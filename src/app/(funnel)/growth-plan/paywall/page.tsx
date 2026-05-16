"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Spinner, Text, VStack } from "@chakra-ui/react";
import type {
  Offerings,
  Package,
  PurchasesError,
} from "@revenuecat/purchases-js";
import { PackageType } from "@revenuecat/purchases-js";

import { FunnelHeader } from "@/funnel/components/FunnelHeader";
import { GrowthPlanPolicy } from "@/funnel/components/GrowthPlanPolicy";
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
  | { kind: "purchasing" }
  | { kind: "error"; message: string };

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

function packagePeriodNote(pkg: Package): string {
  switch (pkg.packageType) {
    case PackageType.Annual:
      return "per year · best value";
    case PackageType.Monthly:
      return "per month";
    default:
      return "";
  }
}

export default function PaywallPage() {
  const router = useRouter();
  const { answers } = useFunnelContext();
  const checkoutRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<PageState>({ kind: "loading" });
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  // Guard: must be signed in to reach this page.
  useEffect(() => {
    if (!answers.firebaseUid) {
      router.replace("/growth-plan/sign-in");
      return;
    }

    // Re-configure RC on page load to handle cases where the user navigated
    // directly or refreshed (RC configure is idempotent for the same user).
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

        // Default selection: annual > monthly > first available.
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
          default_package_type: defaultPkg.packageType,
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
    // Only run when firebaseUid changes, not on every answers update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers.firebaseUid]);

  const handlePurchase = async () => {
    if (!selectedPkg) return;
    setPurchaseError(null);
    setState({ kind: "purchasing" });

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
        metadata: { source: "growth-plan" },
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
      // ErrorCode 1 == UserCancelledError — don't show an error message.
      const rcErr = err as PurchasesError;
      if (rcErr?.errorCode === 1) {
        setState((prev) =>
          prev.kind === "purchasing"
            ? { kind: "ready", offerings: prev as never }
            : prev,
        );
        // Re-fetch state since we may have lost it during purchasing state.
        const rc = getRevenueCat();
        const offerings = await rc.getOfferings().catch(() => null);
        setState(
          offerings ? { kind: "ready", offerings } : { kind: "no-offerings" },
        );
        return;
      }

      const msg =
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.";
      setPurchaseError(msg);
      track(EVENTS.PURCHASE_FAILED, {
        package_id: selectedPkg.identifier,
        package_type: selectedPkg.packageType,
        error: msg,
      });

      // Restore ready state so user can retry.
      const rc = getRevenueCat();
      const offerings = await rc.getOfferings().catch(() => null);
      setState(
        offerings ? { kind: "ready", offerings } : { kind: "no-offerings" },
      );
    }
  };

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <Box minH="100vh" bg="bg.canvas" display="flex" flexDirection="column">
      <FunnelHeader />
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        px={4}
        pt={8}
        pb={10}
        maxW="480px"
        mx="auto"
        w="full"
        gap={6}
      >
        {children}
      </Box>
    </Box>
  );

  if (state.kind === "loading") {
    return (
      <Shell>
        <VStack gap={3} align="center" flex="1" justify="center">
          <Spinner size="lg" color="brand.primary" />
          <Text fontFamily="body" fontSize="sm" color="fg.muted">
            Loading your plan…
          </Text>
        </VStack>
      </Shell>
    );
  }

  if (state.kind === "no-offerings" || state.kind === "error") {
    return (
      <Shell>
        <VStack gap={4} align="stretch" flex="1" justify="center">
          <Text
            fontFamily="heading"
            fontSize="xl"
            fontWeight="bold"
            color="fg.default"
            textAlign="center"
          >
            {state.kind === "error"
              ? "Something went wrong"
              : "Plans unavailable"}
          </Text>
          <Text
            fontFamily="body"
            fontSize="sm"
            color="fg.muted"
            textAlign="center"
          >
            {state.kind === "error"
              ? state.message
              : "We couldn't load the available plans. Please try again later."}
          </Text>
          <Button
            onClick={() => router.push("/growth-plan/intro")}
            fontFamily="body"
            fontWeight="700"
            bg="brand.primary"
            color="bg.canvas"
            size="lg"
            borderRadius="xl"
            _hover={{ opacity: 0.9 }}
          >
            Start over
          </Button>
        </VStack>
      </Shell>
    );
  }

  const offering = state.offerings.current!;
  const packages = offering.availablePackages;

  return (
    <Shell>
      <VStack gap={2} align="center" w="full">
        <Text
          fontFamily="heading"
          fontSize="2xl"
          fontWeight="bold"
          color="fg.default"
          textAlign="center"
        >
          Unlock your growth plan
        </Text>
        <Text
          fontFamily="body"
          fontSize="sm"
          color="fg.muted"
          textAlign="center"
        >
          Choose the plan that works for you.
        </Text>
      </VStack>

      {/* Package selector */}
      <VStack gap={3} align="stretch" w="full">
        {packages.map((pkg) => {
          const isSelected = selectedPkg?.identifier === pkg.identifier;
          return (
            <Box
              key={pkg.identifier}
              as="button"
              onClick={() => setSelectedPkg(pkg)}
              w="full"
              textAlign="left"
              borderRadius="xl"
              border="2px solid"
              borderColor={isSelected ? "brand.primary" : "whiteAlpha.200"}
              bg={isSelected ? "whiteAlpha.100" : "transparent"}
              px={5}
              py={4}
              cursor="pointer"
              transition="all 0.15s ease"
              _hover={{ borderColor: "brand.primary", bg: "whiteAlpha.50" }}
            >
              <Text
                fontFamily="heading"
                fontSize="md"
                fontWeight="bold"
                color="fg.default"
                mb={0.5}
              >
                {packageLabel(pkg)}
              </Text>
              <Text fontFamily="body" fontSize="sm" color="fg.muted">
                {pkg.webBillingProduct.currentPrice.formattedPrice}{" "}
                {packagePeriodNote(pkg)}
              </Text>
            </Box>
          );
        })}
      </VStack>

      {/* RC embeds its checkout UI here on purchase() call */}
      <Box ref={checkoutRef} w="full" />

      {purchaseError && (
        <Text
          fontFamily="body"
          fontSize="sm"
          color="red.400"
          textAlign="center"
        >
          {purchaseError}
        </Text>
      )}

      <Button
        onClick={handlePurchase}
        disabled={!selectedPkg || state.kind === "purchasing"}
        w="full"
        size="lg"
        borderRadius="xl"
        fontFamily="body"
        fontWeight="700"
        bg="brand.primary"
        color="bg.canvas"
        _hover={{ opacity: 0.9 }}
        _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
      >
        {state.kind === "purchasing" ? (
          <VStack gap={1} align="center">
            <Spinner size="sm" />
            <span>Processing…</span>
          </VStack>
        ) : (
          "Start my plan"
        )}
      </Button>

      <GrowthPlanPolicy />
    </Shell>
  );
}
