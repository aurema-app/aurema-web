"use client";

import Link from "next/link";

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
      By continuing you agree to Lexi&apos;s{" "}
      <Link
        href="/terms"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "underline" }}
      >
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link
        href="/privacy"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "underline" }}
      >
        Privacy Policy
      </Link>
      . Subscription renews automatically. Cancel any time.
    </Text>
  );
}
