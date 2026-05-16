import * as amplitude from "@amplitude/analytics-browser";
import { Identify } from "@amplitude/analytics-browser";

let initialized = false;

export function initAmplitude(): void {
  if (initialized || typeof window === "undefined") return;
  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
  if (!apiKey) {
    return;
  }

  amplitude.init(apiKey, {
    defaultTracking: {
      sessions: true,
      // We fire step_view manually; suppress automatic page-view noise.
      pageViews: false,
      formInteractions: false,
      fileDownloads: false,
    },
    // Flush queued events aggressively so step_exit events aren't lost on navigation.
    flushIntervalMillis: 0,
    flushQueueSize: 1,
    logLevel:
      process.env.NODE_ENV === "development"
        ? amplitude.Types.LogLevel.Warn
        : amplitude.Types.LogLevel.None,
  });

  initialized = true;
}

export function setAmplitudeUserId(uid: string): void {
  amplitude.setUserId(uid);
}

/** Set named user properties. Null values are omitted. */
export function setAmplitudeUserProperties(
  props: Record<string, string | number | boolean | null | undefined>,
): void {
  const id = new Identify();
  for (const [key, value] of Object.entries(props)) {
    if (value !== null && value !== undefined) {
      id.set(key, value);
    }
  }
  amplitude.identify(id);
}

export function amplitudeTrack(
  event: string,
  props?: Record<string, unknown>,
): void {
  amplitude.track(event, props);
}
