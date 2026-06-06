"use client";

import { Box, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { LexiCtaButton } from "@/funnel/components/lexi/LexiCtaButton";
import { LexiCtaFooter } from "@/funnel/components/lexi/LexiCtaFooter";
import { LexiLogoBanner } from "@/funnel/components/lexi/LexiLogoBanner";
import { LexiStepScroll } from "@/funnel/components/lexi/LexiStepScroll";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track, EVENTS } from "@/funnel/analytics/track";
import { TestimonialCard } from "@/funnel/components/lexi/TestimonialCard";
import { FUNNEL_STEP_TOP_PADDING } from "@/funnel/theme/layout.constants";

const SURFACE = "#F6F2FF";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, delay, ease: "easeOut" as const },
});

const TESTIMONIALS = [
  {
    avatar: "/lexi/avatar-1.png",
    title: "I feel exposed 😅",
    handle: "@itsmariah.xo",
    body: "I pasted two weeks of texts and Lexi said 'bestie he's not confused, he's just keeping you on the bench.' I wasn't ready for that answer. I sat with my phone for like five minutes. Then I archived the chat.",
  },
  {
    avatar: "/lexi/avatar-2.png",
    title: "I wasn't ready for this answer tbh",
    handle: "@ana.knowsbetter",
    body: "I'd been rereading his dry texts for the 50th time when Lexi said 'you're not decoding signals, you're writing fanfiction.' I actually laughed. Then I cried a little. Then I blocked him. 😂",
  },
  {
    avatar: "/lexi/avatar-3.png",
    title: "Okay this actually works.",
    handle: "@notyourtype_",
    body: "I thought it was just another cute app. I pasted 3 months of on-and-off texts and she called my exact pattern in one voice note. 'You keep giving second chances to someone who keeps making the same first mistake.' Had to put my phone down for a moment.",
  },
] as const;

export function SocialProofStep() {
  const { goNext } = useFunnelNavigation();

  const handleCta = () => {
    track(EVENTS.STEP_EXIT, { step: "social-proof" });
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
        <LexiStepScroll px={4} pb={3}>
          <VStack gap={{ base: 3, sm: 4 }} w="full" align="center" pb={2}>
            <motion.div {...fadeUp(0)}>
              <LexiLogoBanner />
            </motion.div>

            <motion.div {...fadeUp(0.06)} style={{ width: "100%" }}>
              <Text
                fontFamily="body"
                fontSize="24px"
                fontWeight="800"
                lineHeight="1.2"
                letterSpacing="-0.3px"
                color="fg.default"
                textAlign="center"
              >
                You aren&rsquo;t the
                <br />
                only one looping
              </Text>
            </motion.div>

            <motion.div {...fadeUp(0.12)} style={{ width: "100%" }}>
              <Box
                w="full"
                border="1.5px solid"
                borderColor="lexi.lavender"
                borderRadius="xl"
                px={4}
                py={4}
                textAlign="center"
              >
                <Text
                  fontFamily="body"
                  fontSize="36px"
                  fontWeight="700"
                  color="brand.primary"
                  lineHeight="1.1"
                  letterSpacing="-0.5px"
                >
                  17k+ women
                </Text>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={1}
                  mt={1.5}
                  flexWrap="wrap"
                >
                  <Text
                    fontFamily="body"
                    fontSize="12px"
                    fontWeight="400"
                    color="fg.default"
                  >
                    already get help from
                  </Text>
                  <LexiLogoBanner
                    size="sm"
                    flexShrink={0}
                    objectPosition="left center"
                  />
                </Box>
              </Box>
            </motion.div>

            <VStack gap={2.5} w="full" align="stretch">
              {TESTIMONIALS.map((card, i) => (
                <motion.div
                  key={card.handle}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.15 + i * 0.08,
                    ease: "easeOut",
                  }}
                >
                  <TestimonialCard
                    avatarSrc={card.avatar}
                    title={card.title}
                    handle={card.handle}
                    body={card.body}
                  />
                </motion.div>
              ))}
            </VStack>
          </VStack>
        </LexiStepScroll>

        <LexiCtaFooter px={4}>
          <LexiCtaButton h={{ base: "56px", sm: "60px" }} onClick={handleCta}>
            See where you stand
          </LexiCtaButton>
        </LexiCtaFooter>
      </Box>
    </Box>
  );
}
