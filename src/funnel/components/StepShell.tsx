"use client";

import { useEffect } from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";

import { FunnelHeader } from "@/funnel/components/FunnelHeader";
import { ProgressBar } from "@/funnel/components/ProgressBar";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track } from "@/funnel/analytics/track";

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
  const { currentStep } = useFunnelNavigation();

  useEffect(() => {
    if (currentStep?.id) {
      track("step_view", { stepId: currentStep.id });
    }
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
