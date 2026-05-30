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
      <Link href="/terms" style={{ textDecoration: "underline" }}>
        Terms of use
      </Link>
      {" · "}
      <Link href="/privacy" style={{ textDecoration: "underline" }}>
        Privacy policy
      </Link>
    </Text>
  );
}
