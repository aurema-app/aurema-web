import type { FunnelAnswers } from "@/funnel/state/types";

export type FunnelStep = {
  id: string;
  when?: (answers: FunnelAnswers) => boolean;
};

// Lexi situationship analyzer — 13-screen flow.
// Components live in [stepId]/page.tsx's registry to avoid circular imports.
export const flow: FunnelStep[] = [
  { id: "landing" }, // Screen 1 — Emotional hook
  { id: "social-proof" }, // Screen 2 — Real-time validation
  { id: "peace-breaker" }, // Screen 3 — Fast-tap icebreaker
  { id: "overthinking" }, // Screen 4 — Overthinking scan
  { id: "digital-anxiety" }, // Screen 5 — Digital anxiety scan
  { id: "friend-group" }, // Screen 6 — Friend group check
  { id: "projection" }, // Screen 7 — Projection scan
  { id: "reinforcement" }, // Screen 8 — Intermittent reinforcement check
  { id: "pattern-detected" }, // Screen 9 — Identity label setup
  { id: "evidence" }, // Screen 10 — Evidence drop
  { id: "analyzing" }, // Screen 11 — Dynamic loading + LLM call
  { id: "teaser" }, // Screen 12 — Custom teaser
  { id: "email", when: (a) => !a.userEmail }, // Lead capture
  { id: "sign-in", when: (a) => !a.firebaseUid }, // Auth gate
  { id: "paywall" }, // Screen 13 — Paywall (redirects to /growth-plan/paywall)
];
