import cv2
import json
import time
import threading
import pyttsx3
import requests
import websocket
import sounddevice as sd
import speech_recognition as sr

API_BASE = "http://127.0.0.1:8000/api/v1"
WS_URL = "ws://127.0.0.1:8000/api/v1/stream/ws"

# Shared Thread-Safe State
state_lock = threading.Lock()
latest_frame = None
is_running = True
current_nav_cmd = "Path clear ahead."
current_scene_summary = "Path clear ahead."
current_detections = []
total_memories_count = 0

# Audio Engine Setup
engine = pyttsx3.init()
engine.setProperty('rate', 175)
tts_lock = threading.Lock()
last_spoken_time = 0.0
last_spoken_text = ""

def speak(text: str, priority: bool = False):
    global last_spoken_time, last_spoken_text
    current_time = time.time()

    if not priority:
        if text == last_spoken_text and (current_time - last_spoken_time < 5.0):
            return
        if current_time - last_spoken_time < 2.5:
            return

    last_spoken_time = current_time
    last_spoken_text = text

    def _run():
        with tts_lock:
            engine.say(text)
            engine.runAndWait()
    threading.Thread(target=_run, daemon=True).start()

def describe_current_scene():
    with state_lock:
        summary = current_scene_summary
    print(f"\n[Scene Description]: {summary}\n")
    speak(summary, priority=True)

def query_memory(prompt: str):
    if "describe" in prompt.lower() or "what do you see" in prompt.lower():
        describe_current_scene()
        return

    try:
        # Increased timeout to 12s to prevent premature client-side disconnects
        res = requests.get(f"{API_BASE}/memory/semantic-search", params={"query": prompt, "limit": 1}, timeout=12)
        if res.status_code == 200:
            data = res.json()
            matches = data.get("matches", [])
            stored_count = data.get("total_stored_memories", 0)

            if matches:
                top = matches[0]
                similarity = top.get("similarity", 0.0)
                print(f"[Debug] Match Score: {similarity:.2f} | Scene: {top['description']}")

                if similarity >= 0.20:
                    answer = f"Recall: {top['description']}"
                else:
                    answer = f"I could not locate '{prompt}' in recent memory."
            else:
                answer = f"No memories have been recorded yet ({stored_count} items stored)."
        else:
            answer = "Memory service unavailable."
    except Exception as e:
        print(f"[Memory Request Error]: {e}")
        answer = "Memory engine unreachable."
    
    print(f"\n[Drishti Response]: {answer}\n")
    speak(answer, priority=True)

def record_and_transcribe():
    def _listen():
        recognizer = sr.Recognizer()
        speak("Listening", priority=True)
        print("\n[Microphone Active] Speak now (4s window)...")

        try:
            recording = sd.rec(int(4.0 * 16000), samplerate=16000, channels=1, dtype='int16')
            sd.wait()
            audio = sr.AudioData(recording.tobytes(), 16000, 2)
            user_text = recognizer.recognize_google(audio)
            print(f"[Voice Prompt]: \"{user_text}\"")
            query_memory(user_text)
        except sr.UnknownValueError:
            speak("I did not understand that.", priority=True)
        except Exception as err:
            print(f"[Voice Error]: {err}")
            speak("Voice capture failed.", priority=True)

    threading.Thread(target=_listen, daemon=True).start()

def inference_worker():
    global current_nav_cmd, current_scene_summary, current_detections, total_memories_count, is_running
    
    try:
        ws = websocket.create_connection(WS_URL, timeout=5)
    except Exception as e:
        print(f"WebSocket Connection Failed: {e}")
        return

    while is_running:
        frame_to_send = None
        with state_lock:
            if latest_frame is not None:
                frame_to_send = latest_frame.copy()

        if frame_to_send is not None:
            try:
                encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 60]
                _, buffer = cv2.imencode('.jpg', frame_to_send, encode_param)
                ws.send(buffer.tobytes(), opcode=websocket.ABNF.OPCODE_BINARY)

                raw_data = ws.recv()
                data = json.loads(raw_data)

                if "error" not in data:
                    nav_cmd = data.get("navigation_command", "Path clear ahead.")
                    scene_summary = data.get("scene_summary", "")
                    detections = data.get("detections", [])
                    mem_count = data.get("total_memories", 0)

                    with state_lock:
                        current_nav_cmd = nav_cmd
                        current_scene_summary = scene_summary
                        current_detections = detections
                        total_memories_count = mem_count

                    if "Stop" in nav_cmd or "Warning" in nav_cmd:
                        speak(nav_cmd, priority=True)
                    elif "blocked" in nav_cmd or "obstructed" in nav_cmd:
                        speak(nav_cmd, priority=False)

            except websocket.WebSocketTimeoutException:
                pass
            except Exception:
                time.sleep(0.2)

        time.sleep(0.05)

    try:
        ws.close()
    except Exception:
        pass

def draw_hud(frame, nav_cmd, detections, mem_count):
    h, w, _ = frame.shape
    one_third, two_thirds = w // 3, (2 * w) // 3

    # Corridors
    cv2.line(frame, (one_third, 0), (one_third, h), (70, 70, 70), 1)
    cv2.line(frame, (two_thirds, 0), (two_thirds, h), (70, 70, 70), 1)

    cv2.putText(frame, "LEFT", (20, h - 15), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 200, 200), 1)
    cv2.putText(frame, "CENTER", (one_third + 25, h - 15), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 200, 200), 1)
    cv2.putText(frame, "RIGHT", (two_thirds + 25, h - 15), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 200, 200), 1)

    for obj in detections:
        bbox = obj.get("bbox", [])
        label = str(obj.get("label", "object"))
        if isinstance(bbox, (list, tuple)) and len(bbox) == 4:
            x1, y1, x2, y2 = [int(v) for v in bbox]
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, label, (x1, max(20, y1 - 8)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    color = (0, 0, 255) if ("Stop" in nav_cmd or "Warning" in nav_cmd) else (0, 255, 0)
    cv2.putText(frame, f"NAV: {nav_cmd}", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.65, color, 2)
    cv2.putText(frame, f"Memories: {mem_count}", (w - 150, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 0), 2)

def main():
    global latest_frame, is_running

    print("\n--- Drishti Controls ---")
    print(" [d]           : Full Scene Summary (Voice)")
    print(" [Space] / [v] : Ask a Question (Voice Search)")
    print(" [q]           : Quit")
    print("------------------------\n")

    worker_thread = threading.Thread(target=inference_worker, daemon=True)
    worker_thread.start()

    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        with state_lock:
            latest_frame = frame.copy()
            nav_cmd = current_nav_cmd
            detections = list(current_detections)
            mem_count = total_memories_count

        draw_hud(frame, nav_cmd, detections, mem_count)
        cv2.imshow("Drishti Assistive Vision Stream", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            is_running = False
            break
        elif key == ord('d'):
            describe_current_scene()
        elif key in [ord('v'), 32]:
            record_and_transcribe()

    is_running = False
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()