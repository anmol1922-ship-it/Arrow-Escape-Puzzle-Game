# Deterministic Game Engine Contract

## Authority

The local engine is the sole authority for arrow legality, state transitions,
completion, scoring inputs, local hints, solver output, and level validation. UI,
storage, audio, vibration, the backend, and AI providers consume engine results
but must not override them.

## Inputs

### Level Definition

A validated immutable Level, as defined in [data-model.md](../data-model.md), is
the only source for board dimensions, arrow position/direction, targets, scoring
profile, and progression order.

### Attempt State

An immutable GameAttempt contains the Level reference and current active arrow
IDs, counts, timer value, status, and optional hint highlight.

### Player Events

| Event                    | Preconditions               | Outcome                                              |
| ------------------------ | --------------------------- | ---------------------------------------------------- |
| `start`                  | Valid unlocked level        | New active attempt with all arrows active            |
| `activateArrow(arrowId)` | Attempt is active           | `escaped`, `blocked`, or `completed` MoveResult      |
| `requestLocalHint`       | Attempt is active           | Hint for legal arrow or recoverable no-move response |
| `pause`                  | Attempt is active           | Status becomes paused; timer freezes                 |
| `resume`                 | Attempt is paused           | Status becomes active                                |
| `restart`                | Attempt is active or paused | New active attempt from source Level                 |
| `tick(seconds)`          | Attempt is active           | Elapsed time advances; no other field changes        |

Any event received in a state where it is not allowed returns `ignored` and must
not alter an attempt, progress record, or score.

## Deterministic Rules

1. An arrow's escape path begins at its adjacent grid cell and ends at the first
   cell beyond the matching board edge.
2. The arrow is legal only when no active arrow occupies any in-bounds cell on
   that path.
3. A legal activation removes precisely that arrow from `activeArrowIds`,
   increments `moves` once, clears an obsolete hint, and emits escaped feedback.
4. A blocked activation keeps `activeArrowIds` unchanged, increments `mistakes`
   once, keeps `moves` unchanged, and emits blocked feedback.
5. Completion occurs only after the last active arrow escapes. The engine marks
   completion, freezes elapsed time, and invokes the pure scoring function once.
6. A local hint enumerates legal arrows in canonical row, column, ID order and
   uses the first arrow of the canonical shortest solver path. It never removes
   an arrow or increments a counter.
7. The solver and validator use the identical legality function. Any discrepancy
   is a test failure and blocks level publication.

## Outputs

### MoveResult

The engine returns an immutable result containing the requested arrow ID, the
new or unchanged GameAttempt, a result kind, and player-safe/ARIA-ready message.

| Result      | Required state effect                                 | Example announcement            |
| ----------- | ----------------------------------------------------- | ------------------------------- |
| `escaped`   | One arrow removed; moves +1                           | `Arrow cleared successfully.`   |
| `blocked`   | No arrow removed; mistakes +1                         | `This arrow is blocked.`        |
| `completed` | Final arrow removed; status complete; score/stars set | `Level complete.`               |
| `ignored`   | No state changes                                      | No repeat announcement required |

### Local Hint

A successful result identifies an active legal arrow and has a reason equivalent
to "Its path is currently clear." A no-move result is not a move recommendation;
it provides restart or level-selection recovery.

## Level Validation Contract

A level is publishable only if all of the following pass:

- required fields, types, direction values, IDs, and scoring profile reference
  are valid;
- board size is 4 through 7 and every arrow coordinate is within bounds;
- arrow IDs and positions are unique and at least one arrow exists;
- targets are positive and target moves are not below the canonical shortest
  solution length;
- every solver transition passes the same path validator used at runtime;
- the solver removes every arrow and completes within the configured benchmark.

The validation output lists every failed level ID and reason and returns a
nonzero exit status if any level fails. It runs before frontend tests, production
builds, and CI artifact publication.

## AI Boundary

AI guidance is input text only. Before it can be shown as a suggestion, the
returned `arrowId` must exist in the active attempt, pass deterministic path
validation, and agree with a solver-valid continuation. The engine exposes no
mutation method to AI callers. Any failed AI check produces a local hint or a
friendly unavailable result.
