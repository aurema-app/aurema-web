"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Box, Button, Spinner, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { Package, PurchasesError } from "@revenuecat/purchases-js";
import { PackageType } from "@revenuecat/purchases-js";

import { GrowthPlanPolicy } from "@/funnel/components/GrowthPlanPolicy";
import { LexiAvatar } from "@/funnel/components/lexi/LexiAvatar";
import {
  DUMMY_PAYWALL_PLANS,
  DUMMY_PURCHASE_KEY,
  type PaywallPlan,
} from "@/funnel/paywall/dummyPackages";
import {
  configureRevenueCat,
  getRevenueCat,
  isRevenueCatEnabled,
} from "@/funnel/services/revenueCatClient";
import { setAmplitudeUserProperties } from "@/funnel/analytics/amplitudeClient";
import { useFunnelContext } from "@/funnel/state/FunnelContext";
import { EVENTS, track } from "@/funnel/analytics/track";

const SURFACE = "#F6F2FF";

type PageState =
  | { kind: "loading" }
  | { kind: "ready"; plans: PaywallPlan[]; mode: "dummy" | "live" }
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

function useDummyPaywall(firebaseUid: string | undefined): boolean {
  if (!isRevenueCatEnabled()) return true;
  return Boolean(firebaseUid?.startsWith("email:"));
}

