# 05 — Auth

Firebase Auth on the client. Three providers: Google, Apple, email/password.

## Order in the funnel

1. Early step captures **email only** → sent to Brevo for marketing. No Firebase account yet.
2. Before the paywall, `SignInStep` offers:
   - Continue with Google
   - Continue with Apple
   - Continue with email/password
3. On successful sign-in, `firebaseUid` is set in funnel state. We then call `configureRevenueCat(firebaseUid)`.

## Env vars

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Use the **same Firebase project** as the mobile app (aurema-app). That's what keeps `firebaseUid` identical across platforms.

## Google sign-in

Works out of the box once the Google provider is enabled in Firebase Console. `aurema-app.com` must be in the authorized domains list.

## Apple sign-in — non-trivial setup

Required in Apple Developer:

- App ID with "Sign in with Apple" capability
- Services ID (e.g. `com.aurema.web`) with domain `aurema-app.com` and return URL `https://aurema-app.com/__/auth/handler`
- Private key (.p8) for the Services ID
- Upload the key + team ID + key ID into Firebase Console → Auth → Apple provider

Until all of the above is configured, do **not** render the Apple button. Use a feature flag:

```ts
const appleEnabled = process.env.NEXT_PUBLIC_APPLE_SIGNIN_ENABLED === 'true'
```

## Email/password sign-in

- On submit, call `createUserWithEmailAndPassword` or `signInWithEmailAndPassword`.
- Password minimum: 8 chars (Firebase default).
- On "email already exists" error, flip to sign-in mode automatically.
- No password reset flow in the funnel — direct users to the app instead.

## Backend user doc

- `aurema-backend` already creates a user doc on first auth via `createUser` in `userController.js`.
- The funnel does NOT need to call this explicitly if the backend middleware creates-on-verify. Confirm during phase 4 and note here.

## Link early email → Firebase account

If the email captured early differs from the one the user signs in with later, we **do not merge**. The Firebase-verified email wins on the user doc; the early one remains in Brevo for marketing only.

## Don'ts

- No magic link / passwordless (yet).
- No phone auth.
- No anonymous Firebase users — we always want a real UID before the paywall.
- Do not roll our own JWTs. Backend verifies Firebase ID tokens.
