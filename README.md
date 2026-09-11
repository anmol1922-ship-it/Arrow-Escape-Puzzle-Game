# Arrow Escape: Puzzle Game

Arrow Escape is a polished, mobile-first casual puzzle game. Players clear
directional arrows only when the complete path in the arrow's direction is open. The
board, solver, scoring, level validation, hints, completion, and progress are
local and deterministic; the optional backend only adds safe AI guidance.

## Features

- 32 bundled levels across easy, medium, hard, and expert chapters
- Deterministic arrow legality, solver, level validation, score, stars, and hints
- Responsive custom board for touch, mouse, keyboard, mobile, tablet, and desktop
- Local progress, resumable attempts, best scores/times, settings, and daily play
- Optional Gemma Hint, Move Explanation, and Coach with local fallback
- Friendly recovery UI, ARIA announcements, reduced-motion support, and visible focus
- CI, production build validation, and release-tag artifact packaging without auto-deployment

## Architecture

```text
React UI -> application session -> deterministic engine -> solver/validator/scoring
    |
    +-> FastAPI -> AI service -> configured Gemma provider (optional only)
```

The backend never decides whether a move is legal and never mutates browser game
state. See [docs/architecture.md](docs/architecture.md).

## Local Setup

Prerequisites: Node.js 20+ and Python 3.12+.

For the normal local setup, copy the root environment template and use the
launcher:

```bash
cp .env.example .env
./run.sh
```

The launcher starts the frontend on `http://localhost:5173` and the backend on
`http://localhost:8000`, then stops both processes together with `Ctrl+C`. Set
`RUN_BACKEND=0` to run only the frontend, or override `FRONTEND_PORT` and
`BACKEND_PORT` in `.env` when those ports are already in use.

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

In another terminal:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn app.main:app --reload
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

AI configuration is optional. Core play must work with the backend stopped and
without a network connection after the app shell has been cached.

## Environment Variables

Frontend uses `VITE_API_BASE_URL` for the optional guidance API. Backend uses
`AI_PROVIDER`, `GEMMA_MODEL`, `GEMMA_BASE_URL`, `GEMMA_API_KEY`,
`GEMMA_TIMEOUT_SECONDS`, `CORS_ORIGINS`, `MAX_REQUEST_BYTES`, and
`AI_RATE_LIMIT`. Commit only the example files; never commit credentials.

## Commands

```bash
cd frontend
npm run validate:levels
npm run lint
npm run test -- --run
npm run test:e2e
npm run build
```

```bash
cd backend
.venv/bin/pytest
```

Level validation runs before the frontend build and rejects malformed,
conflicting, out-of-bounds, below-target, or unsolvable levels. The test suite
covers game rules, solver behavior, components, accessibility, persistence,
responsive browser flows, API contracts, and AI failure fallback.

## AI Safety

AI calls go through FastAPI and the configured provider abstraction. Requests and
responses are schema-validated; returned arrow IDs are checked against the
current deterministic state and legal path before display. Timeouts, offline
mode, malformed output, illegal advice, provider failures, and rate limits use a
friendly local hint. Provider credentials and raw errors never reach the browser.

## Accessibility and Browser Validation

Arrow direction is visible in the arrow glyph and accessible label, not color
alone. Important outcomes use a live status region. Native buttons support touch,
mouse, keyboard, visible focus, and Escape-to-pause. `prefers-reduced-motion`
removes nonessential animation and particles while retaining feedback.

Chrome and Edge are the primary acceptance browsers. Run the exact walkthrough in
[docs/acceptance-walkthrough.md](docs/acceptance-walkthrough.md).

## Documentation

- [Architecture](docs/architecture.md)
- [API and safety contract](docs/api.md)
- [Accessibility](docs/accessibility.md)
- [Testing](docs/testing.md)
- [Deployment and release](docs/deployment.md)
- [Acceptance walkthrough](docs/acceptance-walkthrough.md)

## V1 Scope

V1 deliberately excludes authentication, accounts, databases, vector databases,
RAG, embeddings, Redis, Kafka, Kubernetes, microservices, public rankings,
personalization, AI puzzle generation, and production auto-deployment.
