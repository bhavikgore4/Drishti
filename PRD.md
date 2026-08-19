# DRISHTI Product Requirements Document

**Last Updated:** 2026-08-19  
**Related:** [TDR](TDR.md) · [Architecture](ARCHITECTURE.md) · [Contracts](CONTRACTS.md) · [Progress](PROGRESS.md)

## Product intent

DRISHTI is a civic grievance and disaster-information prototype focused on the Nagpur context. The frontend README describes the product as an AI-powered public grievance and disaster-management portal aligned with CPGRAMS-style workflows. The implemented application lets citizens register, authenticate, submit and track grievances, attach files, view disaster hotspots, and receive automated triage suggestions.

## Problem

Citizens need a single interface to submit civic or disaster-related grievances, attach evidence, track a docket, and review locally relevant disaster-risk information. Operators need authenticated grievance status-management APIs.

## Target users

| User | Supported need |
|---|---|
| Citizen | Register/login, submit a grievance, upload an attachment, view own grievances, look up a docket, and use AI triage. |
| Officer | Authenticate and update grievance status through the API. A dedicated officer login UI exists. |
| Public visitor | View landing content, disaster hotspots, and use public docket lookup. |
| Administrator | Role is recognized by backend authorization. Admin UI and provisioning workflow are **UNKNOWN — requires confirmation**. |

## Product vision and goals

- Provide a local, runnable prototype linking a web/mobile-capable UI, REST backend, MongoDB data store, and a local ML triage service.
- Make grievance submission and docket tracking data-driven rather than static UI examples.
- Surface Nagpur disaster hotspot information in the map experience.
- Keep ML triage optional: a failure must not prevent grievance creation.

## Core implemented features

| Area | Behavior |
|---|---|
| Authentication | Citizen registration/login, officer login, JWT bearer session, and current-user lookup. |
| Grievances | Authenticated citizens can create/list/view their own grievances; officers/admins can update status. |
| Tracking | Public lookup by registration/docket number. |
| Attachments | Authenticated upload stored by the backend and served below `/uploads`. |
| Disaster data | Backend seeds and exposes hotspot records; frontend map fetches them. |
| ML triage | Dashboard sends description/filename to backend; backend proxies to `03-ml-engine`; results populate the form. Grievance creation records whether triage succeeded. |
| Frontend resilience | Existing UI displays API loading/error states for grievances and hotspots; triage shows a manual-selection message if unavailable. |
| Android | Capacitor project exists and synchronizes web assets to Android. |

The frontend also contains presentation-only OTP, Parichay SSO, SMS/reminder, CPGRAMS-ledger, and auto-assignment language. These are **NOT IMPLEMENTED as verified backend integrations**; where present, they are UI feedback or static/sample content.

## User requirements and expected behavior

1. A citizen can create an account with name, email, mobile, and password, then receives a bearer token.
2. An authenticated citizen can request triage for a non-empty grievance description and receive category, ministry, subcategory, priority, confidence, signals, and engine name.
3. A citizen can upload a file and submit a grievance. The backend assigns a unique `DRISHTI/<year>/<six digits>` docket number.
4. A citizen can list only their own grievances. An officer/admin can list all grievances and update their status.
5. A visitor can look up a grievance by registration number; the response deliberately excludes timeline/citizen data beyond the serialized grievance.
6. A visitor can retrieve disaster hotspots; the backend supplies minimal seeded hotspot data when the collection is empty.
7. If the ML service is unavailable, direct triage returns HTTP 503 and grievance creation continues with `aiTriaged: false`.

## Scope and MVP boundary

### In scope

- Web frontend and Capacitor asset sync.
- FastAPI REST API, MongoDB collections/indexes, JWT authentication.
- Grievance lifecycle API, attachment storage, docket lookup, and hotspot API.
- Local deterministic ML triage service.

### Explicitly out of scope / not evidenced as complete

- A trained statistical/deep-learning grievance classifier.
- Production notification delivery (SMS, email, push): **UNKNOWN — requires confirmation**.
- Real OTP, external identity/Parichay SSO, SMS, email, push, and reminder delivery: **NOT IMPLEMENTED**; citizen/officer login uses local MongoDB credentials and the related frontend messaging is not a delivery integration.
- Real-time weather ingestion through the backend: **NOT IMPLEMENTED**. The frontend directly queries Open-Meteo.
- Production deployment, hosting, TLS, backups, rate limiting, malware scanning, and object storage: **UNKNOWN — requires confirmation**.
- Play Store release configuration: **NOT IMPLEMENTED**.

## Success criteria

- Frontend typecheck/build succeeds.
- Primary backend starts and reports MongoDB health.
- Separate ML service starts and returns deterministic triage output.
- Authenticated frontend contracts can reach backend endpoints.
- Backend can reach MongoDB and the configured ML URL.
- A grievance can be triaged, created, retrieved, and looked up by docket.

## Known assumptions

- The local development topology is frontend `http://localhost:3000`, backend `http://localhost:8000`, ML service `http://localhost:8001`, and MongoDB `mongodb://localhost:27017`.
- Hotspot data is demo/prototype data seeded by `02-Backend/app/database.py`; completeness of the broader “77 hotspots” narrative in the frontend README is **UNKNOWN — requires confirmation**.
- The keyword-based ML result is a prototype baseline, not a trained model or accuracy claim.
