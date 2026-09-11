import type {
  AiGuidanceRequest,
  AiGuidanceResponse,
  AiMode,
  Hint,
} from "../types/game";

export type { AiGuidanceRequest, AiGuidanceResponse, AiMode, Hint };
export interface AiRequestResult {
  hint: Hint;
  usedFallback: boolean;
}
