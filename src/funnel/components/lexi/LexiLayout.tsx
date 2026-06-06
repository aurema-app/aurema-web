"use client";

import { Box } from "@chakra-ui/react";

import { FUNNEL_STEP_TOP_PADDING } from "@/funnel/theme/layout.constants";

/**
 * Shared page wrapper for all Lexi funnel screens.
 * Light lavender-white background, single-column centered layout.
 */
export function LexiLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      minH="100dvh"
      bg="bg.canvas"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        w="full"
        maxW="420px"
        flex="1"
        display="flex"
        flexDirection="column"
        px={5}
        pt={FUNNEL_STEP_TOP_PADDING}
        pb={10}
      >
        {children}
      </Box>
    </Box>
  );
}
