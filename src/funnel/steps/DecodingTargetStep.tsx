"use client";

import { LexiTapQuizStep } from "@/funnel/components/lexi/LexiTapQuizStep";

const OPTIONS = [
  { id: "guy", emoji: "👨", label: "A guy I'm dealing with" },
  { id: "girl", emoji: "👩", label: "A girl I'm dealing with" },
  {
    id: "myself",
    emoji: "🪞",
    label: "Myself (I am the problem, help)",
  },
] as const;

export function DecodingTargetStep() {
  return (
    <LexiTapQuizStep
      question="Who are we decoding today?"
      options={OPTIONS}
      answerKey="decodingTarget"
      stepId="decoding-target"
      amplitudeProperty="decoding_target"
    />
  );
}
