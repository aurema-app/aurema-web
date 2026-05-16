"use client";

import { Button, Flex, Text } from "@chakra-ui/react";

type OptionTextProps = {
  children: React.ReactNode;
  emoji?: string;
  selected?: boolean;
  onClick: () => void;
};

export function OptionText({
  children,
  emoji,
  selected = false,
  onClick,
}: OptionTextProps) {
  return (
    <Button
      w="full"
      h="auto"
      minH="56px"
      px={4}
      py={4}
      bg={selected ? "brand.primary" : "transparent"}
      color={selected ? "bg.canvas" : "fg.default"}
      border="1px solid"
      borderColor={selected ? "brand.primary" : "fg.muted"}
      borderRadius="xl"
      fontFamily="body"
      fontWeight="500"
      fontSize="md"
      textAlign="left"
      justifyContent="flex-start"
      onClick={onClick}
      aria-pressed={selected}
      _hover={{
        bg: selected ? "brand.primary" : "whiteAlpha.100",
        opacity: selected ? 0.9 : 1,
      }}
    >
      <Flex align="center" gap={3} w="full">
        {emoji && (
          <Text as="span" fontSize="1.3rem" lineHeight="1" flexShrink={0}>
            {emoji}
          </Text>
        )}
        <Text as="span" flex="1" whiteSpace="normal" lineHeight="1.4">
          {children}
        </Text>
      </Flex>
    </Button>
  );
}
