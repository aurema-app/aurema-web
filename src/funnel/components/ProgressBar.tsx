"use client";

import { Box } from "@chakra-ui/react";

import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";

export function ProgressBar() {
  const { currentIndex, totalVisible } = useFunnelNavigation();

  const pct =
    totalVisible > 1
      ? Math.round(((currentIndex + 1) / totalVisible) * 100)
      : 0;

  return (
    <Box w="full" maxW="sm" mx="auto" px={4} mb={4}>
      <Box
        h="2px"
        w="full"
        bg="border.light"
        borderRadius="full"
        overflow="hidden"
      >
        <Box
          h="full"
          w={`${pct}%`}
          bg="brand.primary"
          borderRadius="full"
          transition="width 200ms linear"
        />
      </Box>
    </Box>
  );
}
