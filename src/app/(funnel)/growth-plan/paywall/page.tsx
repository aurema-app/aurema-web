"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { Box, Button, Spinner, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type {
  Offerings,
  Package,
  PurchasesError,
} from "@revenuecat/purchases-js";
import { PackageType } from "@revenuecat/purchases-js";

import { GrowthPlanPolicy } from "@/funnel/components/GrowthPlanPolicy";
import { LexiAvatar } from "@/funnel/components/lexi/LexiAvatar";
import {
  configureRevenueCat,
  getRevenueCat,
} from "@/funnel/services/revenueCatClient";
import { setAmplitudeUserProperties } from "@/funnel/analytics/amplitudeClient";
import { useFunnelContext } from "@/funnel/state/FunnelContext";
import { EVENTS, track } from "@/funnel/analytics/track";

type PageState =
  | { kind: "loading" }
  | { kind: "ready"; offerings: Offerings }
  | { kind: "no-offerings" }
  | { kind: "error"; message: string };

const VALUE_PROPS = [
  "Break toxic emotional cycles before attachment locks in.",
  "Stop confusing situational anxiety with a deep connection.",
  "Get a custom response strategy: Know exactly what to text next.",
  "Get what your friends are tired of repeating.",
] as const;

const TRUST_BADGES = [
  "Safe & Secure Checkout",
  "Instant Digital Delivery",
  "Cancel Anytime",
] as const;

function packageLabel(pkg: Package): string {
  switch (pkg.packageType) {
    case PackageType.Annual:
      return "Annual";
    case PackageType.Monthly:
      return "Monthly";
    default:
      return pkg.webBillingProduct.title;
  }
}

function packageNote(pkg: Package): string {
  switch (pkg.packageType) {
    case PackageType.Annual:
      return "Best value · per year";
    case PackageType.Monthly:
      return "Cancel anytime · per month";
    default:
      return "";
  }
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      minH="100dvh"
      bg="bg.canvas"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        w="full"
        maxW="420px"
        flex="1"
        display="flex"
        flexDirection="column"
        px={5}
        pt={8}
        pb={10}
      >
        {/* Wordmark */}
        <Text
          fontFamily="heading"
          fontSize="2xl"
          fontWeight="800"
          color="fg.default"
          textAlign="center"
          mb={6}
        >
          Lexi
          <Text as="span" color="brand.primary" fontSize="xl" ml="1px">
            ♥
          </Text>
        </Text>
        {children}
      </Box>
    </Box>
  );
}

