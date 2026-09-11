import { Navigate, Route, Routes } from "react-router-dom";
import { Splash } from "../screens/Splash/Splash";
import { Home } from "../screens/Home/Home";
import { LevelSelect } from "../screens/LevelSelect/LevelSelect";
import { Game } from "../screens/Game/Game";
import { LevelComplete } from "../screens/LevelComplete/LevelComplete";
import { Settings } from "../screens/Settings/Settings";
import { DailyChallenge } from "../screens/DailyChallenge/DailyChallenge";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/home" element={<Home />} />
      <Route path="/levels" element={<LevelSelect />} />
      <Route path="/game/:levelId" element={<Game />} />
      <Route path="/complete/:levelId" element={<LevelComplete />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/daily" element={<DailyChallenge />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
