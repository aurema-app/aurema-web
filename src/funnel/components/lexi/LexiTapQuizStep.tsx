"use client";

import { useState } from "react";

import { Box, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { LexiCtaFooter } from "@/funnel/components/lexi/LexiCtaFooter";
import { LexiLogoBanner } from "@/funnel/components/lexi/LexiLogoBanner";
import { LexiStepScroll } from "@/funnel/components/lexi/LexiStepScroll";
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

export type TapQuizOption = {
  id: string;
  emoji: string;
  label: string;
};

type LexiTapQuizStepProps = {
  question: string;
  options: readonly TapQuizOption[];
  answerKey: keyof FunnelAnswers;
  stepId: string;
  amplitudeProperty: string;
};

export function LexiTapQuizStep({
  question,
  options,
  answerKey,
  stepId,
  amplitudeProperty,
}: LexiTapQuizStepProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const { setAnswer } = useFunnelAnswers();
  const { goNext } = useFunnelNavigation();

  const handleSelect = (id: string) => {
    if (selected) return;

    setSelected(id);
    setAnswer(answerKey, id);
    track(EVENTS.ANSWER_SELECTED, { step: stepId, value: id });
    setAmplitudeUserProperties({ [amplitudeProperty]: id });

    window.setTimeout(() => goNext(), 280);
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
          <VStack w="full" align="center" gap={0} pt={2}>
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

          <Box w="full" py={4}>
            <motion.div {...fadeUp(0.16)} style={{ width: "100%" }}>
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
            </motion.div>
          </Box>
        </LexiStepScroll>

        <LexiCtaFooter px={4} />
      </Box>
    </Box>
  );
}
