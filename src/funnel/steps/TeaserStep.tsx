"use client";

import { Box, Button, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track, EVENTS } from "@/funnel/analytics/track";

import { LexiAvatar } from "@/funnel/components/lexi/LexiAvatar";

export function TeaserStep() {
  const { answers } = useFunnelAnswers();
  const { goNext } = useFunnelNavigation();

  const phrase =
    answers.lexiExtractedPhrase ?? "I just need some space right now";
  const pattern = answers.lexiPattern ?? "Avoidant Reinforcement Loop";
  const teaserCopy =
    answers.lexiTeaserCopy ??
    "They are keeping you close enough to hope, but far enough to not ask for more.";
  const paywallHook =
    answers.lexiPaywallHook ??
    "Your full Delusion Score, Red Flag breakdown, and custom Next-Move strategy are ready.";

  const handleUnlock = () => {
    track(EVENTS.STEP_EXIT, { step: "teaser" });
    goNext();
  };

  return (
    <Box
      h="100dvh"
      maxH="100dvh"
      w="full"
      bg="bg.canvas"
      display="flex"
      flexDirection="column"
      alignItems="center"
      overflow="hidden"
    >
      <Box
        w="full"
        maxW="420px"
        h="full"
        display="flex"
        flexDirection="column"
        pt="max(24px, env(safe-area-inset-top))"
      >
        <Box
          flex="1"
          overflowY="auto"
          overflowX="hidden"
          minH={0}
          px={5}
          pb={3}
          css={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box display="flex" flexDirection="column" gap={5}>
            {/* Critical badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: "center" }}
            >
              <Box
                display="inline-flex"
                alignItems="center"
                gap={2}
                px={4}
                py={2}
                borderRadius="full"
                bg="lexi.primaryLight"
                border="1.5px solid"
                borderColor="brand.primary"
              >
                <Box w="6px" h="6px" borderRadius="full" bg="brand.primary" />
                <Text
                  fontSize="xs"
                  fontWeight="800"
                  color="brand.primary"
                  letterSpacing="wider"
                  textTransform="uppercase"
                >
                  Critical Repetition Found
                </Text>
              </Box>
            </motion.div>

            {/* Blurred "report" card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <Box position="relative" borderRadius="3xl" overflow="hidden">
                {/* Fake blurred report */}
                <Box
                  bg="lexi.lavenderLight"
                  p={6}
                  filter="blur(6px)"
                  userSelect="none"
                  pointerEvents="none"
                >
                  {[...Array(5)].map((_, i) => (
                    <Box
                      key={i}
                      h="12px"
                      bg="border.light"
                      borderRadius="full"
                      mb={3}
                      opacity={0.8 - i * 0.12}
                    />
                  ))}
                  <Box
                    h="40px"
                    bg="lexi.primaryLight"
                    borderRadius="xl"
                    mt={4}
                  />
                </Box>
                {/* Mascot overlay */}
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                >
                  <LexiAvatar mood="side-eye" size="md" />
                </Box>
              </Box>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <Text
                fontFamily="body"
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="900"
                color="fg.default"
                lineHeight="1.3"
                letterSpacing="-0.5px"
              >
                Analysis Complete.{" "}
                <Text as="span" color="brand.primary">
                  Verdict: {pattern}.
                </Text>
              </Text>
            </motion.div>

            {/* Dynamic analysis card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <Box
                bg="card.bg"
                border="1.5px solid"
                borderColor="border.light"
                borderRadius="2xl"
                px={5}
                py={4}
                boxShadow="0 4px 20px rgba(0,0,0,0.05)"
              >
                <Text
                  fontSize="xs"
                  fontWeight="800"
                  color="brand.secondary"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  mb={2}
                >
                  Lexi flagged this pattern
                </Text>
                <Text
                  fontFamily="body"
                  fontSize="sm"
                  fontWeight="600"
                  color="fg.default"
                  lineHeight="1.7"
                >
                  When they text you{" "}
                  <Text as="span" fontStyle="italic" color="brand.primary">
                    &ldquo;{phrase}&rdquo;
                  </Text>
                  , they aren&rsquo;t trying to protect your feelings. They are
                  establishing a loophole to enjoy relationship benefits without
                  relationship accountability.
                </Text>
              </Box>
            </motion.div>

            {/* Lexi's punchy teaser copy */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              <Box
                bg="lexi.cardFeedback"
                borderRadius="2xl"
                px={5}
                py={4}
                position="relative"
              >
                <Box
                  position="absolute"
                  top="5px"
                  left="5px"
                  right="-5px"
                  bottom="-5px"
                  bg="lexi.cardFeedbackShadow"
                  borderRadius="2xl"
                  zIndex={0}
                />
                <Box position="relative" zIndex={1}>
                  <Text
                    fontFamily="script"
                    fontSize="12px"
                    color="fg.muted"
                    mb={1}
                  >
                    Lexi says
                  </Text>
                  <Text
                    fontFamily="body"
                    fontSize="sm"
                    fontWeight="600"
                    fontStyle="italic"
                    color="fg.default"
                    lineHeight="1.6"
                  >
                    &ldquo;{teaserCopy}&rdquo;
                  </Text>
                </Box>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.55 }}
            >
              <Text
                fontSize="xs"
                color="fg.muted"
                fontWeight="500"
                lineHeight="1.6"
                textAlign="center"
              >
                {paywallHook}
              </Text>
            </motion.div>
          </Box>
        </Box>

        <Box
          flexShrink={0}
          w="full"
          px={5}
          pt={3}
          pb="max(16px, env(safe-area-inset-bottom))"
          bg="bg.canvas"
          borderTop="1px solid"
          borderColor="lexi.border"
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
            onClick={handleUnlock}
          >
            Unlock My Read
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
