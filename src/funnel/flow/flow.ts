import type { FunnelAnswers } from "@/funnel/state/types";

export type FunnelStep = {
  id: string;
  // Optional gate: step is skipped when predicate returns false.
  // Phase 3+ will use this for conditional screens (e.g. email step when not signed in).
  when?: (answers: FunnelAnswers) => boolean;
};

// Ordered list of step IDs. Components live in [stepId]/page.tsx's registry
// to avoid a circular-import cycle (steps → useFunnelNavigation → flow → steps).
export const flow: FunnelStep[] = [
  { id: "intro" },
  { id: "goal" },
  { id: "age" },
  { id: "current-state" },
  { id: "frequency" },
  { id: "generating" },
  { id: "plan-preview" },
  { id: "paywall" },
];
