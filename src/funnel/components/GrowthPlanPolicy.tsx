"use client";

import { Text } from "@chakra-ui/react";

export function GrowthPlanPolicy() {
  return (
    <Text
      fontFamily="body"
      fontSize="xs"
      color="fg.muted"
      textAlign="center"
      lineHeight="1.5"
    >
      By continuing you agree to Aurema&apos;s{" "}
      <Text
        as="a"
        href="/terms"
        target="_blank"
        rel="noopener noreferrer"
        textDecoration="underline"
        _hover={{ color: "fg.default" }}
      >
        Terms of Service
      </Text>{" "}
      and{" "}
      <Text
        as="a"
        href="/privacy"
        target="_blank"
        rel="noopener noreferrer"
        textDecoration="underline"
        _hover={{ color: "fg.default" }}
      >
        Privacy Policy
      </Text>
      . Subscription renews automatically. Cancel any time.
    </Text>
  );
}
