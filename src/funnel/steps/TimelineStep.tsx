"use client";

import { LexiTapQuizStep } from "@/funnel/components/lexi/LexiTapQuizStep";

const OPTIONS = [
  { id: "few-weeks", emoji: "✨", label: "A few weeks (Still fresh)" },
  { id: "1-3-months", emoji: "💗", label: "1 to 3 months (Deep in it)" },
  {
    id: "6-months",
    emoji: "💍",
    label: "6+ months (Basically married without the benefits)",
  },
  {
    id: "broke-off",
    emoji: "💔",
    label: "We officially broke it off, but I'm still stuck looping",
  },
] as const;

export function TimelineStep() {
  return (
    <LexiTapQuizStep
      question={`How long has this "talking stage" been dragging on?`}
      options={OPTIONS}
      answerKey="timeline"
      stepId="timeline"
      amplitudeProperty="timeline"
    />
  );
}
