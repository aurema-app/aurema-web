"use client";

import { useRouter } from "next/navigation";

import { LexiEmailCapture } from "@/funnel/components/lexi/LexiEmailCapture";
import { setAmplitudeUserProperties } from "@/funnel/analytics/amplitudeClient";
import { EVENTS, track } from "@/funnel/analytics/track";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";

export function SignInStep() {
  const router = useRouter();
  const { answers, setAnswer } = useFunnelAnswers();

  const handleContinue = (email: string) => {
    setAnswer("userEmail", email);
    setAnswer("firebaseUid", `email:${email}`);
    setAmplitudeUserProperties({ email_captured: true });
    track(EVENTS.EMAIL_CAPTURED, { step_id: "sign-in" });
    router.push("/growth-plan/paywall");
  };

  return (
    <LexiEmailCapture
      initialEmail={answers.userEmail ?? ""}
      onContinue={handleContinue}
      showBack
      onBack={() => router.push("/growth-plan/teaser")}
    />
  );
}
