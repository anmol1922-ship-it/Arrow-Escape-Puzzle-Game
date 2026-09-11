# Research: Arrow Escape Puzzle Game V1

## 1. Deterministic Move Validation

**Decision**: Represent each board position as an immutable level definition plus
a set of active arrow IDs. Determine legality with a pure linear scan from the
cell adjacent to an arrow through the board edge in its declared direction.

**Rationale**: The rule is a one-dimensional occupancy check with a maximum scan
length equal to board size. A pure function is fast, repeatable, and can be used
unchanged by player moves, local hints, the solver, level validation, and AI
response validation. It keeps core gameplay fully offline and authoritative.

**Alternatives considered**:

- Pathfinding algorithms: rejected because they add complexity to a simple linear
  escape-path rule.
- Server-side legality: rejected because it adds latency and breaks offline play.
- AI legality decisions: rejected by the constitution and because they are not
  deterministic or safe.

## 2. Solver and Local Hint Selection

**Decision**: Use breadth-first search over active-arrow sets to find a shortest
solution. Enumerate legal arrows in stable row, column, and ID order, and use the
first move from the resulting shortest path as the local hint.

**Rationale**: BFS guarantees a shortest solution for small finite boards and
produces predictable hints. A canonical traversal order makes the result stable
across sessions and test runs. A sorted active-arrow-ID signature is a compact,
collision-free state key because positions and directions do not change.

**Alternatives considered**:

- Depth-first search: finds a solution but not necessarily the shortest one and
  makes target-move validation less precise.
- Greedy selection: is simpler but can lead to a dead end or different result for
  equivalent states.
- Backend solver: rejected because solvability and hints must work offline.

## 3. Level Catalog and Shipping Validation

**Decision**: Store 32 authored JSON level definitions in four difficulty files:
8 easy, 8 medium, 8 hard, and 8 expert. Run a Node validation command before unit
tests, before production builds, and in CI.

**Rationale**: Static bundled definitions allow immediate offline play. The
validator guarantees each shipped level is structurally correct and solvable
before users can see it. Thirty-two levels exceed the V1 minimum while keeping
content size and quality review manageable.

**Validation sequence**:

1. Parse each JSON file and confirm the catalog count, unique IDs, and unique
   unlock order.
2. Validate required fields, known difficulty, directions, board bounds, positive
   targets, nonempty arrow list, and no overlapping positions.
3. Create the initial active-arrow state and solve it with the canonical solver.
4. Reject the catalog when any puzzle has no solution, solver result contains an
   illegal transition, target moves are below the shortest solution length, or a
   scoring profile is missing.
5. Emit level ID, shortest solution length, and failure reason to CI output.

**Alternatives considered**:

- Runtime-only validation: rejected because players could be offered a broken
  puzzle and validation could delay the game.
- Manual review alone: rejected because it cannot reliably prove solvability.
- Remote level delivery: rejected because it undermines offline-first V1.

## 4. Scoring and Stars

**Decision**: Store difficulty-keyed scoring profiles as data. A pure scorer
starts from configured base points and applies configured penalties for moves
over target, time over target, and mistakes. Profiles include the inclusive
minimum score for three, two, and one stars.

**Rationale**: Balancing values change more often than engine rules. Data-driven
profiles keep UI free of scoring literals, give designers one place to tune
thresholds, and make edge cases testable at exact boundaries. Completion clamps
the score to a nonnegative value and guarantees at least one star.

**Alternatives considered**:

- UI constants: rejected because values become duplicated and hard to tune.
- A complex adaptive formula: rejected as unnecessary for a fixed V1 level set.
- Service-supplied scoring rules: rejected because scoring must be offline.

## 5. Frontend State, Navigation, and Rendering

**Decision**: Use React 19 with TypeScript, Vite, React Router, application
context, and `useReducer`. Keep the pure engine outside React and have UI events
submit typed actions to it. Use CSS Grid for the board and lazy-load screen
modules after the app shell.

**Rationale**: This keeps game state transitions separate from rendering while
avoiding a global state library for a single-player puzzle. CSS Grid gives stable,
responsive square board cells without a canvas accessibility layer. Flat routes
map directly to the seven V1 screens, and lazy screen modules reduce initial
work.

**Alternatives considered**:

- Canvas board: rejected because per-arrow keyboard and screen-reader behavior
  would require a parallel accessibility model.
- Global Redux-style store: rejected because it adds ceremony without meaningful
  V1 complexity reduction.
- A server-rendered application: rejected because core gameplay must be offline.

## 6. Offline Delivery and Persistence

**Decision**: Use `vite-plugin-pwa` to precache the app shell, level files,
icons, and sound assets after the first successful visit. Define a versioned
`StorageAdapter` over `localStorage` for V1 progress, settings, daily results,
and resumable attempts.

