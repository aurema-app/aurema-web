"use client";

import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";

import { flow } from "@/funnel/flow/flow";

// Lexi funnel steps
import { LandingStep } from "@/funnel/steps/LandingStep";
import { SocialProofStep } from "@/funnel/steps/SocialProofStep";
import { PeaceBreakerStep } from "@/funnel/steps/PeaceBreakerStep";
import { OverthinkingStep } from "@/funnel/steps/OverthinkingStep";
import { DigitalAnxietyStep } from "@/funnel/steps/DigitalAnxietyStep";
import { FriendGroupStep } from "@/funnel/steps/FriendGroupStep";
import { ProjectionStep } from "@/funnel/steps/ProjectionStep";
import { ReinforcementStep } from "@/funnel/steps/ReinforcementStep";
import { PatternDetectedStep } from "@/funnel/steps/PatternDetectedStep";
import { EvidenceStep } from "@/funnel/steps/EvidenceStep";
import { AnalyzingStep } from "@/funnel/steps/AnalyzingStep";
import { TeaserStep } from "@/funnel/steps/TeaserStep";

// Auth + paywall steps (kept from original implementation)
import { EmailStep } from "@/funnel/steps/EmailStep";
import { SignInStep } from "@/funnel/steps/SignInStep";
import { PaywallStep } from "@/funnel/steps/PaywallStep";

const STEP_COMPONENTS: Record<string, ComponentType> = {
  // Lexi screens 1–12
  landing: LandingStep,
  "social-proof": SocialProofStep,
  "peace-breaker": PeaceBreakerStep,
  overthinking: OverthinkingStep,
  "digital-anxiety": DigitalAnxietyStep,
  "friend-group": FriendGroupStep,
  projection: ProjectionStep,
  reinforcement: ReinforcementStep,
  "pattern-detected": PatternDetectedStep,
  evidence: EvidenceStep,
  analyzing: AnalyzingStep,
  teaser: TeaserStep,

  // Lead capture + auth
  email: EmailStep,
  "sign-in": SignInStep,

  // Screen 13 — dedicated paywall page (this component redirects there)
  paywall: PaywallStep,
};

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

  return <Step />;
}
