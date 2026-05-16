"use client";

import { Box, Text } from "@chakra-ui/react";

// Mood emoji map — matches the spec's mascot states
const MOOD_EMOJI: Record<string, string> = {
  unamused: "😑",
  tapping: "😤",
  peeking: "👀",
  "eye-roll": "🙄",
  analytical: "📱",
  facepalm: "🤦‍♀️",
  thoughtful: "🤔",
  "arms-crossed": "🙅‍♀️",
  knowing: "😏",
  "holding-out": "🤚",
  typing: "⌨️",
  "side-eye": "👁️",
  soft: "🫶",
};

type LexiAvatarProps = {
  mood?: keyof typeof MOOD_EMOJI;
  size?: "sm" | "md" | "lg";
};

const SIZE_MAP = {
  sm: { box: "60px", font: "1.8rem" },
  md: { box: "80px", font: "2.4rem" },
  lg: { box: "100px", font: "3rem" },
};

export function LexiAvatar({
  mood = "unamused",
  size = "md",
}: LexiAvatarProps) {
  const { box, font } = SIZE_MAP[size];
  const emoji = MOOD_EMOJI[mood] ?? "😑";

  return (
    <Box
      w={box}
      h={box}
      borderRadius="full"
      bg="brand.secondary"
      display="flex"
      alignItems="center"
      justifyContent="center"
      mx="auto"
      boxShadow="0 6px 24px rgba(199, 166, 247, 0.45)"
      position="relative"
    >
      <Text fontSize={font} lineHeight="1" userSelect="none">
        {emoji}
      </Text>
      {/* Pink accent dot */}
      <Box
        position="absolute"
        bottom="2px"
        right="2px"
        w="16px"
        h="16px"
        borderRadius="full"
        bg="brand.primary"
        border="2px solid white"
      />
    </Box>
  );
}
