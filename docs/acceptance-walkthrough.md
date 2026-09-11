# Arrow Escape Acceptance Walkthrough

Run the frontend at `http://localhost:5173` and the optional backend at
`http://localhost:8000`. Use Chrome or Edge. Core gameplay must also be checked
with the backend stopped and the browser offline after the app shell has loaded.

## Test 1 — Launch

1. Start frontend.
2. Open Chrome.
3. Navigate to `http://localhost:5173`.
4. Confirm splash screen.
5. Confirm home screen loads.

Expected: Application loads without errors and the short splash reaches Home.

## Test 2 — Start Game

1. Click Play Now.
2. Select Level 1.
3. Confirm game board appears.
4. Confirm timer starts.

Expected: A playable puzzle appears with directional arrows and counters.

## Test 3 — Valid Arrow

1. Identify an arrow with a clear path.
2. Click/tap it.
3. Confirm animation.
4. Confirm arrow disappears.
5. Confirm move count increases.

Expected: Arrow successfully escapes and accessible success feedback appears.

## Test 4 — Blocked Arrow

1. Select a blocked arrow.
2. Click/tap it.

Expected: Arrow remains, blocked feedback appears, successful moves do not
increase, and accessible feedback is announced.

## Test 5 — Complete Level

1. Continue until all arrows are removed.

Expected: Level Complete shows score, time, moves, mistakes, stars, and next
level/level-select actions.

## Test 6 — Progress Persistence

1. Complete Level 1.
2. Refresh browser.
3. Open Level Select.

Expected: Level 1 remains completed and its stars/best result remain saved.

## Test 7 — Hint

1. Start a level.
2. Click Hint.

Expected: A legal arrow is highlighted and the clear-path explanation appears;
the hint does not remove an arrow or count as a move.

## Test 8 — AI Failure

Disconnect backend or simulate AI failure. Click AI Hint/Coach.

Expected: Game remains functional, deterministic local guidance appears, and no
technical error is displayed.

## Test 9 — Backend Health

Open `/health`.

Expected:

```json
{
  "status": "healthy",
  "service": "arrow-escape-api",
  "version": "1.0.0"
}
```

Also open `/health/ready`; it must return a safe readiness result and no secrets.

## Test 10 — Responsive

Use Chrome DevTools and test `360x640`, `390x844`, `412x915`, `768x1024`, and
`1920x1080`, plus the full automated matrix in `frontend/tests/e2e/responsive.spec.ts`.

Expected: no clipping, horizontal scrolling, overlap, or inaccessible controls.

## Test 11 — Keyboard Accessibility

Navigate using Tab, Shift+Tab, Enter, Space, and Escape.

Expected: important controls are reachable, focus is visible, buttons operate,
pause works, and game state is understandable.

## Test 12 — Reduced Motion

Enable `prefers-reduced-motion` and the in-game reduced-motion setting.

Expected: game remains fully functional, nonessential animation is reduced, and
no important information depends on movement.

## Test 13 — Production Build

```bash
cd frontend
npm run build
cd ../backend
.venv/bin/pytest
```

Expected: production build and backend tests pass with no known failures.

## Test 14 — GitHub CI

Push to a feature branch.

Expected: frontend validation, backend tests, and build checks run and fail the
workflow when a required check fails.

## Test 15 — Release

Create a `v*` release tag after CI passes.

Expected: production validation, build, traceable artifact creation, and publish
run; production deployment is never performed automatically.

## Automated evidence

Current local acceptance evidence is maintained by the Playwright P1,
navigation, recovery, persistence, daily, AI fallback, accessibility, and
responsive specs. The final release run must execute this walkthrough manually
in Chrome/Edge and retain the CI artifact logs.
