"use client";

import Image from "next/image";

import { Box, type BoxProps } from "@chakra-ui/react";

const LOGO_SRC = "/lexi/logo-banner.svg";

/** Intrinsic dimensions of logo-banner.svg */
const ASPECT_RATIO = 76 / 45;

const SIZES = {
  sm: { h: 14, w: Math.round(14 * ASPECT_RATIO) },
  md: { h: 36, w: Math.round(36 * ASPECT_RATIO) },
  lg: { h: 40, w: Math.round(40 * ASPECT_RATIO) },
} as const;

type LexiLogoBannerProps = BoxProps & {
  size?: keyof typeof SIZES;
  priority?: boolean;
  objectPosition?: string;
};

export function LexiLogoBanner({
  size = "md",
  priority = true,
  objectPosition = "center",
  ...boxProps
}: LexiLogoBannerProps) {
  const { h, w } = SIZES[size];

  return (
    <Box position="relative" h={`${h}px`} w={`${w}px`} {...boxProps}>
      <Image
        src={LOGO_SRC}
        alt="Lexi"
        fill
        style={{ objectFit: "contain", objectPosition }}
        priority={priority}
      />
    </Box>
  );
}
