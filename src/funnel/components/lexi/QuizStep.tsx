"use client";

import { useState } from "react";

import { Box, Button, Text, VStack } from "@chakra-ui/react";

import type { FunnelAnswers } from "@/funnel/state/types";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track, EVENTS } from "@/funnel/analytics/track";
import { setAmplitudeUserProperties } from "@/funnel/analytics/amplitudeClient";

import { LexiLayout } from "./LexiLayout";
import { LexiTopBar } from "./LexiTopBar";
import { LexiAvatar } from "./LexiAvatar";
import { PillButton } from "./PillButton";
import { MicroFeedback } from "./MicroFeedback";

type Mood = Parameters<typeof LexiAvatar>[0]["mood"];

export type FeedbackRule = {
  ifAnswers: string[];
  message: string;
};

export type QuizOption = {
  id: string;
  label: string;
};

type QuizStepProps = {
  mood: Mood;
  question: string;
  options: QuizOption[];
  answerKey: keyof FunnelAnswers;
  userPropertyKey?: string;
  feedbackRules?: FeedbackRule[];
  ctaLabel?: string;
  // When true, navigates immediately on selection with no feedback pause.
  autoAdvance?: boolean;
};

export function QuizStep({
  mood,
  question,
  options,
  answerKey,
  userPropertyKey,
  feedbackRules,
  ctaLabel = "Continue",
  autoAdvance = false,
}: QuizStepProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const { setAnswer } = useFunnelAnswers();
  const { goNext } = useFunnelNavigation();

  const feedbackText =
    selected && feedbackRules
      ? (feedbackRules.find((r) => r.ifAnswers.includes(selected))?.message ??
        null)
      : null;

  const handleSelect = (id: string) => {
    if (selected) return; // prevent double-tap

    setSelected(id);
    setAnswer(answerKey, id);

    track(EVENTS.ANSWER_SELECTED, { step: answerKey, value: id });

    if (userPropertyKey) {
      setAmplitudeUserProperties({ [userPropertyKey]: id });
    }

    if (autoAdvance) {
      goNext();
      return;
    }

    const hasFeedback = feedbackRules?.some((r) => r.ifAnswers.includes(id));
    if (hasFeedback) {
      setShowFeedback(true);
    } else {
      goNext();
    }
  };

  return (
    <LexiLayout>
      <LexiTopBar />

      <Box flex="1" display="flex" flexDirection="column" gap={6}>
        <Box textAlign="center">
          <LexiAvatar mood={mood} size="md" />
        </Box>

        <Text
          fontFamily="body"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="800"
          color="fg.default"
          lineHeight="1.3"
          letterSpacing="-0.3px"
        >
          {question}
        </Text>

        <VStack gap={3} align="stretch">
          {options.map((opt) => (
            <PillButton
              key={opt.id}
              selected={selected === opt.id}
              onClick={() => handleSelect(opt.id)}
            >
              {opt.label}
            </PillButton>
          ))}
        </VStack>

        {showFeedback && feedbackText && <MicroFeedback text={feedbackText} />}

        {showFeedback && (
          <Button
            bg="brand.primary"
            color="white"
            borderRadius="full"
            py={6}
            fontFamily="body"
            fontWeight="700"
            fontSize="md"
            w="full"
            _hover={{
              bg: "lexi.pink",
              transform: "translateY(-1px)",
              boxShadow: "0 8px 24px rgba(255,125,186,0.4)",
            }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s"
            onClick={goNext}
            mt="auto"
          >
            {ctaLabel}
          </Button>
        )}
      </Box>
    </LexiLayout>
  );
}
