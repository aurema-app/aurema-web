"use client";

import { Box, Text, type BoxProps } from "@chakra-ui/react";

import { LegalFooterLinks } from "@/funnel/components/LegalFooterLinks";
import { FUNNEL_CTA_FOOTER_PB } from "@/funnel/theme/layout.constants";

type LexiCtaFooterProps = BoxProps & {
  caption?: React.ReactNode;
  showLegalLinks?: boolean;
  legalLinksMt?: number | string;
};

export function LexiCtaFooter({
  children,
  caption,
  showLegalLinks = false,
  legalLinksMt,
  px = 5,
  pt = 3,
  ...rest
}: LexiCtaFooterProps) {
  const hasAction = Boolean(children);
  const linksMargin = legalLinksMt ?? (hasAction || caption ? 3 : 0);

  return (
    <Box position="relative" flexShrink={0} w="full">
      <Box
        position="absolute"
        top="-20px"
        left={0}
        right={0}
        h="20px"
        pointerEvents="none"
        zIndex={1}
        css={{
          background:
            "linear-gradient(to top, var(--chakra-colors-lexi-surface), transparent)",
        }}
      />
      <Box
        flexShrink={0}
        w="full"
        px={px}
        // pt={pt}
        pb={FUNNEL_CTA_FOOTER_PB}
        bg="bg.canvas"
        {...rest}
      >
        {children}
        {caption != null && caption !== false && (
          <Text
            fontSize="12px"
            fontWeight="500"
            color="fg.muted"
            textAlign="center"
            mt={hasAction ? "12px" : 0}
          >
            {caption}
          </Text>
        )}
        {showLegalLinks && <LegalFooterLinks mt={linksMargin} />}
      </Box>
    </Box>
  );
}
