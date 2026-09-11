import { createContext } from "react";
import type { GameSession } from "../hooks/useGameSession";

export const GameContext = createContext<GameSession | null>(null);
