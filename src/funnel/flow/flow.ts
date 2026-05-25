import type { FunnelAnswers } from "@/funnel/state/types";

export type FunnelStep = {
  id: string;
  when?: (answers: FunnelAnswers) => boolean;
};

// Lexi situationship analyzer — 13-screen flow.
// Components live in [stepId]/page.tsx's registry to avoid circular imports.
export const flow: FunnelStep[] = [
  { id: "landing" }, // Screen 1 — Emotional hook
  { id: "decoding-target" }, // Screen 2 — Who are we decoding
  { id: "demographics" }, // Screen 3 — Age bracket
  { id: "timeline" }, // Screen 4 — Talking stage duration
  { id: "social-proof" }, // Screen 5 — Real-time validation
  { id: "peace-breaker" }, // Screen 6 — Fast-tap icebreaker
  { id: "overthinking" },
  { id: "digital-anxiety" },
  { id: "intuition" },
  { id: "friend-group" },
  { id: "projection" },
  { id: "reinforcement" },
  { id: "pattern-detected" },
  { id: "evidence" },
  { id: "analyzing" },
  { id: "teaser" },
  { id: "email", when: (a) => !a.userEmail || !a.firebaseUid },
  // Sign-in hidden until Lexi auth UI is wired; email step sets a local uid stub.
  { id: "sign-in", when: () => false },
  { id: "paywall" }, // Screen 13 — Paywall (redirects to /growth-plan/paywall)
];
