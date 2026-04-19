"use client";

import { useRouter } from "next/navigation";
import { Box, Text, VStack } from "@chakra-ui/react";

import { StepShell } from "@/funnel/components/StepShell";
import { ContinueButton } from "@/funnel/components/ContinueButton";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import type { FunnelAnswers } from "@/funnel/state/types";

const GOAL_LABELS: Record<NonNullable<FunnelAnswers["goal"]>, string> = {
  clarity: "finding clarity",
  calm: "building calm",
  focus: "sharpening focus",
  growth: "personal growth",
};

const FREQUENCY_LABELS: Record<
  NonNullable<FunnelAnswers["frequency"]>,
  string
> = {
  daily: "daily",
  "few-times-week": "3×/week",
  weekly: "weekly",
};

const CURRENT_STATE_LABELS: Record<
  NonNullable<FunnelAnswers["currentState"]>,
  string
> = {
  stressed: "feel less stressed",
  stuck: "get unstuck",
  curious: "explore what's possible",
  hopeful: "build on that momentum",
};

const AGE_CONTEXT: Record<NonNullable<FunnelAnswers["ageRange"]>, string> = {
  "18-24": "Designed for where you are right now.",
  "25-34": "Built around your pace of life.",
  "35-44": "Adapted to fit a busy schedule.",
  "45+": "Crafted with your experience in mind.",
};

export function PlanPreviewStep() {
  const router = useRouter();
  const { answers } = useFunnelAnswers();

  const goalLabel = answers.goal ? GOAL_LABELS[answers.goal] : "your goals";
  const frequencyLabel = answers.frequency
    ? FREQUENCY_LABELS[answers.frequency]
    : "regular";
  const stateBlurb = answers.currentState
    ? CURRENT_STATE_LABELS[answers.currentState]
    : null;
  const ageBlurb = answers.ageRange ? AGE_CONTEXT[answers.ageRange] : null;

  const headline = `A ${frequencyLabel} plan for ${goalLabel}.`;

  return (
    <StepShell
      title="Your plan is ready"
      footer={
        <ContinueButton onClick={() => router.push("/growth-plan/paywall")}>
          See my plan
        </ContinueButton>
      }
    >
      <VStack gap={4} align="stretch" pt={2}>
        <Box
          bg="whiteAlpha.100"
          borderRadius="xl"
          px={5}
          py={4}
          borderLeft="3px solid"
          borderColor="brand.primary"
        >
          <Text
            fontFamily="heading"
            fontSize="xl"
            color="fg.default"
            fontWeight="bold"
            lineHeight="1.3"
          >
            {headline}
          </Text>
        </Box>

        {stateBlurb && (
          <Text fontFamily="body" fontSize="sm" color="fg.muted">
            {"→ "}
            {stateBlurb}
          </Text>
        )}

        {ageBlurb && (
          <Text fontFamily="body" fontSize="sm" color="fg.muted">
            {"→ "}
            {ageBlurb}
          </Text>
        )}

        <Text fontFamily="body" fontSize="sm" color="fg.muted">
          {"→ Short, science-backed exercises you can do anywhere."}
        </Text>
      </VStack>
    </StepShell>
  );
}
