"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

type AutoLoadingBarProps = {
  durationMs?: number;
  onComplete: () => void;
  label?: string;
};

const TICK_MS = 40;

export function AutoLoadingBar({
  durationMs = 4000,
  onComplete,
  label,
}: AutoLoadingBarProps) {
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const totalTicks = durationMs / TICK_MS;
    const increment = 100 / totalTicks;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + increment, 100);
        if (next >= 100 && !completedRef.current) {
          completedRef.current = true;
          clearInterval(interval);
          // defer to avoid state update during render
          setTimeout(onComplete, 0);
        }
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  const displayPct = Math.round(progress);

  return (
    <Box w="full">
      {label !== undefined && (
        <Flex justify="space-between" mb={2}>
          <Text fontFamily="body" fontSize="sm" color="fg.default">
            {label}
          </Text>
          <Text fontFamily="body" fontSize="sm" color="fg.muted">
            {displayPct}%
          </Text>
        </Flex>
      )}
      <Box
        h="6px"
        w="full"
        bg="whiteAlpha.200"
        borderRadius="full"
        overflow="hidden"
      >
        <Box
          h="full"
          w={`${progress}%`}
          bg="brand.primary"
          borderRadius="full"
          transition={`width ${TICK_MS}ms linear`}
        />
      </Box>
    </Box>
  );
}
