"use client";

import { LexiFeedbackQuizStep } from "@/funnel/components/lexi/LexiFeedbackQuizStep";

const OPTIONS = [
  {
    id: "yes",
    emoji: "👍",
    label: "Yes, I just think I did something wrong",
    feedback:
      "Your intuition isn't broken, babe. Your nervous system is just tired of guessing.",
  },
  {
    id: "notice",
    emoji: "👌",
    label: "I notice it, but I stay calm",
    feedback:
      "Staying calm is good. Just make sure it's actually calm and not just practiced ignoring.",
  },
  {
    id: "no",
    emoji: "🤘",
    label: "I don't pay attention to that",
    feedback:
      "That's either really healthy or really trained. Worth knowing which one it is.",
  },
] as const;

export function DigitalAnxietyStep() {
  return (
    <LexiFeedbackQuizStep
      question="Does an unexpected shift in their texting tone make your stomach drop?"
      options={OPTIONS}
      answerKey="digitalAnxiety"
      stepId="digital_anxiety"
      amplitudeProperty="digital_anxiety"
      exitStepId="digital-anxiety"
      ctaLabel="Continue Analysis"
    />
  );
}
