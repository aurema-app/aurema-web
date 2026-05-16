"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

import { auth } from "@/funnel/services/firebaseClient";
import { configureRevenueCat } from "@/funnel/services/revenueCatClient";
import { useFunnelContext } from "@/funnel/state/FunnelContext";

type PageState =
  | { kind: "checking" }
  | { kind: "invalid-link" }
  | { kind: "need-email" }
  | { kind: "signing-in" }
  | { kind: "error"; message: string };

export default function VerifyPage() {
  const router = useRouter();
  const { setAnswer } = useFunnelContext();
  const [state, setState] = useState<PageState>({ kind: "checking" });
  const [emailInput, setEmailInput] = useState("");

  const completeSignIn = async (email: string) => {
    setState({ kind: "signing-in" });
    try {
      const cred = await signInWithEmailLink(auth, email, window.location.href);
      localStorage.removeItem("aurema.pendingEmail");
      setAnswer("firebaseUid", cred.user.uid);
      setAnswer("userEmail", cred.user.email ?? email);
      configureRevenueCat(cred.user.uid);
      router.push("/growth-plan/paywall");
    } catch (err: unknown) {
      localStorage.removeItem("aurema.pendingEmail");
      const msg = err instanceof Error ? err.message : "Sign-in failed.";

      let friendly = "Something went wrong. Please try again.";
      if (msg.includes("expired")) {
        friendly =
          "This link has expired. Links are valid for 24 hours — request a new one.";
      } else if (
        msg.includes("invalid-email") ||
        msg.includes("invalid-action-code")
      ) {
        friendly =
          "The email address didn't match the one this link was sent to.";
      }

      setState({ kind: "error", message: friendly });
    }
  };

  useEffect(() => {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      setState({ kind: "invalid-link" });
      return;
    }

    const stored = localStorage.getItem("aurema.pendingEmail");
    if (stored) {
      completeSignIn(stored);
    } else {
      setState({ kind: "need-email" });
    }
    // Run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (state.kind === "checking" || state.kind === "signing-in") {
    return (
      <Shell>
        <VStack gap={4} align="center">
          <Spinner size="lg" color="brand.primary" />
          <Text fontFamily="body" color="fg.muted" fontSize="sm">
            {state.kind === "signing-in"
              ? "Signing you in…"
              : "Verifying your link…"}
          </Text>
        </VStack>
      </Shell>
    );
  }

  if (state.kind === "invalid-link") {
    return (
      <Shell>
        <VStack gap={6} align="stretch">
          <Heading
            as="h1"
            fontFamily="heading"
            color="fg.default"
            fontSize="2xl"
            fontWeight="bold"
          >
            Invalid link
          </Heading>
          <Text fontFamily="body" color="fg.muted" fontSize="sm">
            This link doesn't look right or has already been used. Please
            restart the sign-in flow.
          </Text>
          <Button
            bg="brand.primary"
            color="bg.canvas"
            fontFamily="body"
            fontWeight="700"
            size="lg"
            borderRadius="xl"
            _hover={{ opacity: 0.9 }}
            onClick={() => router.push("/growth-plan/intro")}
          >
            Start over
          </Button>
        </VStack>
      </Shell>
    );
  }

  if (state.kind === "error") {
    return (
      <Shell>
        <VStack gap={6} align="stretch">
          <Heading
            as="h1"
            fontFamily="heading"
            color="fg.default"
            fontSize="2xl"
            fontWeight="bold"
          >
            Sign-in failed
          </Heading>
          <Text fontFamily="body" color="red.400" fontSize="sm">
            {state.message}
          </Text>
          <Button
            bg="brand.primary"
            color="bg.canvas"
            fontFamily="body"
            fontWeight="700"
            size="lg"
            borderRadius="xl"
            _hover={{ opacity: 0.9 }}
            onClick={() => router.push("/growth-plan/sign-in")}
          >
            Try again
          </Button>
        </VStack>
      </Shell>
    );
  }

  // need-email: different-device case
  return (
    <Shell>
      <VStack gap={6} align="stretch">
        <Heading
          as="h1"
          fontFamily="heading"
          color="fg.default"
          fontSize="2xl"
          fontWeight="bold"
        >
          Confirm your email
        </Heading>
        <Text fontFamily="body" color="fg.muted" fontSize="sm">
          It looks like you opened this link on a different device. Enter the
          email address you used to receive the link.
        </Text>
        <Input
          type="email"
          placeholder="you@example.com"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          size="lg"
          borderRadius="xl"
          fontFamily="body"
          bg="whiteAlpha.100"
          borderColor="whiteAlpha.300"
          _focus={{ borderColor: "brand.primary", boxShadow: "none" }}
          color="fg.default"
          autoComplete="email"
          inputMode="email"
        />
        <Button
          bg="brand.primary"
          color="bg.canvas"
          fontFamily="body"
          fontWeight="700"
          size="lg"
          borderRadius="xl"
          _hover={{ opacity: 0.9 }}
          _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
          disabled={!emailInput.trim()}
          onClick={() => completeSignIn(emailInput.trim())}
        >
          Sign in
        </Button>
      </VStack>
    </Shell>
  );
}
