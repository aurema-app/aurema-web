"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner, VStack } from "@chakra-ui/react";

// The paywall is now a dedicated page at /growth-plan/paywall (Phase 6).
// This step component exists only to satisfy the flow.ts registry and redirect
// any client navigating via goNext() from the sign-in step.
export function PaywallStep() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/growth-plan/paywall");
  }, [router]);

  return (
    <VStack minH="100vh" align="center" justify="center">
      <Spinner size="lg" color="brand.primary" />
    </VStack>
  );
}
