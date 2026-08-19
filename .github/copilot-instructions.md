# Drishti Copilot Instructions

**Last updated:** 2026-08-19  
**Related:** [AI_CONTEXT.md](../AI_CONTEXT.md) · [ARCHITECTURE.md](../ARCHITECTURE.md) · [CONTRACTS.md](../CONTRACTS.md)

Before starting work, read [AI_CONTEXT.md](../AI_CONTEXT.md) for operating rules and the required documentation reading order.

## Build, test, and lint commands

### Frontend (`01-frontend`)
```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Type checking (faster than full build)
npm run lint

# Production build
npm run build

# Clean build artifacts
npm run clean
```

### Backend (`02-Backend`)
```bash
# Install dependencies (in venv)
pip install -r requirements.txt

# Run primary backend (runs on http://localhost:8000)
python -m uvicorn app.main:app --reload --port 8000

# Type checking
python -m py_compile app/**/*.py  # or use mypy if configured

# Import/syntax check
python -c "from app.main import app; print('OK')"
```

### ML Engine (`03-ml-engine`)
```bash
# Install dependencies (in venv)
pip install -r requirements.txt

# Run ML engine (runs on http://localhost:8001)
python -m uvicorn main:app --reload --port 8001

# Health check
curl http://localhost:8001/health
```

### Database
- MongoDB: connect via `settings.MONGODB_URI` (default: `mongodb://localhost:27017`)
- Database name: `drishti`
- Collections: users, officers, grievances, timeline_events, hotspots

## High-level architecture

**System topology:** Browser (React/Vite) → Backend (FastAPI) → MongoDB + ML Engine (FastAPI)

### Component boundaries

| Component | Technology | Purpose | Port |
|-----------|-----------|---------|------|
| `01-frontend` | React 19 + Vite + TypeScript + Tailwind | Browser UI with Capacitor wrapper for Android | 3000 |
| `02-Backend` | FastAPI + Motor (async MongoDB) + PyJWT + bcrypt | Primary REST API, auth, data persistence | 8000 |
| `03-ml-engine` | FastAPI | Triage classification (rule-based, not ML-based) | 8001 |
| MongoDB | Motor async driver | Stores users, grievances, officers, timeline, hotspots | 27017 |
| Root `app/` | FastAPI + WebSocket + YOLO | Unintegrated legacy; do not use | — |

### Core flows

1. **Auth:** Frontend → Backend (register/login) → MongoDB (verify/create user with bcrypt) → return JWT
2. **Triage & Submission:** Frontend → Backend → ML Engine (POST /api/v1/triage) → Backend → MongoDB → return result
3. **Disaster Map:** Frontend → Backend (/api/v1/disaster/hotspots) → MongoDB; also frontend → Open-Meteo API (weather)

### Critical assumptions

- **Frontend API base:** `http://localhost:8000` (configurable)
- **Backend ML URL:** `http://localhost:8001` (env: `ML_ENGINE_URL`)
- **ML timeout:** 3 seconds (env: `ML_ENGINE_TIMEOUT_SECONDS`)
- **CORS origins:** Includes localhost:3000 and localhost:5173 by default
- If ML engine is unavailable: triage returns 503; grievance creation still works with `aiTriaged: false`

## Key conventions

### Backend (FastAPI)

**File structure:**
- `main.py` (root): FastAPI app instantiation, middleware, route registration, database lifecycle
- `app/config.py`: Settings loaded from environment (dataclass with frozen=True)
- `app/database.py`: MongoDB connection (global `client`, Motor async driver)
- `app/api/routes/`: One file per resource (auth.py, grievances.py, disaster.py, etc.)
- `app/api/deps.py`: Dependency injection (e.g., `get_current_user`)
- `app/services/`: Business logic (e.g., ml.py for ML engine calls)
- `app/db/`: Database setup, indexes, schema

