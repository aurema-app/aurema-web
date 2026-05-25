"use client";

import { LexiFeedbackQuizStep } from "@/funnel/components/lexi/LexiFeedbackQuizStep";

const OPTIONS = [
  {
    id: "yes",
    emoji: "😍",
    label: "Yes, it changes my whole mood instantly",
    feedback:
      "One warm text as a reset button. He's figured out the minimum amount of effort needed to keep you — and you've accidentally taught him it works.",
  },
  {
    id: "helps",
    emoji: "🤔",
    label: "It helps, but the doubt stays",
    feedback:
      "That doubt isn't anxiety. It's your gut keeping score when your heart keeps forgiving and forgetting.",
  },
  {
    id: "no",
    emoji: "🧊",
    label: "No, the cold shoulder still hurts",
    feedback:
      "Good. Don't let one nice moment rewrite three days of being an afterthought. Your memory is allowed to be longer than his charm.",
  },
] as const;

export function ReinforcementStep() {
  return (
    <LexiFeedbackQuizStep
      question="Does one warm, affectionate text completely wipe away three days of them ignoring you?"
      options={OPTIONS}
      answerKey="reinforcement"
      stepId="reinforcement"
      amplitudeProperty="reinforcement"
      exitStepId="reinforcement"
      ctaLabel="View My Behavioral Match"
    />
  );
}
