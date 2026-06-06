"use client";

import Image from "next/image";

import { Box, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { LexiCtaButton } from "@/funnel/components/lexi/LexiCtaButton";
import { LexiCtaFooter } from "@/funnel/components/lexi/LexiCtaFooter";
import { LexiLogoBanner } from "@/funnel/components/lexi/LexiLogoBanner";
import { LexiStepScroll } from "@/funnel/components/lexi/LexiStepScroll";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track, EVENTS } from "@/funnel/analytics/track";
import { FUNNEL_STEP_TOP_PADDING } from "@/funnel/theme/layout.constants";

const SURFACE = "#F6F2FF";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, delay, ease: "easeOut" as const },
});

export function LandingStep() {
  const { goNext } = useFunnelNavigation();

  const handleStart = () => {
    track(EVENTS.STEP_EXIT, { step: "landing" });
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
        <LexiStepScroll>
          <VStack gap={4} w="full" align="center" px={5} pb={3}>
            <motion.div {...fadeUp(0)}>
              <LexiLogoBanner size="lg" mx="auto" />
            </motion.div>

            <motion.div {...fadeUp(0.06)} style={{ width: "100%" }}>
              <Text
                fontFamily="display"
                fontSize={{ base: "32px", sm: "36px" }}
                fontWeight="900"
                lineHeight="1.1"
                letterSpacing="-1px"
                color="fg.default"
                textAlign="center"
              >
                Stop calling
                <Text as="span" color="brand.primary">
                  {" mixed signals "}
                </Text>
                chemistry.
              </Text>
            </motion.div>

            <motion.div {...fadeUp(0.12)} style={{ width: "100%" }}>
              <Text
                fontFamily="body"
                fontSize="16px"
                fontWeight="500"
                color="fg.muted"
                lineHeight="1.55"
                textAlign="center"
              >
                Lexi clocks the red flags, roasts the excuses and gives you real
                advice.
              </Text>
            </motion.div>

            <motion.div {...fadeUp(0.18)} style={{ width: "100%" }}>
              <Image
                src="/lexi/awards.png"
                alt="Best Dating Analyzer App 2026 · Editor's Choice"
                width={560}
                height={120}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </motion.div>
          </VStack>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22, ease: "easeOut" }}
            style={{
              display: "flex",
              alignItems: "flex-end",
              width: "100vw",
              maxWidth: "100vw",
              marginLeft: "calc(50% - 50vw)",
              marginRight: "calc(50% - 50vw)",
            }}
          >
            <Box
              w="full"
              display="flex"
              justifyContent="center"
              alignItems="flex-end"
            >
              <Image
                src="/lexi/hero-1.png"
                alt="Lexi analyzing your texts"
                width={1170}
                height={996}
                priority
                style={{
                  width: "100%",
                  maxWidth: "430px",
                  height: "auto",
                  display: "block",
                }}
              />
            </Box>
          </motion.div>
        </LexiStepScroll>

        <LexiCtaFooter>
          <motion.div {...fadeUp(0.32)}>
            <LexiCtaButton ctaSize="lg" onClick={handleStart}>
              Start Analysis
            </LexiCtaButton>
          </motion.div>
        </LexiCtaFooter>
      </Box>
    </Box>
  );
}
