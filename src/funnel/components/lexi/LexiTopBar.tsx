"use client";

import { Box, Text } from "@chakra-ui/react";

import { ProgressBar } from "@/funnel/components/ProgressBar";

export function LexiTopBar({
  showProgress = true,
}: {
  showProgress?: boolean;
}) {
  return (
    <Box mb={6}>
      {/* Lexi wordmark */}
      <Text
        fontFamily="heading"
        fontSize="2xl"
        fontWeight="800"
        color="fg.default"
        textAlign="center"
        letterSpacing="-0.5px"
        mb={showProgress ? 4 : 0}
      >
        Lexi
        <Text as="span" color="brand.primary" fontSize="xl" ml="1px">
          ♥
        </Text>
      </Text>

      {showProgress && <ProgressBar />}
    </Box>
  );
}
