import asyncio
import websockets

async def test():
    uri = "ws://127.0.0.1:8000/api/v1/stream/ws"
    # If your server is running on port 8001, change port above to 8001
    try:
        async with websockets.connect(uri) as ws:
            print("Connected to Drishti WebSocket successfully!")
    except Exception as e:
        print("Connection failed:", e)

asyncio.run(test())