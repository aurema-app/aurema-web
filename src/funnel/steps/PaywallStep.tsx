"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner, VStack } from "@chakra-ui/react";

// The paywall is a dedicated page at /growth-plan/paywall.
// This step exists only to satisfy the flow registry and redirect goNext().
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
