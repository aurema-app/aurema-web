"use client";

import Image from "next/image";

import { Box, Button, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track, EVENTS } from "@/funnel/analytics/track";

export function LandingStep() {
  const { goNext } = useFunnelNavigation();

  const handleStart = () => {
    track(EVENTS.STEP_EXIT, { step: "landing" });
    goNext();
  };

  return (
    <Box
      minH="100dvh"
      bg="bg.canvas"
      display="flex"
      flexDirection="column"
      alignItems="center"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative lavender blob */}
      <Box
        position="absolute"
        top="-80px"
        left="-60px"
        w="280px"
        h="280px"
        borderRadius="full"
        bg="lexi.lavenderLight"
        opacity="0.6"
        filter="blur(60px)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="100px"
        right="-80px"
        w="220px"
        h="220px"
        borderRadius="full"
        bg="lexi.pinkLight"
        opacity="0.5"
        filter="blur(50px)"
        pointerEvents="none"
      />

      <Box
        w="full"
        maxW="420px"
        flex="1"
        display="flex"
        flexDirection="column"
        px={5}
        pt={8}
        pb={10}
        zIndex={1}
      >
        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Text
            fontFamily="heading"
            fontSize="3xl"
            fontWeight="800"
            color="fg.default"
            textAlign="center"
            letterSpacing="-0.5px"
            mb={8}
          >
            Lexi
            <Text as="span" color="brand.primary" fontSize="2xl" ml="1px">
              ♥
            </Text>
          </Text>
        </motion.div>

        {/* Hero image — Lexi full body portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <Box
            position="relative"
            w="260px"
            h="340px"
            borderRadius="3xl"
            overflow="hidden"
            boxShadow="0 20px 60px rgba(199, 166, 247, 0.3)"
          >
            <Image
              src="/lexi/hero.png"
              alt="Lexi — your situationship advisor"
              fill
              style={{ objectFit: "cover", objectPosition: "center top" }}
              priority
            />
          </Box>
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{ textAlign: "center" }}
        >
          <Text
            fontFamily="body"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="800"
            color="fg.default"
            lineHeight="1.25"
            letterSpacing="-0.5px"
            mb={3}
          >
            You&rsquo;re not confused.{" "}
            <Text as="span" color="brand.primary">
              You&rsquo;re emotionally attached to mixed signals.
            </Text>
          </Text>

          <Text
            fontFamily="body"
            fontSize="sm"
            color="fg.muted"
            fontWeight="500"
            lineHeight="1.6"
            mb={8}
          >
            Lexi analyzes your talking stage patterns in 3 minutes. Let&rsquo;s
            get you some answers.
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{ marginTop: "auto" }}
        >
          <Button
            bg="brand.primary"
            color="white"
            borderRadius="full"
            py={7}
            w="full"
            fontFamily="body"
            fontWeight="700"
            fontSize="lg"
            letterSpacing="-0.2px"
            _hover={{
              bg: "lexi.pink",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 32px rgba(255,125,186,0.45)",
            }}
            _active={{ transform: "translateY(0)" }}
            transition="all 0.2s"
            onClick={handleStart}
          >
            Start Analysis
          </Button>

          <Text
            fontSize="xs"
            color="fg.muted"
            textAlign="center"
            mt={3}
            fontWeight="500"
          >
            Free · 3 minutes · No sign-up required
          </Text>
        </motion.div>
      </Box>
    </Box>
  );
}
