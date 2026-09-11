# Arrow Escape Testing

## Frontend

```bash
cd frontend
npm run validate:levels
npm run lint
npm run test -- --run
npm run test:e2e
npm run build
```

Vitest covers move legality, immutable engine transitions, timer/pause state,
solver/local hints, score/star thresholds, storage recovery, components, and
settings. Playwright covers the PRD P1 flow, navigation, persistence, daily play,
AI fallback, keyboard/reduced motion, and 360x640 through 1920x1080 viewports.
Axe coverage checks the board semantics; browser checks confirm focus and live
feedback.

## Backend

```bash
cd backend
.venv/bin/pytest
```

Pytest covers health/readiness, request IDs, explicit CORS, request-size limits,
controlled errors, Pydantic schemas, deterministic AI response validation,
provider failures, and local fallback. Run from `backend/` so `pytest.ini` can
resolve the `app` package.

## Test Data Rules

Production levels must pass `npm run validate:levels`. Do not weaken a test to
make a rule implementation pass. Update focused tests when an intentional product
behavior changes.
