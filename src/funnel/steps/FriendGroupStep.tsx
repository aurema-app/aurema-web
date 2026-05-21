"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { LexiSaysCard } from "@/funnel/components/lexi/LexiSaysCard";
import { QuizOptionButton } from "@/funnel/components/lexi/QuizOptionButton";
import { setAmplitudeUserProperties } from "@/funnel/analytics/amplitudeClient";
import { EVENTS, track } from "@/funnel/analytics/track";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";

const SURFACE = "#F6F2FF";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, delay, ease: "easeOut" as const },
});

const OPTIONS = [
  {
    id: "yes",
    emoji: "🙈",
    label: "Yes, I make up excuses for them",
    feedback:
      "The lawyer who never gets paid. You're working overtime defending someone who didn't even ask for a case.",
  },
  {
    id: "once",
    emoji: "👌",
    label: "I've done it once or twice",
    feedback:
      "Once or twice is just human. The question is whether you believed the excuses or just needed your friends to.",
  },
  {
    id: "never",
    emoji: "🤘",
    label: "Never, my friends know everything",
    feedback:
      "That kind of honesty with your friends is rare. Now try being that honest with yourself about it.",
  },
] as const;

export function FriendGroupStep() {
  const [selected, setSelected] = useState<string | null>(null);
  const { setAnswer } = useFunnelAnswers();
  const { goNext } = useFunnelNavigation();

  const selectedOption = OPTIONS.find((o) => o.id === selected);

  const handleSelect = (id: string) => {
    if (selected) return;

    setSelected(id);
    setAnswer("friendGroup", id);
    track(EVENTS.ANSWER_SELECTED, { step: "friend_group", value: id });
    setAmplitudeUserProperties({ friend_group: id });
  };

  const handleContinue = () => {
    track(EVENTS.STEP_EXIT, { step: "friend-group" });
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
        px={4}
        pt="max(24px, env(safe-area-inset-top))"
        pb="max(16px, env(safe-area-inset-bottom))"
      >
        <VStack w="full" align="center" gap={0} flexShrink={0} pt={2}>
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

          <motion.div
            {...fadeUp(0.08)}
            style={{ width: "100%", marginTop: "20px" }}
          >
            <Text
              fontFamily="body"
              fontSize="24px"
              fontWeight="800"
              lineHeight="1.2"
              letterSpacing="-0.3px"
              color="fg.default"
              textAlign="center"
            >
              Have you ever actively defended their low effort to your best
              friends?
            </Text>
          </motion.div>
        </VStack>

        <Box
          flex="1"
          w="full"
          overflowY="auto"
          overflowX="hidden"
          minH={0}
          css={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box
            minH="full"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
          >
            <motion.div {...fadeUp(0.14)} style={{ width: "100%" }}>
              <VStack gap={2.5} w="full" align="stretch">
                {OPTIONS.map((opt) => (
                  <QuizOptionButton
                    key={opt.id}
                    emoji={opt.emoji}
                    label={opt.label}
                    selected={selected === opt.id}
                    onClick={() => handleSelect(opt.id)}
                  />
                ))}
              </VStack>

              {selectedOption && (
                <>
                  <LexiSaysCard text={selectedOption.feedback} />
                  <Button
                    bg="brand.primary"
                    color="white"
                    borderRadius="full"
                    h="56px"
                    w="full"
                    fontFamily="display"
                    fontWeight="700"
                    fontSize="17px"
                    mt={4}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 32px rgba(236,72,153,0.38)",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    transition="all 0.18s ease"
                    onClick={handleContinue}
                  >
                    Next Scan
                  </Button>
                </>
              )}
            </motion.div>
          </Box>
        </Box>

        <Text
          fontSize="11px"
          fontWeight="500"
          color="fg.muted"
          textAlign="center"
          flexShrink={0}
          mt={2}
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
