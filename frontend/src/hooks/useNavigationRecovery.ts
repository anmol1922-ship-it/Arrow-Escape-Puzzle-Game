import { useEffect } from "react";

export function useNavigationRecovery(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return undefined;
    const warnBeforeLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeLeave);
    return () => window.removeEventListener("beforeunload", warnBeforeLeave);
  }, [enabled]);
}
