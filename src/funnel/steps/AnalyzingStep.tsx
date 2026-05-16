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
  const [error, setError] = useState<string | null>(null);

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
      answers: {
        peaceBreaker: answers.peaceBreaker,
        overthinking: answers.overthinking,
        digitalAnxiety: answers.digitalAnxiety,
        friendGroup: answers.friendGroup,
        projection: answers.projection,
        reinforcement: answers.reinforcement,
      },
    };

    fetch("/api/lexi/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        const json = (await res.json()) as {
          phrase?: string;
          pattern?: string;
          error?: string;
        };
        if (json.error) throw new Error(json.error);
        setAnswer(
          "lexiExtractedPhrase",
          json.phrase ?? "I just need some space right now",
        );
        setAnswer(
          "lexiPattern",
          json.pattern ?? "Classic avoidant reinforcement loop.",
        );
      })
      .catch(() => {
        // Graceful fallback — still advance to teaser
        setError("Analysis complete.");
        setAnswer(
          "lexiExtractedPhrase",
          answers.evidenceText?.slice(0, 60) ??
            "I just need some space right now",
        );
        setAnswer(
          "lexiPattern",
          "Lexi detected a high-loop risk pattern in your data.",
        );
      })
      .finally(() => {
        // Wait at least 4 s of animation before advancing
        setTimeout(() => goNext(), Math.max(0, 4000));
      });
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

        {error && (
          <Text fontSize="xs" color="fg.muted" mt={2}>
            {error}
          </Text>
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
