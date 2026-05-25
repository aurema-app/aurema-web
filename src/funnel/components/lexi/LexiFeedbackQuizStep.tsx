"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { LexiSaysCard } from "@/funnel/components/lexi/LexiSaysCard";
import { QuizOptionButton } from "@/funnel/components/lexi/QuizOptionButton";
import { setAmplitudeUserProperties } from "@/funnel/analytics/amplitudeClient";
import { EVENTS, track } from "@/funnel/analytics/track";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import type { FunnelAnswers } from "@/funnel/state/types";

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
        pt="max(24px, env(safe-area-inset-top))"
      >
        {/* Scrollable: logo, question, options, Lexi says */}
        <Box
          flex="1"
          overflowY="auto"
          overflowX="hidden"
          minH={0}
          px={4}
          pb={3}
          css={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <VStack w="full" align="center" gap={0} pt={2}>
            <motion.div {...fadeUp(0)}>
              <Box position="relative" h="36px" w="88px">
                <Image
                  src="/lexi/logo.png"
                  alt="Lexi"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </Box>
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

          <motion.div
            {...fadeUp(0.14)}
            style={{ width: "100%", marginTop: "20px" }}
          >
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
                style={{ width: "100%" }}
              >
                <LexiSaysCard text={selectedOption.feedback} />
              </motion.div>
            )}
          </motion.div>
        </Box>

        {/* Pinned CTA + footer */}
        <Box
          flexShrink={0}
          w="full"
          px={4}
          pt={3}
          pb="max(16px, env(safe-area-inset-bottom))"
          bg={SURFACE}
          borderTop={selected ? "1px solid" : "none"}
          borderColor="lexi.border"
        >
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Button
                bg="brand.primary"
                color="white"
                borderRadius="full"
                h="56px"
                w="full"
                fontFamily="display"
                fontWeight="700"
                fontSize="17px"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 32px rgba(236,72,153,0.38)",
                }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.18s ease"
                onClick={handleContinue}
              >
                {ctaLabel}
              </Button>
            </motion.div>
          )}

          <Text
            fontSize="11px"
            fontWeight="500"
            color="fg.muted"
            textAlign="center"
            mt={selected ? 3 : 0}
          >
            <Link href="/terms" style={{ textDecoration: "underline" }}>
              Terms of use
            </Link>
            {" · "}
            <Link href="/privacy" style={{ textDecoration: "underline" }}>
              Privacy policy
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