**Rationale**: Precaching static game assets and local data meets browser-first
offline requirements. The adapter avoids scattered direct storage calls and can
be replaced for a later Capacitor package. Data volume is small, so IndexedDB is
unnecessary for V1.

**Alternatives considered**:

- No service worker: rejected because first-visit caching is needed for reliable
  offline reuse.
- IndexedDB: rejected as disproportionate for a small score/settings record.
- Caching optional AI responses: rejected because stale guidance can mismatch the
  current board and services remain optional.

## 7. Accessibility and Game Feedback

**Decision**: Render arrows as buttons with labels containing row, column, and
direction. Use one persistent polite ARIA live region for outcomes. Support
keyboard activation through native button behavior and Escape for pause. Provide
high-contrast visible focus, non-color direction glyphs, and a single
reduced-motion CSS mode driven by user preference and system preference.

**Rationale**: Native controls provide reliable keyboard semantics and touch
targets. Centralized live feedback avoids repetitive announcements. Motion and
color cannot be required to understand a move result, preserving playable access
for more players.

**Alternatives considered**:

- Clickable nonsemantic elements: rejected because they require reimplementing
  standard keyboard behavior.
- Hover-only hints or feedback: rejected because touch and keyboard users cannot
  rely on hover.
- Separate accessibility-only board: rejected because it risks divergent state.

## 8. Optional Gemma Integration

**Decision**: Use FastAPI with Pydantic v2 request/response schemas, an
`AIProvider` protocol, and a `GemmaProvider` implementation configured only by
backend environment variables. The model is `google/gemma-4-26B-A4B-it`; provider
calls use an `httpx.AsyncClient` with a five-second timeout.

**Rationale**: A provider boundary isolates external protocol and credentials,
allows deterministic mocks in tests, and permits an unavailable provider without
affecting the game. Pydantic validates service boundaries. The browser sends only
current-state context and never receives secrets or raw provider output.

**Alternatives considered**:

- Browser-to-provider calls: rejected because credentials would be exposed.
- Provider-specific code in routes: rejected because it impedes testing and safe
  replacement.
- AI-generated state changes: rejected because AI is supplemental, not game
  authority.

## 9. AI Validation, Safety, and Failure Behavior

**Decision**: Process AI guidance in this order: request schema validation,
provider response schema validation, domain validation against the client state,
deterministic move legality validation, then solver confirmation. Return a
player-safe response only after all checks pass; otherwise return a controlled
failure that the frontend replaces with a local hint.

**Rationale**: No AI output can become a legal recommendation without the same
deterministic checks used for a player move. The browser has a local fallback even
when the API itself is unavailable, avoiding a service dependency.

**Alternatives considered**:

- Trusting structured provider JSON: rejected because valid syntax does not prove
  a move is legal in the active board.
- Returning provider error text: rejected because it can expose secrets or
  confusing technical details.
- Retrying indefinitely: rejected because it delays player guidance and harms
  failure recovery.

## 10. API Safety Controls

**Decision**: Expose only `GET /health`, `GET /health/ready`, and
`POST /api/v1/ai/hint`. Configure an origin allowlist from environment, a 64 KiB
body-size middleware limit, an `X-Request-ID` middleware, and SlowAPI in-memory
limiting of the AI route to 20 requests per minute per client IP.

**Rationale**: The route set is the smallest surface needed by V1. Explicit
origins prevent arbitrary browser access, bounded input prevents accidental or
abusive oversized prompts, request IDs support safe support diagnostics, and a
small in-memory rate limit is enough for a no-database V1.

**Alternatives considered**:

- Wildcard CORS: rejected because it violates the explicit-CORS requirement.
- Distributed rate limiting: rejected because it requires infrastructure outside
  V1 scope.
- AI provider health probe on every readiness request: rejected because readiness
  should be fast and should not consume quota; validate configuration and client
  initialization instead.

## 11. Test Stack and Release Checks

**Decision**: Use Vitest for frontend domain tests, React Testing Library with
axe-core for components/accessibility, Playwright for browser acceptance and
viewports, and pytest with FastAPI's test client for backend behavior. Use
GitHub Actions with separate CI, build-validation, and tag-only artifact workflows.

**Rationale**: The selected tools test pure rules, accessible UI behavior, and
real browser workflows at the appropriate levels. CI catches invalid levels and
production build failures before release; release tags package artifacts without
performing a production deployment.

**Alternatives considered**:

- Snapshot-only UI tests: rejected because they do not demonstrate interaction or
  accessibility behavior.
- Manual responsive testing only: rejected because required viewports are release
  gates.
- Publishing from branch pushes: rejected because the constitution forbids it.
