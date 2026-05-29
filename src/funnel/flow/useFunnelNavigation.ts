"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

import { flow } from "@/funnel/flow/flow";
import { useFunnelContext } from "@/funnel/state/FunnelContext";

function visibleSteps(answers: ReturnType<typeof useFunnelContext>["answers"]) {
  return flow.filter((step) => (step.when ? step.when(answers) : true));
}

export function useFunnelNavigation() {
  const router = useRouter();
  const params = useParams();
  const { answers } = useFunnelContext();

  const stepId = typeof params?.stepId === "string" ? params.stepId : "";
  const visible = visibleSteps(answers);
  const currentIndex = visible.findIndex((s) => s.id === stepId);
  const totalVisible = visible.length;
  const currentStep = visible[currentIndex] ?? null;

  const goNext = useCallback(() => {
    if (currentIndex === -1) return;
    const next = visible[currentIndex + 1];
    if (!next) {
      // Phase 3 wires the terminal step (generating). No-op for now.
      return;
    }
    router.push(`/growth-plan/${next.id}`);
  }, [currentIndex, visible, router]);

  const goPrev = useCallback(() => {
    if (currentIndex <= 0) return;
    const prev = visible[currentIndex - 1];
    if (!prev) return;
    router.push(`/growth-plan/${prev.id}`);
  }, [currentIndex, visible, router]);

  return { goNext, goPrev, currentIndex, totalVisible, currentStep };
}
