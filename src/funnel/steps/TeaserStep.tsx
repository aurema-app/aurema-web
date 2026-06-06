"use client";

import Image from "next/image";

import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { LegalFooterLinks } from "@/funnel/components/LegalFooterLinks";
import { LexiLogoBanner } from "@/funnel/components/lexi/LexiLogoBanner";
import { LexiCtaButton } from "@/funnel/components/lexi/LexiCtaButton";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track, EVENTS } from "@/funnel/analytics/track";
import { FUNNEL_STEP_TOP_PADDING } from "@/funnel/theme/layout.constants";

const SURFACE = "#F6F2FF";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: "easeOut" as const },
});

export function TeaserStep() {
  const { answers } = useFunnelAnswers();
  const { goNext } = useFunnelNavigation();

  const phrase =
    answers.lexiExtractedPhrase ?? "I just need some space right now";
  const pattern = answers.lexiPattern ?? "Confusion and uncertainty";
  const teaserCopy =
    answers.lexiTeaserCopy ??
    "They are keeping you close enough to hope, but far enough to not ask for more.";

  const handleUnlock = () => {
    track(EVENTS.STEP_EXIT, { step: "teaser" });
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
        {/* Scrollable content */}
        <Box
          flex="1"
          overflowY="auto"
          overflowX="hidden"
          minH={0}
          px={6}
          pb={3}
          css={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {/* Logo */}
          <motion.div
            {...fadeUp(0)}
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "8px",
              marginBottom: "20px",
            }}
          >
            <LexiLogoBanner />
          </motion.div>

          {/* Headline */}
          <motion.div {...fadeUp(0.08)}>
            <Text
              fontFamily="body"
              fontSize="24px"
              fontWeight="800"
              lineHeight="1.25"
              letterSpacing="-0.3px"
              color="fg.default"
              textAlign="center"
              mb={5}
            >
              Analysis completed. Verdict:{" "}
              <Text as="span" color="brand.primary">
                {pattern}
              </Text>
            </Text>
          </motion.div>

          {/* Judge video — circular mask */}
          <motion.div
            {...fadeUp(0.16)}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <Box
              w="260px"
              h="260px"
              borderRadius="full"
              overflow="hidden"
              flexShrink={0}
            >
              <video
                src="/lexi/lexi-judge.mp4"
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
          </motion.div>

          {/* "Lexi flagged this pattern" card */}
          <motion.div {...fadeUp(0.24)}>
            <Box
              bg="white"
              border="1px solid"
              borderColor="lexi.border"
              borderRadius="2xl"
              px={5}
              py={4}
              boxShadow="0 4px 20px rgba(0,0,0,0.04)"
            >
              <Text fontSize="13px" fontWeight="700" color="fg.muted" mb={3}>
                🏛️ Lexi flagged this pattern
              </Text>
              <Text
                fontSize="15px"
                fontWeight="500"
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
        </Box>

        {/* Pinned footer */}
        <Box
          flexShrink={0}
          w="full"
          px={6}
          pt={3}
          pb="max(16px, env(safe-area-inset-bottom))"
          bg={SURFACE}
          borderTop="1px solid"
          borderColor="lexi.border"
        >
          <LexiCtaButton fontStyle="italic" onClick={handleUnlock}>
            Unlock your read
          </LexiCtaButton>

          <LegalFooterLinks mt={3} />
        </Box>
      </Box>
    </Box>
  );
}
