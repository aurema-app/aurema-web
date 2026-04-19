"use client";

import { Text } from "@chakra-ui/react";

import { StepShell } from "@/funnel/components/StepShell";

export function PaywallStep() {
  return (
    <StepShell
      title="Coming soon"
      subtitle="Your paywall will land in Phase 6."
      hideProgress
    >
      <Text fontFamily="body" fontSize="sm" color="fg.muted">
        RevenueCat Web Billing checkout will appear here.
      </Text>
    </StepShell>
  );
}
