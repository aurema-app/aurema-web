"use client";

import { useEffect } from "react";

import { EXPERIMENTS } from "@/funnel/experiments/experiments.constants";
import { useVariant } from "@/funnel/experiments/useVariant";
import { EVENTS, track } from "@/funnel/analytics/track";
import { IntroControl } from "@/funnel/steps/intro/IntroControl";
import { IntroVariantA } from "@/funnel/steps/intro/IntroVariantA";

export function IntroStep() {
  const variant = useVariant(EXPERIMENTS.INTRO_HERO);

  useEffect(() => {
    track(EVENTS.STEP_VIEW, { step_id: "intro", variant });
  }, [variant]);

  if (variant === "variant-a") return <IntroVariantA />;
  return <IntroControl />;
}
