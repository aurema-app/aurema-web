"use client";

import { Box, type BoxProps } from "@chakra-ui/react";

export function LexiStepScroll({ children, ...rest }: BoxProps) {
  return (
    <Box
      flex="1"
      overflowY="auto"
      overflowX="hidden"
      minH={0}
      css={{
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}
