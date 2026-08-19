# DRISHTI Research and Shared Knowledge

**Last Updated:** 2026-08-19  
**Related:** [TDR](TDR.md) · [Architecture](ARCHITECTURE.md) · [AI Context](AI_CONTEXT.md)

## Confirmed findings

### Primary application

- The active frontend calls `http://localhost:8000` by default and uses `/api/v1` backend paths.
- The primary backend is `02-Backend/main.py`, not root `app/main.py`.
- The backend uses asynchronous MongoDB access through Motor and expects `MONGODB_URI`/`MONGODB_DB`.
- The backend applies MongoDB indexes and seeds two officer accounts plus two hotspot records when appropriate.
- The current ML service is `03-ml-engine`, with a FastAPI endpoint and deterministic keyword baseline. It intentionally contains no fabricated trained model.
- The backend reaches this service through `ML_ENGINE_URL`; direct frontend access to the ML port is not part of the current contract.

### Existing related code outside the active topology

- `03-ml-engine/vision_service` contains the preserved YOLO/OpenCV/WebSocket/spatial/embedding prototype, and its model is `03-ml-engine/models/yolov8n.pt`.
- That code references PostgreSQL/SQLAlchemy/pgvector in its own configuration and model files; server/client dependency manifests now accompany it.
- It is not imported by `02-Backend` or referenced by frontend API modules.
- Therefore it must not be represented as active ML functionality without a deliberate integration task.
- `02-Backend/app/main.py` and `app/routes/auth.py` are a separate stale stub with hard-coded “hackathon” tokens; its database import does not match the current `app/database_legacy` directory. It is not the primary `02-Backend/main.py` entrypoint.

### Frontend discoveries

- Leaflet renders the disaster map; hotspots come from backend while weather comes directly from Open-Meteo.
- Capacitor Android is configured with application id `com.drishti.civic` and web directory `dist`.

## Useful resources in this repository

| Resource | Purpose |
|---|---|
| Root [README.md](README.md) and shared context documents | Product/UI narrative and current implementation boundaries. |
| `01-frontend/src/api/` | Authoritative frontend API expectations. |
| `02-Backend/app/api/routes/` | Authoritative primary REST route behavior. |
| `02-Backend/app/database.py` and `app/db/indexes.py` | Current MongoDB data initialization and indexes. |
| `03-ml-engine/triage.py` | Current transparent triage logic. |
| `03-ml-engine/vision_service/` | Optional legacy vision prototype, isolated from active triage. |
| `CONTRACTS.md` | Condensed interface reference. |

## External references used by current code

| External technology | Current relationship |
|---|---|
| MongoDB | Local development URI is documented as `mongodb://localhost:27017`. |
| Open-Meteo | Browser-side forecast fetch in map component. |
| OpenStreetMap/Leaflet ecosystem | Map rendering/dependency evidence; tile configuration is in frontend source. |
| Gradle distribution service | Android wrapper downloads Gradle 8.14.3 when not cached. |

## Open questions

- What production identity, notification, hosting, file-storage, and privacy requirements apply? **UNKNOWN — requires confirmation**.
- Is the optional YOLO/vision service intended to be integrated or removed? **UNKNOWN — requires confirmation**.
- Are the full hotspot data and the extensive sample UI data authoritative operational data or demo content? **UNKNOWN — requires confirmation**.
- What evaluation data and acceptance threshold should replace the keyword ML baseline? **UNKNOWN — requires confirmation**.
- Are public docket lookups acceptable under the project's privacy policy? **UNKNOWN — requires confirmation**.
- Which UI-only product claims (OTP, Parichay SSO, SMS/reminders, CPGRAMS ledger, officer assignment) are intended for implementation versus removal? **UNKNOWN — requires confirmation**.

## Assumptions requiring verification

- Local MongoDB, backend, and ML service run on ports documented in [Architecture](ARCHITECTURE.md).
- The local uploads directory is acceptable for prototype use only.
- The frontend README's policy and organizational claims are presentation context, not verified operational integrations.
