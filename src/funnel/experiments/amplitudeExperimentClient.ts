import {
  Experiment,
  type ExperimentClient,
} from "@amplitude/experiment-js-client";

let client: ExperimentClient | null = null;

/**
 * Initialize once after Amplitude Analytics is initialized.
 * Uses `initializeWithAmplitudeAnalytics` so $exposure events flow through
 * the same Amplitude session and are automatically attributed.
 */
export function initExperimentClient(): void {
  if (client || typeof window === "undefined") return;
  const deploymentKey = process.env.NEXT_PUBLIC_AMPLITUDE_DEPLOYMENT_KEY;
  if (!deploymentKey) return;

  client = Experiment.initializeWithAmplitudeAnalytics(deploymentKey, {
    // Fetch variants on start(); automatic exposure tracking fires $exposure
    // when variant() is called — no manual fire needed.
    automaticExposureTracking: true,
    fetchTimeoutMillis: 3000,
    retryFetchOnFailure: false,
  });

  // Fire and forget — variants load async; hook defaults to control until ready.
  void client.start();
}

export function getExperimentClient(): ExperimentClient | null {
  return client;
}
