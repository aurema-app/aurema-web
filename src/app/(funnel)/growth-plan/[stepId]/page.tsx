"use client";

import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";

import { flow } from "@/funnel/flow/flow";
import { IntroStep } from "@/funnel/steps/IntroStep";
import { GoalStep } from "@/funnel/steps/GoalStep";
import { AgeStep } from "@/funnel/steps/AgeStep";
import { CurrentStateStep } from "@/funnel/steps/CurrentStateStep";
import { FrequencyStep } from "@/funnel/steps/FrequencyStep";
import { GeneratingPlanStep } from "@/funnel/steps/GeneratingPlanStep";
import { PlanPreviewStep } from "@/funnel/steps/PlanPreviewStep";
import { EmailStep } from "@/funnel/steps/EmailStep";
import { SignInStep } from "@/funnel/steps/SignInStep";
import { PaywallStep } from "@/funnel/steps/PaywallStep";

const STEP_COMPONENTS: Record<string, ComponentType> = {
  intro: IntroStep,
  goal: GoalStep,
  age: AgeStep,
  "current-state": CurrentStateStep,
  frequency: FrequencyStep,
  generating: GeneratingPlanStep,
  "plan-preview": PlanPreviewStep,
  email: EmailStep,
  "sign-in": SignInStep,
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
