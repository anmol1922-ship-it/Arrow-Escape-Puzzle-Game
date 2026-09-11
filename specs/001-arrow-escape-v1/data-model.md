# Data Model: Arrow Escape Puzzle Game V1

This model defines the stable data and state boundaries for V1. It intentionally
keeps authoritative gameplay local and treats AI guidance as optional text
validated against the current local state.

## Level

| Field               | Type              | Rules                                                   |
| ------------------- | ----------------- | ------------------------------------------------------- |
| `id`                | string            | Globally unique, stable ID such as `level-001`          |
| `title`             | string            | Nonempty player-facing title                            |
| `difficulty`        | enum              | `easy`, `medium`, `hard`, or `expert`                   |
| `boardSize`         | integer           | Inclusive range 4 through 7                             |
| `arrows`            | ArrowDefinition[] | Nonempty; IDs and positions are unique                  |
| `targetMoves`       | integer           | Positive and not less than the shortest solution length |
| `targetTimeSeconds` | integer           | Positive                                                |
| `scoringProfileId`  | string            | References a defined scoring profile                    |
| `unlockOrder`       | integer           | Unique positive progression position                    |

**Relationships**: A Level owns its ArrowDefinitions and references one
ScoringProfile. It produces GameAttempts and may be selected as a DailyChallenge.

**Validation**: Every arrow position must be in bounds, every direction must be
supported, no positions may overlap, and the canonical solver must return a legal
complete solution before the level ships.

## ArrowDefinition

| Field       | Type    | Rules                            |
| ----------- | ------- | -------------------------------- |
| `id`        | string  | Unique within its level          |
| `row`       | integer | Zero-based, within board bounds  |
| `column`    | integer | Zero-based, within board bounds  |
| `direction` | enum    | `UP`, `DOWN`, `LEFT`, or `RIGHT` |

**Relationships**: Definitions are immutable members of a Level. An active arrow
in a GameAttempt references a definition by ID; its position and direction never
change during an attempt.

## GameAttempt

| Field            | Type            | Rules                                                    |
| ---------------- | --------------- | -------------------------------------------------------- |
| `levelId`        | string          | References a validated Level                             |
| `activeArrowIds` | string[]        | Ordered set of currently present arrows                  |
| `moves`          | integer         | Starts at 0; increments only for legal escapes           |
| `mistakes`       | integer         | Starts at 0; increments once for each blocked activation |
| `elapsedSeconds` | integer         | Starts at 0; increases only while active and unpaused    |
| `status`         | enum            | `active`, `paused`, `completed`, or `abandoned`          |
| `score`          | integer or null | Set only on completion; nonnegative                      |
| `stars`          | integer or null | Set only on completion; 1 through 3                      |
| `hintedArrowId`  | string or null  | Active legal arrow currently highlighted                 |
| `startedAt`      | ISO timestamp   | Set when attempt begins                                  |
| `updatedAt`      | ISO timestamp   | Updated when resumable state is saved                    |

**State transitions**:

```text
new level -> active -> paused -> active
                    -> completed
                    -> abandoned
paused -> abandoned
```

- `active -> completed` requires no active arrows remaining.
- `active -> paused` freezes timer progression and rejects arrow activation.
- `paused -> active` preserves active arrows, moves, mistakes, and elapsed time.
- `active|paused -> abandoned` occurs only after an explicit restart, start-over,
  or return-home action; it never changes best completed progress.
- Restart creates a new `active` attempt from the immutable Level definition.

## MoveResult

| Field          | Type        | Rules                                           |
| -------------- | ----------- | ----------------------------------------------- |
| `kind`         | enum        | `escaped`, `blocked`, `completed`, or `ignored` |
| `arrowId`      | string      | The requested arrow ID                          |
| `attempt`      | GameAttempt | Resulting immutable attempt state               |
| `announcement` | string      | Player-safe status for the live region          |

**Validation**: `escaped` and `completed` require the shared path validator to
succeed. `blocked` preserves the active arrow set and move count. `ignored`
represents input while paused, complete, missing, or in transition and must not
change score or progress.

## ScoringProfile

| Field               | Type    | Rules                                      |
| ------------------- | ------- | ------------------------------------------ |
| `id`                | string  | Unique stable identifier                   |
| `baseScore`         | integer | Positive starting score                    |
| `movePenalty`       | integer | Nonnegative penalty per move over target   |
| `timePenalty`       | integer | Nonnegative penalty per second over target |
| `mistakePenalty`    | integer | Nonnegative penalty per blocked activation |
| `threeStarMinScore` | integer | Greater than `twoStarMinScore`             |
| `twoStarMinScore`   | integer | Greater than `oneStarMinScore`             |
| `oneStarMinScore`   | integer | Nonnegative minimum for completed attempt  |

