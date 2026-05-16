import { amplitudeTrack } from "@/funnel/analytics/amplitudeClient";

/**
 * All funnel event names. Add here before using — do not use string literals
 * elsewhere in the codebase so event names stay searchable and consistent.
 */
export const EVENTS = {
  // Navigation
  STEP_VIEW: "step_view",
  STEP_EXIT: "step_exit",
  // Answers
  ANSWER_SELECTED: "answer_selected",
  // Lead capture
  EMAIL_CAPTURED: "email_captured",
  // Auth
  SIGN_IN_STARTED: "sign_in_started",
  SIGN_IN_COMPLETED: "sign_in_completed",
  SIGN_IN_FAILED: "sign_in_failed",
  EMAIL_LINK_SENT: "email_link_sent",
  // Paywall + purchase
  PAYWALL_VIEWED: "paywall_viewed",
  PURCHASE_STARTED: "purchase_started",
  PURCHASE_COMPLETED: "purchase_completed",
  PURCHASE_FAILED: "purchase_failed",
  // Activation
  SUBSCRIPTION_ACTIVATED: "subscription_activated",
  SUBSCRIPTION_PENDING: "subscription_pending",
  // Experiments
  EXPERIMENT_EXPOSED: "experiment_exposed",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

/**
 * Typed analytics wrapper. All funnel code should call this instead of
 * importing Amplitude directly, so we can swap the backend without touching
 * every call site.
 */
export function track(event: EventName, props?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[track]", event, props);
  }
  amplitudeTrack(event, props);
}
