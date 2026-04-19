"use client";

import { StepShell } from "@/funnel/components/StepShell";
import { OptionText } from "@/funnel/components/OptionText";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track } from "@/funnel/analytics/track";

const OPTIONS = [
  { value: "daily", emoji: "🔥", label: "Every day — I'm committed" },
  { value: "few-times-week", emoji: "📅", label: "A few times a week" },
  { value: "weekly", emoji: "🌿", label: "Once a week is fine for now" },
] as const;

type FrequencyValue = (typeof OPTIONS)[number]["value"];

export function FrequencyStep() {
  const { answer, setAnswer } = useFunnelAnswers("frequency");
  const { goNext } = useFunnelNavigation();

  const onPick = (value: FrequencyValue) => {
    setAnswer("frequency", value);
    track("answer_selected", { stepId: "frequency", value });
    goNext();
  };

  return (
    <StepShell
      title="How often do you want to practice?"
      subtitle="You can always change this later."
    >
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
