// Bump to v2 — shape changed with Lexi funnel; v1 answers are discarded on load.
export const ANSWERS_STORAGE_KEY = "lexi.funnel.answers.v2";

export type FunnelAnswers = {
  // Lexi situationship quiz answers (Screens 3–8)
  peaceBreaker?: string;
  overthinking?: string;
  digitalAnxiety?: string;
  friendGroup?: string;
  projection?: string;
  reinforcement?: string;

  // Evidence drop (Screen 10)
  evidenceText?: string;

  // LLM analysis result (Screen 11→12)
  lexiExtractedPhrase?: string;
  lexiPattern?: string;

  // Lead + auth
  userEmail?: string;
  firebaseUid?: string;
};
