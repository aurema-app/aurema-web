"use client";

import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

type MicroFeedbackProps = {
  text: string;
};

export function MicroFeedback({ text }: MicroFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Box
        mt={4}
        px={5}
        py={4}
        borderRadius="2xl"
        bg="lexi.lavenderLight"
        borderLeft="3px solid"
        borderColor="brand.secondary"
        position="relative"
      >
        <Text
          fontSize="xs"
          fontWeight="700"
          color="brand.secondary"
          letterSpacing="wider"
          textTransform="uppercase"
          mb={1}
        >
          Lexi says
        </Text>
        <Text
          fontFamily="body"
          fontSize="sm"
          fontWeight="600"
          color="fg.default"
          lineHeight="1.6"
          fontStyle="italic"
        >
          &ldquo;{text}&rdquo;
        </Text>
      </Box>
    </motion.div>
  );
}
