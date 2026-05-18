"use client";

import Image from "next/image";
import Link from "next/link";

import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

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
        bg={SURFACE}
        px={5}
        pt={8}
        pb={6}
      >
        <VStack gap={5} w="full" align="center" flex="1">
          {/* Logo */}
          <motion.div {...fadeUp(0)}>
            <Box position="relative" h="40px" w="96px">
              <Image
                src="/lexi/logo.png"
                alt="Lexi"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </Box>
          </motion.div>

          {/* Headline */}
          <motion.div {...fadeUp(0.06)} style={{ width: "100%" }}>
            <Text
              fontFamily="display"
              fontSize={{ base: "32px", sm: "36px" }}
              fontWeight="800"
              lineHeight="1.15"
              letterSpacing="-0.5px"
              color="fg.default"
              textAlign="center"
            >
              You aren&rsquo;t the only one looping
            </Text>
          </motion.div>

          {/* Social proof box */}
          <motion.div {...fadeUp(0.12)} style={{ width: "100%" }}>
            <Box
              w="full"
              border="1.5px solid"
              borderColor="lexi.lavender"
              borderRadius="xl"
              px={5}
              py={5}
              textAlign="center"
            >
              <Text
                fontFamily="display"
                fontSize={{ base: "36px", sm: "40px" }}
                fontWeight="900"
                color="brand.primary"
                lineHeight="1"
                letterSpacing="-1px"
              >
                17k+ women
              </Text>
              <Text
                fontFamily="body"
                fontSize="sm"
                fontWeight="600"
                color="fg.default"
                mt={2}
              >
                already get help from{" "}
                <Text as="span" fontWeight="800" color="brand.primary">
                  Lexi
                </Text>
              </Text>
            </Box>
          </motion.div>

          {/* Testimonial cards */}
          <VStack gap={3} w="full" align="stretch">
            {TESTIMONIALS.map((card, i) => (
              <motion.div
                key={card.handle}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2 + i * 0.1,
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

        {/* CTA + footer */}
        <Box w="full" mt={6}>
          <motion.div {...fadeUp(0.5)}>
            <Button
              bg="brand.primary"
              color="white"
              borderRadius="full"
              h="64px"
              w="full"
              fontFamily="display"
              fontWeight="700"
              fontSize="18px"
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
          </motion.div>

          <Text
            fontSize="11px"
            fontWeight="500"
            color="fg.muted"
            textAlign="center"
            mt={4}
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
    </Box>
  );
}
