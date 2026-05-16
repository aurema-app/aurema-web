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
  const pattern =
    answers.lexiPattern ??
    "Lexi detected a high-loop risk pattern in your data. Classic avoidant reinforcement loop identified.";

  const handleUnlock = () => {
    track(EVENTS.STEP_EXIT, { step: "teaser" });
    goNext();
  };

  return (
    <Box
      minH="100dvh"
      bg="bg.canvas"
      display="flex"
      flexDirection="column"
      alignItems="center"
      px={5}
      pt={8}
      pb={10}
    >
      <Box
        w="full"
        maxW="420px"
        flex="1"
        display="flex"
        flexDirection="column"
        gap={5}
      >
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
            bg="lexi.pinkLight"
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
              <Box h="40px" bg="lexi.pinkLight" borderRadius="xl" mt={4} />
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
              Verdict: High Loop Risk.
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.5 }}
        >
          <Text
            fontSize="xs"
            color="fg.muted"
            fontWeight="500"
            lineHeight="1.6"
            textAlign="center"
          >
            Your full <strong>Delusion Score</strong>, Red Flag breakdown, and
            custom Next-Move strategy are ready.
          </Text>
        </motion.div>

        <Button
          bg="brand.primary"
          color="white"
          borderRadius="full"
          py={6}
          w="full"
          fontFamily="body"
          fontWeight="700"
          fontSize="md"
          _hover={{
            transform: "translateY(-1px)",
            boxShadow: "0 8px 24px rgba(255,125,186,0.4)",
          }}
          _active={{ transform: "translateY(0)" }}
          transition="all 0.2s"
          onClick={handleUnlock}
          mt="auto"
        >
          Unlock My Read
        </Button>
      </Box>
    </Box>
  );
}
