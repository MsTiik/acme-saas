export function trackEvent(name: string, props?: Record<string, unknown>) {
  console.log("[acme-events]", name, props);
}
