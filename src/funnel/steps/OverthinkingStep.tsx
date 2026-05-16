"use client";

import { QuizStep } from "@/funnel/components/lexi/QuizStep";

export function OverthinkingStep() {
  return (
    <QuizStep
      mood="eye-roll"
      question="Do you rewrite a message 5 times before sending it to make sure you sound 'chill'?"
      answerKey="overthinking"
      userPropertyKey="overthinking"
      ctaLabel="Next Scan"
      options={[
        { id: "yes", label: "Yes, every single time" },
        { id: "sometimes", label: "Sometimes" },
        { id: "no", label: "No, I say what I want" },
      ]}
      feedbackRules={[
        {
          ifAnswers: ["yes", "sometimes"],
          message:
            "Yeah... when you have to audition to be liked, it's not a conversation. It's a performance.",
        },
      ]}
    />
  );
}
