"use client";

import { useEffect, useRef, useState } from "react";

import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track, EVENTS } from "@/funnel/analytics/track";

import { LexiLayout } from "@/funnel/components/lexi/LexiLayout";
import { LexiTopBar } from "@/funnel/components/lexi/LexiTopBar";
import { LexiAvatar } from "@/funnel/components/lexi/LexiAvatar";

const PROOF_CARDS = [
  "Someone just realized 'he's just busy' was actually a lie.",
  "A girl in New York just deleted his contact info. (Proud of her).",
  "Some survived. Some went back. We don't judge.",
] as const;

const START_COUNT = 3_482;

function useAnimatedCounter(target: number, duration = 1200) {
  const [value, setValue] = useState(target - 80);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = Date.now();
    const from = target - 80;

    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

export function SocialProofStep() {
  const { goNext } = useFunnelNavigation();
  const count = useAnimatedCounter(START_COUNT);

  const handleCta = () => {
    track(EVENTS.STEP_EXIT, { step: "social-proof" });
    goNext();
  };

  return (
    <LexiLayout>
      <LexiTopBar showProgress={false} />

      <Box flex="1" display="flex" flexDirection="column" gap={5}>
        {/* Mascot */}
        <Box textAlign="center">
          <LexiAvatar mood="tapping" size="md" />
        </Box>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Text
            fontFamily="body"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="800"
            color="fg.default"
            lineHeight="1.25"
            letterSpacing="-0.5px"
          >
            You aren&rsquo;t the only one looping today.
          </Text>
        </motion.div>

        {/* Live counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          <Box
            bg="lexi.lavenderLight"
            borderRadius="2xl"
            px={5}
            py={4}
            textAlign="center"
          >
            <Text
              fontFamily="body"
              fontSize="4xl"
              fontWeight="900"
              color="brand.secondary"
              letterSpacing="-1px"
            >
              {count.toLocaleString()}
            </Text>
            <Text fontSize="sm" color="fg.muted" fontWeight="600" mt={1}>
              situationships decoded today
            </Text>
          </Box>
        </motion.div>

        {/* Stacking notification cards */}
        <VStack gap={3} align="stretch">
          {PROOF_CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
            >
              <Box
                bg="card.bg"
                borderRadius="2xl"
                px={4}
                py={3}
                border="1.5px solid"
                borderColor="border.light"
                boxShadow="0 2px 12px rgba(0,0,0,0.05)"
                display="flex"
                gap={3}
                alignItems="flex-start"
              >
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg="brand.primary"
                  mt="5px"
                  flexShrink={0}
                />
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="fg.default"
                  lineHeight="1.5"
                >
                  {card}
                </Text>
              </Box>
            </motion.div>
          ))}
        </VStack>

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
          onClick={handleCta}
          mt="auto"
        >
          See Where You Stand
        </Button>
      </Box>
    </LexiLayout>
  );
}
