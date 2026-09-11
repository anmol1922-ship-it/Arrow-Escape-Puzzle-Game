# Arrow Escape Architecture

## Authority Boundaries

```text
React screens/components
        |
        v
Application session and persistence adapter
        |
        v
Deterministic engine -> move validator -> solver / level validator / scorer

React AI client -> FastAPI AI route -> AI service -> Gemma provider
                                      |
                                      v
                         schema + state + legal-move validation
```

The deterministic frontend domain is the only authority for legality, blocked
moves, arrow removal, completion, score, stars, hints, solvability, and solver
output. React renders engine results and collects input; it does not calculate
rules. AI can provide explanatory text only after its proposed arrow passes the
same local legality check and solver confirmation.

## Level Validation

The catalog contains 32 version-controlled JSON levels. The `validate:levels`
command checks IDs, unlock order, dimensions, positions, directions, scoring
profiles, shortest solver solution, legal solver transitions, and target moves.
The command runs before tests/build and in CI, so invalid or unsolvable content
cannot ship.

## Local Storage

`StorageAdapter` is the only browser storage boundary. V1 stores versioned
progress, settings, daily results, and one resumable attempt. Invalid records
fall back to safe defaults without blanking the game. No secret, provider token,
account, or sensitive personal data is stored.

## Offline and Recovery

Bundled levels and the PWA app shell support core play without the backend. AI
requests are never cached as gameplay authority. On refresh, an unfinished
attempt offers Resume or Start Over; completed results remain in the progress
record. The global error boundary offers Try Again and Return Home.

## Game Feel

A successful move updates authoritative state immediately, then presents escape
motion and optional sound/vibration/particles. Blocked moves keep the arrow,
update mistakes, and show a brief shake/pulse plus an accessible announcement.
Reduced motion removes nonessential movement without removing information.
