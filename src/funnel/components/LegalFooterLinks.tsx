"use client";

import Link from "next/link";

import { Text, type TextProps } from "@chakra-ui/react";

export function LegalFooterLinks(props: TextProps) {
  return (
    <Text
      fontSize="11px"
      fontWeight="500"
      color="fg.muted"
      textAlign="center"
      {...props}
    >
      <Link
        href="/terms"
        style={{ color: "#746476" }}
      >
        Terms of use
      </Link>
      {" · "}
      <Link
        href="/privacy"
        style={{ color: "#746476" }}
      >
        Privacy policy
      </Link>
    </Text>
  );
}
