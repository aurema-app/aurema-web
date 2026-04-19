"use client";

import Image from "next/image";
import { Box, Flex, Text } from "@chakra-ui/react";

type OptionWithImageProps = {
  src: string;
  alt: string;
  label: string;
  selected?: boolean;
  onClick: () => void;
};

export function OptionWithImage({
  src,
  alt,
  label,
  selected = false,
  onClick,
}: OptionWithImageProps) {
  return (
    <Flex
      as="button"
      direction="column"
      overflow="hidden"
      borderRadius="xl"
      border="2px solid"
      borderColor={selected ? "brand.primary" : "fg.muted"}
      w="full"
      cursor="pointer"
      onClick={onClick}
      aria-pressed={selected}
      _hover={{ borderColor: "brand.primary", opacity: 0.9 }}
      transition="border-color 150ms ease"
    >
      <Box position="relative" w="full" h="120px">
        <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} />
      </Box>
      <Flex
        justify="center"
        align="center"
        px={3}
        py={2}
        bg={selected ? "brand.primary" : "transparent"}
        transition="background 150ms ease"
      >
        <Text
          fontFamily="body"
          fontWeight="600"
          fontSize="sm"
          color={selected ? "bg.canvas" : "fg.default"}
        >
          {label}
        </Text>
      </Flex>
    </Flex>
  );
}
