import { type PropsWithChildren } from "react";
import { useGameSession } from "../hooks/useGameSession";
import { GameContext } from "./gameContext";

export function GameProvider({ children }: PropsWithChildren) {
  const session = useGameSession();
  return (
    <GameContext.Provider value={session}>{children}</GameContext.Provider>
  );
}
