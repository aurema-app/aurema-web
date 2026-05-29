"use client";

import { LexiFeedbackQuizStep } from "@/funnel/components/lexi/LexiFeedbackQuizStep";

const OPTIONS = [
  {
    id: "yes",
    emoji: "🙈",
    label: "Yes, I make up excuses for them",
    feedback:
      "The lawyer who never gets paid. You're working overtime defending someone who didn't even ask for a case.",
  },
  {
    id: "once",
    emoji: "👌",
    label: "I've done it once or twice",
    feedback:
      "Once or twice is just human. The question is whether you believed the excuses or just needed your friends to.",
  },
  {
    id: "never",
    emoji: "🤘",
    label: "Never, my friends know everything",
    feedback:
      "That kind of honesty with your friends is rare. Now try being that honest with yourself about it.",
  },
] as const;

export function FriendGroupStep() {
  return (
    <LexiFeedbackQuizStep
      question="Have you ever actively defended their low effort to your best friends?"
      options={OPTIONS}
      answerKey="friendGroup"
      stepId="friend_group"
      amplitudeProperty="friend_group"
      exitStepId="friend-group"
      ctaLabel="Next Scan"
    />
  );
}
