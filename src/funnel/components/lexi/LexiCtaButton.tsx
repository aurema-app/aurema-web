"use client";

import { Button, type ButtonProps } from "@chakra-ui/react";

const HOVER_SHADOW = "0 12px 32px rgba(236,72,153,0.38)";

const CTA_SIZES = {
  md: { h: "48px", fontSize: "16px" },
  lg: { h: "54px", fontSize: "20px", letterSpacing: "-0.2px" },
} as const;

type LexiCtaButtonProps = ButtonProps & {
  ctaSize?: keyof typeof CTA_SIZES;
};

export function LexiCtaButton({
  ctaSize = "md",
  disabled,
  children,
  _hover,
  _active,
  _disabled,
  transition = "all 0.18s ease",
  ...rest
}: LexiCtaButtonProps) {
  const sizeStyles = CTA_SIZES[ctaSize];

  return (
    <Button
      bg="brand.primary"
      color="white"
      borderRadius="full"
      w="full"
      fontFamily="display"
      fontWeight="700"
      transition={transition}
      {...sizeStyles}
      {...rest}
      disabled={disabled}
      _hover={
        _hover ??
        (disabled
          ? undefined
          : {
              transform: "translateY(-2px)",
              boxShadow: HOVER_SHADOW,
            })
      }
      _active={_active ?? { transform: "translateY(0)" }}
      _disabled={_disabled ?? { opacity: 0.6, cursor: "not-allowed" }}
    >
      {children}
    </Button>
  );
}
