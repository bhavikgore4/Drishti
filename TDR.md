# DRISHTI Technical Design Record

**Last Updated:** 2026-08-19  
**Related:** [PRD](PRD.md) · [Architecture](ARCHITECTURE.md) · [Research](RESEARCH.md) · [Progress](PROGRESS.md)

## Status vocabulary

- **CURRENT**: present in executable current code.
- **PLANNED**: explicitly implied by code/comments/docs but not implemented.
- **UNKNOWN**: no repository evidence establishes it.

## Current technical stack

| Layer | CURRENT implementation | Notes |
|---|---|---|
| Frontend | React 19, TypeScript, Vite 6 | `01-frontend`; Tailwind Vite plugin, Motion, Lucide, Leaflet. |
| Mobile wrapper | Capacitor Android 8 | `webDir: dist`; Android project is present. |
| Backend | Python, FastAPI 0.141, Uvicorn | Entrypoint: `02-Backend/main.py`. |
| Database | MongoDB with Motor/PyMongo | URI/db are environment-configured; backend creates indexes and minimal demo data. |
| Authentication | bcrypt password hashes; PyJWT HS256 bearer tokens | JWT config comes from environment. |
| File storage | Local filesystem | `02-Backend/uploads`, statically mounted at `/uploads`. |
| ML engine | Separate FastAPI service; Python standard-library deterministic keyword rules | `03-ml-engine`; no trained classifier. |
| External weather | Open-Meteo REST API, called directly by frontend | Implemented in `DisasterWeatherMap.tsx`. |

## Primary runtime components

### CURRENT: frontend

- `npm run dev` runs Vite at port 3000.
- `VITE_API_BASE_URL` defaults to `http://localhost:8000` in `src/api/client.ts`.
- API access is centralized in `src/api/client.ts`; bearer tokens are stored in browser `localStorage`.
- Hash routes in `src/App.tsx` select landing, auth, dashboard, and weather-map views.

### CURRENT: backend

- CORS accepts localhost ports 5173 and 3000 plus `CORS_ORIGINS`.
- Startup tries MongoDB initialization for at most five seconds, logs failure, and exposes degraded health rather than silently succeeding.
- Database indexes are created for user email/mobile, officers, grievances, timelines, and hotspot geospatial location.
- Seed logic creates two demo officers and two hotspot documents only when appropriate collections are empty.

### CURRENT: ML engine

- Runs independently at `ML_ENGINE_URL` (default `http://localhost:8001`).
- `POST /api/v1/triage` performs transparent keyword scoring across flood/water, road/landslide, EPFO, and health categories, then returns a general fallback if no rule matches.
- It has no model file, model training, notebook, or accuracy evaluation in `03-ml-engine`.

### CURRENT: optional legacy vision service

`03-ml-engine/vision_service/` preserves the separate FastAPI/SQLAlchemy/PostgreSQL-oriented YOLO, OpenCV, embeddings, spatial-processing, and WebSocket prototype formerly located at repository root. Its model is `03-ml-engine/models/yolov8n.pt`; server and webcam-client dependency manifests now accompany it. It is not imported by `02-Backend/main.py` or frontend API modules. Treat it as **legacy/unintegrated** unless a task explicitly establishes otherwise.

`02-Backend/app/main.py`, `app/routes/`, and `app/database_legacy/` are also an unintegrated, stale alternate backend stub. Its imports do not match the present `database_legacy` path and its auth route returns hard-coded tokens. The runnable primary entrypoint is specifically `02-Backend/main.py`; do not start the alternate module as the current service.

## Configuration

| Variable | Component | Meaning | Status |
|---|---|---|---|
| `VITE_API_BASE_URL` | Frontend | Backend base URL | CURRENT |
| `PROJECT_NAME`, `API_V1_STR`, `ENVIRONMENT` | Backend | Service metadata/versioned path/environment | CURRENT |
| `MONGODB_URI`, `MONGODB_DB` | Backend | MongoDB connection and database | CURRENT |
| `JWT_SECRET`, `JWT_EXPIRE_MINUTES` | Backend | JWT signing/expiry | CURRENT |
| `CORS_ORIGINS` | Backend | Additional allowed browser origins | CURRENT |
| `ML_ENGINE_URL`, `ML_ENGINE_TIMEOUT_SECONDS` | Backend | Separate ML service location and request timeout | CURRENT |
| `ML_ENGINE_HOST`, `ML_ENGINE_PORT` | ML `.env.example` | Documented service host/port | PARTIALLY IMPLEMENTED: current `main.py` does not read them. |

## Build and testing

| Command | Scope | Status observed |
|---|---|---|
| `npm run lint` | Frontend TypeScript | Passed during latest integration work. |
| `npm run build` | Frontend production bundle | Passed; Vite reports a large-chunk warning. |
| `npx cap sync android` | Capacitor assets/config | Passed during latest integration work. |
| Python `compileall` | Backend and ML source | Passed during latest integration work. |
| Live HTTP smoke flow | Backend + MongoDB + ML | Passed during latest integration work. |
| `./gradlew assembleDebug` | Android APK | Blocked by external Gradle distribution download timeout; see [Progress](PROGRESS.md). |

The old root diagnostic scripts targeting the relocated vision app were removed because they were ad-hoc import/connection probes, not a configured test suite. No `pytest.ini`, `pyproject.toml`, CI workflow, Dockerfile, or Docker Compose file was found.

## Existing technical decisions supported by evidence

| Decision | Evidence | Why |
|---|---|---|
| Treat `02-Backend` as primary backend | Frontend uses its `/api/v1` contracts; its entrypoint owns current routes. | Current integrated API architecture. |
| Use MongoDB for current application data | `Motor`, config, index and route code. | Current persistence implementation. |
| Run ML as a separate service | `03-ml-engine/main.py`, `ML_ENGINE_URL`, backend proxy service. | Explicit runtime integration. |
| Keep triage optional during creation | `create_grievance` catches `MLEngineUnavailable`. | Allows core reporting to continue if ML is down. |

## Technical debt and constraints

- The frontend contains substantial presentation/demo data and sample timeline content not all backed by APIs.
- The optional vision service remains separate from the current MongoDB/FastAPI topology and retains unverified PostgreSQL persistence code.
- OTP, Parichay SSO, reminders/SMS, CPGRAMS-ledger messaging, and officer auto-assignment shown in frontend UI are not backed by the current primary API.
- Uploads have no documented file-size/type allowlist or malware scanning.
- `/api/v1/disaster/seed` has no authentication requirement.
- Public docket lookup exposes serialized grievance fields; privacy requirements are **UNKNOWN — requires confirmation**.
- JWT secret defaults to a development value if not overridden; production secret management is **UNKNOWN**.
- Line ending/style inconsistency exists in several backend files.
- Android build depends on external Gradle download availability.
