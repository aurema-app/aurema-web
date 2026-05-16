"use client";

import { QuizStep } from "@/funnel/components/lexi/QuizStep";

export function ProjectionStep() {
  return (
    <QuizStep
      mood="thoughtful"
      question="Are you more in love with who they could be, or who they actually are on an average Tuesday?"
      answerKey="projection"
      userPropertyKey="projection"
      ctaLabel="Analyze Pattern"
      options={[
        {
          id: "potential",
          label: "I'm definitely holding onto their potential",
        },
        { id: "mix", label: "It's a mix of both" },
        { id: "reality", label: "I see them exactly as they are" },
      ]}
      feedbackRules={[
        {
          ifAnswers: ["potential", "mix"],
          message:
            "You're dating a script you wrote in your head. Let's look at the actual reality.",
        },
      ]}
    />
  );
}
