# DRISHTI ML Engine

**Last Updated:** 2026-08-19

This directory contains both ML-related services:

- **Triage service** (`main.py`, `triage.py`): the active lightweight FastAPI API used by `02-Backend` at `http://localhost:8001`.
- **Vision service** (`vision_service/`): the preserved YOLO/WebSocket/scene-memory prototype. It is not called by the frontend or primary backend. Run it separately on `http://localhost:8002` when needed.

## Run triage

```bash
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8001
```

## Run the optional vision service

```bash
pip install -r requirements-vision.txt
uvicorn vision_service.main:app --host 127.0.0.1 --port 8002
```

The YOLO model is located at `models/yolov8n.pt`; the detector resolves this path from its own source location, so it does not depend on the current working directory. The optional webcam client is `clients/client_stream.py`; install `requirements-vision-client.txt` before using it.

The vision service keeps its original `/api/v1/vision`, `/api/v1/stream`, and `/api/v1/memory` routes. It is intentionally separate from the triage process so starting triage does not load YOLO or sentence-transformer models.
