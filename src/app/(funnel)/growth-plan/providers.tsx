"use client";

import { ChakraProvider } from "@chakra-ui/react";

import { FunnelProvider } from "@/funnel/state/FunnelContext";
import { chakraSystem } from "@/funnel/theme/chakraTheme";

export function FunnelProviders({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={chakraSystem}>
      <FunnelProvider>{children}</FunnelProvider>
    </ChakraProvider>
  );
}