function packageToPlan(pkg: Package, index: number): PaywallPlan {
  const label =
    pkg.packageType === PackageType.Annual
      ? "Annual"
      : pkg.packageType === PackageType.Monthly
        ? "Monthly"
        : pkg.webBillingProduct.title;

  const note =
    pkg.packageType === PackageType.Annual
      ? "Best value · per year"
      : pkg.packageType === PackageType.Monthly
        ? "Cancel anytime · per month"
        : "";

  return {
    id: pkg.identifier,
    label,
    note,
    price: pkg.webBillingProduct.currentPrice.formattedPrice,
    isMostPopular: index === 0,
  };
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      minH="100dvh"
      w="full"
      bg={SURFACE}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        w="full"
        maxW="430px"
        flex="1"
        display="flex"
        flexDirection="column"
        px={5}
        pt="max(24px, env(safe-area-inset-top))"
        pb="max(20px, env(safe-area-inset-bottom))"
      >
        <Box
          mx="auto"
          position="relative"
          h="36px"
          w="88px"
          mb={6}
          flexShrink={0}
        >
          <Image
            src="/lexi/logo.png"
            alt="Lexi"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [livePackages, setLivePackages] = useState<Package[]>([]);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const dummyMode = useDummyPaywall(answers.firebaseUid);

  useEffect(() => {
    if (!answers.firebaseUid) {
      router.replace("/growth-plan/email");
      return;
    }

    if (dummyMode) {
      const defaultPlan =
        DUMMY_PAYWALL_PLANS.find((p) => p.isMostPopular) ??
        DUMMY_PAYWALL_PLANS[0];
      setSelectedId(defaultPlan.id);
      setState({ kind: "ready", plans: DUMMY_PAYWALL_PLANS, mode: "dummy" });
      track(EVENTS.PAYWALL_VIEWED, {
        mode: "dummy",
        packages: DUMMY_PAYWALL_PLANS.map((p) => p.id),
      });
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

        const pkgs = offerings.current.availablePackages;
        const plans = pkgs.map(packageToPlan);
        const defaultPkg =
          offerings.current.annual ?? offerings.current.monthly ?? pkgs[0];

        setLivePackages(pkgs);
        setSelectedId(defaultPkg.identifier);
        setState({ kind: "ready", plans, mode: "live" });

        track(EVENTS.PAYWALL_VIEWED, {
          mode: "live",
          packages: pkgs.map((p) => p.identifier),
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
  }, [answers.firebaseUid, dummyMode]);

  const handleDummyPurchase = () => {
    const plan =
      state.kind === "ready"
        ? state.plans.find((p) => p.id === selectedId)
        : null;
    track(EVENTS.PURCHASE_COMPLETED, {
      mode: "dummy",
      package_id: selectedId,
      price_formatted: plan?.price,
    });
    setAmplitudeUserProperties({ plan_type: selectedId, subscribed: true });
    sessionStorage.setItem(DUMMY_PURCHASE_KEY, "1");
    router.push("/growth-plan/activate");
  };

  const handleLivePurchase = async () => {
    const selectedPkg = livePackages.find((p) => p.identifier === selectedId);
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
        setIsPurchasing(false);
        const rc = getRevenueCat();
        const restored = await rc.getOfferings().catch(() => null);
        if (restored?.current?.availablePackages.length) {
          const pkgs = restored.current.availablePackages;
          setLivePackages(pkgs);
          setState({
            kind: "ready",
            plans: pkgs.map(packageToPlan),
            mode: "live",
          });
        } else {
          setState({ kind: "no-offerings" });
        }
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
      if (restored?.current?.availablePackages.length) {
        const pkgs = restored.current.availablePackages;
        setLivePackages(pkgs);
        setState({
          kind: "ready",
          plans: pkgs.map(packageToPlan),
          mode: "live",
        });
      } else {
        setState({ kind: "no-offerings" });
      }
    }
  };

  const handlePurchase = () => {
    if (state.kind !== "ready") return;
    if (state.mode === "dummy") {
      handleDummyPurchase();
      return;
    }
    void handleLivePurchase();
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

  const { plans, mode } = state;

  return (
    <PageShell>
      <VStack gap={6} align="stretch" flex="1">
        {mode === "dummy" && (
          <Text
            fontSize="11px"
            fontWeight="600"
            color="fg.muted"
            textAlign="center"
            bg="lexi.cardFeedback"
            borderRadius="full"
            px={3}
            py={1}
            alignSelf="center"
          >
            Preview mode — no charge
          </Text>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: "center" }}
        >
          <LexiAvatar mood="soft" size="md" />
        </motion.div>

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
                  bg="lexi.primaryLight"
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

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <VStack gap={3} align="stretch">
            {plans.map((plan) => {
              const isSelected = selectedId === plan.id;

              return (
                <Box
                  key={plan.id}
                  as="button"
                  onClick={() => setSelectedId(plan.id)}
                  w="full"
                  textAlign="left"
                  borderRadius="2xl"
                  border="2px solid"
                  borderColor={isSelected ? "brand.primary" : "#E4DBFE"}
                  bg={isSelected ? "lexi.primaryLight" : "white"}
                  px={5}
                  py={4}
                  cursor="pointer"
                  transition="all 0.18s"
                  position="relative"
                  boxShadow={
                    isSelected ? "0 4px 20px rgba(236,72,153,0.2)" : "none"
                  }
                  _hover={{ borderColor: "brand.primary" }}
                >
                  {plan.isMostPopular && (
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
                        {plan.label}
                      </Text>
                      <Text
                        fontSize="xs"
                        color="fg.muted"
                        fontWeight="500"
                        mt={0.5}
                      >
                        {plan.note}
                      </Text>
                    </Box>
                    <Text
                      fontFamily="body"
                      fontSize="xl"
                      fontWeight="900"
                      color={isSelected ? "brand.primary" : "fg.default"}
                    >
                      {plan.price}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </VStack>
        </motion.div>

        {mode === "live" && <Box ref={checkoutRef} w="full" />}

        {purchaseError && (
          <Text
            fontSize="sm"
            color="red.500"
            textAlign="center"
            fontWeight="600"
          >
            {purchaseError}
          </Text>
        )}

        <Button
          bg="brand.primary"
          color="white"
          borderRadius="full"
          h="56px"
          w="full"
          fontFamily="display"
          fontWeight="700"
          fontSize="17px"
          disabled={!selectedId || isPurchasing}
          _hover={{
            transform: selectedId ? "translateY(-2px)" : undefined,
            boxShadow: selectedId
              ? "0 12px 32px rgba(236,72,153,0.45)"
              : undefined,
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
          ) : mode === "dummy" ? (
            "Continue (preview)"
          ) : (
            "Get Instant Clarity"
          )}
        </Button>

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
