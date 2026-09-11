import type { Level } from "../../types/game";
import { getLegalMoves } from "../engine/moveValidator";

interface QueueNode {
  activeArrowIds: string[];
  path: string[];
}

function signature(activeArrowIds: readonly string[]): string {
  return [...activeArrowIds].sort().join("|");
}

export function solvePuzzle(
  level: Level,
  initialArrowIds = level.arrows.map((arrow) => arrow.id),
): string[] | null {
  const queue: QueueNode[] = [
    { activeArrowIds: [...initialArrowIds], path: [] },
  ];
  const visited = new Set([signature(initialArrowIds)]);

  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) break;
    if (node.activeArrowIds.length === 0) return node.path;

    for (const arrowId of getLegalMoves(level, node.activeArrowIds)) {
      const nextActive = node.activeArrowIds.filter(
        (candidate) => candidate !== arrowId,
      );
      const nextSignature = signature(nextActive);
      if (visited.has(nextSignature)) continue;
      visited.add(nextSignature);
      queue.push({ activeArrowIds: nextActive, path: [...node.path, arrowId] });
    }
  }

  return null;
}

export function isSolvable(level: Level): boolean {
  return solvePuzzle(level) !== null;
}
