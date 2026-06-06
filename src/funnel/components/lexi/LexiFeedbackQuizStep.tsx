"use client";

import { useState } from "react";

import { Box, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { LexiCtaButton } from "@/funnel/components/lexi/LexiCtaButton";
import { LexiCtaFooter } from "@/funnel/components/lexi/LexiCtaFooter";
import { LexiLogoBanner } from "@/funnel/components/lexi/LexiLogoBanner";
import { LexiStepScroll } from "@/funnel/components/lexi/LexiStepScroll";
import { LexiSaysCard } from "@/funnel/components/lexi/LexiSaysCard";
import { QuizOptionButton } from "@/funnel/components/lexi/QuizOptionButton";
import { setAmplitudeUserProperties } from "@/funnel/analytics/amplitudeClient";
import { EVENTS, track } from "@/funnel/analytics/track";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import type { FunnelAnswers } from "@/funnel/state/types";
import { FUNNEL_STEP_TOP_PADDING } from "@/funnel/theme/layout.constants";

const SURFACE = "#F6F2FF";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, delay, ease: "easeOut" as const },
});

export type FeedbackQuizOption = {
  id: string;
  emoji: string;
  label: string;
  feedback: string;
};

type LexiFeedbackQuizStepProps = {
  question: string;
  options: readonly FeedbackQuizOption[];
  answerKey: keyof FunnelAnswers;
  stepId: string;
  amplitudeProperty: string;
  exitStepId: string;
  ctaLabel: string;
};

export function LexiFeedbackQuizStep({
  question,
  options,
  answerKey,
  stepId,
  amplitudeProperty,
  exitStepId,
  ctaLabel,
}: LexiFeedbackQuizStepProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const { setAnswer } = useFunnelAnswers();
  const { goNext } = useFunnelNavigation();

  const selectedOption = options.find((o) => o.id === selected);

  const handleSelect = (id: string) => {
    if (selected) return;

    setSelected(id);
    setAnswer(answerKey, id);
    track(EVENTS.ANSWER_SELECTED, { step: stepId, value: id });
    setAmplitudeUserProperties({ [amplitudeProperty]: id });
  };

  const handleContinue = () => {
    track(EVENTS.STEP_EXIT, { step: exitStepId });
    goNext();
  };

  return (
    <Box
      h="100dvh"
      maxH="100dvh"
      w="full"
      bg={SURFACE}
      display="flex"
      flexDirection="column"
      alignItems="center"
      overflow="hidden"
    >
      <Box
        w="full"
        maxW="430px"
        h="full"
        display="flex"
        flexDirection="column"
        bg={SURFACE}
        pt={FUNNEL_STEP_TOP_PADDING}
      >
        <LexiStepScroll px={4} pb={3}>
          <Box minH="100%" display="flex" flexDirection="column">
            <VStack w="full" align="center" gap={0} pt={2} flexShrink={0}>
              <motion.div {...fadeUp(0)}>
                <LexiLogoBanner />
              </motion.div>

              <motion.div
                {...fadeUp(0.08)}
                style={{ width: "100%", marginTop: "20px" }}
              >
                <Text
                  fontFamily="body"
                  fontSize="24px"
                  fontWeight="800"
                  lineHeight="1.2"
                  letterSpacing="-0.3px"
                  color="fg.default"
                  textAlign="center"
                >
                  {question}
                </Text>
              </motion.div>
            </VStack>

            {/* Center options vertically in available space */}
            <Box
              flex="1"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              pt={5}
            >
              <motion.div {...fadeUp(0.14)} style={{ width: "100%" }}>
                <VStack gap={2.5} w="full" align="stretch">
                  {options.map((opt) => (
                    <QuizOptionButton
                      key={opt.id}
                      emoji={opt.emoji}
                      label={opt.label}
                      selected={selected === opt.id}
                      onClick={() => handleSelect(opt.id)}
                    />
                  ))}
                </VStack>

                {selectedOption && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: "100%", marginTop: "16px" }}
                  >
                    <LexiSaysCard text={selectedOption.feedback} />
                  </motion.div>
                )}
              </motion.div>
            </Box>
          </Box>
        </LexiStepScroll>

        <LexiCtaFooter
          px={4}
          showBorder={Boolean(selected)}
          legalLinksMt={selected ? 3 : 0}
        >
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <LexiCtaButton onClick={handleContinue}>{ctaLabel}</LexiCtaButton>
            </motion.div>
          )}
        </LexiCtaFooter>
      </Box>
    </Box>
  );
}
