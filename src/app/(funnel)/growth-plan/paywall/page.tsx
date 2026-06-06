"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Box, Button, Spinner, Text, VStack } from "@chakra-ui/react";
import type { Package, PurchasesError } from "@revenuecat/purchases-js";
import { PackageType } from "@revenuecat/purchases-js";

import {
  DUMMY_PAYWALL_PLANS,
  type PaywallPlan,
} from "@/funnel/paywall/dummyPackages";
import { LexiCtaButton } from "@/funnel/components/lexi/LexiCtaButton";
import { LexiCtaFooter } from "@/funnel/components/lexi/LexiCtaFooter";
import { LexiLogoBanner } from "@/funnel/components/lexi/LexiLogoBanner";
import { LexiStepScroll } from "@/funnel/components/lexi/LexiStepScroll";
import {
  configureRevenueCat,
  getRevenueCat,
  isRevenueCatEnabled,
} from "@/funnel/services/revenueCatClient";
import { setAmplitudeUserProperties } from "@/funnel/analytics/amplitudeClient";
import { useFunnelContext } from "@/funnel/state/FunnelContext";
import { EVENTS, track } from "@/funnel/analytics/track";
import { FUNNEL_STEP_TOP_PADDING } from "@/funnel/theme/layout.constants";

const SURFACE = "#F6F2FF";

type PageState =
  | { kind: "loading" }
  | { kind: "ready"; plans: PaywallPlan[]; mode: "dummy" | "live" }
  | { kind: "no-offerings" }
  | { kind: "error"; message: string };

function useDummyPaywall(): boolean {
  return !isRevenueCatEnabled();
}

function packageToPlan(pkg: Package, index: number): PaywallPlan {
  const label =
    pkg.packageType === PackageType.Annual
      ? "1 year"
      : pkg.packageType === PackageType.Monthly
        ? "1 month"
        : pkg.webBillingProduct.title;

  const rawPrice = pkg.webBillingProduct.currentPrice.amountMicros / 1_000_000;
  const days =
    pkg.packageType === PackageType.Annual
      ? 365
      : pkg.packageType === PackageType.Monthly
        ? 30
        : 7;
  const perDay = (rawPrice / days).toFixed(2);

  return {
    id: pkg.identifier,
    label,
    savePct: index === 0 ? 70 : 65,
    originalPrice: "",
    price: pkg.webBillingProduct.currentPrice.formattedPrice,
    perDay: `$${perDay}`,
    isMostPopular: index === 1,
  };
}

function PageShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
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
        pt={FUNNEL_STEP_TOP_PADDING}
      >
        <LexiStepScroll px={5} pb={3}>
          <Box display="flex" justifyContent="center" pt={2} mb={6}>
            <LexiLogoBanner />
          </Box>
          {children}
        </LexiStepScroll>
        {footer}
      </Box>
    </Box>
  );
}

