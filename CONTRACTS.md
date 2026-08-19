# DRISHTI Integration Contracts

**Last Updated:** 2026-08-19  
**Related:** [Architecture](ARCHITECTURE.md) · [TDR](TDR.md) · [Progress](PROGRESS.md)

## Conventions

- API prefix: `/api/v1`.
- JSON errors use FastAPI's `{ "detail": ... }` format; frontend converts common status codes to user messages.
- Authenticated browser requests use `Authorization: Bearer <JWT>`.
- Status labels in storage/API use lowercase underscore values; the dashboard maps them to presentation labels.

## Primary backend API

| Status | Method / path | Auth | Request | Response / frontend use |
|---|---|---|---|---|
| IMPLEMENTED | `GET /api/v1/health` | No | — | Service/database status, optional `databaseError`. |
| IMPLEMENTED | `GET /api/v1/status` | No | — | Basic running status. |
| IMPLEMENTED | `POST /api/v1/auth/register` | No | `name`, `email`, `mobile`, `password`; optional profile fields | 201 `{access_token, token_type, user}`. |
| IMPLEMENTED | `POST /api/v1/auth/login` | No | `{identifier, password}` | JWT auth response. |
| IMPLEMENTED | `POST /api/v1/auth/officer/login` | No | `{username, password}` | Officer JWT auth response. |
| IMPLEMENTED | `GET /api/v1/auth/me` | JWT | — | Current serialized user. |
| IMPLEMENTED | `GET /api/v1/grievances` | JWT | — | Citizen's own grievances; officer/admin receives all. |
| IMPLEMENTED | `POST /api/v1/grievances` | Citizen JWT | `description`, `category`; optional title/ministry/subcategory/location/priority/attachment fields | 201 serialized grievance plus timeline. ML is best-effort. |
| IMPLEMENTED | `GET /api/v1/grievances/lookup?registration_number=…` | No | Query parameter | Serialized grievance by docket number. Used by landing tracker. |
| IMPLEMENTED | `GET /api/v1/grievances/{id}` | JWT | Mongo ObjectId path | Serialized grievance plus timeline; citizen ownership enforced. |
| IMPLEMENTED | `PATCH /api/v1/grievances/{id}/status` | Officer/admin JWT | `{status, note?}` | Updated grievance plus timeline. |
| IMPLEMENTED | `POST /api/v1/uploads` | JWT | `multipart/form-data`, field `file` | 201 `{filename, storedFilename, url, contentType, sizeBytes, ...}`. |
| IMPLEMENTED | `GET /api/v1/disaster/hotspots` | No | — | Array of hotspot objects. Used by map. |
| IMPLEMENTED | `POST /api/v1/disaster/seed` | No | — | Seeds/counts hotspots. Security policy is **UNKNOWN — requires confirmation**. |
| IMPLEMENTED | `POST /api/v1/ml/triage` | Citizen/officer/admin JWT | `{description, filename?}` | ML triage result or 503 if ML service unavailable. |

### Response shapes and errors

- An authentication success response is `{access_token, token_type: "bearer", user}`. Citizen `user` includes `id`, `role`, `name`, `email`, `mobile`, and optional profile fields; officer `user` includes `id`, `role`, `username`, identity/contact, department, designation, and subdivision fields.
- A serialized grievance includes `id`/`_id`, `docketNumber`/`registrationNumber`, `citizenId`, description/title, status, ministry/category/subCategory, location, priority, `aiTriaged`, attachment fields, and timestamps. Create, get-by-ID, and status-update responses additionally include `timeline`; list and public lookup do not.
- Hotspot responses contain identifier/name, risk/category, latitude/longitude and GeoJSON `location`, plus the seeded hotspot metadata when available. Upload responses include `status`, original/stored names, absolute local `filePath`, relative static `url`, content type, and byte size.
- Validation failures are FastAPI `422 {"detail": [ ... ]}`. Domain/auth errors use `{"detail": "..."}`: duplicate user or invalid status `400`; invalid credentials/token or absent auth `401`; role/ownership denial `403`; missing grievance `404`; ML proxy unavailable `503`. Storage/database failures can return `500`. The frontend maps these to user-facing messages.

## Frontend ↔ backend mapping

| Frontend module | Backend contract | Status |
|---|---|---|
| `api/auth.ts` | Auth register/login/officer-login/me | IMPLEMENTED and matched |
| `api/grievances.ts` | List/create/lookup/upload | IMPLEMENTED and matched |
| `api/disaster.ts` | Hotspot list | IMPLEMENTED and matched |
| `api/ml.ts` | ML triage proxy | IMPLEMENTED and matched |
| `api/client.ts` | Base URL, JWT header, JSON/FormData, errors | IMPLEMENTED |

## ML service contract

| Status | Method / path | Input | Output |
|---|---|---|---|
| IMPLEMENTED | `GET /health` | — | `{status, service, engine}` |
| IMPLEMENTED | `POST /api/v1/triage` | `{description: string, filename?: string}` | `{label, ministry, category, subCategory, priority, confidence, signals, engine}` |

`02-Backend/app/services/ml.py` POSTs the same JSON body to `${ML_ENGINE_URL}/api/v1/triage` with a configured timeout. It maps transport/parse failures to `MLEngineUnavailable`.

## Database/service contracts

| Service | Contract | Status |
|---|---|---|
| MongoDB users | Email/mobile unique sparse indexes; bcrypt `password_hash`; citizen role/profile fields | IMPLEMENTED |
| MongoDB officers | Unique `username`; demo officers are seeded if backend initialization succeeds | IMPLEMENTED |
| MongoDB grievances | Docket, citizen id, description, state, optional metadata and attachments | IMPLEMENTED |
| MongoDB timeline | Event documents keyed by grievance id | IMPLEMENTED |
| MongoDB hotspots | GeoJSON `location` with 2dsphere index; hotspot metadata | IMPLEMENTED |
| Local uploads | Returned `url` is relative `/uploads/<stored name>` | IMPLEMENTED |

## Known contract limitations

- `CreateGrievanceRequest.category` is required even though backend independently invokes triage; frontend supplies it after a triage result or current form state. This is IMPLEMENTED, not automatic backend field replacement.
- The UI exposes OTP, Parichay SSO, reminder/SMS, CPGRAMS-ledger, and auto-assignment messaging, but there are no corresponding primary-backend endpoints or external service contracts. These are NOT IMPLEMENTED integrations.
- ML engine host/port variables appear only in its example environment file; actual Uvicorn host/port are launch arguments. PARTIALLY IMPLEMENTED configuration.
- Optional `03-ml-engine/vision_service` vision/WebSocket endpoints and the alternate `02-Backend/app/main.py` stub are not contracts of the current frontend/backend system. NOT YET IMPLEMENTED in this architecture.
