export const ANSWERS_STORAGE_KEY = "aurema.funnel.answers.v1";

export type FunnelAnswers = {
  goal?: "clarity" | "calm" | "focus" | "growth";
  ageRange?: "18-24" | "25-34" | "35-44" | "45+";
  currentState?: "stressed" | "stuck" | "curious" | "hopeful";
  frequency?: "daily" | "few-times-week" | "weekly";
  userEmail?: string;
  firebaseUid?: string;
};