**Patterns:**
- Routers use `@router.post()`, `@router.get()` decorators with prefix (e.g., `/auth`)
- All routes prefixed with `/api/v1` via `settings.API_V1_STR`
- Request/response models inherit from `pydantic.BaseModel` with `Field` validators
- Async everywhere: `async def` functions, Motor for MongoDB
- JWT auth via `Authorization: Bearer {token}` header, verified with `get_current_user` dependency
- Passwords hashed with bcrypt; never store plaintext
- Error handling: raise `HTTPException` with status codes (401, 403, 404, 500, 503)
- MongoDB ObjectId handled via `bson.ObjectId`; serialized as string in responses

**Configuration:**
- Load from `.env` via `python-dotenv`; see `.env.example` for required keys
- Critical keys: `MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET`, `ML_ENGINE_URL`

### Frontend (React + TypeScript)

**File structure:**
- `src/main.tsx`: Entry point
- `src/App.tsx`: Root component with routing and Capacitor setup
- `src/api/`: API client functions (REST calls to backend)
- `src/components/`: Reusable UI components (DisasterWeatherMap, etc.)
- `src/types/`: TypeScript interfaces for API responses
- `src/utils/`: Helpers (e.g., API base URL from env)
- `src/i18n/`: Internationalization (if used)

**Patterns:**
- TypeScript strict mode; run `npm run lint` (tsc --noEmit) before commit
- Vite development: `npm run dev` auto-reloads on file changes
- Capacitor setup in App.tsx for Android/iOS builds
- API calls via fetch or axios (check `src/api/` for existing patterns)
- Environment: `import.meta.env.VITE_API_URL` (set in `.env`)

### ML Engine

**File structure:**
- `main.py`: FastAPI app with `/health` and `/api/v1/triage` POST endpoint
- `triage.py`: Triage logic (rule-based keyword matching, not neural)

**Pattern:**
- Request: `TriageRequest` with `description` and optional `filename`
- Response: dict with category, ministry, priority, confidence

### Database (MongoDB)

**Schema note:** MongoDB is schemaless, but app code enforces a structure. Check `app/db/indexes.py` and route handlers for the actual schema.

## Important cautions

- **Do not use** `02-Backend/app/main.py` (alternate stub), `app/routes/`, or `app/database_legacy/` as entrypoints; they are stale
- **Do not modify** the primary architecture without reading ARCHITECTURE.md
- **Do not create mocks** of external services (Open-Meteo, CPGRAMS, SMS, etc.) unless a task explicitly asks for a labeled prototype fallback
- **Always test** backend changes with `python -c "from app.main import app"` to catch import/syntax errors early
- **Always verify** environment configuration (`.env`) before running backend or ML engine; missing keys will cause startup failures

## Verification baseline

- **Frontend:** `npm run lint` (TypeScript check), `npm run build` (production build)
- **Backend:** `python -c "from app.main import app"` (import check), `python -m py_compile app/**/*.py` (syntax)
- **ML Engine:** `curl http://localhost:8001/health` (health check) after `python -m uvicorn main:app --reload --port 8001`
- **Integration:** All three services running locally; test key flows (auth, triage, disaster map) via browser

## Common tasks

### Add a new API endpoint

1. Create request/response models in the route file (inherit from BaseModel)
2. Add route handler in `app/api/routes/{resource}.py` (mark async, add appropriate decorators)
3. Import router in `02-Backend/main.py` and register via `app.include_router()`
4. Test: restart backend, call endpoint via browser console or curl
5. Update CONTRACTS.md if API signature changes

### Add a new frontend component

1. Create `.tsx` file in `src/components/`
2. Use TypeScript for prop types, import from `src/types/` for API response types
3. Call backend API via functions in `src/api/`
4. Run `npm run lint` to catch type errors
5. Test in dev server: `npm run dev`

### Debug MongoDB queries

1. Use MongoDB client (e.g., mongosh) to inspect collections: `use drishti; db.grievances.findOne()`
2. Backend logs (run with `--reload` flag) show Motor async driver activity
3. Check indexes: `db.collection.getIndexes()`

### Add environment variables

1. Add to `.env` file (ignored by git)
2. Copy to `.env.example` for documentation
3. Update `app/config.py` to read via `os.getenv()`
4. Use `settings.VARIABLE_NAME` in code
