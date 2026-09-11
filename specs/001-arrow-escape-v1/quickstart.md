# Quickstart Validation: Arrow Escape Puzzle Game V1

This guide validates the planned V1 end to end. It complements the data rules in
[data-model.md](data-model.md), the deterministic behavior in
[contracts/game-engine.md](contracts/game-engine.md), and the service contract in
[contracts/openapi.yaml](contracts/openapi.yaml).

## Prerequisites

- Node.js 20 LTS and npm
- Python 3.12
- Chrome or Edge
- A supported shell

## Local Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

In a separate terminal:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Expected local addresses:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API documentation: `http://localhost:8000/docs`

AI configuration is optional. A missing provider key or unavailable provider must
not prevent frontend startup, core play, local hints, or saved progress.

## Fast Quality Gate

Run the full pre-release baseline before manual testing:

```bash
cd frontend
npm run validate:levels
npm run lint
npm run test -- --run
npm run build
npm run test:e2e
```

```bash
cd backend
source .venv/bin/activate
pytest
```

Expected results:

- Level validation reports at least 32 valid, solvable bundled levels and exits
  successfully.
- Frontend lint, unit/component/accessibility tests, production build, and browser
  tests pass.
- Backend API tests pass, including controlled errors and AI failure behavior.

## Acceptance Walkthrough

### 1. Launch and Navigation

1. Open `http://localhost:5173` in Chrome or Edge.
2. Confirm the branded splash appears briefly with nonessential animation.
3. Confirm Home appears with Play Now, Levels, Daily Challenge, and Settings.
4. Confirm each destination opens and returning from it preserves saved progress.

Expected: the application loads without visible errors, does not wait
unnecessarily at splash, and remains game-first rather than dashboard-like.

### 2. Start, Move, and Complete a Level

1. Choose Play Now, select Level 1, and confirm the board and timer appear.
2. Activate an arrow whose path to the board edge is clear.
3. Confirm the arrow exits, success feedback occurs, and moves increase by one.
4. Activate an arrow with another active arrow in its path.
5. Confirm it remains, blocked feedback occurs, moves do not increase, and an
   accessible message announces the blocked state.
6. Clear the remaining arrows.

Expected: Level Complete reports score, elapsed time, moves, mistakes, stars,
and offers Next Level and level selection. Repeating the level never overwrites a
better saved result with a worse one.

### 3. Level Catalog and Validation

1. Open Levels and confirm 32 or more levels across easy, medium, hard, and
   expert progression.
2. Confirm Level 1 is available and later levels are locked until unlocked.
3. Complete the first level and return to confirm completion and stars appear and
   the next eligible level unlocks.
4. Run `npm run validate:levels` after temporarily adding an invalid out-of-bounds
   or unsolvable fixture outside the shipped catalog.

Expected: locked levels cannot start; a deliberately invalid fixture causes level
validation to fail with the level ID/reason; no invalid or unsolvable level is
shown to players.

### 4. Pause, Refresh, and Persistence

1. Start an unfinished level, make one legal move, then pause it.
2. Confirm board input is disabled and the elapsed timer stops.
3. Resume and confirm the same board and counts continue.
4. Refresh during a different unfinished attempt.
5. Choose Resume, then repeat and choose Start Over.
6. Complete a level, refresh, and inspect Levels and Settings.

Expected: resume restores the attempt; start-over restores its initial board;
completion, stars, best score/time, sound, vibration, theme, and motion choices
remain available on the same device. Corrupted saved data restores safe defaults
without blocking play.

### 5. Local Hint and Offline Operation

1. Start a level with a legal move and choose Hint.
2. Confirm a currently legal arrow is highlighted with a clear-path explanation.
3. Confirm the hint does not remove an arrow or increase moves.
4. In browser DevTools, set the network offline and reload after the app shell has
   been visited once.
5. Repeat the launch, Level 1, valid move, blocked move, hint, completion, and
   persistence flow.

