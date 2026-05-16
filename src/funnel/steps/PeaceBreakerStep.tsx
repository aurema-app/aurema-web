"use client";

import { QuizStep } from "@/funnel/components/lexi/QuizStep";

export function PeaceBreakerStep() {
  return (
    <QuizStep
      mood="peeking"
      question="What destroys your peace faster?"
      answerKey="peaceBreaker"
      userPropertyKey="peace_breaker"
      autoAdvance
      options={[
        { id: "dry-texts", label: "Dry texts" },
        { id: "slow-replies", label: "Slow replies (3+ hours)" },
        {
          id: "left-on-delivered",
          label: "Left on delivered but active on socials",
        },
        {
          id: "no-label",
          label: 'The phrase: "I\'m not ready for a label right now"',
        },
        { id: "watched-story", label: "Watched my story but didn't text back" },
      ]}
    />
  );
}
