"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Separator,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { sendSignInLinkToEmail, signInWithPopup } from "firebase/auth";

import { StepShell } from "@/funnel/components/StepShell";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import {
  auth,
  appleProvider,
  googleProvider,
} from "@/funnel/services/firebaseClient";
import { actionCodeSettings } from "@/funnel/services/authActionCode";
import { configureRevenueCat } from "@/funnel/services/revenueCatClient";
import {
  setAmplitudeUserProperties,
  setAmplitudeUserId,
} from "@/funnel/analytics/amplitudeClient";
import { EVENTS, track } from "@/funnel/analytics/track";

const RESEND_THROTTLE_S = 30;
const APPLE_ENABLED = process.env.NEXT_PUBLIC_APPLE_SIGNIN_ENABLED === "true";

type View = "chooser" | "check-email";

export function SignInStep() {
  const { answers, setAnswer } = useFunnelAnswers();
  const { goNext } = useFunnelNavigation();

  const email = answers.userEmail ?? "";
  const [editingEmail, setEditingEmail] = useState(false);
  const [draftEmail, setDraftEmail] = useState(email);

  const [view, setView] = useState<View>("chooser");
  const [sentTo, setSentTo] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  useEffect(() => () => clearCountdown(), []);

  const startResendThrottle = useCallback(() => {
    clearCountdown();
    setResendCountdown(RESEND_THROTTLE_S);
    countdownRef.current = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearCountdown();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading("google");
    track(EVENTS.SIGN_IN_STARTED, { method: "google" });
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      setAnswer("firebaseUid", cred.user.uid);
      setAnswer("userEmail", cred.user.email ?? email);
      configureRevenueCat(cred.user.uid);
      setAmplitudeUserId(cred.user.uid);
      setAmplitudeUserProperties({ signed_in: true, sign_in_method: "google" });
      track(EVENTS.SIGN_IN_COMPLETED, { method: "google" });
      goNext();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed.";
      if (!msg.includes("popup-closed") && !msg.includes("cancelled")) {
        track(EVENTS.SIGN_IN_FAILED, { method: "google", error: msg });
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(null);
    }
  };

  const handleAppleSignIn = async () => {
    setError(null);
    setLoading("apple");
    track(EVENTS.SIGN_IN_STARTED, { method: "apple" });
    try {
      const cred = await signInWithPopup(auth, appleProvider);
      setAnswer("firebaseUid", cred.user.uid);
      setAnswer("userEmail", cred.user.email ?? email);
      configureRevenueCat(cred.user.uid);
      setAmplitudeUserId(cred.user.uid);
      setAmplitudeUserProperties({ signed_in: true, sign_in_method: "apple" });
      track(EVENTS.SIGN_IN_COMPLETED, { method: "apple" });
      goNext();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Apple sign-in failed.";
      if (!msg.includes("popup-closed") && !msg.includes("cancelled")) {
        track(EVENTS.SIGN_IN_FAILED, { method: "apple", error: msg });
        setError("Apple sign-in failed. Please try again.");
      }
    } finally {
      setLoading(null);
    }
  };

  const sendEmailLink = async (targetEmail: string) => {
    setError(null);
    setLoading("email");
    track(EVENTS.SIGN_IN_STARTED, { method: "email_link" });
    try {
      await sendSignInLinkToEmail(auth, targetEmail, actionCodeSettings);
      localStorage.setItem("aurema.pendingEmail", targetEmail);
      setSentTo(targetEmail);
      setView("check-email");
      startResendThrottle();
      track(EVENTS.EMAIL_LINK_SENT, { step_id: "sign-in" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Email link failed.";
      track(EVENTS.SIGN_IN_FAILED, { method: "email_link", error: msg });
      setError(
        "Couldn't send the link. Please check your email and try again.",
      );
    } finally {
      setLoading(null);
    }
  };

  const handleEmailContinue = () => {
    const target = (editingEmail ? draftEmail : email).trim();
    if (target) sendEmailLink(target);
  };

  const handleResend = () => {
    if (resendCountdown > 0) return;
    sendEmailLink(sentTo);
  };

  const SocialButtons = (
    <VStack gap={3} align="stretch">
      <Button
        onClick={handleGoogleSignIn}
        disabled={!!loading}
        size="lg"
        borderRadius="xl"
        fontFamily="body"
        fontWeight="700"
        bg="white"
        color="gray.800"
        _hover={{ opacity: 0.9 }}
        _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
      >
        {loading === "google" ? (
          <HStack gap={2}>
            <Spinner size="sm" />
            <span>Signing in…</span>
          </HStack>
        ) : (
          "Continue with Google"
        )}
      </Button>

      {APPLE_ENABLED && (
        <Button
          onClick={handleAppleSignIn}
          disabled={!!loading}
          size="lg"
          borderRadius="xl"
          fontFamily="body"
          fontWeight="700"
          bg="black"
          color="white"
          _hover={{ opacity: 0.9 }}
          _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
        >
          {loading === "apple" ? (
            <HStack gap={2}>
              <Spinner size="sm" />
              <span>Signing in…</span>
            </HStack>
          ) : (
            "Continue with Apple"
          )}
        </Button>
      )}
    </VStack>
  );

  const OrSeparator = ({ label = "or" }: { label?: string }) => (
    <HStack>
      <Separator borderColor="whiteAlpha.300" flex="1" />
      <Text
        fontFamily="body"
        fontSize="xs"
        color="fg.muted"
        whiteSpace="nowrap"
        px={2}
      >
        {label}
      </Text>
      <Separator borderColor="whiteAlpha.300" flex="1" />
    </HStack>
  );

  if (view === "check-email") {
    return (
      <StepShell title="Check your inbox" hideProgress>
        <VStack gap={5} align="stretch">
          <Box
            bg="whiteAlpha.100"
            borderRadius="xl"
            px={5}
            py={4}
            borderLeft="3px solid"
            borderColor="brand.primary"
          >
            <Text fontFamily="body" fontSize="sm" color="fg.muted" mb={1}>
              We sent a sign-in link to
            </Text>
            <Text
              fontFamily="heading"
              fontSize="md"
              color="fg.default"
              fontWeight="bold"
            >
              {sentTo}
            </Text>
            <Text fontFamily="body" fontSize="xs" color="fg.muted" mt={1}>
              Click the link in the email to continue. Check spam if you
              don&apos;t see it.
            </Text>
          </Box>

          <Button
            onClick={handleResend}
            disabled={resendCountdown > 0 || !!loading}
            variant="ghost"
            size="sm"
            fontFamily="body"
            color="fg.muted"
            _hover={{ color: "fg.default" }}
          >
            {resendCountdown > 0
              ? `Resend link in ${resendCountdown}s`
              : loading === "email"
                ? "Sending…"
                : "Resend link"}
          </Button>

          <Button
            onClick={() => {
              setView("chooser");
              setEditingEmail(true);
            }}
            variant="ghost"
            size="sm"
            fontFamily="body"
            color="fg.muted"
            _hover={{ color: "fg.default" }}
          >
            Wrong email? Change it
          </Button>

          {error && (
            <Text fontFamily="body" fontSize="sm" color="red.400">
              {error}
            </Text>
          )}

          <OrSeparator label="or sign in with" />

          {SocialButtons}
        </VStack>
      </StepShell>
    );
  }

  return (
    <StepShell
      title="Create your account"
      subtitle="Save your plan and unlock your growth journey."
    >
      <VStack gap={4} align="stretch">
        {error && (
          <Text fontFamily="body" fontSize="sm" color="red.400">
            {error}
          </Text>
        )}

        {SocialButtons}

        <OrSeparator />

        {/* Email section */}
        {editingEmail ? (
          <VStack gap={2} align="stretch">
            <input
              type="email"
              value={draftEmail}
              onChange={(e) => setDraftEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 12,
                padding: "12px 16px",
                color: "inherit",
                fontFamily: "inherit",
                fontSize: 16,
                width: "100%",
                outline: "none",
              }}
              autoFocus
            />
            <Button
              onClick={handleEmailContinue}
              disabled={!!loading || !draftEmail.trim()}
              size="lg"
              borderRadius="xl"
              fontFamily="body"
              fontWeight="700"
              bg="brand.primary"
              color="bg.canvas"
              _hover={{ opacity: 0.9 }}
              _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
            >
              {loading === "email" ? "Sending…" : "Continue with email"}
            </Button>
          </VStack>
        ) : (
          <VStack gap={1} align="stretch">
            {email && (
              <Box
                bg="whiteAlpha.50"
                borderRadius="lg"
                px={4}
                py={2}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text
                  fontFamily="body"
                  fontSize="sm"
                  color="fg.muted"
                  truncate
                  flex="1"
                  mr={2}
                >
                  {email}
                </Text>
                <Button
                  onClick={() => {
                    setDraftEmail(email);
                    setEditingEmail(true);
                  }}
                  variant="ghost"
                  size="xs"
                  fontFamily="body"
                  color="fg.muted"
                  _hover={{ color: "fg.default" }}
                >
                  Change
                </Button>
              </Box>
            )}
            <Button
              onClick={handleEmailContinue}
              disabled={!!loading || !email}
              size="lg"
              borderRadius="xl"
              fontFamily="body"
              fontWeight="700"
              variant="outline"
              borderColor="whiteAlpha.300"
              color="fg.default"
              _hover={{ bg: "whiteAlpha.100" }}
              _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
            >
              {loading === "email" ? "Sending…" : "Continue with email"}
            </Button>
          </VStack>
        )}
      </VStack>
    </StepShell>
  );
}