Expected: built-in levels, local hints, active play, and progress work offline.
If no legal move exists, the hint response is honest and offers restart or level
selection rather than suggesting an illegal move.

### 6. Optional AI Guidance and Failure Fallback

1. With valid server AI configuration, request each available AI mode: Hint,
   Move Explanation, and Coach.
2. Confirm an accepted suggestion references a currently legal active arrow and
   does not change the board.
3. Stop the backend, put the browser offline, simulate a timeout, return malformed
   provider content, return an illegal arrow ID, and exceed the route's request
   limit.
4. Request AI guidance in each failure state.

Expected: every failure results in a friendly local hint or friendly unavailable
message. The game remains playable. Browser UI and API payloads never display a
provider credential, upstream message, stack trace, or raw technical error.

### 7. Backend Health and API Contract

```bash
curl -i http://localhost:8000/health
curl -i http://localhost:8000/health/ready
```

Expected health body:

```json
{
  "status": "healthy",
  "service": "arrow-escape-api",
  "version": "1.0.0"
}
```

Compare the API documentation with [contracts/openapi.yaml](contracts/openapi.yaml).
Verify `POST /api/v1/ai/hint` returns controlled `400`, `413`, `429`, `500`, or
`503` envelopes as applicable, each with `X-Request-ID` and no sensitive details.
Verify only configured frontend origins are accepted by CORS.

### 8. Keyboard and Screen Reader

1. Navigate with Tab and Shift+Tab on Home, Level Select, Game, pause, completion,
   settings, and daily screens.
2. Use Enter and Space to operate focused buttons and arrows; use Escape to pause
   an active level.
3. With a screen reader active, focus several arrows and complete valid/blocked
   actions, pause, resume, and a level completion.

Expected: every important control is reachable, focused, and operable; arrows
announce row, column, and direction; live messages describe blocked and successful
moves, pause state, and completion. Direction remains understandable without
color.

### 9. Reduced Motion and Feedback Preferences

1. Enable system reduced motion and reload; then test the game's reduced-motion
   setting.
2. Trigger a valid move, a blocked move, a hint, and completion.
3. Disable sound and vibration separately and repeat those actions on supported
   hardware.

Expected: excessive movement and particles are reduced, while every state change
remains visually and accessibly clear. Disabling sound/vibration never removes
essential feedback.

### 10. Responsive Validation

Use browser device emulation and repeat launch, navigation, Level 1 play, hint,
pause, and completion at each viewport:

| Viewport  | Orientation checks     |
| --------- | ---------------------- |
| 360x640   | Portrait               |
| 375x667   | Portrait               |
| 390x844   | Portrait               |
| 412x915   | Portrait               |
| 768x1024  | Portrait and landscape |
| 1280x720  | Landscape              |
| 1366x768  | Landscape              |
| 1440x900  | Landscape              |
| 1920x1080 | Landscape              |

Expected: no horizontal scrolling, clipped board, overlap, inaccessible action,
or text collision. The board remains usable and interactive controls remain at
least 44 by 44 pixels where practical.

## Automated Acceptance Coverage

Playwright must automate the P1 game flow, blocked move, completion, persistence,
local hint, offline fallback, keyboard path, reduced-motion path, and every listed
viewport. Vitest/React Testing Library must cover the deterministic rules and
screen behavior. pytest must cover the health/readiness and AI contract outcomes.

## CI and Release Validation

1. Push a feature branch and confirm CI runs level validation, frontend lint/tests/
   build, backend tests, and a backend health probe.
2. Deliberately fail a test in a local branch and confirm the workflow fails.
3. Create a `v*` release tag only after CI is green.
4. Confirm the release workflow reruns validation and publishes only traceable
   `frontend-dist.zip`, `backend-package.zip`, test results, and build logs.

Expected: feature branches never publish production artifacts; a release artifact
is traceable to the tag, commit, branch, and build number, and no workflow
performs automatic production deployment.
