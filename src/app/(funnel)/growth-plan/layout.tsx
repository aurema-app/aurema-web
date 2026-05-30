import { FunnelProviders } from "./providers";
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