**Relationships**: A Level references a profile; the score calculator takes a
completed GameAttempt and Level target values with this profile.

**Validation**: Thresholds must descend strictly. Completion produces at least
one star even if configured penalties reduce the clamped score below the
one-star threshold.

## Hint

| Field        | Type           | Rules                                        |
| ------------ | -------------- | -------------------------------------------- |
| `arrowId`    | string         | Must identify a currently active legal arrow |
| `message`    | string         | Concise player-facing recommendation         |
| `reason`     | string         | Explains that the complete path is clear     |
| `source`     | enum           | `local` or `ai`                              |
| `confidence` | number or null | 0 through 1 for AI; null for local           |

**Relationships**: A Hint refers to a GameAttempt state. It cannot mutate the
attempt. AI Guidance may produce a Hint only after deterministic validation.

## ProgressRecord

| Field               | Type                | Rules                                   |
| ------------------- | ------------------- | --------------------------------------- |
| `completedLevelIds` | string[]            | Unique IDs of completed standard levels |
| `bestByLevel`       | map                 | Maps level ID to BestResult             |
| `activeAttempt`     | GameAttempt or null | One resumable unfinished attempt        |
| `schemaVersion`     | integer             | Enables safe future migration           |

### BestResult

| Field             | Type          | Rules                   |
| ----------------- | ------------- | ----------------------- |
| `bestScore`       | integer       | Highest completed score |
| `bestTimeSeconds` | integer       | Fastest completed time  |
| `bestStars`       | integer       | Highest earned stars    |
| `lastCompletedAt` | ISO timestamp | Latest completion time  |

**Merge rule**: A newly completed result replaces a saved result when it has more
stars, or equal stars and higher score, or equal stars/score and lower elapsed
time. A worse repeat never erases a better result.

## PlayerSettings

| Field              | Type    | Rules                           |
| ------------------ | ------- | ------------------------------- |
| `soundEnabled`     | boolean | Defaults to true                |
| `vibrationEnabled` | boolean | Defaults to true when supported |
| `theme`            | enum    | `system`, `light`, or `dark`    |
| `reduceMotion`     | enum    | `system`, `on`, or `off`        |
| `schemaVersion`    | integer | Enables safe migration          |

**Validation**: Invalid/missing records are discarded and replaced with defaults.
Reduced motion resolves to `on` whenever either player choice or system
preference requires it.

## DailyChallenge

| Field        | Type               | Rules                                 |
| ------------ | ------------------ | ------------------------------------- |
| `dateKey`    | string             | Local date in `YYYY-MM-DD` form       |
| `levelId`    | string             | References a bundled validated level  |
| `completion` | BestResult or null | Separate from standard-level progress |

**Relationships**: The day selects exactly one configured bundled Level. Its
completion does not alter standard level unlocking.

## AiGuidanceRequest

| Field       | Type          | Rules                                                  |
| ----------- | ------------- | ------------------------------------------------------ |
| `puzzleId`  | string        | References the current Level                           |
| `boardSize` | integer       | Must match level dimensions                            |
| `moves`     | integer       | Nonnegative current count                              |
| `mistakes`  | integer       | Nonnegative current count                              |
| `arrows`    | ActiveArrow[] | Exact active-arrow snapshot, bounded by board capacity |
| `mode`      | enum          | `hint`, `explanation`, or `coach`                      |

**Validation**: Payload size is capped at 64 KiB. The backend validates shape,
bounds, uniqueness, and directions. The frontend still revalidates any returned
arrow against the live local GameAttempt before display.

## AiGuidanceResponse

| Field        | Type    | Rules                                           |
| ------------ | ------- | ----------------------------------------------- |
| `arrowId`    | string  | Must be active and legal in the submitted state |
| `hint`       | string  | Player-safe short guidance                      |
| `reason`     | string  | Player-safe reason tied to the legal path       |
| `confidence` | number  | Inclusive range 0 through 1                     |
| `source`     | literal | Always `ai` for a successful backend response   |
| `requestId`  | string  | Correlates safe support diagnostics             |

**Validation pipeline**: request schema -> provider response schema -> active
arrow/domain checks -> local move validator -> canonical solver confirmation ->
response. Any failure yields no accepted AI guidance; the frontend uses a local
Hint instead.

## ErrorEnvelope

| Field             | Type   | Rules                                      |
| ----------------- | ------ | ------------------------------------------ |
| `error.code`      | string | Stable machine-readable code               |
| `error.message`   | string | Friendly, nontechnical player-safe message |
| `error.requestId` | string | Matches response `X-Request-ID`            |

**Validation**: Never include credentials, raw provider content, stack traces,
or internal exception details.
