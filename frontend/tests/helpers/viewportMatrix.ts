export const portraitViewports = [
  { width: 360, height: 640, name: "mobile-small" },
  { width: 375, height: 667, name: "mobile-standard" },
  { width: 390, height: 844, name: "mobile-tall" },
  { width: 412, height: 915, name: "mobile-large" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 1280, height: 720, name: "desktop" },
  { width: 1366, height: 768, name: "desktop-wide" },
  { width: 1440, height: 900, name: "desktop-large" },
  { width: 1920, height: 1080, name: "desktop-xl" },
] as const;

export const landscapeViewports = [
  { width: 640, height: 360, name: "mobile-small-landscape" },
  { width: 667, height: 375, name: "mobile-standard-landscape" },
  { width: 844, height: 390, name: "mobile-tall-landscape" },
  { width: 915, height: 412, name: "mobile-large-landscape" },
  { width: 1024, height: 768, name: "tablet-landscape" },
] as const;

export const allViewports = [
  ...portraitViewports,
  ...landscapeViewports,
] as const;

export type ViewportCase = (typeof allViewports)[number];
