"use client";

import Image from "next/image";

import { Box, Text } from "@chakra-ui/react";

type TestimonialCardProps = {
  avatarSrc: string;
  title: string;
  handle: string;
  body: string;
};

export function TestimonialCard({
  avatarSrc,
  title,
  handle,
  body,
}: TestimonialCardProps) {
  return (
    <Box
      bg="card.bg"
      borderRadius="2xl"
      px={4}
      py={4}
      boxShadow="0 4px 20px rgba(118, 68, 118, 0.08)"
      display="flex"
      gap={3}
      alignItems="flex-start"
    >
      <Box
        position="relative"
        w="72px"
        h="72px"
        flexShrink={0}
        borderRadius="xl"
        overflow="hidden"
      >
        <Image
          src={avatarSrc}
          alt=""
          fill
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
      </Box>

      <Box flex="1" minW={0}>
        <Text
          fontFamily="body"
          fontSize="sm"
          fontWeight="700"
          color="fg.default"
          mb={2}
        >
          {title}
        </Text>
        <Text
          fontFamily="body"
          fontSize="xs"
          fontWeight="500"
          color="fg.muted"
          lineHeight="1.55"
          mb={3}
        >
          {body}
        </Text>
        <Text
          fontFamily="body"
          fontSize="xs"
          fontWeight="500"
          color="fg.muted"
          textAlign="right"
        >
          {handle}
        </Text>
      </Box>
    </Box>
  );
}
