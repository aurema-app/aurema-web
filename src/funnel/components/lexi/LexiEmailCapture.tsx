"use client";

import { useState } from "react";

import Image from "next/image";

import { Box, Button, IconButton, Input, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { ProgressBar } from "@/funnel/components/ProgressBar";

const SURFACE = "#F6F2FF";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, delay, ease: "easeOut" as const },
});

const BackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 18l-6-6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type LexiEmailCaptureProps = {
  initialEmail?: string;
  onContinue: (email: string) => void;
  onBack?: () => void;
  showBack?: boolean;
  showProgress?: boolean;
};

export function LexiEmailCapture({
  initialEmail = "",
  onContinue,
  onBack,
  showBack = false,
  showProgress = true,
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
        pt="max(24px, env(safe-area-inset-top))"
        pb="max(20px, env(safe-area-inset-bottom))"
      >
        <Box position="relative" flexShrink={0} mb={4}>
          {showBack && onBack && (
            <IconButton
              aria-label="Go back"
              variant="ghost"
              color="fg.muted"
              size="sm"
              position="absolute"
              left={0}
              top="50%"
              transform="translateY(-50%)"
              onClick={onBack}
              _hover={{ bg: "transparent", color: "fg.default" }}
            >
              <BackIcon />
            </IconButton>
          )}

          <Box mx="auto" position="relative" h="36px" w="88px">
            <Image
              src="/lexi/logo.png"
              alt="Lexi"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </Box>
        </Box>

        {showProgress && (
          <Box flexShrink={0} mb={8}>
            <ProgressBar />
          </Box>
        )}

        <VStack flex="1" align="stretch" justify="flex-start" gap={8} w="full">
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
                Enter your email to create your personal account and track your
                progress
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

        <motion.div {...fadeUp(0.2)}>
          <Button
            bg="brand.primary"
            color="white"
            borderRadius="full"
            h="56px"
            w="full"
            fontFamily="display"
            fontWeight="700"
            fontSize="17px"
            disabled={!isValid}
            onClick={handleContinue}
            _hover={{
              transform: isValid ? "translateY(-2px)" : undefined,
              boxShadow: isValid
                ? "0 12px 32px rgba(236,72,153,0.38)"
                : undefined,
            }}
            _active={{ transform: "translateY(0)" }}
            _disabled={{ opacity: 0.45, cursor: "not-allowed" }}
            transition="all 0.18s ease"
          >
            Continue
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
}
