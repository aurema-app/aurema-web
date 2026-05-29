import { redirect } from "next/navigation";

import { flow } from "@/funnel/flow/flow";

export default function GrowthPlanPage() {
  redirect(`/growth-plan/${flow[0].id}`);
}
