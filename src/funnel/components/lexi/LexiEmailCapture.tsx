"use client";

import { useState } from "react";

import { Box, Input, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { LegalFooterLinks } from "@/funnel/components/LegalFooterLinks";
import { LexiLogoBanner } from "@/funnel/components/lexi/LexiLogoBanner";
import { LexiCtaButton } from "@/funnel/components/lexi/LexiCtaButton";
import { FUNNEL_STEP_TOP_PADDING } from "@/funnel/theme/layout.constants";

const SURFACE = "#F6F2FF";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, delay, ease: "easeOut" as const },
});

type LexiEmailCaptureProps = {
  initialEmail?: string;
  onContinue: (email: string) => void;
};

export function LexiEmailCapture({
  initialEmail = "",
  onContinue,
}: LexiEmailCaptureProps) {
  const [value, setValue] = useState(initialEmail);
  const [touched, setTouched] = useState(false);

  const trimmed = value.trim();
  const isValid = EMAIL_RE.test(trimmed);
  const showError = touched && trimmed.length > 0 && !isValid;

  const handleContinue = () => {
    if (!isValid) {
      setTouched(true);
      return;
    }
    onContinue(trimmed);
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
        <Box
          flex="1"
          overflowY="auto"
          overflowX="hidden"
          minH={0}
          px={5}
          pb={3}
          css={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box position="relative" mb={4}>
            <LexiLogoBanner mx="auto" />
          </Box>

          <VStack align="stretch" gap={8} w="full">
            <motion.div {...fadeUp(0.06)}>
              <VStack align="stretch" gap={3}>
                <Text
                  fontFamily="body"
                  fontSize={{ base: "22px", sm: "24px" }}
                  fontWeight="800"
                  lineHeight="1.25"
                  letterSpacing="-0.3px"
                  color="fg.default"
                  textAlign="left"
                >
                  Enter your email to create your personal account and track
                  your progress
                </Text>
                <Text
                  fontFamily="body"
                  fontSize="14px"
                  fontStyle="italic"
                  fontWeight="500"
                  lineHeight="1.45"
                  color="fg.muted"
                >
                  We&apos;ll never spam you or share your email
                </Text>
              </VStack>
            </motion.div>

            <motion.div {...fadeUp(0.14)}>
              <VStack align="stretch" gap={2}>
                <Input
                  type="email"
                  placeholder="example@gmail.com"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onBlur={() => setTouched(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isValid) handleContinue();
                  }}
                  size="lg"
                  h="56px"
                  borderRadius="16px"
                  fontFamily="body"
                  fontSize="16px"
                  fontWeight="500"
                  bg="white"
                  border="1px solid"
                  borderColor={showError ? "red.400" : "#E4DBFE"}
                  color="fg.default"
                  _placeholder={{ color: "#B8A8C4" }}
                  _focus={{
                    borderColor: "brand.primary",
                    boxShadow: "0 0 0 3px rgba(236, 72, 153, 0.15)",
                  }}
                  autoComplete="email"
                  inputMode="email"
                  aria-label="Email address"
                />
                {showError && (
                  <Text fontFamily="body" fontSize="sm" color="red.500">
                    Please enter a valid email address.
                  </Text>
                )}
              </VStack>
            </motion.div>
          </VStack>
        </Box>

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
          <LexiCtaButton
            disabled={!isValid}
            onClick={handleContinue}
            _disabled={{ opacity: 0.45, cursor: "not-allowed" }}
          >
            Continue
          </LexiCtaButton>

          <LegalFooterLinks mt={3} />
        </Box>
      </Box>
    </Box>
  );
}
