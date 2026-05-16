"use client";

import { QuizStep } from "@/funnel/components/lexi/QuizStep";

export function DigitalAnxietyStep() {
  return (
    <QuizStep
      mood="analytical"
      question="Does an unexpected shift in their texting tone make your stomach drop?"
      answerKey="digitalAnxiety"
      userPropertyKey="digital_anxiety"
      ctaLabel="Continue Analysis"
      options={[
        { id: "yes", label: "Yes, I immediately think I did something wrong" },
        { id: "notice", label: "I notice it, but I stay calm" },
        { id: "no", label: "I don't pay attention to that" },
      ]}
      feedbackRules={[
        {
          ifAnswers: ["yes"],
          message:
            "Your intuition isn't broken, babe. Your nervous system is just tired of guessing.",
        },
      ]}
    />
  );
}
