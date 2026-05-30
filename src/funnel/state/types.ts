// Bump to v3 — added evidence images + richer LLM result fields.
export const ANSWERS_STORAGE_KEY = "lexi.funnel.answers.v3";

export type FunnelAnswers = {
  // Onboarding (Screens 2–4)
  decodingTarget?: string;
  demographics?: string;
  timeline?: string;

  // Lexi situationship quiz answers
  peaceBreaker?: string;
  overthinking?: string;
  digitalAnxiety?: string;
  friendGroup?: string;
  projection?: string;
  reinforcement?: string;

  // Evidence drop (Screen 10)
  evidenceText?: string;
  // base64 data URLs (jpeg/png) — max 3
  evidenceImages?: string[];
  // "text" = typed/pasted, "screenshot" = image upload, "chip" = preset excuse selected
  evidenceType?: "text" | "screenshot" | "chip";

  // LLM analysis result (Screen 11→12)
  lexiExtractedPhrase?: string;
  lexiPattern?: string;
  lexiTeaserCopy?: string;
  lexiPaywallHook?: string;

  // Lead capture (localStorage only)
  userEmail?: string;
};
