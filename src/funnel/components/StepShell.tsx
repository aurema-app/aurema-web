"use client";

import { useEffect, useRef } from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";

import { FunnelHeader } from "@/funnel/components/FunnelHeader";
import { ProgressBar } from "@/funnel/components/ProgressBar";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { EVENTS, track } from "@/funnel/analytics/track";

type StepShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  hideProgress?: boolean;
};

export function StepShell({
  title,
  subtitle,
  children,
  footer,
  hideProgress = false,
}: StepShellProps) {
  const { currentStep, currentIndex, totalVisible } = useFunnelNavigation();
  const mountTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!currentStep?.id) return;

    mountTimeRef.current = Date.now();

    track(EVENTS.STEP_VIEW, {
      step_id: currentStep.id,
      // 1-based so dashboard queries read naturally.
      step_index: currentIndex + 1,
      total_steps: totalVisible,
      funnel_progress_pct: Math.round(
        ((currentIndex + 1) / totalVisible) * 100,
      ),
    });

    return () => {
      const timeSpentMs = Date.now() - mountTimeRef.current;
      track(EVENTS.STEP_EXIT, {
        step_id: currentStep.id,
        time_spent_ms: timeSpentMs,
        // Integer seconds — easier to read in dashboard tables.
        time_spent_s: Math.round(timeSpentMs / 1000),
      });
    };
    // Re-run only when the step changes, not on every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep?.id]);

  return (
    <Box minH="100vh" bg="bg.canvas" display="flex" flexDirection="column">
      <FunnelHeader />

      {!hideProgress && <ProgressBar />}

      <Box flex="1" px={4} pb={6} maxW="sm" w="full" mx="auto">
        <Heading
          as="h1"
          fontFamily="heading"
          color="fg.default"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          mb={subtitle ? 2 : 6}
          lineHeight="1.2"
        >
          {title}
        </Heading>

        {subtitle && (
          <Text
            fontFamily="body"
            color="fg.muted"
            fontSize="sm"
            fontWeight="500"
            mb={6}
          >
            {subtitle}
          </Text>
        )}

        <VStack gap={3} align="stretch">
          {children}
        </VStack>
      </Box>

      {footer && (
        <Box px={4} pb={8} maxW="sm" w="full" mx="auto">
          {footer}
        </Box>
      )}
    </Box>
  );
}
