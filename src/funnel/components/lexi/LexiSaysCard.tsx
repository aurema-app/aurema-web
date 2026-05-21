"use client";

import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

type LexiSaysCardProps = {
  text: string;
};

export function LexiSaysCard({ text }: LexiSaysCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ width: "100%" }}
    >
      <Box position="relative" mt={4} w="full">
        {/* Offset layer — #A78BFA */}
        <Box
          position="absolute"
          top="5px"
          left="5px"
          right="-5px"
          bottom="-5px"
          bg="lexi.cardFeedbackShadow"
          borderRadius="xl"
        />

        {/* Card face — #E4DBFE */}
        <Box
          position="relative"
          bg="lexi.cardFeedback"
          borderRadius="xl"
          px={4}
          py={4}
        >
          <Text
            fontFamily="script"
            fontSize="12px"
            fontWeight="400"
            color="fg.muted"
            mb={2}
            lineHeight="1.2"
          >
            Lexi says
          </Text>

          <Text
            fontFamily="body"
            fontSize="12px"
            fontWeight="400"
            fontStyle="italic"
            color="fg.default"
            lineHeight="1.55"
          >
            &ldquo;{text}&rdquo;
          </Text>
        </Box>
      </Box>
    </motion.div>
  );
}
