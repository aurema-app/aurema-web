"use client";

import { useEffect, useState } from "react";

import { getExperimentClient } from "@/funnel/experiments/amplitudeExperimentClient";
import type { ExperimentEntry } from "@/funnel/experiments/experiments.constants";

/**
 * Returns the active variant for the given experiment entry.
 *
 * - Immediately returns `defaultVariant` so the first render is stable
 *   (brief control flash is acceptable — no SSR allocation).
 * - Fetches the user's variant once the experiment client is ready.
 * - The $exposure event is fired automatically by the Amplitude SDK when
 *   variant() is called — do NOT fire it manually.
 */
export function useVariant<T extends ExperimentEntry>(
  experiment: T,
): T["variants"][number] {
  const [variant, setVariant] = useState<string>(experiment.defaultVariant);

  useEffect(() => {
    let cancelled = false;

    const resolve = () => {
      const experimentClient = getExperimentClient();
      if (!experimentClient || cancelled) return;

      // variant() fires $exposure automatically (automaticExposureTracking: true).
      const result = experimentClient.variant(experiment.key);
      const resolved = result.value ?? experiment.defaultVariant;

      if (!cancelled) setVariant(resolved);
    };

    // Poll briefly for the client to finish its start() fetch.
    // Typical fetch is <500ms; we retry every 100ms for up to 2s.
    let attempts = 0;
    const MAX_ATTEMPTS = 20;

    const poll = () => {
      if (cancelled) return;
      const c = getExperimentClient();
      if (c) {
        resolve();
        return;
      }
      if (attempts < MAX_ATTEMPTS) {
        attempts++;
        setTimeout(poll, 100);
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [experiment.key, experiment.defaultVariant]);

  return variant as T["variants"][number];
}
