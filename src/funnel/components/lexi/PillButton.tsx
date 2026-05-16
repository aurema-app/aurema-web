"use client";

import { Box, Text } from "@chakra-ui/react";

type PillButtonProps = {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
};

export function PillButton({
  children,
  selected = false,
  onClick,
}: PillButtonProps) {
  return (
    <Box
      as="button"
      w="full"
      textAlign="left"
      px={5}
      py={4}
      borderRadius="2xl"
      border="2px solid"
      borderColor={selected ? "brand.primary" : "border.light"}
      bg={selected ? "lexi.pinkLight" : "card.bg"}
      cursor="pointer"
      transition="all 0.18s ease"
      _hover={{
        borderColor: "brand.primary",
        bg: "lexi.pinkLight",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 16px rgba(255, 125, 186, 0.2)",
      }}
      _active={{ transform: "translateY(0)" }}
      onClick={onClick}
    >
      <Text
        fontFamily="body"
        fontSize={{ base: "sm", md: "md" }}
        fontWeight={selected ? "700" : "600"}
        color={selected ? "brand.primary" : "fg.default"}
        lineHeight="1.4"
      >
        {children}
      </Text>
    </Box>
  );
}
