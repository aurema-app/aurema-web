"use client";

import Image from "next/image";

import { Box, Button, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { LegalFooterLinks } from "@/funnel/components/LegalFooterLinks";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track, EVENTS } from "@/funnel/analytics/track";

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
        pt="max(24px, env(safe-area-inset-top))"
      >
        {/* Text area */}
        <Box flexShrink={0} px={5} pt={2} pb={4}>
          <motion.div
            {...fadeUp(0)}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
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

          <motion.div {...fadeUp(0.06)} style={{ width: "100%" }}>
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

          <motion.div {...fadeUp(0.1)} style={{ width: "100%" }}>
            <Text
              fontFamily="body"
              fontSize="16px"
              fontStyle="italic"
              fontWeight="400"
              lineHeight="1.65"
              color="fg.default"
              textAlign="center"
            >
              If your stomach drops when their tone shifts, you&apos;re not
              dramatic, your nervous system is just tired of guessing where you
              stand. Lexi looks at their actual patterns, not the potential
              you&apos;re holding onto.
            </Text>
          </motion.div>
        </Box>

        {/* Hero — fills remaining space, anchored to bottom */}
        <motion.div
          {...fadeUp(0.16)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-end",
            minHeight: 0,
            overflow: "hidden",
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
              maxHeight: "100%",
              objectFit: "contain",
              objectPosition: "bottom",
            }}
            priority
          />
        </motion.div>

        {/* Pinned CTA */}
        <Box
          flexShrink={0}
          w="full"
          px={5}
          pt={3}
          pb="max(16px, env(safe-area-inset-bottom))"
          bg={SURFACE}
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
            onClick={handleContinue}
          >
            Continue
          </Button>

          <LegalFooterLinks mt={3} />
        </Box>
      </Box>
    </Box>
  );
}
