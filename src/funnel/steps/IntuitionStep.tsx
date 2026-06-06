"use client";

import Image from "next/image";

import { Box, Text } from "@chakra-ui/react";
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

export function IntuitionStep() {
  const { goNext } = useFunnelNavigation();

  const handleContinue = () => {
    track(EVENTS.STEP_EXIT, { step: "intuition" });
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
        <LexiStepScroll display="flex" flexDirection="column" px={6}>
          <Box
            flex="1"
            display="flex"
            flexDirection="column"
            minH="full"
            w="full"
          >
            <motion.div
              {...fadeUp(0)}
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
                paddingTop: "8px",
                flexShrink: 0,
              }}
            >
              <LexiLogoBanner />
            </motion.div>

            <motion.div
              {...fadeUp(0.06)}
              style={{ width: "100%", flexShrink: 0 }}
            >
              <Text
                fontFamily="body"
                fontSize="26px"
                fontWeight="800"
                lineHeight="1.2"
                letterSpacing="-0.4px"
                color="fg.default"
                textAlign="center"
                mb={3}
              >
                Your intuition isn&apos;t{" "}
                <Text as="span" color="brand.primary">
                  broken.
                </Text>
              </Text>
            </motion.div>

            <motion.div
              {...fadeUp(0.1)}
              style={{ width: "100%", flexShrink: 0 }}
            >
              <Text
                fontFamily="body"
                fontSize="16px"
                fontWeight="400"
                lineHeight="1.65"
                color="fg.default"
                textAlign="center"
              >
                If your stomach drops when their tone shifts, you&apos;re not
                dramatic, your nervous system is just tired of guessing where
                you stand. Lexi looks at their actual patterns, not the
                potential you&apos;re holding onto.
              </Text>
            </motion.div>

            <motion.div
              {...fadeUp(0.16)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "flex-end",
                width: "100%",
                marginTop: "16px",
              }}
            >
              <Image
                src="/lexi/hero-2.png"
                alt="Lexi character"
                width={777}
                height={878}
                sizes="(max-width: 430px) 100vw, 430px"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
                priority
              />
            </motion.div>
          </Box>
        </LexiStepScroll>

        <LexiCtaFooter>
          <LexiCtaButton onClick={handleContinue}>Continue</LexiCtaButton>
        </LexiCtaFooter>
      </Box>
    </Box>
  );
}
