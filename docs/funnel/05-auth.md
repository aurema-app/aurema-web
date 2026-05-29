# 05 — Auth

Firebase Auth on the client. Three sign-in paths: **Google**, **Apple**, and **email-link (passwordless)**. No email/password, no magic-link alternatives, no phone auth, no anonymous users.

## Why email-link (passwordless)

- One identifier (the email) is all the user remembers — no password to forget.
- Same primitive works for the web funnel and for logging in on the mobile app later.
- First successful `signInWithEmailLink` creates the Firebase user. No separate "sign up vs. sign in" modes.
- Proof of inbox ownership is built in, which closes the enumeration / account-takeover hole that naive "Admin SDK createUser + custom token" flows have.

## Order in the funnel

1. `EmailStep` (early): captures email → writes to Firestore `funnel_leads` collection via `aurema-backend`. No Firebase account yet, no ESP.
2. `SignInStep` (before paywall): three buttons, in this order on the UI:
   - Continue with Google
   - Continue with Apple (only if `NEXT_PUBLIC_APPLE_SIGNIN_ENABLED === 'true'`)
   - Continue with email (defaults to the email from step 1)
3. Email path UX:
   - Call `sendSignInLinkToEmail(auth, email, actionCodeSettings)` and store the email in `localStorage`.
   - Render a "Check your email" screen that (a) shows the address, (b) offers a "Resend link" button (with throttle), (c) keeps the Google/Apple buttons visible as escape hatches.
4. `/growth-plan/verify` handler: runs `signInWithEmailLink` when the user clicks the link. Sets `firebaseUid` + `email` in funnel state, calls `configureRevenueCat(firebaseUid)`, and routes onward.
5. After any successful sign-in (Google / Apple / email-link), the user continues to the paywall.

## Env vars

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_APPLE_SIGNIN_ENABLED=false
```

Use the **same Firebase project** as `aurema-app` (mobile). That's what keeps `firebaseUid` identical across platforms.

## Email-link: ActionCodeSettings

```ts
import { ActionCodeSettings } from 'firebase/auth'

export const actionCodeSettings: ActionCodeSettings = {
  url: 'https://aurema-app.com/growth-plan/verify',
  handleCodeInApp: true,
  iOS: { bundleId: 'com.aurema.app' },
  android: { packageName: 'com.aurema.app', installApp: false },
  linkDomain: 'links.aurema-app.com',
}
```

### Firebase Dynamic Links deprecation

**Firebase Dynamic Links was sunset on 25 Aug 2025.** Do not rely on it. Two supported replacements for the email-link flow:

- **`linkDomain` parameter** (Firebase's current recommended path): use a Firebase Hosting custom domain like `links.aurema-app.com` set up with the Firebase Auth action handler. Email links open in the browser at that domain; we then deep-link into the app via our own Universal Link / App Link handler.
- **Direct Universal Links / App Links on `aurema-app.com`**: configure `apple-app-site-association` (iOS) and `assetlinks.json` (Android) on the production domain so the system routes `/growth-plan/verify?...` straight into the app. More setup but removes the Firebase Hosting detour.

**Decide in Phase 4.** Record the choice in `PROGRESS.md`. In aurema-web the difference is just the `linkDomain` value (or omitting it); the tricky work is on the mobile side.

## Email-link: client code sketch

Sending the link:

```ts
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth'

export const sendLink = async (email: string) => {
  await sendSignInLinkToEmail(getAuth(), email, actionCodeSettings)
  localStorage.setItem('aurema.pendingEmail', email)
}
```

Verifying on `/growth-plan/verify`:

```ts
import { getAuth, signInWithEmailLink, isSignInWithEmailLink } from 'firebase/auth'

export const completeSignIn = async () => {
  const auth = getAuth()
  if (!isSignInWithEmailLink(auth, window.location.href)) return
  const email =
    localStorage.getItem('aurema.pendingEmail') ??
    window.prompt('Confirm your email to finish signing in') ??
    ''
  const cred = await signInWithEmailLink(auth, email, window.location.href)
  localStorage.removeItem('aurema.pendingEmail')
  return cred.user
}
```

## Google sign-in

Works out of the box once the Google provider is enabled in Firebase Console. `aurema-app.com` and any dev host must be in the authorized domains list.

## Apple sign-in — non-trivial setup

Required in Apple Developer:

- App ID with "Sign in with Apple" capability
- Services ID (e.g. `com.aurema.web`) with domain `aurema-app.com` and return URL `https://aurema-app.com/__/auth/handler`
- Private key (.p8) for the Services ID
- Upload the key + team ID + key ID into Firebase Console → Auth → Apple provider

Until all of the above is configured, do **not** render the Apple button. Gate with `NEXT_PUBLIC_APPLE_SIGNIN_ENABLED`.

## Backend user doc

- `aurema-backend` creates a user doc on first auth via `createUser` in `userController.js`.
- The funnel should **not** call this explicitly if middleware creates-on-verify. Confirm during Phase 4 and note the outcome here.
- Email-link users will have `emailVerified: true` automatically on first sign-in (Firebase sets this because the link proves inbox ownership).

## Link early email → Firebase account

If the email captured early differs from the one the user signs in with, we **do not merge**. The Firebase-verified email wins on the user doc; the earlier `funnel_leads` row stays for future ESP export.

## Gotchas

- **Same-device email required by default.** `signInWithEmailLink` needs the email again at verification time. We store it in `localStorage`; if the user opens the link on a different device (very common), `/growth-plan/verify` prompts for the email. Document this on the UI.
- **Authorized domains.** Every host that calls `sendSignInLinkToEmail` must be in Firebase Console → Auth → Settings → Authorized domains. Add both `aurema-app.com` and `localhost` for dev.
- **Email deliverability.** The default sender (`noreply@<project>.firebaseapp.com`) hits spam filters. Before launch, set up a custom sender domain with SPF/DKIM in Firebase Console → Auth → Templates.
- **Link expiry.** Default 1 hour, configurable up to 24h. For funnels, set to 24h — users often check email hours later.
- **Rate limits.** Firebase has per-IP / per-email quotas on `sendSignInLinkToEmail`. Low risk at our scale; monitor.
- **App Store review.** Some reviewers won't bother with email verification. Keep Apple Sign-In as an alternative for review, or set up a reviewer test account with a persistent session.

## Why NOT "random password + login link"

Considered and rejected. The random password is never used and just sits in Firebase Auth as dead credential material. If we want the "login via link in email" experience, email-link sign-in is the native Firebase primitive for exactly that.

## Why NOT "Admin SDK createUser + custom token mid-funnel"

Considered and rejected. An attacker could POST a victim's email to our lead endpoint, receive a custom token, and sign in as the victim. Email-link forces proof of inbox ownership before the Firebase user is created or authenticated.

## Don'ts

- No email/password.
- No phone auth.
- No anonymous Firebase users.
- No custom tokens issued to unverified clients.
- No magic-link alternatives (OTP codes, one-time URLs we sign ourselves). If we ever want an OTP flow, open a new RFC first.
