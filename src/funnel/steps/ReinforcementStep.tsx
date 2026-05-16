"use client";

import { QuizStep } from "@/funnel/components/lexi/QuizStep";

export function ReinforcementStep() {
  return (
    <QuizStep
      mood="arms-crossed"
      question="Does one warm, affectionate text completely wipe away three days of them ignoring you?"
      answerKey="reinforcement"
      userPropertyKey="reinforcement"
      ctaLabel="View My Behavioral Match"
      options={[
        { id: "yes", label: "Yes, it changes my whole mood instantly" },
        { id: "helps", label: "It helps, but the doubt stays" },
        { id: "no", label: "No, the cold shoulder still hurts" },
      ]}
      feedbackRules={[
        {
          ifAnswers: ["yes", "helps"],
          message:
            "That's not connection, that's a slot machine loop. You're waiting for the next hit of certainty.",
        },
      ]}
    />
  );
}
