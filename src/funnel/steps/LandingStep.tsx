"use client";

import Image from "next/image";

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

export function LandingStep() {
  const { goNext } = useFunnelNavigation();

  const handleStart = () => {
    track(EVENTS.STEP_EXIT, { step: "landing" });
    goNext();
  };

  return (
    <Box
      minH="100dvh"
      w="full"
      bg={SURFACE}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        w="full"
        maxW="430px"
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        bg={SURFACE}
        pt={8}
        pb={10}
      >
        {/* Top copy — padded */}
        <VStack gap={4} w="full" align="center" px={5}>
          <motion.div {...fadeUp(0)}>
            <Box position="relative" h="40px" w="96px" mx="auto">
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
              fontFamily="display"
              fontSize={{ base: "40px", sm: "46px" }}
              fontWeight="900"
              lineHeight="1.1"
              letterSpacing="-1px"
              color="fg.default"
              textAlign="center"
            >
              Stop calling
              <br />
              <Text as="span" color="brand.primary">
                mixed signals
              </Text>
              <br />
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

        {/* Hero — full bleed, no horizontal padding (breaks out of column padding) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: "easeOut" }}
          style={{
            flex: 1,
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

        {/* CTA — padded */}
        <Box px={5} w="full">
          <motion.div {...fadeUp(0.32)} style={{ width: "100%" }}>
            <Button
              bg="brand.primary"
              color="white"
              borderRadius="full"
              h="64px"
              w="full"
              fontFamily="display"
              fontWeight="700"
              fontSize="18px"
              letterSpacing="-0.2px"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 12px 32px rgba(236,72,153,0.38)",
              }}
              _active={{ transform: "translateY(0px)" }}
              transition="all 0.18s ease"
              onClick={handleStart}
            >
              Start Analysis
            </Button>

            <Text
              fontSize="12px"
              fontWeight="500"
              color="fg.muted"
              textAlign="center"
              mt="12px"
            >
              Free · 3 minutes · No sign-up required
            </Text>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
