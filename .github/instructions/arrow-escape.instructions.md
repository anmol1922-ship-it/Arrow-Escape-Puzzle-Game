---
description: "Use when creating or modifying any Arrow Escape game, frontend, backend, level, AI, storage, test, documentation, or workflow artifact. Enforces project game authority, offline, AI safety, accessibility, and V1 scope decisions."
applyTo: "**"
---

# Arrow Escape Project Instructions

## Product Identity

- Arrow Escape is a polished, mobile-first casual puzzle game. Preserve game
  feel, visual polish, responsive touch play, and progression in every change.
- Do not turn the player experience into a CRUD app, dashboard, admin layout,
  data-management interface, or form-heavy business application.
- The board and primary game flow use a custom game-oriented visual system.
  Generic tables, dashboards, and MUI-style card layouts are not valid primary
  game UI.
- Prefer the simplest design that preserves game quality, reliability,
  accessibility, and maintainable boundaries.

## Deterministic Game Authority

- The deterministic local game domain is the sole authority for move legality,
  blocked moves, arrow removal, completion, score, stars, solvability, and
  solver output. AI must never decide or enforce any of these.
- Keep puzzle rules out of React components. Components render, collect input,
  and orchestrate state; engine, move validator, puzzle validator, solver, and
  scorer remain independently testable game modules.
- Route every player move, local hint, level validator, solver transition, and
  accepted AI recommendation through the same deterministic move validation.
- Do not add a production level unless it has a unique ID, valid in-bounds arrow
  positions/directions, no conflicting positions, and a passing puzzle-validator
  and solver result.
- Use the solver to prove production puzzles are solvable. Do not accept a level
  because it merely appears solvable.
- Keep scoring and star thresholds as configurable game data, never duplicated
  UI literals.

## Game Feel and Responsive Play

- A successful arrow action gives immediate glow/highlight, escape motion,
  board update, and optional particles, sound, and haptics. A blocked action
  gives immediate blocked feedback with a subtle shake or pulse. Animation must
  never delay the authoritative state transition.
- Keep core controls touch-first, mouse-operable, and large/separated enough to
  prevent accidental activation. Hover may enhance the game but cannot be
  required for play.
- Support mobile portrait and landscape, tablet, and desktop. At the PRD
  viewports (360, 375, 390, 412, and 768 px widths plus desktop), normal play
  must have no horizontal scrolling, clipped board, overlapping controls, or
  unusably small controls.
- Treat browser Chrome/Edge as the primary development and acceptance target.
  Validate responsive, touch, layout, console, and failed-network behavior with
  browser tooling when available before claiming browser acceptance.

## Accessibility and Motion

- Preserve game rules when adding accessibility. Provide keyboard operation,
  visible focus, accessible arrow descriptions and controls, and live
  announcements for blocked moves, successful escapes, pause, and completion.
- Direction and state must remain understandable without color; arrows must
  visibly and accessibly identify UP, DOWN, LEFT, or RIGHT.
- Respect `prefers-reduced-motion`. Reduce nonessential movement and particles,
  avoid excessive screen movement, and retain all functional, visual, and
  accessible feedback. Do not remove necessary controls or information.
- Disabling sound or vibration cannot remove essential gameplay feedback.

## Offline Storage and Recovery

- Core play must launch and remain playable offline: bundled levels, deterministic
  validation, moves, completion, scoring, stars, local hints, and saved progress
  cannot depend on the backend.
- Store only local game progress/settings through the repository storage
  abstraction. Do not access `localStorage` directly from arbitrary components.
- Persist completed levels, stars, best score/time, settings, theme, and
  resumable state where applicable. Do not store secrets, credentials, passwords,
  or sensitive personal data.
- Preserve progress across refresh/restart where possible and give the player a
  recovery path rather than a blank screen or lost completion record.
- Keep browser code suitable for later Capacitor packaging without introducing
  Capacitor-specific complexity before it is requested.

## Optional AI Boundary

- V1 AI features are only AI Hint, AI Move Explanation, and AI Coach. Do not add
  AI puzzle generation, difficulty recommendations, personalized challenges,
  AI daily challenges, visual puzzle analysis, or other future AI features unless
  explicitly requested.
- Use `google/gemma-4-26B-A4B-it` through configuration and a backend provider
  abstraction. Never hardcode it throughout game logic.
- AI requests must flow through the backend. Credentials, provider tokens, and
  provider-specific details must never appear in React code, browser bundles,
  committed environment files, logs, error messages, screenshots, or fixtures.
- Accept AI content only after response-schema, game-state, deterministic move,
  and solver validation. AI can provide explanatory text but cannot directly
  manipulate local game or React state.
- For timeout, offline/network failure, malformed output, invalid advice, provider
  failure, or rate limiting, use deterministic local guidance when possible. AI
  failure must not interrupt play.
- Player-facing errors are friendly and game-oriented. Never reveal HTTP 500 text,
  provider errors, tracebacks, stack traces, internal hosts, API auth details, or
  secrets. The UI must have an error boundary with retry and return-home recovery
  actions.

## V1 Architecture and Scope

- Keep the V1 boundaries explicit: React UI -> application hooks/state -> game
  engine -> solver/validator/scoring; React -> FastAPI -> AI service -> Gemma
  provider. Neither AI nor backend may bypass the game engine.
- Use browser-local persistence only for V1. Do not add authentication, accounts,
  a database, vector database, RAG, embeddings, Redis, Kafka, Kubernetes,
  microservices, or speculative enterprise architecture unless the requirement
  explicitly changes.
- Backend AI endpoints must use schema validation, explicit configured CORS,
  request-size limits, rate limiting, request/correlation IDs, and controlled
  safe error envelopes. Health/readiness responses must not expose secrets.

## Quality, Documentation, and Delivery

- Any game-rule change must update focused coverage for legal/blocked moves,
  arrow removal, completion, scoring/stars, solver behavior, and puzzle
  validation as applicable. Fix implementation defects rather than weakening
  tests unless the product behavior intentionally changed.
- Before marking work complete, run the relevant frontend type/lint/test/build
  checks, backend tests, and applicable component, accessibility, responsive,
  offline, and failure-path checks. Do not leave known build failures for later.
- Keep project documentation focused on Arrow Escape decisions: escape rules,
  level validation, local storage, AI fallback, browser testing, and release
  workflow. Avoid generic technology tutorials.
- Do not make normal feature changes directly on `main`. Required CI must run
  frontend install/lint/test/build and backend install/test; a failed required
  check must fail the workflow. Release workflows may publish traceable artifacts
  only after validation and must not auto-deploy production.
- Preserve existing behavior and project conventions unless requirements change;
  inspect related tests before changing core logic and avoid unrelated refactors.
