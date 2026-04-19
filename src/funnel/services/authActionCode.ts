import type { ActionCodeSettings } from "firebase/auth";

// linkDomain intentionally omitted — Firebase Dynamic Links is sunset
// (Aug 2025) and the replacement strategy (Firebase Hosting linkDomain vs.
// native Universal/App Links) is still undecided. Email links will open in
// the browser at /growth-plan/verify and complete sign-in there. Mobile
// deep-linking deferred to Phase 9 QA. See PROGRESS.md open questions.
export const actionCodeSettings: ActionCodeSettings = {
  url: "https://aurema-app.com/growth-plan/verify",
  handleCodeInApp: true,
  iOS: { bundleId: "com.aurema.app" },
  android: { packageName: "com.aurema.app", installApp: false },
};
