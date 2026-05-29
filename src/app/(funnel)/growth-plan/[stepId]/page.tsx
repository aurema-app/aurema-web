"use client";

import type { ComponentType } from "react";
import { useEffect, useRef } from "react";
import { notFound, useParams } from "next/navigation";

import { flow } from "@/funnel/flow/flow";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track, EVENTS } from "@/funnel/analytics/track";

// Lexi funnel steps
import { LandingStep } from "@/funnel/steps/LandingStep";
import { DecodingTargetStep } from "@/funnel/steps/DecodingTargetStep";
import { DemographicsStep } from "@/funnel/steps/DemographicsStep";
import { TimelineStep } from "@/funnel/steps/TimelineStep";
import { SocialProofStep } from "@/funnel/steps/SocialProofStep";
import { PeaceBreakerStep } from "@/funnel/steps/PeaceBreakerStep";
import { OverthinkingStep } from "@/funnel/steps/OverthinkingStep";
import { DigitalAnxietyStep } from "@/funnel/steps/DigitalAnxietyStep";
import { IntuitionStep } from "@/funnel/steps/IntuitionStep";
import { FriendGroupStep } from "@/funnel/steps/FriendGroupStep";
import { ProjectionStep } from "@/funnel/steps/ProjectionStep";
import { ReinforcementStep } from "@/funnel/steps/ReinforcementStep";
import { PatternDetectedStep } from "@/funnel/steps/PatternDetectedStep";
import { EvidenceStep } from "@/funnel/steps/EvidenceStep";
import { AnalyzingStep } from "@/funnel/steps/AnalyzingStep";
import { TeaserStep } from "@/funnel/steps/TeaserStep";

// Auth + paywall steps
import { EmailStep } from "@/funnel/steps/EmailStep";
import { SignInStep } from "@/funnel/steps/SignInStep";
import { PaywallStep } from "@/funnel/steps/PaywallStep";

const STEP_COMPONENTS: Record<string, ComponentType> = {
  landing: LandingStep,
  "decoding-target": DecodingTargetStep,
  demographics: DemographicsStep,
  timeline: TimelineStep,
  "social-proof": SocialProofStep,
  "peace-breaker": PeaceBreakerStep,
  overthinking: OverthinkingStep,
  "digital-anxiety": DigitalAnxietyStep,
  intuition: IntuitionStep,
  "friend-group": FriendGroupStep,
  projection: ProjectionStep,
  reinforcement: ReinforcementStep,
  "pattern-detected": PatternDetectedStep,
  evidence: EvidenceStep,
  analyzing: AnalyzingStep,
  teaser: TeaserStep,
  email: EmailStep,
  "sign-in": SignInStep,
  paywall: PaywallStep,
};

/**
 * Fires step_view on mount and step_exit (with dwell time) on unmount.
 * Runs inside every step so tracking is centralized here rather than
 * repeated in each step component.
 */
function StepTracker({ stepId }: { stepId: string }) {
  const { currentIndex, totalVisible } = useFunnelNavigation();
  const enteredAt = useRef(Date.now());

  useEffect(() => {
    enteredAt.current = Date.now();

    track(EVENTS.STEP_VIEW, {
      step_id: stepId,
      step_index: currentIndex,
      total_steps: totalVisible,
      funnel_progress_pct:
        totalVisible > 0
          ? Math.round((currentIndex / (totalVisible - 1)) * 100)
          : 0,
    });

    return () => {
      track(EVENTS.STEP_EXIT, {
        step_id: stepId,
        step_index: currentIndex,
        duration_ms: Date.now() - enteredAt.current,
      });
    };
    // stepId changing is a new step — re-run this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId]);

  return null;
}

export default function StepPage() {
  const params = useParams();
  const stepId = typeof params?.stepId === "string" ? params.stepId : "";

  const stepDef = flow.find((s) => s.id === stepId);
  if (!stepDef) {
    notFound();
  }

  const Step = STEP_COMPONENTS[stepId];
  if (!Step) {
    notFound();
  }

  return (
    <>
      <StepTracker stepId={stepId} />
      <Step />
    </>
  );
}
