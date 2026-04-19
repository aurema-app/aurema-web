"use client";

import { StepShell } from "@/funnel/components/StepShell";
import { OptionText } from "@/funnel/components/OptionText";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track } from "@/funnel/analytics/track";

const OPTIONS = [
  { value: "stressed", emoji: "😰", label: "Stressed and overwhelmed" },
  { value: "stuck", emoji: "😶", label: "Stuck and unsure what to do next" },
  { value: "curious", emoji: "🤔", label: "Curious and open to new ideas" },
  { value: "hopeful", emoji: "✨", label: "Hopeful and ready to grow" },
] as const;

type CurrentStateValue = (typeof OPTIONS)[number]["value"];

export function CurrentStateStep() {
  const { answer, setAnswer } = useFunnelAnswers("currentState");
  const { goNext } = useFunnelNavigation();

  const onPick = (value: CurrentStateValue) => {
    setAnswer("currentState", value);
    track("answer_selected", { stepId: "current-state", value });
    goNext();
  };

  return (
    <StepShell title="How are you feeling today?">
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
