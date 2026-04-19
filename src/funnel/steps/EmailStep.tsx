"use client";

import { useState } from "react";
import { Input, Text, VStack } from "@chakra-ui/react";

import { StepShell } from "@/funnel/components/StepShell";
import { ContinueButton } from "@/funnel/components/ContinueButton";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { submitLead } from "@/funnel/services/leadsClient";
import { track } from "@/funnel/analytics/track";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function EmailStep() {
  const { answers, setAnswer } = useFunnelAnswers();
  const { goNext } = useFunnelNavigation();
  const [value, setValue] = useState(answers.userEmail ?? "");
  const [touched, setTouched] = useState(false);

  const isValid = EMAIL_RE.test(value.trim());
  const showError = touched && !isValid;

  const handleContinue = () => {
    const trimmed = value.trim();
    setAnswer("userEmail", trimmed);

    // Fire-and-forget: backend failure must never block the user.
    submitLead({ email: trimmed }).catch((err) => {
      console.warn("[EmailStep] lead capture failed:", err);
    });

    track("email_submitted", { stepId: "email" });
    goNext();
  };

  return (
    <StepShell
      title="Where should we send your plan?"
      subtitle="We'll use this to keep your progress safe."
      footer={
        <ContinueButton onClick={handleContinue} disabled={!isValid}>
          Continue
        </ContinueButton>
      }
    >
      <VStack gap={2} align="stretch">
        <Input
          type="email"
          placeholder="you@example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          size="lg"
          borderRadius="xl"
          fontFamily="body"
          bg="whiteAlpha.100"
          borderColor={showError ? "red.400" : "whiteAlpha.300"}
          _focus={{ borderColor: "brand.primary", boxShadow: "none" }}
          color="fg.default"
          autoComplete="email"
          inputMode="email"
          aria-label="Email address"
        />
        {showError && (
          <Text fontFamily="body" fontSize="sm" color="red.400">
            Please enter a valid email address.
          </Text>
        )}
      </VStack>
    </StepShell>
  );
}
