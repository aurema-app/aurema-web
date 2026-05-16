import type { Metadata } from "next";

import { FunnelProviders } from "./providers";

export const metadata: Metadata = {
  title: "Aurema — Your growth plan",
};

export default function GrowthPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FunnelProviders>{children}</FunnelProviders>;
}
