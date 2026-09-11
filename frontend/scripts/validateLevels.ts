import { levels } from "../src/data/levels/levelCatalog";
import { validateCatalog } from "../src/game/validator/puzzleValidator";

const result = validateCatalog(levels);
if (!result.valid) {
  console.error("Level validation failed:");
  for (const error of result.errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${levels.length} levels; ${result.solutionLength} total optimal moves.`,
  );
}
