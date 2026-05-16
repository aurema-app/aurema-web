"use client";

import { StepShell } from "@/funnel/components/StepShell";
import { OptionText } from "@/funnel/components/OptionText";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { setAmplitudeUserProperties } from "@/funnel/analytics/amplitudeClient";
import { EVENTS, track } from "@/funnel/analytics/track";

const OPTIONS = [
  { value: "clarity", emoji: "🔍", label: "Find more clarity in my thoughts" },
  { value: "calm", emoji: "🧘", label: "Feel calmer and less stressed" },
  { value: "focus", emoji: "🎯", label: "Improve my focus and productivity" },
  { value: "growth", emoji: "🌱", label: "Grow as a person" },
] as const;

type GoalValue = (typeof OPTIONS)[number]["value"];

export function GoalStep() {
  const { answer, setAnswer } = useFunnelAnswers("goal");
  const { goNext } = useFunnelNavigation();

  const onPick = (value: GoalValue) => {
    setAnswer("goal", value);
    setAmplitudeUserProperties({ goal: value });
    track(EVENTS.ANSWER_SELECTED, { step_id: "goal", value });
    goNext();
  };

  return (
    <StepShell title="What brings you to Aurema?">
      {OPTIONS.map((opt) => (
        <OptionText
          key={opt.value}
          emoji={opt.emoji}
          selected={answer === opt.value}
          onClick={() => onPick(opt.value)}
        >
          {opt.label}
        </OptionText>
      ))}
    </StepShell>
  );
}
