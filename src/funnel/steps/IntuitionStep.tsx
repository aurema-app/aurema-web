"use client";

import Image from "next/image";
import Link from "next/link";

import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

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
      overflow="hidden"
    >
      <Box flex="1" display="flex" flexDirection="column" minH={0} w="full">
        <VStack
          gap={4}
          w="full"
          flexShrink={0}
          px={5}
          pt="max(24px, env(safe-area-inset-top))"
        >
          <motion.div {...fadeUp(0)}>
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
              fontSize={{ base: "26px", sm: "28px" }}
              fontWeight="800"
              lineHeight="1.2"
              letterSpacing="-0.4px"
              color="fg.default"
              textAlign="center"
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
        </VStack>

        {/* Hero — full width, anchored to bottom above CTA */}
        <motion.div
          {...fadeUp(0.16)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-end",
            width: "100vw",
            maxWidth: "100vw",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
            minHeight: 0,
          }}
        >
          <Box w="full" display="flex" alignItems="flex-end">
            <Image
              src="/lexi/hero-2.png"
              alt="Lexi — Truth hurts. Lexi helps."
              width={777}
              height={878}
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                verticalAlign: "bottom",
              }}
              priority
            />
          </Box>
        </motion.div>
      </Box>

      <Box
        flexShrink={0}
        w="full"
        maxW="430px"
        mx="auto"
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

        <Text
          fontSize="11px"
          fontWeight="500"
          color="fg.muted"
          textAlign="center"
          mt={3}
        >
          <Link href="/terms" style={{ textDecoration: "underline" }}>
            Terms of use
          </Link>
          {" · "}
          <Link href="/privacy" style={{ textDecoration: "underline" }}>
            Privacy policy
          </Link>
        </Text>
      </Box>
    </Box>
  );
}
