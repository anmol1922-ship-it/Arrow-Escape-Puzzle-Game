import easy from "./easy.json";
import medium from "./medium.json";
import hard from "./hard.json";
import expert from "./expert.json";
import type { Level } from "../../types/game";

export const levels: Level[] = [
  ...easy,
  ...medium,
  ...hard,
  ...expert,
] as Level[];
export const levelsById = new Map(levels.map((level) => [level.id, level]));

export function getLevel(levelId: string): Level | undefined {
  return levelsById.get(levelId);
}

export function isLevelUnlocked(
  level: Level,
  completedLevelIds: string[],
): boolean {
  return (
    level.unlockOrder === 1 ||
    completedLevelIds.includes(levels[level.unlockOrder - 2]?.id ?? "")
  );
}
