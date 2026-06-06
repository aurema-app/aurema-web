"use client";

import { useEffect } from "react";

import Link from "next/link";

import { Box, Button, Text, VStack } from "@chakra-ui/react";

import { EVENTS, track } from "@/funnel/analytics/track";

const SUPPORT_EMAIL = "support@aurema-app.com";

function ActivatePage() {
  useEffect(() => {
    track(EVENTS.PURCHASE_FAILED, { step: "activate", reason: "not_verified" });
  }, []);

  return (
    <Box
      minH="100vh"
      bg="bg.canvas"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box maxW="sm" w="full">
        <VStack gap={6} align="stretch">
          <Text
            fontFamily="heading"
            fontSize="2xl"
            fontWeight="bold"
            color="fg.default"
          >
            Payment didn&apos;t go through
          </Text>
          <Text fontFamily="body" fontSize="sm" color="fg.muted">
            We couldn&apos;t verify your subscription. Your card may not have
            been charged — try again, or use a different payment method.
          </Text>
          <Text fontFamily="body" fontSize="sm" color="fg.muted">
            If you believe you were charged, contact us at{" "}
            <Link
              href={`mailto:${SUPPORT_EMAIL}`}
              style={{ textDecoration: "underline" }}
            >
              {SUPPORT_EMAIL}
            </Link>
            .
          </Text>
          <Link href="/growth-plan/paywall">
            <Button
              fontFamily="body"
              fontWeight="700"
              bg="brand.primary"
              color="bg.canvas"
              size="lg"
              borderRadius="xl"
              _hover={{ opacity: 0.9 }}
              w="full"
            >
              Try again
            </Button>
          </Link>
        </VStack>
      </Box>
    </Box>
  );
}

export default ActivatePage;
