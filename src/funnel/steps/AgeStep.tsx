"use client";

import { StepShell } from "@/funnel/components/StepShell";
import { OptionText } from "@/funnel/components/OptionText";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { setAmplitudeUserProperties } from "@/funnel/analytics/amplitudeClient";
import { EVENTS, track } from "@/funnel/analytics/track";

const OPTIONS = [
  { value: "18-24", emoji: "🌱", label: "18–24" },
  { value: "25-34", emoji: "✨", label: "25–34" },
  { value: "35-44", emoji: "🔥", label: "35–44" },
  { value: "45+", emoji: "🌿", label: "45+" },
] as const;

type AgeValue = (typeof OPTIONS)[number]["value"];

export function AgeStep() {
  const { answer, setAnswer } = useFunnelAnswers("ageRange");
  const { goNext } = useFunnelNavigation();

  const onPick = (value: AgeValue) => {
    setAnswer("ageRange", value);
    setAmplitudeUserProperties({ age_range: value });
    track(EVENTS.ANSWER_SELECTED, { step_id: "age", value });
    goNext();
  };

  return (
    <StepShell
      title="How old are you?"
      subtitle="This helps us tailor your experience."
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
