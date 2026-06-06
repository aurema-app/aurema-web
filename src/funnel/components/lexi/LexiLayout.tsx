"use client";

import { Box } from "@chakra-ui/react";

import { LexiStepScroll } from "@/funnel/components/lexi/LexiStepScroll";
import { FUNNEL_STEP_TOP_PADDING } from "@/funnel/theme/layout.constants";

type LexiLayoutProps = {
  children: React.ReactNode;
  footer?: React.ReactNode;
};

/**
 * Shared page wrapper for Lexi funnel screens — scrollable body, optional pinned footer.
 */
export function LexiLayout({ children, footer }: LexiLayoutProps) {
  return (
    <Box
      h="100dvh"
      maxH="100dvh"
      w="full"
      bg="bg.canvas"
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
        pt={FUNNEL_STEP_TOP_PADDING}
      >
        <LexiStepScroll px={5}>{children}</LexiStepScroll>
        {footer}
      </Box>
    </Box>
  );
}
