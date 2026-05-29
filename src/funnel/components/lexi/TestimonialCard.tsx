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
      boxShadow="0 4px 20px rgba(118, 68, 118, 0.08)"
      display="flex"
      alignItems="stretch"
      overflow="hidden"
      minH="110px"
      position="relative"
    >
      {/* Avatar column — image is 90% card height, full column width, fully visible */}
      <Box
        position="relative"
        w={{ base: "96px", sm: "108px" }}
        flexShrink={0}
        alignSelf="stretch"
      >
        <Box position="absolute" top="5%" left={0} w="full" h="90%">
          <Image
            src={avatarSrc}
            alt=""
            fill
            sizes="108px"
            style={{
              objectFit: "contain",
              objectPosition: "center center",
            }}
          />
        </Box>
      </Box>

      <Box
        flex="1"
        minW={0}
        py={3}
        pr={4}
        pl={3}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          <Text
            fontFamily="body"
            fontSize="sm"
            fontWeight="700"
            color="fg.default"
            mb={1.5}
            lineHeight="1.3"
          >
            {title}
          </Text>
          <Text
            fontFamily="body"
            fontSize="12px"
            fontWeight="500"
            color="fg.muted"
            lineHeight="1.5"
          >
            {body}
          </Text>
        </Box>
        <Text
          fontFamily="body"
          fontSize="12px"
          fontWeight="500"
          color="fg.muted"
          textAlign="right"
          mt={2}
          flexShrink={0}
        >
          {handle}
        </Text>
      </Box>
    </Box>
  );
}
