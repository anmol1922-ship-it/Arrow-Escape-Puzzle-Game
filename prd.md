# Arrow Escape: Puzzle Game

## Repository Layout, Functional & Non-Functional Requirements, Failure Handling, CI/CD, Accessibility, Build & Acceptance Walkthrough

---

# 1. Project Objective

Build **Arrow Escape: Puzzle Game** as a polished, mobile-first casual puzzle game.

The initial implementation must be:

- React + TypeScript + Vite frontend
- Python + FastAPI backend
- Browser-first and fully playable in Chrome/Edge
- Responsive for desktop, tablet and mobile
- Designed for future Capacitor Android/iOS packaging
- AI-enhanced using **Gemma 4 26B A4B IT**
- Offline-capable for core gameplay
- No database required for V1
- No authentication required for V1
- No vector database
- No RAG
- No Kubernetes
- No unnecessary enterprise architecture

The application must feel like a **real casual mobile game**, not a CRUD/business application.

---

# 2. Repository Structure

Create the following repository:

```text
arrow-escape/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── build.yml
│       └── publish.yml
│
├── frontend/
│   ├── public/
│   │   ├── icons/
│   │   ├── sounds/
│   │   └── manifest.webmanifest
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx
│   │   │   ├── routes.tsx
│   │   │   └── providers.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── Arrow/
│   │   │   ├── GameBoard/
│   │   │   ├── GameHeader/
│   │   │   ├── Timer/
│   │   │   ├── MoveCounter/
│   │   │   ├── HintButton/
│   │   │   ├── GameButton/
│   │   │   ├── StarRating/
│   │   │   ├── ParticleEffect/
│   │   │   ├── PauseModal/
│   │   │   └── ErrorBoundary/
│   │   │
│   │   ├── screens/
│   │   │   ├── Splash/
│   │   │   ├── Home/
│   │   │   ├── LevelSelect/
│   │   │   ├── Game/
│   │   │   ├── LevelComplete/
│   │   │   ├── Settings/
│   │   │   └── DailyChallenge/
│   │   │
│   │   ├── game/
│   │   │   ├── engine/
│   │   │   │   ├── GameEngine.ts
│   │   │   │   ├── moveValidator.ts
│   │   │   │   └── gameState.ts
│   │   │   ├── solver/
│   │   │   │   └── puzzleSolver.ts
│   │   │   ├── validator/
│   │   │   │   └── puzzleValidator.ts
│   │   │   ├── scoring/
│   │   │   │   └── scoreCalculator.ts
│   │   │   └── generator/
│   │   │       └── puzzleGenerator.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── aiService.ts
│   │   │   ├── aiTypes.ts
│   │   │   └── aiFallback.ts
│   │   │
│   │   ├── storage/
│   │   │   ├── gameStorage.ts
│   │   │   └── settingsStorage.ts
│   │   │
│   │   ├── audio/
│   │   │   └── audioService.ts
│   │   │
│   │   ├── accessibility/
│   │   │   ├── accessibilityUtils.ts
│   │   │   └── keyboardNavigation.ts
│   │   │
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── constants/
│   │   ├── data/
│   │   │   └── levels/
│   │   │       ├── easy.json
│   │   │       ├── medium.json
│   │   │       ├── hard.json
│   │   │       └── expert.json
│   │   ├── utils/
│   │   └── styles/
│   │       ├── global.css
│   │       ├── game.css
│   │       └── animations.css
│   │
│   ├── tests/
│   │   ├── unit/
│   │   ├── components/
│   │   ├── game/
│   │   └── accessibility/
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   │
│   │   ├── routes/
│   │   │   ├── health.py
│   │   │   ├── ai.py
│   │   │   └── puzzle.py
│   │   │
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   ├── puzzle_service.py
│   │   │   └── health_service.py
│   │   │
│   │   ├── providers/
│   │   │   ├── ai_provider.py
│   │   │   └── gemma_provider.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── ai.py
│   │   │   ├── puzzle.py
│   │   │   └── health.py
│   │   │
│   │   ├── validators/
│   │   │   ├── ai_validator.py
│   │   │   └── puzzle_validator.py
│   │   │
│   │   ├── config/
│   │   │   └── settings.py
│   │   │
│   │   └── exceptions/
│   │       └── handlers.py
│   │
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── api/
│   │
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── pytest.ini
│   ├── .env.example
│   └── Dockerfile
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── accessibility.md
│   ├── testing.md
│   ├── deployment.md
│   └── acceptance-walkthrough.md
│
├── .gitignore
├── README.md
└── LICENSE
```

---

# 3. Functional Requirements

## FR-001 Splash Screen

The application shall display:

- Arrow Escape logo
- Animated arrows
- Short loading animation
- Game branding

The splash screen must not unnecessarily delay the user.

---

# 4. Home Screen

The home screen shall provide:

- Play Now
- Levels
- Daily Challenge
- Settings

The screen must include:

- Animated background
- Game logo
- Premium-looking buttons
- Smooth transitions
- Responsive layout

---

# 5. Level Selection

The user shall be able to:

- View available levels
- See completed levels
- See stars earned
- See locked levels
- Select an unlocked level

Levels should visually communicate progression.

Example:

```text
Level 1     ★★★
Level 2     ★★☆
Level 3     ★★★
Level 4     🔒
```

---

# 6. Game Board

The game board is the core functionality.

Each level contains:

- Board size
- Arrows
- Arrow positions
- Arrow direction
- Difficulty
- Target moves
- Target time

Supported directions:

```text
UP
DOWN
LEFT
RIGHT
```

---

# 7. Arrow Movement Rules

An arrow can be removed only when the complete path in its direction is clear.

Example:

```text
→ → →     OUT
```

The arrow can escape if nothing blocks its path.

Blocked:

```text
→ → X
```

The arrow cannot escape.

The deterministic game engine must always be the source of truth.

AI must never independently determine whether a move is legal.

---

# 8. Game State

The game state must maintain:

```text
Current level
Active arrows
Moves
Mistakes
Elapsed time
Score
Stars
Pause state
Completion state
```

---

# 9. Scoring

Score should consider:

- Completion
- Number of moves
- Time
- Mistakes
- Difficulty

Stars:

```text
★★★ Excellent
★★☆ Good
★☆☆ Completed
```

Exact thresholds must be configurable rather than hardcoded throughout the UI.

---

# 10. Hint System

The application shall provide a local deterministic hint.

When the player selects Hint:

1. Find valid moves.
2. Select the recommended move.
3. Highlight the arrow.
4. Explain why the arrow can move.

Example:

```text
✨ Quick Hint

Try the highlighted arrow first.
Its path is currently clear.
```

---

# 11. AI Features

AI shall enhance gameplay but never control game rules.

Model:

```text
google/gemma-4-26B-A4B-it
```

AI features:

### V1

- AI Hint
- AI Move Explanation
- AI Coach

### Future

- AI Puzzle Generator
- AI Difficulty Recommendation
- AI Daily Challenge
- Personalized Challenges
- AI Game Assistant
- Visual Puzzle Analysis

---

# 12. AI Hint Request

Frontend:

```text
React
   ↓
FastAPI
   ↓