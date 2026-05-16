"use client";

import Image from "next/image";
import { Box, Flex, IconButton } from "@chakra-ui/react";

import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";

const BackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 18l-6-6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function FunnelHeader() {
  const { goPrev, currentIndex } = useFunnelNavigation();
  const showBack = currentIndex > 0;

  return (
    <Flex
      w="full"
      maxW="sm"
      mx="auto"
      px={4}
      py={3}
      alignItems="center"
      position="relative"
    >
      {showBack && (
        <IconButton
          aria-label="Go back"
          variant="ghost"
          color="fg.muted"
          size="sm"
          position="absolute"
          left={2}
          onClick={goPrev}
          _hover={{ bg: "transparent", color: "fg.default" }}
        >
          <BackIcon />
        </IconButton>
      )}

      <Box mx="auto">
        <Image
          src="/logo.png"
          alt="Aurema"
          width={36}
          height={36}
          style={{ objectFit: "contain" }}
        />
      </Box>
    </Flex>
  );
}
