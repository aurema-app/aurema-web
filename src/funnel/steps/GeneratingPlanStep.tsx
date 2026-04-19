"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";

import { StepShell } from "@/funnel/components/StepShell";
import { AutoLoadingBar } from "@/funnel/components/AutoLoadingBar";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";

const REASSURANCE_COPY = [
  "Analyzing your answers…",
  "Picking the right exercises…",
  "Personalizing for your goal…",
  "Almost there…",
];

const ROTATE_MS = 1200;
const DURATION_MS = 4000;

export function GeneratingPlanStep() {
  const { goNext } = useFunnelNavigation();
  const [copyIndex, setCopyIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCopyIndex((prev) => (prev + 1) % REASSURANCE_COPY.length);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = useCallback(() => {
    goNext();
  }, [goNext]);

  return (
    <StepShell title="Building your plan">
      <VStack gap={8} align="stretch" pt={4}>
        <Box minH="28px" textAlign="center">
          <Text
            fontFamily="body"
            fontSize="sm"
            color="fg.muted"
            transition="opacity 300ms ease"
          >
            {REASSURANCE_COPY[copyIndex]}
          </Text>
        </Box>

        <AutoLoadingBar
          durationMs={DURATION_MS}
          onComplete={handleComplete}
          label="Generating your plan"
        />
      </VStack>
    </StepShell>
  );
}
