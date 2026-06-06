"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { Box, Text } from "@chakra-ui/react";
import { motion, useAnimationFrame } from "framer-motion";

import { LegalFooterLinks } from "@/funnel/components/LegalFooterLinks";
import { LexiLogoBanner } from "@/funnel/components/lexi/LexiLogoBanner";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { FUNNEL_STEP_TOP_PADDING } from "@/funnel/theme/layout.constants";

const SURFACE = "#F6F2FF";

const MESSAGES = [
  "Scanning breadcrumb tolerance...",
  "Isolating avoidant behavior spikes...",
  "Calculating delulu coefficient...",
  "Extracting core mixed signal phrases...",
  "Formulating brutal truth engine response...",
];

// Each message stays visible for 2 seconds so it can be read
const MSG_INTERVAL_MS = 2000;

const RING_SIZE = 140;
const RING_CENTER = RING_SIZE / 2;
const RING_RADIUS = 58;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const MIN_ANIM_MS = 4000;

export function AnalyzingStep() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  const { answers, setAnswer } = useFunnelAnswers();
  const { goNext } = useFunnelNavigation();
  const calledRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % MESSAGES.length);
    }, MSG_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useAnimationFrame((_, delta) => {
    setProgress((p) => Math.min(p + delta * 0.00022, 0.95));
  });

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
        alignItems="center"
        bg={SURFACE}
        px={6}
        pt={FUNNEL_STEP_TOP_PADDING}
        pb="max(16px, env(safe-area-inset-bottom))"
      >
        {/* Logo */}
        <LexiLogoBanner mt={2} mb="auto" />

        {/* Center content */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={6}
          flex="1"
          justifyContent="center"
        >
          {/* Circular video — no margin, video anchored to top */}
          <Box
            w="240px"
            h="240px"
            borderRadius="full"
            overflow="hidden"
            flexShrink={0}
          >
            <video
              src="/lexi/lexi-analysis.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
                display: "block",
              }}
            />
          </Box>

          {/* Progress ring with number inside */}
          <Box
            position="relative"
            w={`${RING_SIZE}px`}
            h={`${RING_SIZE}px`}
            flexShrink={0}
          >
            <svg
              width={RING_SIZE}
              height={RING_SIZE}
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                cx={RING_CENTER}
                cy={RING_CENTER}
                r={RING_RADIUS}
                fill="none"
                stroke="#E8E0F8"
                strokeWidth="7"
              />
              <motion.circle
                cx={RING_CENTER}
                cy={RING_CENTER}
                r={RING_RADIUS}
                fill="none"
                stroke="#FF7DBA"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <Box
              position="absolute"
              inset={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                fontSize="40px"
                fontWeight="800"
                color="fg.default"
                lineHeight="1"
                fontFamily="body"
              >
                {Math.round(progress * 100)}
              </Text>
            </Box>
          </Box>

          {/* Text */}
          <Box textAlign="center">
            <Text
              fontFamily="body"
              fontSize="22px"
              fontWeight="800"
              color="fg.default"
              letterSpacing="-0.3px"
              mb={3}
            >
              Analyzing your situationship...
            </Text>

            <motion.div
              key={msgIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <Text fontSize="15px" color="fg.muted" fontWeight="600">
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
        </Box>

        {/* Footer */}
        <LegalFooterLinks mt="auto" pt={4} />
      </Box>
    </Box>
  );
}
