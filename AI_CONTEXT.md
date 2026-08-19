# DRISHTI AI Context and Working Agreement

**Last Updated:** 2026-08-19  
**Shared documentation:** [PRD](PRD.md) · [TDR](TDR.md) · [Architecture](ARCHITECTURE.md) · [Contracts](CONTRACTS.md) · [Research](RESEARCH.md) · [Progress](PROGRESS.md)

## Required reading order

1. Read this file first.
2. Read [PRD.md](PRD.md) for product intent and scope.
3. Read [TDR.md](TDR.md) for implemented technology and constraints.
4. Read [ARCHITECTURE.md](ARCHITECTURE.md) before changing system boundaries.
5. Read [CONTRACTS.md](CONTRACTS.md) before changing an integration or API.
6. Read [RESEARCH.md](RESEARCH.md) for confirmed discoveries and open questions.
7. Read [PROGRESS.md](PROGRESS.md) for current state, tests, and blockers.

Documentation is a shared memory aid, not a substitute for inspecting current code. Resolve discrepancies in favor of verified source/configuration, then update the relevant document.

## Operating rules

- Treat `PRD.md` as the product source of truth, `TDR.md` as the technical source of truth, `ARCHITECTURE.md` as the system-structure source of truth, and `CONTRACTS.md` as the integration/interface source of truth.
- Inspect actual code, configuration, and repository state before making assumptions.
- Clearly distinguish facts, assumptions, plans, and unknowns. Mark unsupported information as `UNKNOWN — requires confirmation`.
- Never invent missing functionality or claim a feature works without running an appropriate test.
- Never silently change architecture or replace an existing technology merely by preference.
- Preserve working functionality and make minimal, targeted changes.
- Search before creating files, components, routes, schemas, or services; reuse existing implementations where appropriate.
- Respect existing coding conventions and the established primary topology: `01-frontend` → `02-Backend` → MongoDB / `03-ml-engine`.
- Treat root `app/` as unintegrated legacy code unless a task verifies and authorizes a change.
- Use `02-Backend/main.py` as the primary backend entrypoint. Treat `02-Backend/app/main.py`, `app/routes/`, and `app/database_legacy/` as unintegrated stale code unless a task explicitly addresses them.
- Treat frontend OTP, Parichay SSO, SMS/reminder, CPGRAMS-ledger, and officer-assignment messaging as UI-only unless a current backend/external contract proves otherwise.
- Do not create fake/mock integrations merely to make the system appear complete unless a task explicitly requires a clearly labeled prototype fallback.
- Keep secrets in ignored environment files; never expose them in code or documentation.
- Run relevant lint/typecheck/build/import/API tests after changes and report failures honestly.
- Never delete or rewrite major project areas without explicit justification and scope confirmation.

## Documentation maintenance

After significant implementation work:

- Update `CONTRACTS.md` for API, service, schema, or authentication changes.
- Update `ARCHITECTURE.md` for runtime/component relationship changes.
- Update `TDR.md` for technology/configuration/technical-debt changes.
- Update `RESEARCH.md` for durable discoveries or resolved questions.
- Update `PROGRESS.md` after completed work, tests, blockers, and next steps.
- Record important architectural or technical decisions with repository evidence; do not backfill invented rationale.

## AI workflow

1. Read context.
2. Inspect repository.
3. Understand existing implementation.
4. Identify exact task.
5. Plan minimal changes.
6. Implement.
7. Test.
8. Fix failures.
9. Update documentation.
10. Report exactly what changed and what remains.

## Verification baseline

Use checks appropriate to the touched component. Current known commands include frontend `npm run lint`, `npm run build`, `npx cap sync android`; Python compile/import/OpenAPI checks for backend/ML; and live local smoke checks when services and MongoDB are available. Do not report a blocked external dependency as a source-code failure.