function PlanCard({
  plan,
  isSelected,
  onSelect,
}: {
  plan: PaywallPlan;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Box position="relative">
      {plan.isMostPopular && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bg="#A78BDA"
          borderTopRadius="16px"
          py="6px"
          textAlign="center"
          zIndex={1}
        >
          <Text
            fontSize="11px"
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
        as="button"
        onClick={onSelect}
        w="full"
        textAlign="left"
        borderRadius="16px"
        border="2px solid"
        borderColor={isSelected ? "#A78BDA" : "#DDD6F8"}
        bg={isSelected ? "#EDE8FF" : "white"}
        px={4}
        pt={plan.isMostPopular ? "36px" : "14px"}
        pb="14px"
        cursor="pointer"
        transition="all 0.18s"
        _hover={{ borderColor: "#A78BDA" }}
        display="flex"
        alignItems="center"
        gap={3}
      >
        {/* Radio dot */}
        <Box
          w="20px"
          h="20px"
          borderRadius="full"
          border="2px solid"
          borderColor={isSelected ? "#A78BDA" : "#C4B8F0"}
          bg="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          {isSelected && (
            <Box w="10px" h="10px" borderRadius="full" bg="#A78BDA" />
          )}
        </Box>

        {/* Left: label + badge + prices */}
        <Box flex="1">
          <Text
            fontFamily="body"
            fontSize="18px"
            fontWeight="800"
            color="fg.default"
            fontStyle="italic"
            lineHeight="1.2"
          >
            {plan.label}
          </Text>
          <Box display="flex" alignItems="center" gap={2} mt={1}>
            <Box px="8px" py="2px" borderRadius="full" bg="#E8E0FF">
              <Text fontSize="11px" fontWeight="700" color="#7C5DC7">
                SAVE {plan.savePct}%
              </Text>
            </Box>
          </Box>
          {plan.originalPrice && (
            <Text fontSize="12px" color="fg.muted" mt={1}>
              <Text as="span" textDecoration="line-through">
                {plan.originalPrice}
              </Text>{" "}
              <Text as="span" color="fg.default" fontWeight="600">
                {plan.price}
              </Text>
            </Text>
          )}
        </Box>

        {/* Right: per-day price */}
        <Box
          flexShrink={0}
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
        >
          <Box display="flex" alignItems="baseline" justifyContent="flex-end">
            <Text
              fontFamily="body"
              fontSize={plan.isMostPopular ? "28px" : "22px"}
              fontWeight="900"
              color="fg.default"
              lineHeight="1"
              mr="1px"
            >
              $
            </Text>
            <Text
              fontFamily="body"
              fontSize={plan.isMostPopular ? "48px" : "36px"}
              fontWeight="900"
              color="fg.default"
              lineHeight="1"
            >
              {plan.perDay.replace(/^\$/, "")}
            </Text>
          </Box>
          <Text
            fontSize="10px"
            color="fg.muted"
            fontWeight="600"
            letterSpacing="wide"
          >
            PER DAY
          </Text>
        </Box>
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

  const dummyMode = useDummyPaywall();

  useEffect(() => {
    if (!answers.userEmail) {
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

    configureRevenueCat(answers.userEmail);
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
  }, [answers.userEmail, dummyMode]);

  const handleDummyPurchase = async () => {
    const plan =
      state.kind === "ready"
        ? state.plans.find((p) => p.id === selectedId)
        : null;
    if (!plan) return;

    setIsPurchasing(true);
    setPurchaseError(null);

    track(EVENTS.PURCHASE_STARTED, {
      mode: "stripe",
      package_id: plan.id,
      price_formatted: plan.price,
    });

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          planLabel: plan.label,
          priceFormatted: plan.price,
          email: answers.userEmail,
        }),
      });

      const json = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !json.url) {
        throw new Error(json.error ?? "Could not create checkout session.");
      }

      window.location.href = json.url;
    } catch (err) {
      setIsPurchasing(false);
      setPurchaseError(err instanceof Error ? err.message : "Checkout failed.");
    }
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
  const selectedPlan = plans.find((p) => p.id === selectedId);

  const footer = (
    <LexiCtaFooter showLegalLinks={false} showBorder={false}>
      {purchaseError && (
        <Text
          fontSize="sm"
          color="red.500"
          textAlign="center"
          fontWeight="600"
          mb={3}
        >
          {purchaseError}
        </Text>
      )}

      <LexiCtaButton
        fontStyle="italic"
        disabled={!selectedId || isPurchasing}
        transition="all 0.2s"
        _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
        onClick={handlePurchase}
      >
        {isPurchasing ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Spinner size="sm" />
            <Text>Redirecting...</Text>
          </Box>
        ) : selectedPlan ? (
          `Buy with ${selectedPlan.savePct}% discount`
        ) : (
          "Choose a plan"
        )}
      </LexiCtaButton>

      <Text
        fontSize="11px"
        color="fg.muted"
        fontWeight="400"
        textAlign="center"
        lineHeight="1.6"
        mt={3}
        px={2}
      >
        We&apos;ve automatically applied a discount to your first subscription
        price. Please note that your subscription will be automatically renewed
        at full price at the end of the intro period. Learn more about
        cancellation and refund policy in{" "}
        <Link href="/terms" style={{ textDecoration: "underline" }}>
          Subscription Policy
        </Link>
        .
      </Text>

      <Box display="flex" justifyContent="center" mt={3} mb={1}>
        <Image
          src="/lexi/payment-methods.png"
          alt="Accepted payment methods"
          width={424}
          height={140}
          style={{ width: "auto", height: "70px" }}
        />
      </Box>
    </LexiCtaFooter>
  );

  return (
    <PageShell footer={footer}>
      <VStack gap={4} align="stretch">
        {/* Headline */}
        <Text
          fontFamily="body"
          fontSize="22px"
          fontWeight="800"
          color="fg.default"
          textAlign="center"
          letterSpacing="-0.3px"
          fontStyle="italic"
        >
          Choose your plan
        </Text>

        {/* Plan cards */}
        <VStack gap={3} align="stretch">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedId === plan.id}
              onSelect={() => setSelectedId(plan.id)}
            />
          ))}
        </VStack>

        {mode === "live" && <Box ref={checkoutRef} w="full" />}
      </VStack>
    </PageShell>
  );
}
