import { levels } from "./levels/levelCatalog";
import type { DailyChallenge } from "../types/game";

export function getDateKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function getDailyChallenge(date = new Date()): DailyChallenge {
  const dateKey = getDateKey(date);
  const index =
    Math.abs(
      [...dateKey].reduce((hash, char) => hash * 31 + char.charCodeAt(0), 7),
    ) % levels.length;
  return { dateKey, levelId: levels[index].id, completion: null };
}
