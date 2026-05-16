"use client";

import { useEffect, useState } from "react";
import { Box, Button, Spinner, Text, VStack } from "@chakra-ui/react";

import { getRevenueCat } from "@/funnel/services/revenueCatClient";
import { useFunnelContext } from "@/funnel/state/FunnelContext";
import { EVENTS, track } from "@/funnel/analytics/track";

// Confirm the entitlement ID matches what is configured in the RC dashboard
// and used by aurema-app (mobile). Open question tracked in PROGRESS.md.
const ENTITLEMENT_ID = "pro";

const POLL_INTERVAL_MS = 500;
const POLL_TIMEOUT_MS = 10_000;

// Deep link: update before launch with the real App Store / Play Store URLs.
const APP_STORE_URL = "https://apps.apple.com/app/aurema/id000000000";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.aurema.app";

const SUPPORT_EMAIL = "support@aurema-app.com";

type PageState =
  | { kind: "checking" }
  | { kind: "success" }
  | { kind: "pending" };

async function pollBackend(
  backendUrl: string,
  signal: AbortSignal,
): Promise<boolean> {
  const res = await fetch("/api/user", {
    headers: { "Content-Type": "application/json" },
    signal,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { subscriptionStatus?: string };
  return data.subscriptionStatus === "active";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function ActivatePage() {
  const { answers, resetAnswers } = useFunnelContext();
  const [state, setState] = useState<PageState>({ kind: "checking" });

  useEffect(() => {
    const controller = new AbortController();
    const backendUrl =
      process.env.NEXT_PUBLIC_AUREMA_BACKEND_URL ?? "http://localhost:4000";

    const check = async () => {
      const start = Date.now();

      // Phase 1: poll /api/user (proxied to aurema-backend) for up to 10s.
      while (Date.now() - start < POLL_TIMEOUT_MS) {
        if (controller.signal.aborted) return;

        try {
          const active = await pollBackend(backendUrl, controller.signal);
          if (active) {
            track(EVENTS.SUBSCRIPTION_ACTIVATED, { method: "backend_poll" });
            setState({ kind: "success" });
            return;
          }
        } catch {
          // Network error or backend not available — keep polling until timeout.
        }

        await sleep(POLL_INTERVAL_MS);
      }

      // Phase 2: timeout reached — fall back to RC customer info (authoritative).
      try {
        const rc = getRevenueCat();
        const info = await rc.getCustomerInfo();
        if (info.entitlements.active[ENTITLEMENT_ID]) {
          track(EVENTS.SUBSCRIPTION_ACTIVATED, { method: "rc_fallback" });
          setState({ kind: "success" });
          return;
        }
      } catch {
        // RC not configured (e.g. page refreshed without re-signing in) — show pending.
      }

      track(EVENTS.SUBSCRIPTION_PENDING);
      setState({ kind: "pending" });
    };

    check();
    return () => controller.abort();
  }, []);

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <Box
      minH="100vh"
      bg="bg.canvas"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box maxW="sm" w="full">
        {children}
      </Box>
    </Box>
  );

  if (state.kind === "checking") {
    return (
      <Shell>
        <VStack gap={4} align="center">
          <Spinner size="xl" color="brand.primary" />
          <Text
            fontFamily="heading"
            fontSize="lg"
            fontWeight="bold"
            color="fg.default"
          >
            Activating your plan…
          </Text>
          <Text
            fontFamily="body"
            fontSize="sm"
            color="fg.muted"
            textAlign="center"
          >
            This usually takes just a moment.
          </Text>
        </VStack>
      </Shell>
    );
  }

  if (state.kind === "pending") {
    return (
      <Shell>
        <VStack gap={6} align="stretch">
          <Text
            fontFamily="heading"
            fontSize="2xl"
            fontWeight="bold"
            color="fg.default"
          >
            Almost there…
          </Text>
          <Text fontFamily="body" fontSize="sm" color="fg.muted">
            Your payment was received but activation is still processing. It
            should appear within a few minutes.
          </Text>
          <Text fontFamily="body" fontSize="sm" color="fg.muted">
            If you don&apos;t see your subscription active in the app shortly,
            reach out:{" "}
            <Text
              as="a"
              href={`mailto:${SUPPORT_EMAIL}`}
              textDecoration="underline"
              color="fg.default"
            >
              {SUPPORT_EMAIL}
            </Text>
          </Text>
          <Button
            as="a"
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            fontFamily="body"
            fontWeight="700"
            bg="brand.primary"
            color="bg.canvas"
            size="lg"
            borderRadius="xl"
            _hover={{ opacity: 0.9 }}
          >
            Open Aurema on iPhone
          </Button>
        </VStack>
      </Shell>
    );
  }

  // success
  return (
    <Shell>
      <VStack gap={6} align="stretch">
        <Text
          fontFamily="heading"
          fontSize="3xl"
          fontWeight="bold"
          color="fg.default"
          textAlign="center"
        >
          You&apos;re in. 🎉
        </Text>
        <Text
          fontFamily="body"
          fontSize="sm"
          color="fg.muted"
          textAlign="center"
        >
          Your Aurema growth plan is active. Open the app to start your first
          session — your subscription is already synced.
        </Text>

        <Button
          as="a"
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          fontFamily="body"
          fontWeight="700"
          bg="brand.primary"
          color="bg.canvas"
          size="lg"
          borderRadius="xl"
          _hover={{ opacity: 0.9 }}
        >
          Open Aurema on iPhone
        </Button>

        <Button
          as="a"
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          fontFamily="body"
          fontWeight="700"
          variant="outline"
          borderColor="whiteAlpha.300"
          color="fg.default"
          size="lg"
          borderRadius="xl"
          _hover={{ bg: "whiteAlpha.100" }}
        >
          Open Aurema on Android
        </Button>

        <Button
          onClick={() => {
            resetAnswers();
            window.location.href = "/";
          }}
          variant="ghost"
          size="sm"
          fontFamily="body"
          color="fg.muted"
          _hover={{ color: "fg.default" }}
        >
          Back to aurema-app.com
        </Button>
      </VStack>
    </Shell>
  );
}
