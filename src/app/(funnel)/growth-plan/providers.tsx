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
import { track, EVENTS } from "@/funnel/analytics/track";

// sessionStorage key so we only fire funnel_opened once per browser session.
const SESSION_OPENED_KEY = "lexi.funnel.opened";

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

    // Fire funnel_opened once per session (survives page refreshes in the same tab).
    if (!sessionStorage.getItem(SESSION_OPENED_KEY)) {
      sessionStorage.setItem(SESSION_OPENED_KEY, "1");
      track(EVENTS.FUNNEL_OPENED, {
        referrer: document.referrer || "direct",
        user_agent: navigator.userAgent,
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
      });
    }
  }, []);

  // Keep user identity and answer-based user properties in sync.
  useEffect(() => {
    if (answers.firebaseUid) {
      setAmplitudeUserId(answers.firebaseUid);
    }

    // Mirror all Lexi funnel answers as user properties so every subsequent
    // event is automatically enriched for cohort analysis.
    const props: Record<string, string | boolean> = {};

    if (answers.decodingTarget) props.decoding_target = answers.decodingTarget;
    if (answers.demographics) props.demographics = answers.demographics;
    if (answers.timeline) props.timeline = answers.timeline;
    if (answers.peaceBreaker) props.peace_breaker = answers.peaceBreaker;
    if (answers.overthinking) props.overthinking = answers.overthinking;
    if (answers.digitalAnxiety) props.digital_anxiety = answers.digitalAnxiety;
    if (answers.friendGroup) props.friend_group = answers.friendGroup;
    if (answers.projection) props.projection = answers.projection;
    if (answers.reinforcement) props.reinforcement = answers.reinforcement;
    if (answers.evidenceType) props.evidence_type = answers.evidenceType;
    if (answers.lexiPattern) props.detected_pattern = answers.lexiPattern;
    if (answers.userEmail) props.email_captured = "true";
    if (answers.firebaseUid) props.signed_in = "true";

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
