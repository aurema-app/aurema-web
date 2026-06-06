"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { Box, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

import { LexiCtaButton } from "@/funnel/components/lexi/LexiCtaButton";
import { LexiCtaFooter } from "@/funnel/components/lexi/LexiCtaFooter";
import { LexiLogoBanner } from "@/funnel/components/lexi/LexiLogoBanner";
import { LexiStepScroll } from "@/funnel/components/lexi/LexiStepScroll";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import { track, EVENTS } from "@/funnel/analytics/track";
import { FUNNEL_STEP_TOP_PADDING } from "@/funnel/theme/layout.constants";

const SURFACE = "#F6F2FF";

const BARS = [
  {
    emoji: "🔄",
    label: "Loop risk",
    finalValue: 84,
    loadLabel: "Assessing loop risk...",
  },
  {
    emoji: "📦",
    label: "Breadcrumb tolerance",
    finalValue: 79,
    loadLabel: "Finding breadcrumb tolerance...",
  },
  {
    emoji: "🕳️",
    label: "Situationship depth",
    finalValue: 91,
    loadLabel: "Getting situationship depth...",
  },
];

const REVEAL_DELAY = 3800;

function getHeadline(decodingTarget?: string): string {
  if (decodingTarget === "guy")
    return "Lexi is concerned about your pattern with this boy";
  if (decodingTarget === "girl")
    return "Lexi is concerned about your pattern with this girl";
  return "Lexi has detected a dangerous pattern";
}

function ProgressBar({
  value,
  final,
  revealed,
}: {
  value: number;
  final: number;
  revealed: boolean;
}) {
  return (
    <Box
      w="full"
      h="8px"
      bg="lexi.lavenderLight"
      borderRadius="full"
      overflow="hidden"
    >
      <motion.div
        animate={{ width: `${revealed ? final : value}%` }}
        transition={
          revealed
            ? { duration: 0.6, ease: "easeOut" }
            : { type: "spring", stiffness: 50, damping: 20 }
        }
        style={{
          height: "100%",
          background: "#C7A6F7",
          borderRadius: "9999px",
        }}
      />
    </Box>
  );
}

export function PatternDetectedStep() {
  const { goNext } = useFunnelNavigation();
  const { answers } = useFunnelAnswers();
  const [counts, setCounts] = useState([0, 0, 0]);
  const [revealed, setRevealed] = useState(false);

  const headline = getHeadline(answers.decodingTarget);

  useEffect(() => {
    const timers = BARS.map((bar, index) =>
      setTimeout(
        () => {
          let current = 0;
          const interval = setInterval(() => {
            current += 1;
            setCounts((prev) => {
              const next = [...prev];
              next[index] = current;
              return next;
            });
            if (current >= bar.finalValue) clearInterval(interval);
          }, 16);
          return interval;
        },
        index * 600 + 400,
      ),
    );

    const revealTimer = setTimeout(() => setRevealed(true), REVEAL_DELAY);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(revealTimer);
    };
  }, []);

  const handleContinue = () => {
    track(EVENTS.STEP_EXIT, { step: "pattern-detected" });
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
        <LexiStepScroll display="flex" flexDirection="column" px={6} pb={3}>
          {/* Logo */}
          <Box
            display="flex"
            justifyContent="center"
            pt={2}
            mb={8}
            flexShrink={0}
          >
            <LexiLogoBanner />
          </Box>

          {/* Headline */}
          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.div
                key="loading-headline"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                style={{ flexShrink: 0 }}
              >
                <Text
                  fontFamily="body"
                  fontSize="24px"
                  fontWeight="800"
                  lineHeight="1.25"
                  letterSpacing="-0.3px"
                  color="fg.default"
                  textAlign="center"
                  mb={8}
                >
                  Lexi is analyzing your{" "}
                  <Text as="span" color="brand.primary">
                    baseline patterns...
                  </Text>
                </Text>
              </motion.div>
            ) : (
              <motion.div
                key="results-headline"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                style={{ flexShrink: 0 }}
              >
                <Text
                  fontFamily="body"
                  fontSize="24px"
                  fontWeight="800"
                  lineHeight="1.25"
                  letterSpacing="-0.3px"
                  color="fg.default"
                  textAlign="center"
                  mb={8}
                >
                  {headline.replace(/(boy|girl|dangerous pattern)/, "")}
                  <Text as="span" color="brand.primary" whiteSpace="nowrap">
                    {headline.match(/(boy|girl|dangerous pattern)/)?.[0] ?? ""}
                  </Text>
                </Text>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bars */}
          <Box display="flex" flexDirection="column" gap={6} flexShrink={0}>
            {BARS.map((bar, index) => (
              <Box key={bar.label} w="full">
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Text fontSize="16px" fontWeight="700" color="fg.default">
                    {revealed ? (
                      <>
                        <Text as="span" mr={2}>
                          {bar.emoji}
                        </Text>
                        {bar.label}
                      </>
                    ) : (
                      <Text as="span" fontStyle="italic" color="fg.muted">
                        {bar.loadLabel}
                      </Text>
                    )}
                  </Text>
                  <Text
                    fontSize="14px"
                    fontWeight="700"
                    color="fg.muted"
                    flexShrink={0}
                    ml={2}
                  >
                    {revealed ? `${bar.finalValue}%` : `${counts[index]}%`}
                  </Text>
                </Box>
                <ProgressBar
                  value={counts[index]}
                  final={bar.finalValue}
                  revealed={revealed}
                />
              </Box>
            ))}
          </Box>

          {/* Hero image — fills remaining space, anchored to bottom of scroll area */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "flex-end",
                  marginTop: "16px",
                }}
              >
                <Image
                  src="/lexi/hero-3.png"
                  alt="Lexi annoyed"
                  width={692}
                  height={654}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto", display: "block" }}
                  priority
                />
              </motion.div>
            )}
          </AnimatePresence>
        </LexiStepScroll>

        <LexiCtaFooter
          px={6}
          legalLinksMt={revealed ? 3 : 0}
        >
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LexiCtaButton onClick={handleContinue}>
                  Drop the Evidence
                </LexiCtaButton>
              </motion.div>
            )}
          </AnimatePresence>
        </LexiCtaFooter>
      </Box>
    </Box>
  );
}
