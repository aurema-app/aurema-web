import type { Metadata } from "next";

import { FunnelProviders } from "./providers";

export const metadata: Metadata = {
  title: "Lexi — Your situationship read",
};

export default function GrowthPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="lexi-funnel-root"
      style={{
        minHeight: "100dvh",
        width: "100%",
        backgroundColor: "#F6F2FF",
      }}
    >
      <FunnelProviders>{children}</FunnelProviders>
    </div>
  );
}
