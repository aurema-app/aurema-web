"use client";

import { QuizStep } from "@/funnel/components/lexi/QuizStep";

export function FriendGroupStep() {
  return (
    <QuizStep
      mood="facepalm"
      question="Have you ever actively defended their low effort to your best friends?"
      answerKey="friendGroup"
      userPropertyKey="friend_group"
      ctaLabel="Next Question"
      options={[
        { id: "yes", label: "Yes, I make up excuses for them" },
        { id: "once", label: "I've done it once or twice" },
        { id: "never", label: "Never, my friends know everything" },
      ]}
      feedbackRules={[
        {
          ifAnswers: ["yes", "once"],
          message:
            "When someone gives you crumbs long enough, your brain starts calling it a feast. Let's reframe that.",
        },
      ]}
    />
  );
}