export default function PaywallPage() {
  const router = useRouter();
  const { answers } = useFunnelContext();
  const checkoutRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<PageState>({ kind: "loading" });
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (!answers.firebaseUid) {
      router.replace("/growth-plan/sign-in");
      return;
    }

    configureRevenueCat(answers.firebaseUid);

    let cancelled = false;

    const load = async () => {
      try {
        const rc = getRevenueCat();
        const offerings = await rc.getOfferings();
        if (cancelled) return;

        if (
          !offerings.current ||
          offerings.current.availablePackages.length === 0
        ) {
          setState({ kind: "no-offerings" });
          return;
        }

        const defaultPkg =
          offerings.current.annual ??
          offerings.current.monthly ??
          offerings.current.availablePackages[0];

        setSelectedPkg(defaultPkg);
        setState({ kind: "ready", offerings });

        track(EVENTS.PAYWALL_VIEWED, {
          packages: offerings.current.availablePackages.map(
            (p) => p.identifier,
          ),
          default_package: defaultPkg.identifier,
        });
      } catch (err: unknown) {
        if (cancelled) return;
        const msg =
          err instanceof Error ? err.message : "Failed to load plans.";
        setState({ kind: "error", message: msg });
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers.firebaseUid]);

  const handlePurchase = async () => {
    if (!selectedPkg) return;
    setPurchaseError(null);
    setIsPurchasing(true);

    track(EVENTS.PURCHASE_STARTED, {
      package_id: selectedPkg.identifier,
      package_type: selectedPkg.packageType,
      price_formatted:
        selectedPkg.webBillingProduct.currentPrice.formattedPrice,
    });

    try {
      const rc = getRevenueCat();
      await rc.purchase({
        rcPackage: selectedPkg,
        htmlTarget: checkoutRef.current ?? undefined,
        customerEmail: answers.userEmail,
        metadata: { source: "lexi-funnel" },
      });

      setAmplitudeUserProperties({
        plan_type: selectedPkg.packageType,
        subscribed: true,
      });
      track(EVENTS.PURCHASE_COMPLETED, {
        package_id: selectedPkg.identifier,
        package_type: selectedPkg.packageType,
        price_formatted:
          selectedPkg.webBillingProduct.currentPrice.formattedPrice,
      });
      router.push("/growth-plan/activate");
    } catch (err: unknown) {
      const rcErr = err as PurchasesError;
      if (rcErr?.errorCode === 1) {
        // User cancelled — restore offerings without surfacing an error.
        setIsPurchasing(false);
        const rc = getRevenueCat();
        const restored = await rc.getOfferings().catch(() => null);
        setState(
          restored
            ? { kind: "ready", offerings: restored }
            : { kind: "no-offerings" },
        );
        return;
      }

      const msg =
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.";
      setPurchaseError(msg);
      setIsPurchasing(false);
      track(EVENTS.PURCHASE_FAILED, {
        package_id: selectedPkg.identifier,
        error: msg,
      });

      const rc = getRevenueCat();
      const restored = await rc.getOfferings().catch(() => null);
      setState(
        restored
          ? { kind: "ready", offerings: restored }
          : { kind: "no-offerings" },
      );
    }
  };

  if (state.kind === "loading") {
    return (
      <PageShell>
        <VStack flex="1" justify="center" gap={3}>
          <Spinner size="lg" color="brand.primary" />
          <Text fontSize="sm" color="fg.muted" fontWeight="500">
            Preparing your read...
          </Text>
        </VStack>
      </PageShell>
    );
  }

  if (state.kind === "no-offerings" || state.kind === "error") {
    return (
      <PageShell>
        <VStack flex="1" justify="center" gap={4} align="stretch">
          <Text
            fontFamily="body"
            fontSize="xl"
            fontWeight="800"
            color="fg.default"
            textAlign="center"
          >
            {state.kind === "error"
              ? "Something went wrong"
              : "Plans unavailable"}
          </Text>
          <Text fontSize="sm" color="fg.muted" textAlign="center">
            {state.kind === "error"
              ? state.message
              : "We couldn't load plans right now. Please try again later."}
          </Text>
          <Button
            bg="brand.primary"
            color="white"
            borderRadius="full"
            fontFamily="body"
            fontWeight="700"
            onClick={() => router.push("/growth-plan/landing")}
            _hover={{ opacity: 0.9 }}
          >
            Start over
          </Button>
        </VStack>
      </PageShell>
    );
  }

  if (state.kind !== "ready") return null;
  const packages: Package[] = state.offerings.current?.availablePackages ?? [];

  return (
    <PageShell>
      <VStack gap={6} align="stretch" flex="1">
        {/* Mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: "center" }}
        >
          <LexiAvatar mood="soft" size="md" />
        </motion.div>

        {/* Hook */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Text
            fontFamily="body"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="900"
            color="fg.default"
            lineHeight="1.3"
            letterSpacing="-0.5px"
            textAlign="center"
          >
            Stop romanticizing people who{" "}
            <Text as="span" color="brand.primary">
              never choose you clearly.
            </Text>
          </Text>
        </motion.div>

        {/* Value props */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <VStack gap={3} align="stretch">
            {VALUE_PROPS.map((prop) => (
              <Box key={prop} display="flex" gap={3} alignItems="flex-start">
                <Box
                  w="20px"
                  h="20px"
                  borderRadius="full"
                  bg="lexi.pinkLight"
                  border="1.5px solid"
                  borderColor="brand.primary"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  mt="1px"
                >
                  <Text fontSize="9px" color="brand.primary" fontWeight="900">
                    ✓
                  </Text>
                </Box>
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color="fg.default"
                  lineHeight="1.5"
                >
                  {prop}
                </Text>
              </Box>
            ))}
          </VStack>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <VStack gap={3} align="stretch">
            {packages.map((pkg, i) => {
              const isSelected = selectedPkg?.identifier === pkg.identifier;
              const isMostPopular = i === 0;

              return (
                <Box
                  key={pkg.identifier}
                  as="button"
                  onClick={() => setSelectedPkg(pkg)}
                  w="full"
                  textAlign="left"
                  borderRadius="2xl"
                  border="2px solid"
                  borderColor={isSelected ? "brand.primary" : "border.light"}
                  bg={isSelected ? "lexi.pinkLight" : "card.bg"}
                  px={5}
                  py={4}
                  cursor="pointer"
                  transition="all 0.18s"
                  position="relative"
                  boxShadow={
                    isSelected ? "0 4px 20px rgba(255,125,186,0.2)" : "none"
                  }
                  _hover={{ borderColor: "brand.primary" }}
                >
                  {isMostPopular && (
                    <Box
                      position="absolute"
                      top="-10px"
                      left="16px"
                      px={3}
                      py={0.5}
                      borderRadius="full"
                      bg="brand.primary"
                    >
                      <Text
                        fontSize="9px"
                        fontWeight="800"
                        color="white"
                        letterSpacing="wider"
                        textTransform="uppercase"
                      >
                        Most Popular
                      </Text>
                    </Box>
                  )}

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Text
                        fontFamily="body"
                        fontSize="md"
                        fontWeight="800"
                        color="fg.default"
                      >
                        {packageLabel(pkg)}
                      </Text>
                      <Text
                        fontSize="xs"
                        color="fg.muted"
                        fontWeight="500"
                        mt={0.5}
                      >
                        {packageNote(pkg)}
                      </Text>
                    </Box>
                    <Text
                      fontFamily="body"
                      fontSize="xl"
                      fontWeight="900"
                      color={isSelected ? "brand.primary" : "fg.default"}
                    >
                      {pkg.webBillingProduct.currentPrice.formattedPrice}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </VStack>
        </motion.div>

        {/* RC checkout mount point */}
        <Box ref={checkoutRef} w="full" />

        {purchaseError && (
          <Text
            fontSize="sm"
            color="red.400"
            textAlign="center"
            fontWeight="600"
          >
            {purchaseError}
          </Text>
        )}

        {/* CTA */}
        <Button
          bg="brand.primary"
          color="white"
          borderRadius="full"
          py={7}
          w="full"
          fontFamily="body"
          fontWeight="700"
          fontSize="lg"
          disabled={!selectedPkg || isPurchasing}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "0 12px 32px rgba(255,125,186,0.45)",
          }}
          _active={{ transform: "translateY(0)" }}
          _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
          transition="all 0.2s"
          onClick={handlePurchase}
        >
          {isPurchasing ? (
            <Box display="flex" alignItems="center" gap={2}>
              <Spinner size="sm" />
              <Text>Processing…</Text>
            </Box>
          ) : (
            "Get Instant Clarity"
          )}
        </Button>

        {/* Trust badges */}
        <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap">
          {TRUST_BADGES.map((badge) => (
            <Text
              key={badge}
              fontSize="10px"
              color="fg.muted"
              fontWeight="600"
              letterSpacing="wide"
            >
              🔒 {badge}
            </Text>
          ))}
        </Box>

        <GrowthPlanPolicy />
      </VStack>
    </PageShell>
  );
}
