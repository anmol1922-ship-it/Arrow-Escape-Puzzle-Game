import { useCallback, useState } from "react";

export function useLiveAnnouncement() {
  const [announcement, setAnnouncement] = useState("");

  const announce = useCallback((message: string) => {
    setAnnouncement(message.trim());
  }, []);

  const clear = useCallback(() => setAnnouncement(""), []);

  return { announcement, announce, clear };
}
