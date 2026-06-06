"use client";

import { Suspense, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Box, Input, Spinner, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { setAmplitudeUserProperties } from "@/funnel/analytics/amplitudeClient";
import { EVENTS, track } from "@/funnel/analytics/track";
import { LexiLogoBanner } from "@/funnel/components/lexi/LexiLogoBanner";
import { LexiCtaButton } from "@/funnel/components/lexi/LexiCtaButton";
import { useFunnelContext } from "@/funnel/state/FunnelContext";
import { FUNNEL_STEP_TOP_PADDING } from "@/funnel/theme/layout.constants";

const SURFACE = "#F6F2FF";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: "easeOut" as const },
});

function formatCardNumber(raw: string) {
  return raw
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  return digits;
}

function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { answers } = useFunnelContext();

  const planId = searchParams.get("plan") ?? "annual";
  const planLabel =
    planId === "annual" ? "Annual — $39.99/yr" : "Monthly — $9.99/mo";

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardStartedRef = useRef(false);

  const handleCardFocus = () => {
    if (cardStartedRef.current) return;
    cardStartedRef.current = true;
    track(EVENTS.CARD_DETAILS_STARTED, {
      plan_id: planId,
      email: answers.userEmail,
    });
  };

  const isComplete =
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.replace(/\s/g, "").length >= 4 &&
    cvc.length >= 3 &&
    name.trim().length > 0;

  const handlePay = () => {
    if (!isComplete) {
      setError("Please fill in all card details.");
      return;
    }

    setSubmitting(true);
    setError(null);

    track(EVENTS.CHECKOUT_SUBMITTED, {
      method: "stripe_mock",
      plan_id: planId,
      email: answers.userEmail,
    });
    track(EVENTS.PURCHASE_COMPLETED, {
      method: "stripe_mock",
      plan_id: planId,
    });
    setAmplitudeUserProperties({ subscribed: true, plan_type: planId });

    // Small delay so the button spin is visible, then go to success.
    setTimeout(() => {
      router.push(
        `/growth-plan/activate?mock=1&plan=${encodeURIComponent(planId)}`,
      );
    }, 900);
  };

  const inputStyles = {
    h: "52px",
    bg: "white",
    border: "1.5px solid",
    borderColor: "#E4DBFE",
    borderRadius: "14px",
    fontFamily: "body",
    fontSize: "15px",
    fontWeight: "500",
    color: "fg.default",
    _placeholder: { color: "#B8A8C4" },
    _focus: {
      borderColor: "brand.primary",
      boxShadow: "0 0 0 3px rgba(236,72,153,0.15)",
    },
  };

  return (
    <Box
      h="100dvh"
      maxH="100dvh"
      w="full"
      bg={SURFACE}
      display="flex"
      flexDirection="column"
      alignItems="center"
      overflow="hidden"
    >
      <Box
        w="full"
        maxW="430px"
        h="full"
        display="flex"
        flexDirection="column"
        bg={SURFACE}
        pt={FUNNEL_STEP_TOP_PADDING}
      >
        <Box
          flex="1"
          overflowY="auto"
          overflowX="hidden"
          minH={0}
          px={5}
          pb={3}
          css={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box display="flex" flexDirection="column" gap={6}>
            <LexiLogoBanner mx="auto" flexShrink={0} />

            <motion.div {...fadeUp(0.05)}>
              <VStack align="stretch" gap={1}>
                <Text
                  fontFamily="body"
                  fontSize="22px"
                  fontWeight="800"
                  letterSpacing="-0.3px"
                  color="fg.default"
                  lineHeight="1.25"
                >
                  Complete your purchase
                </Text>
                <Text
                  fontFamily="body"
                  fontSize="14px"
                  color="fg.muted"
                  fontWeight="500"
                >
                  {planLabel}
                </Text>
              </VStack>
            </motion.div>

            <motion.div {...fadeUp(0.1)}>
              <VStack align="stretch" gap={3}>
                {/* Name */}
                <Input
                  {...inputStyles}
                  placeholder="Name on card"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={handleCardFocus}
                  autoComplete="cc-name"
                />

                {/* Card number */}
                <Input
                  {...inputStyles}
                  placeholder="Card number"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(formatCardNumber(e.target.value))
                  }
                  onFocus={handleCardFocus}
                  inputMode="numeric"
                  autoComplete="cc-number"
                />

                {/* Expiry + CVC */}
                <Box display="flex" gap={3}>
                  <Input
                    {...inputStyles}
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    onFocus={handleCardFocus}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    flex="1"
                  />
                  <Input
                    {...inputStyles}
                    placeholder="CVC"
                    value={cvc}
                    onChange={(e) =>
                      setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    onFocus={handleCardFocus}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    flex="1"
                  />
                </Box>
              </VStack>
            </motion.div>
          </Box>
        </Box>

        <Box
          flexShrink={0}
          w="full"
          px={5}
          pt={3}
          pb="max(16px, env(safe-area-inset-bottom))"
          bg={SURFACE}
          borderTop="1px solid"
          borderColor="lexi.border"
        >
          {error && (
            <Text
              fontFamily="body"
              fontSize="sm"
              color="red.500"
              fontWeight="600"
              mb={3}
            >
              {error}
            </Text>
          )}

          <LexiCtaButton disabled={submitting} onClick={handlePay}>
            {submitting ? (
              <Box display="flex" alignItems="center" gap={2}>
                <Spinner size="sm" />
                <Text>Processing…</Text>
              </Box>
            ) : (
              `Pay ${planId === "annual" ? "$39.99" : "$9.99"}`
            )}
          </LexiCtaButton>

          <Box
            display="flex"
            justifyContent="center"
            gap={4}
            flexWrap="wrap"
            mt={3}
          >
            {["🔒 256-bit SSL", "🔒 Secure Checkout", "Cancel Anytime"].map(
              (badge) => (
                <Text
                  key={badge}
                  fontSize="10px"
                  color="fg.muted"
                  fontWeight="600"
                  letterSpacing="wide"
                >
                  {badge}
                </Text>
              ),
            )}
          </Box>

          <Text
            fontSize="11px"
            color="fg.muted"
            fontWeight="500"
            textAlign="center"
            mt={3}
          >
            By completing your purchase you agree to our{" "}
            <Box as="span" textDecoration="underline">
              Terms
            </Box>{" "}
            and{" "}
            <Box as="span" textDecoration="underline">
              Privacy Policy
            </Box>
            .
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export default function CheckoutPageWrapper() {
  return (
    <Suspense>
      <CheckoutPage />
    </Suspense>
  );
}
