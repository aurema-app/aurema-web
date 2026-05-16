"use client";

import { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";

import {
  initAmplitude,
  setAmplitudeUserId,
  setAmplitudeUserProperties,
} from "@/funnel/analytics/amplitudeClient";
import { initExperimentClient } from "@/funnel/experiments/amplitudeExperimentClient";
import { FunnelProvider } from "@/funnel/state/FunnelContext";
import { useFunnelContext } from "@/funnel/state/FunnelContext";
import { chakraSystem } from "@/funnel/theme/chakraTheme";

/**
 * Bootstraps Amplitude and the experiment client once on mount, then keeps
 * user identity and properties in sync whenever funnel answers change.
 * Must render inside <FunnelProvider> to access context.
 */
function AmplitudeBootstrap() {
  const { answers } = useFunnelContext();

  useEffect(() => {
    initAmplitude();
    initExperimentClient();
  }, []);

  useEffect(() => {
    if (answers.firebaseUid) {
      setAmplitudeUserId(answers.firebaseUid);
    }

    // Mirror all known Lexi answers as user properties so every event is
    // automatically enriched for cohort analysis in dashboards.
    const props: Record<string, string | boolean> = {};
    if (answers.peaceBreaker) props.peace_breaker = answers.peaceBreaker;
    if (answers.overthinking) props.overthinking = answers.overthinking;
    if (answers.digitalAnxiety) props.digital_anxiety = answers.digitalAnxiety;
    if (answers.friendGroup) props.friend_group = answers.friendGroup;
    if (answers.projection) props.projection = answers.projection;
    if (answers.reinforcement) props.reinforcement = answers.reinforcement;
    if (answers.userEmail) props.email_captured = true;
    if (answers.firebaseUid) props.signed_in = true;

    if (Object.keys(props).length) setAmplitudeUserProperties(props);
  }, [answers]);

  return null;
}

export function FunnelProviders({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={chakraSystem}>
      <FunnelProvider>
        <AmplitudeBootstrap />
        {children}
      </FunnelProvider>
    </ChakraProvider>
  );
}
