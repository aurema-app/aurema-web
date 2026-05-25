"use client";

import { LexiFeedbackQuizStep } from "@/funnel/components/lexi/LexiFeedbackQuizStep";

const OPTIONS = [
  {
    id: "potential",
    emoji: "✨",
    label: "I'm definitely holding onto their potential",
    feedback:
      "You're not in a relationship with them. You're in a relationship with your idea of them. Those are two very different people.",
  },
  {
    id: "mix",
    emoji: "👌",
    label: "It's a mix of both",
    feedback:
      "That's fair. Just check the ratio. Because potential that never shows up on a Tuesday isn't potential — it's a promise they haven't made.",
  },
  {
    id: "reality",
    emoji: "👁️",
    label: "I see them exactly as they are",
    feedback:
      "That's the hardest thing to do and most people can't. Now the real question — do you like what you actually see?",
  },
] as const;

export function ProjectionStep() {
  return (
    <LexiFeedbackQuizStep
      question="Are you more in love with who they could be, or who they actually are on an average Tuesday?"
      options={OPTIONS}
      answerKey="projection"
      stepId="projection"
      amplitudeProperty="projection"
      exitStepId="projection"
      ctaLabel="Analyze Pattern"
    />
  );
}
