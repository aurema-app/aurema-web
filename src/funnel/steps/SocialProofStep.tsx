"use client";

import Image from "next/image";

import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { LegalFooterLinks } from "@/funnel/components/LegalFooterLinks";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track, EVENTS } from "@/funnel/analytics/track";
import { TestimonialCard } from "@/funnel/components/lexi/TestimonialCard";

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
        pt="max(24px, env(safe-area-inset-top))"
      >
        {/* Scrollable content */}
        <Box
          flex="1"
          overflowY="auto"
          overflowX="hidden"
          px={4}
          pb={3}
          css={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <VStack gap={{ base: 3, sm: 4 }} w="full" align="center" pb={2}>
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
                  <Box position="relative" h="14px" w="44px" flexShrink={0}>
                    <Image
                      src="/lexi/logo.png"
                      alt="Lexi"
                      fill
                      style={{
                        objectFit: "contain",
                        objectPosition: "left center",
                      }}
                    />
                  </Box>
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
        </Box>

        {/* Pinned CTA + footer — always visible */}
        <Box
          flexShrink={0}
          w="full"
          px={4}
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
            h={{ base: "56px", sm: "60px" }}
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
            onClick={handleCta}
          >
            See where you stand
          </Button>

          <LegalFooterLinks mt={3} />
        </Box>
      </Box>
    </Box>
  );
}
