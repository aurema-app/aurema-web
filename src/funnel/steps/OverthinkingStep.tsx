"use client";

import { LexiFeedbackQuizStep } from "@/funnel/components/lexi/LexiFeedbackQuizStep";

const OPTIONS = [
  {
    id: "yes",
    emoji: "👍",
    label: "Yes, every single time",
    feedback:
      "Yeah… when you have to audition to be liked, it's not a conversation. It's a performance.",
  },
  {
    id: "sometimes",
    emoji: "👌",
    label: "Sometimes",
    feedback:
      "The fact that you know which ones deserve the edit says everything. You already know who makes you nervous.",
  },
  {
    id: "no",
    emoji: "🤘",
    label: "No, I say what I want",
    feedback:
      "Good. The right person won't need you to shrink yourself into something easier to receive.",
  },
] as const;

export function OverthinkingStep() {
  return (
    <LexiFeedbackQuizStep
      question="Do you rewrite a message 5 times before sending it to make sure you sound 'chill'?"
      options={OPTIONS}
      answerKey="overthinking"
      stepId="overthinking"
      amplitudeProperty="overthinking"
      exitStepId="overthinking"
      ctaLabel="Next Scan"
    />
  );
}
