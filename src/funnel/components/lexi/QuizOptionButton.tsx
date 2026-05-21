"use client";

import { Box, Text } from "@chakra-ui/react";

type QuizOptionButtonProps = {
  emoji: string;
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

export function QuizOptionButton({
  emoji,
  label,
  selected = false,
  onClick,
}: QuizOptionButtonProps) {
  return (
    <Box
      as="button"
      w="full"
      display="flex"
      alignItems="center"
      gap={3}
      px={4}
      py={3.5}
      borderRadius="xl"
      border="1px solid"
      borderColor={selected ? "brand.primary" : "border.light"}
      bg="card.bg"
      cursor="pointer"
      transition="all 0.15s ease"
      _hover={{
        borderColor: "brand.primary",
        bg: selected ? "lexi.primaryLight" : "card.bg",
      }}
      _active={{ transform: "scale(0.99)" }}
      onClick={onClick}
    >
      <Text fontSize="lg" lineHeight="1" flexShrink={0} aria-hidden>
        {emoji}
      </Text>
      <Text
        fontFamily="body"
        fontSize="16px"
        fontWeight={selected ? "600" : "400"}
        color="fg.default"
        lineHeight="1.35"
        textAlign="left"
      >
        {label}
      </Text>
    </Box>
  );
}
