# DRISHTI Project Progress

**Last Updated:** 2026-08-19

## Completed

- React/Vite frontend with hash-based views, authentication UI, dashboard, grievance submission, map UI, and API client.
- FastAPI primary backend with auth, grievance, upload, disaster, health, and ML routes.
- MongoDB configuration, indexes, startup initialization, and minimal seed behavior.
- Separate `03-ml-engine` FastAPI triage service with a deterministic local baseline.
- ML-related root artifacts consolidated under `03-ml-engine`: optional YOLO/WebSocket prototype in `vision_service`, model in `models`, and webcam client in `clients`; the obsolete empty ML directory and root diagnostic scripts were removed.
- The optional vision service now has separate server/client dependency manifests, a README, stable model resolution, and a client defaulting to port 8002; the active triage contract remains on port 8001.
- Root legacy-app imports and obsolete ML-directory references were removed; architecture, context, research, contracts, and Copilot instructions were aligned with the consolidated ML layout.
- Frontend cleanup removed a duplicate README, redundant nested ignore/placeholder files, an unused Bun lockfile, unused component aliases, duplicate unreferenced assets, and unused direct dependencies; active Vite, TypeScript, Capacitor, npm lockfile, environment template, and source assets remain.
- Frontend-to-backend triage integration and backend-to-ML proxy integration.
- Backend grievance creation records successful ML triage state without blocking creation on ML service failure.
- Real landing-page docket lookup replaced the prior static status result.

## In progress

- The completed ML and frontend cleanup is present in the working tree and awaits review; no commit has been created.

## Pending

- Define production deployment/secret-management approach. **UNKNOWN — requires confirmation**.
- Define a trained ML model, data set, evaluation method, and rollout plan if the keyword baseline is to be replaced.
- Decide disposition of the optional `03-ml-engine/vision_service` YOLO/PostgreSQL prototype.
- Define upload validation/scanning/storage policy.

## Blocked

- Android debug APK verification: `./gradlew assembleDebug` could not download Gradle 8.14.3 because the external download timed out. Capacitor synchronization passed; no source-level Android failure was observed.

## Known bugs / limitations

- The latest frontend build emits a Vite large-chunk warning; it is a warning, not a build failure.
- Map weather data relies on direct browser access to Open-Meteo.
- The ML classifier is keyword-based and has no trained-model evaluation.
- Some dashboard/timeline presentation content remains sample/static UI content rather than a documented backend contract.
- OTP, Parichay SSO, SMS/reminder dispatch, CPGRAMS-ledger messaging, and officer auto-assignment are UI-only claims with no primary-backend integration.

## Known technical debt

- Legacy vision code and its YOLO model have been consolidated in `03-ml-engine/vision_service` and `03-ml-engine/models`; it remains unintegrated with the primary MongoDB/FastAPI topology.
- `02-Backend` retains a stale nested `app/main.py` / `app/routes` / `app/database_legacy` alternate stub; it conflicts with the primary entrypoint and has hard-coded-token behavior.
- Backend attachment handling stores arbitrary uploaded bytes locally; file policy is incomplete.
- `POST /api/v1/disaster/seed` is public.
- Public docket lookup privacy/authorization requirements need explicit product confirmation.
- No repository CI configuration or primary-backend automated test suite was found.

## Tests completed

| Check | Result |
|---|---|
| MongoDB `ping` at local URI | Passed during latest integration work. |
| ML import/triage inference | Passed. |
| Backend compile/import/OpenAPI checks | Passed. |
| Frontend `npm run lint` | Passed. |
| Frontend `npm run build` | Passed. |
| `npx cap sync android` | Passed. |
| Live auth → ML → grievance → lookup → hotspots flow | Passed against local MongoDB and both FastAPI services. |
| Post-cleanup backend OpenAPI import, ML endpoint handler smoke, Python compilation, frontend lint/build | Passed. HTTP loopback binding for an additional triage smoke server was blocked by the execution sandbox. |
| Post-frontend-cleanup npm lockfile refresh, frontend lint/build, deleted-path/reference scan, and `git diff --check` | Passed. Vite reported only its existing large-chunk warning. |
| Android `assembleDebug` | Blocked by Gradle distribution download timeout. |

## Integrations completed

- Frontend ↔ primary backend: implemented API client contracts.
- Primary backend ↔ MongoDB: implemented and smoke-tested.
- Primary backend ↔ separate ML engine: implemented and smoke-tested.
- Frontend ↔ ML result: implemented through backend `/api/v1/ml/triage`.
- Frontend map ↔ backend hotspots: implemented.

## Integrations remaining

- Android APK build verification once Gradle distribution/dependencies are available.
- Production external services/notifications/identity: **UNKNOWN — requires confirmation**.
- Optional `03-ml-engine/vision_service`: NOT YET IMPLEMENTED in the current architecture.

## Next steps

1. Restore network/cache access and rerun `GRADLE_USER_HOME=/tmp/drishti-gradle ./gradlew assembleDebug` from `01-frontend/android`.
2. Add automated API tests for the current `02-Backend` routes and ML service contract.
3. Confirm data privacy and authorization rules for docket lookup, uploads, and seeding.
4. Decide whether to retire, keep isolated, or formally integrate the optional `03-ml-engine/vision_service` prototype.
5. Decide whether to implement or remove unsupported UI-only OTP/SSO/notification/assignment claims and isolate or remove the stale nested backend stub.
