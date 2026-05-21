"use client";

import { useEffect, useRef, useState } from "react";

import { Box, Text } from "@chakra-ui/react";
import { motion, useAnimationFrame } from "framer-motion";

import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { LexiAvatar } from "@/funnel/components/lexi/LexiAvatar";

const MESSAGES = [
  "Scanning breadcrumb tolerance...",
  "Isolating avoidant behavior spikes...",
  "Calculating delulu coefficient...",
  "Extracting core mixed signal phrases...",
  "Formulating brutal truth engine response...",
];

const RING_RADIUS = 56;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function AnalyzingStep() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  const { answers, setAnswer } = useFunnelAnswers();
  const { goNext } = useFunnelNavigation();
  const calledRef = useRef(false);

  // Cycle through loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % MESSAGES.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Animate progress ring
  useAnimationFrame((_, delta) => {
    setProgress((p) => Math.min(p + delta * 0.00035, 1));
  });

  // Fire LLM call once
  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const body = {
      evidenceText: answers.evidenceText ?? "",
      evidenceImages: answers.evidenceImages,
      evidenceType: answers.evidenceType ?? "text",
      answers: {
        decodingTarget: answers.decodingTarget,
        demographics: answers.demographics,
        timeline: answers.timeline,
        peaceBreaker: answers.peaceBreaker,
        overthinking: answers.overthinking,
        digitalAnxiety: answers.digitalAnxiety,
        friendGroup: answers.friendGroup,
        projection: answers.projection,
        reinforcement: answers.reinforcement,
      },
    };

    const startedAt = Date.now();
    const MIN_ANIM_MS = 3000;

    const run = async () => {
      try {
        const res = await fetch("/api/lexi/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const json = (await res.json()) as {
          spicy_detail?: string;
          detected_pattern?: string;
          teaser_copy?: string;
          paywall_hook?: string;
          error?: string;
        };

        if (!res.ok || json.error) {
          // Surface the real error — stays on this screen so you can see it.
          setApiError(json.error ?? `HTTP ${res.status}`);
          return;
        }

        setAnswer(
          "lexiExtractedPhrase",
          json.spicy_detail ?? "I just need some space right now",
        );
        setAnswer(
          "lexiPattern",
          json.detected_pattern ?? "Avoidant Reinforcement Loop",
        );
        setAnswer(
          "lexiTeaserCopy",
          json.teaser_copy ??
            "They are keeping you close enough to hope, but far enough to not ask for more.",
        );
        setAnswer(
          "lexiPaywallHook",
          json.paywall_hook ??
            "Your full Delusion Score and Red Flag breakdown are ready.",
        );

        // Wait for minimum animation time, then advance.
        const elapsed = Date.now() - startedAt;
        setTimeout(() => goNext(), Math.max(0, MIN_ANIM_MS - elapsed));
      } catch (err) {
        setApiError(
          err instanceof Error ? err.message : "Network error — check console.",
        );
      }
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const strokeDashoffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <Box
      minH="100dvh"
      bg="bg.canvas"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={5}
      gap={8}
    >
      {/* Progress ring */}
      <Box position="relative" w="140px" h="140px">
        <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="70"
            cy="70"
            r={RING_RADIUS}
            fill="none"
            stroke="#EAEAF4"
            strokeWidth="8"
          />
          <motion.circle
            cx="70"
            cy="70"
            r={RING_RADIUS}
            fill="none"
            stroke="#FF7DBA"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <LexiAvatar mood="typing" size="sm" />
        </Box>
      </Box>

      <Box textAlign="center">
        <Text
          fontFamily="body"
          fontSize="xl"
          fontWeight="800"
          color="fg.default"
          letterSpacing="-0.3px"
          mb={1}
        >
          Analyzing your situation...
        </Text>

        <motion.div
          key={msgIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          <Text fontSize="sm" color="fg.muted" fontWeight="600">
            {MESSAGES[msgIdx]}
          </Text>
        </motion.div>

        {apiError && (
          <Box
            mt={4}
            px={4}
            py={3}
            bg="red.50"
            border="1px solid"
            borderColor="red.200"
            borderRadius="xl"
            maxW="340px"
            mx="auto"
          >
            <Text
              fontSize="xs"
              fontWeight="700"
              color="red.600"
              mb={1}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              API Error
            </Text>
            <Text
              fontSize="xs"
              color="red.700"
              fontFamily="mono"
              lineHeight="1.6"
            >
              {apiError}
            </Text>
          </Box>
        )}
      </Box>

      {/* Lexi wordmark small */}
      <Text
        fontSize="xs"
        color="fg.muted"
        fontWeight="700"
        letterSpacing="widest"
        textTransform="uppercase"
      >
        Lexi ♥
      </Text>
    </Box>
  );
}
