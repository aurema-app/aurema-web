"use client";

import { LexiTapQuizStep } from "@/funnel/components/lexi/LexiTapQuizStep";

const OPTIONS = [
  { id: "under-18", emoji: "🎒", label: "Under 18" },
  { id: "18-22", emoji: "🎓", label: "18–22" },
  { id: "23-26", emoji: "💼", label: "23–26" },
  { id: "27-30", emoji: "📅", label: "27–30" },
  { id: "31-plus", emoji: "🍷", label: "31+" },
] as const;

export function DemographicsStep() {
  return (
    <LexiTapQuizStep
      question="How old are we? (Need to know if we're dealing with high school drama or a quarter-life crisis)."
      options={OPTIONS}
      answerKey="demographics"
      stepId="demographics"
      amplitudeProperty="demographics"
    />
  );
}
