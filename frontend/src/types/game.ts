export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type Difficulty = "easy" | "medium" | "hard" | "expert";
export type AttemptStatus = "active" | "paused" | "completed" | "abandoned";
export type MoveKind = "escaped" | "blocked" | "completed" | "ignored";
export type HintSource = "local" | "ai";
export type AiMode = "hint" | "explanation" | "coach";

export interface ArrowDefinition {
  id: string;
  row: number;
  column: number;
  direction: Direction;
}

export interface Level {
  id: string;
  title: string;
  difficulty: Difficulty;
  boardSize: number;
  arrows: ArrowDefinition[];
  targetMoves: number;
  targetTimeSeconds: number;
  scoringProfileId: string;
  unlockOrder: number;
}

export interface ScoringProfile {
  id: string;
  baseScore: number;
  movePenalty: number;
  timePenalty: number;
  mistakePenalty: number;
  threeStarMinScore: number;
  twoStarMinScore: number;
  oneStarMinScore: number;
}

export interface GameAttempt {
  levelId: string;
  activeArrowIds: string[];
  moves: number;
  mistakes: number;
  elapsedSeconds: number;
  status: AttemptStatus;
  score: number | null;
  stars: number | null;
  hintedArrowId: string | null;
  startedAt: string;
  updatedAt: string;
}

export interface MoveResult {
  kind: MoveKind;
  arrowId: string;
  attempt: GameAttempt;
  announcement: string;
}

export interface Hint {
  arrowId: string | null;
  message: string;
  reason: string;
  source: HintSource;
  confidence: number | null;
}

export interface BestResult {
  bestScore: number;
  bestTimeSeconds: number;
  bestStars: number;
  lastCompletedAt: string;
}

export interface ProgressRecord {
  schemaVersion: number;
  completedLevelIds: string[];
  bestByLevel: Record<string, BestResult>;
  activeAttempt: GameAttempt | null;
  dailyCompletions: Record<string, BestResult>;
}

export interface PlayerSettings {
  schemaVersion: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  theme: "system" | "light" | "dark";
  reduceMotion: "system" | "on" | "off";
}

export interface DailyChallenge {
  dateKey: string;
  levelId: string;
  completion: BestResult | null;
}

export interface AiGuidanceRequest {
  puzzleId: string;
  boardSize: number;
  moves: number;
  mistakes: number;
  arrows: ArrowDefinition[];
  mode: AiMode;
}

export interface AiGuidanceResponse {
  arrowId: string;
  hint: string;
  reason: string;
  confidence: number;
  source: "ai";
  requestId: string;
}

export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    requestId?: string;
  };
}
