import type { Difficulty, ScoringProfile } from "../types/game";

export const scoringProfiles: Record<Difficulty, ScoringProfile> = {
  easy: {
    id: "easy",
    baseScore: 1000,
    movePenalty: 25,
    timePenalty: 2,
    mistakePenalty: 40,
    threeStarMinScore: 850,
    twoStarMinScore: 600,
    oneStarMinScore: 0,
  },
  medium: {
    id: "medium",
    baseScore: 1200,
    movePenalty: 30,
    timePenalty: 3,
    mistakePenalty: 50,
    threeStarMinScore: 1000,
    twoStarMinScore: 720,
    oneStarMinScore: 0,
  },
  hard: {
    id: "hard",
    baseScore: 1500,
    movePenalty: 35,
    timePenalty: 4,
    mistakePenalty: 60,
    threeStarMinScore: 1250,
    twoStarMinScore: 900,
    oneStarMinScore: 0,
  },
  expert: {
    id: "expert",
    baseScore: 1800,
    movePenalty: 40,
    timePenalty: 5,
    mistakePenalty: 70,
    threeStarMinScore: 1500,
    twoStarMinScore: 1050,
    oneStarMinScore: 0,
  },
};

export function getScoringProfile(difficulty: Difficulty): ScoringProfile {
  return scoringProfiles[difficulty];
}
