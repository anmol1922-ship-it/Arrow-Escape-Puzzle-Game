import { getDailyChallenge } from "../data/dailyChallenges";
import { getLevel } from "../data/levels/levelCatalog";
import { useGame } from "../app/useGame";

export function useDailyChallenge() {
  const { progress, startDailyLevel } = useGame();
  const challenge = getDailyChallenge();
  return {
    challenge,
    level: getLevel(challenge.levelId),
    completed: Boolean(progress.dailyCompletions[challenge.dateKey]),
    result: progress.dailyCompletions[challenge.dateKey],
    start: () => startDailyLevel(challenge.levelId, challenge.dateKey),
  };
}
