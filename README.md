# DRISHTI

**An R&D prototype for AI-assisted civic grievance intake and disaster-risk awareness.**

DRISHTI combines a React browser application, a FastAPI/MongoDB backend, and a local grievance-triage service. The active system supports account registration and sign-in, grievance submission and tracking, local attachment uploads, rule-based triage suggestions, and a seeded disaster-hotspot map with browser-fetched weather data.

The repository also preserves a separate computer-vision prototype. It is isolated from the active grievance workflow and is not required to run the primary application.

## Overview

The active topology has three local services:

- \`01-frontend/\`: React single-page application for public, citizen, officer, dashboard, status-lookup, and disaster/weather-map views.
- \`02-Backend/\`: the primary FastAPI API for JWT authentication, MongoDB records, uploads, hotspots, and ML-service proxying.
- \`03-ml-engine/\`: the active FastAPI triage API plus an optional standalone vision prototype.

MongoDB persists the primary backend’s data. The frontend calls Open-Meteo directly for weather; weather is not proxied by the backend.

## Key capabilities

Implemented in the primary architecture:

- Citizen registration/login and officer login with JWT bearer authentication.
- MongoDB-backed grievance creation, listing, retrieval, status updates, and timeline events.
- Public grievance lookup by docket/registration number.
- Authenticated attachment upload, with files served by the backend from \`/uploads\`.
- Deterministic triage of a description and optional filename, returning category, ministry, priority, confidence, and matching signals.
- Seeded disaster hotspots served by the backend and displayed on the frontend map.
- A Capacitor Android wrapper for the frontend source.

Not implemented as primary integrations:

- The YOLO/WebSocket/scene-memory service is a standalone prototype.
- OTP, Parichay SSO, SMS/reminders, CPGRAMS-ledger activity, and officer auto-assignment appear in UI messaging but have no matching primary-backend integration.

## Architecture

\`\`\`mermaid
flowchart LR
  F[React + Vite frontend<br/>01-frontend :3000]
  B[Primary FastAPI backend<br/>02-Backend :8000]
  D[(MongoDB<br/>drishti)]
  M[FastAPI triage service<br/>03-ml-engine :8001]
  U[Local upload files]
  W[Open-Meteo]

  F -->|REST + JWT| B
  B -->|Motor| D
  B -->|POST /api/v1/triage| M
  B --> U
  F -->|direct weather fetch| W
\`\`\`

The frontend uses the backend for application data. The backend proxies triage requests to the ML engine. If that engine is unavailable, \`POST /api/v1/ml/triage\` returns \`503\`; grievance creation remains available and records \`aiTriaged: false\`.

The optional vision service runs separately on port 8002 and has no frontend route or backend proxy.

## Repository structure

\`\`\`text
.
├── 01-frontend/                 React/Vite/TypeScript web app and Capacitor Android project
│   ├── src/
│   │   ├── api/                 Backend API client modules
│   │   ├── components/          Landing, auth, dashboard, map, and workflow UI
│   │   ├── assets/, i18n/      Images and translations
│   │   └── types/, utils/      Frontend types and helpers
│   ├── android/                Capacitor Android wrapper source
│   ├── package.json            npm scripts and dependencies
│   └── .env.example            Frontend configuration template
├── 02-Backend/                 Primary FastAPI application
│   ├── main.py                 Active application entry point
│   ├── app/
│   │   ├── api/routes/         Auth, grievance, upload, disaster, health, and ML routes
│   │   ├── db/                 MongoDB models and indexes
│   │   ├── services/ml.py      Triage-service HTTP client
│   │   ├── config.py           Environment-backed settings
│   │   └── database.py         Motor lifecycle and demo-data seeding
│   ├── requirements.txt
│   └── .env.example
├── 03-ml-engine/               Consolidated ML-related services
│   ├── main.py, triage.py      Active lightweight triage API and keyword rules
│   ├── models/yolov8n.pt       YOLO model for the optional vision service
│   ├── vision_service/         Optional YOLO/WebSocket/scene-memory FastAPI prototype
│   │   ├── api/v1/endpoints/   Detection, streaming, and memory routes
│   │   ├── services/           Detector, spatial analysis, embeddings, in-memory memory
│   │   └── core/, db/, models/ Supporting configuration and modules
│   ├── clients/client_stream.py Optional webcam, speech, and WebSocket client
│   ├── requirements*.txt       Separate triage, vision, and client dependency manifests
│   └── .env.example
├── 04-database/                Standalone synchronous PyMongo connection helper
├── ARCHITECTURE.md             Current architecture and data flows
├── CONTRACTS.md                API and integration contracts
├── PROGRESS.md                 Status, validation record, and known issues
└── PRD.md, TDR.md, RESEARCH.md Project and research context
\`\`\`

\`02-Backend/main.py\` is the active backend entry point. The nested \`02-Backend/app/main.py\`, \`app/routes/\`, and \`app/database_legacy/\` are retained stale/alternate code, not part of the primary runtime.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 4, Leaflet, Lucide React, Motion |
| Mobile wrapper | Capacitor 8 and the Android project under \`01-frontend/android/\` |
| Primary backend | FastAPI, Uvicorn, Pydantic, Motor/PyMongo, \`python-dotenv\` |
| Auth | PyJWT and bcrypt |
| Data store | MongoDB (default database: \`drishti\`) |
| Active ML | FastAPI deterministic keyword-rule baseline |
| Optional vision | Ultralytics YOLO, OpenCV, Sentence Transformers, WebSockets; separate speech/webcam client dependencies |
| Tooling | TypeScript compiler, Vite build, Python \`compileall\` |

## Prerequisites

- Node.js and npm; the frontend includes an npm lockfile.
- Python with \`venv\` and \`pip\`.
- A reachable MongoDB instance. The primary backend default is \`mongodb://localhost:27017\`, database \`drishti\`.

The optional vision client also needs a camera, audio devices, and suitable platform support for OpenCV and audio packages.

## Installation and configuration

Create local environment files from the tracked templates. Never commit \`.env\` files, credentials, API keys, JWT secrets, or database URIs containing credentials.

### Frontend

\`\`\`bash
cd 01-frontend
cp .env.example .env
npm ci
\`\`\`

| Variable | Default | Purpose |
| --- | --- | --- |
| \`VITE_API_BASE_URL\` | \`http://localhost:8000\` | Backend base URL used by the browser API client |

### Primary backend

\`\`\`bash
cd 02-Backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
\`\`\`

| Variable | Template default | Purpose |
| --- | --- | --- |
| \`PROJECT_NAME\` | \`Drishti API\` | FastAPI title |
| \`API_V1_STR\` | \`/api/v1\` | API prefix |
| \`MONGODB_URI\` | \`mongodb://localhost:27017\` | MongoDB connection URI |
| \`MONGODB_DB\` | \`drishti\` | Database name |
| \`JWT_SECRET\` | development placeholder | JWT signing key; replace outside local development |
| \`JWT_EXPIRE_MINUTES\` | \`60\` | Token lifetime in minutes |
| \`ENVIRONMENT\` | \`development\` | Health/status response value |
| \`CORS_ORIGINS\` | \`http://localhost:5173\` | Extra comma-separated origins; ports 3000 and 5173 are always included |
| \`ML_ENGINE_URL\` | \`http://localhost:8001\` | Triage service base URL |
| \`ML_ENGINE_TIMEOUT_SECONDS\` | \`3\` | Triage proxy timeout |

On successful startup, the backend pings MongoDB, creates indexes, seeds demo officers, and seeds hotspots only when the hotspot collection is empty. Demo officer data is development-only and must not be used in a deployment.

### ML engine

\`\`\`bash
cd 03-ml-engine
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
\`\`\`

The active triage process has no required environment variables. The ML template documents intended ports; Uvicorn launch arguments set the actual host and port.

## Running the primary application

Start MongoDB, then run the ML engine, backend, and frontend in separate terminals.

\`\`\`bash
# From 03-ml-engine, with its virtual environment active
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8001
\`\`\`

\`\`\`bash
# From 02-Backend, with its virtual environment active
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
\`\`\`

\`\`\`bash
# From 01-frontend
npm run dev
\`\`\`

The frontend runs at \`http://localhost:3000\`; backend API docs are at \`http://localhost:8000/docs\`; triage health is at \`http://localhost:8001/health\`.

The frontend can still submit a manually categorized grievance when the triage process is down, but authenticated triage requests return \`503\`.

### Optional vision prototype

This is independent of the primary application:

\`\`\`bash
cd 03-ml-engine
source .venv/bin/activate
pip install -r requirements-vision.txt
python -m uvicorn vision_service.main:app --reload --host 127.0.0.1 --port 8002
\`\`\`

The detector resolves \`models/yolov8n.pt\` relative to source. The vision configuration declares a PostgreSQL URL and its dependency manifest contains SQLAlchemy/PostgreSQL/pgvector packages; its exposed endpoints currently use in-process scene memory and do not integrate with the primary MongoDB workflow.

For the optional webcam client:

\`\`\`bash
cd 03-ml-engine
pip install -r requirements-vision-client.txt
python clients/client_stream.py
\`\`\`

## API reference

All primary-backend endpoints are prefixed with \`/api/v1\`. Authenticated endpoints require \`Authorization: Bearer <JWT>\`.

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| \`GET\` | \`/health\` | No | Backend/MongoDB health |
| \`GET\` | \`/status\` | No | Basic backend status |
| \`POST\` | \`/auth/register\` | No | Register a citizen and return JWT/user |
| \`POST\` | \`/auth/login\` | No | Citizen login by email or mobile |
| \`POST\` | \`/auth/officer/login\` | No | Officer login by username |
| \`GET\` | \`/auth/me\` | JWT | Current user |
| \`GET\` | \`/grievances\` | JWT | Citizen's own records; all records for officer/admin |
| \`POST\` | \`/grievances\` | Citizen JWT | Create grievance and initial timeline event |
| \`GET\` | \`/grievances/lookup?registration_number=…\` | No | Public docket lookup |
| \`GET\` | \`/grievances/{id}\` | JWT | Grievance/timeline; citizen ownership enforced |
| \`PATCH\` | \`/grievances/{id}/status\` | Officer/admin JWT | Change status and create timeline event |
| \`POST\` | \`/uploads\` | JWT | Store multipart \`file\` locally |
| \`GET\` | \`/disaster/hotspots\` | No | List persisted hotspots |
| \`POST\` | \`/disaster/seed\` | No | Seed/count hotspot data |
| \`POST\` | \`/ml/triage\` | JWT | Proxy a triage request to ML engine |

### Triage request and response

\`\`\`json
POST /api/v1/ml/triage
{
  "description": "Flood water is entering our street",
  "filename": "photo.jpg"
}
\`\`\`

\`\`\`json
{
  "label": "Disaster Relief / Urban Inundation & Flood Emergency",
  "ministry": "Ministry of Home Affairs / NDMA",
  "category": "Disaster Relief & Emergency Response",
  "subCategory": "Immediate Rescue Boat Deployment & Dewatering",
  "priority": "urgent",
  "confidence": 0.75,
  "signals": ["flood", "water"],
  "engine": "keyword-baseline-v1"
}
\`\`\`

\`POST /api/v1/grievances\` requires \`description\` and \`category\`, with optional title, ministry, subcategory, location, priority, and attachment metadata. Valid status values are \`submitted\`, \`under_review\`, \`assigned\`, \`in_progress\`, \`resolved\`, and \`rejected\`.

The direct ML contract is:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| \`GET\` | \`http://localhost:8001/health\` | Engine health/identifier |
| \`POST\` | \`http://localhost:8001/api/v1/triage\` | Keyword-rule triage |

The standalone vision service additionally exposes \`POST /api/v1/vision/detect\`, \`WS /api/v1/stream/ws\`, and \`GET /api/v1/memory/semantic-search\`. These are not primary-backend APIs.

## ML engine

### Active triage

\`03-ml-engine/main.py\` serves port 8001. \`triage.py\` scores the grievance text and optional filename against keyword rules for flood/disaster, road damage, EPFO, and health cases, then uses a general fallback. It is transparent and deterministic—not a trained/evaluated classifier—and has no training pipeline.

\`02-Backend/app/services/ml.py\` sends the matching JSON body to \`\${ML_ENGINE_URL}/api/v1/triage\`. The backend exposes it through its authenticated proxy and attempts it during grievance creation without making the database write depend on ML availability.

### Optional vision service

\`03-ml-engine/vision_service/\` is a separate FastAPI application on port 8002. It loads YOLO from \`03-ml-engine/models/yolov8n.pt\`, supports uploaded-image detection, and accepts WebSocket JPEG frames for detection, spatial navigation cues, and in-memory Sentence Transformer scene-memory search. \`03-ml-engine/clients/client_stream.py\` is its local webcam/speech client.

It has no frontend integration, backend proxy, MongoDB integration, or production persistence path in the current architecture.

## Development and verification

Run commands from their component directories:

| Component | Command | Purpose |
| --- | --- | --- |
| Frontend | \`npm run lint\` | TypeScript check (\`tsc --noEmit\`) |
| Frontend | \`npm run build\` | Production Vite build |
| Frontend | \`npm run clean\` | Remove \`dist\` and \`server.js\` |
| Backend | \`python -m compileall -q .\` | Python syntax compilation |
| Backend | \`python -c "from main import app; print('OK')"\` | Import active FastAPI app |
| ML engine | \`curl http://localhost:8001/health\` | Check running triage API |
| Android wrapper | \`npx cap sync android\` | Synchronize web assets to Android source |

No repository CI configuration or primary-backend automated test suite is present. \`PROGRESS.md\` records completed frontend lint/build, backend import/OpenAPI checks, ML import/triage inference, and a local end-to-end auth → triage → grievance → lookup → hotspots flow. The latest frontend build has a Vite large-chunk warning but succeeds.

## Project status

This is an active prototype, not a completed production deployment.

| State | Current evidence |
| --- | --- |
| Completed | Frontend/API client; FastAPI auth, grievance, upload, disaster, health, and ML routes; MongoDB indexes/demo data; backend-to-triage integration; local attachment serving; public lookup; Capacitor synchronization. |
| In progress | The cleanup/consolidation awaits review and has not been committed, per \`PROGRESS.md\`. |
| Planned / decisions needed | Production deployment/secrets; trained and evaluated triage model; upload scanning/storage policy; vision-prototype disposition; automated API tests. |
| Known limitations | Keyword triage is not trained/evaluated; weather depends on direct Open-Meteo access; some dashboard/timeline content is sample/static UI; public seed and docket lookup need privacy/security decisions. |
| Blocked verification | Android debug APK assembly could not complete because Gradle 8.14.3 download timed out; Capacitor sync passed. |

## Contribution guidance

- Use \`02-Backend/main.py\` and \`02-Backend/app/api/routes/\` for primary API work.
- Add frontend service calls through \`01-frontend/src/api/\`, then run frontend checks.
- Keep triage separate from \`vision_service/\` unless an explicit integration design is approved.
- Update \`CONTRACTS.md\`, \`ARCHITECTURE.md\`, and \`PROGRESS.md\` when contracts, topology, or status changes.
- Keep generated files, local environments, uploads, and credentials out of version control as directed by \`.gitignore\`.

## Security notes

- Copy example configuration; never commit real \`.env\` files, signing keys, credentials, or API keys.
- Replace the development \`JWT_SECRET\` before shared or deployed use.
- Uploads currently store arbitrary bytes in \`02-Backend/uploads/\` and have no documented type validation, malware scanning, size limits, or retention policy.
- \`POST /api/v1/disaster/seed\` is public, and public docket lookup needs product-level privacy/authorization review.
- Verify provenance and licensing before distributing the tracked YOLO model or any downloaded Sentence Transformer assets.

## License

No license file is present in this repository. Do not assume permission to redistribute or reuse the project beyond rights granted by its owners.
