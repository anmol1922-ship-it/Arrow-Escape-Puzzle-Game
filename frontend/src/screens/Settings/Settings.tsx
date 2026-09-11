import { useNavigate } from "react-router-dom";
import { useGame } from "../../app/useGame";
import type { PlayerSettings } from "../../types/game";

export function Settings() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useGame();
  const set = <K extends keyof PlayerSettings>(
    key: K,
    value: PlayerSettings[K],
  ) => updateSettings({ ...settings, [key]: value });
  return (
    <main className="screen-shell settings-screen">
      <header className="screen-heading">
        <button
          className="back-button"
          onClick={() => navigate("/home")}
          aria-label="Back to home"
        >
          ←
        </button>
        <div>
          <span className="eyebrow">MAKE IT YOURS</span>
          <h1>Settings</h1>
        </div>
      </header>
      <section className="settings-list">
        <label>
          <span>
            <strong>Sound effects</strong>
            <small>Move and completion feedback</small>
          </span>
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(event) => set("soundEnabled", event.target.checked)}
          />
        </label>
        <label>
          <span>
            <strong>Music</strong>
            <small>Ambient game atmosphere</small>
          </span>
          <input
            type="checkbox"
            checked={settings.musicEnabled}
            onChange={(event) => set("musicEnabled", event.target.checked)}
          />
        </label>
        <label>
          <span>
            <strong>Vibration</strong>
            <small>Tactile feedback where supported</small>
          </span>
          <input
            type="checkbox"
            checked={settings.vibrationEnabled}
            onChange={(event) => set("vibrationEnabled", event.target.checked)}
          />
        </label>
        <div className="setting-row">
          <span>
            <strong>Theme</strong>
            <small>Choose your board mood</small>
          </span>
          <select
            aria-label="Theme"
            value={settings.theme}
            onChange={(event) =>
              set("theme", event.target.value as PlayerSettings["theme"])
            }
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="setting-row">
          <span>
            <strong>Motion</strong>
            <small>Respect reduced-motion preference</small>
          </span>
          <select
            aria-label="Motion"
            value={settings.reduceMotion}
            onChange={(event) =>
              set(
                "reduceMotion",
                event.target.value as PlayerSettings["reduceMotion"],
              )
            }
          >
            <option value="system">System</option>
            <option value="on">Reduced</option>
            <option value="off">Full</option>
          </select>
        </div>
      </section>
      <p className="settings-note">
        Your progress stays on this device. No account required.
      </p>
    </main>
  );
}
