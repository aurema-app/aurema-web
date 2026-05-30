"use client";

import { LexiEmailCapture } from "@/funnel/components/lexi/LexiEmailCapture";
import { setAmplitudeUserProperties } from "@/funnel/analytics/amplitudeClient";
import { EVENTS, track } from "@/funnel/analytics/track";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";

export function EmailStep() {
  const { answers, setAnswer } = useFunnelAnswers();
  const { goNext, goPrev, currentIndex } = useFunnelNavigation();

  const handleContinue = (email: string) => {
    setAnswer("userEmail", email);
    setAmplitudeUserProperties({ email_captured: true });
    track(EVENTS.EMAIL_CAPTURED, { step_id: "email" });
    goNext();
  };

  return (
    <LexiEmailCapture
      initialEmail={answers.userEmail ?? ""}
      onContinue={handleContinue}
      showBack={currentIndex > 0}
      onBack={goPrev}
    />
  );
}
