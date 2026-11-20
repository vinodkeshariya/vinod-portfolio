declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends a Google Analytics event. Safe to call anywhere on the client:
 * does nothing when Analytics isn't loaded (local dev, previews, opted-out browsers).
 * Never pass personal data (names, emails, messages) as params.
 */
export function track(event: string, params: Record<string, string | number> = {}) {
  if (typeof window !== "undefined") window.gtag?.("event", event, params);
}
