// Phase 2 stub. Phase 8 replaces this with the typed Amplitude wrapper.
export function track(event: string, props?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[track]", event, props);
  }
}
