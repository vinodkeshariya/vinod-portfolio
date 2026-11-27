/**
 * Names of the icons drawn in src/components/Icon.tsx.
 * No imports or path aliases, so the Payload config (and its CLI) can use the list too.
 */
export const ICON_NAMES = [
  "browser", "react", "cart", "store", "pen", "spark", "bolt", "code",
  "layers", "shield", "clock", "check", "award", "mail", "chat", "pin", "arrow", "arrowUpRight",
  "download", "send", "linkedin", "github", "upwork", "menu", "close", "star", "camera", "users",
  "briefcase", "monitor", "cpu", "cap", "globe",
] as const;

export type IconName = (typeof ICON_NAMES)[number];
