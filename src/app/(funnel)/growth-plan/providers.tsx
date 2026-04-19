"use client";

import { ChakraProvider } from "@chakra-ui/react";

import { chakraSystem } from "@/funnel/theme/chakraTheme";

export function FunnelProviders({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={chakraSystem}>{children}</ChakraProvider>;
}
