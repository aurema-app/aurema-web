/**
 * Registry of all active + archived Amplitude Experiment flags.
 * Never reference a flag key by string literal outside this file.
 * See docs/funnel/04-experiments.md for status + results.
 */
export const EXPERIMENTS = {
  INTRO_HERO: {
    key: "funnel-intro-hero",
    variants: ["control", "variant-a"] as const,
    defaultVariant: "control",
  },
} as const;

export type ExperimentEntry = (typeof EXPERIMENTS)[keyof typeof EXPERIMENTS];
