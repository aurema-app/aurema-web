"use client";

import { Box, Button, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { LexiLayout } from "@/funnel/components/lexi/LexiLayout";
import { LexiTopBar } from "@/funnel/components/lexi/LexiTopBar";
import { LexiAvatar } from "@/funnel/components/lexi/LexiAvatar";

export function PatternDetectedStep() {
  const { goNext } = useFunnelNavigation();

  return (
    <LexiLayout>
      <LexiTopBar showProgress={false} />

      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        gap={6}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <LexiAvatar mood="knowing" size="lg" />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Box
            display="inline-block"
            px={4}
            py={1}
            borderRadius="full"
            bg="lexi.lavenderLight"
            border="1.5px solid"
            borderColor="brand.secondary"
          >
            <Text
              fontSize="xs"
              fontWeight="800"
              color="brand.secondary"
              letterSpacing="wider"
              textTransform="uppercase"
            >
              Pattern Baseline Detected
            </Text>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
        >
          <Text
            fontFamily="body"
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="900"
            color="fg.default"
            lineHeight="1.15"
            letterSpacing="-1px"
          >
            Pattern baseline{" "}
            <Text as="span" color="brand.primary">
              detected.
            </Text>
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Text
            fontFamily="body"
            fontSize="sm"
            color="fg.muted"
            fontWeight="500"
            lineHeight="1.7"
          >
            We&rsquo;ve matched your answers with thousands of behavioral
            profiles. Before we reveal your specific type, we need the final
            piece of evidence.
          </Text>
        </motion.div>

        {/* Decorative bar chart / stats illusion */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ width: "100%", transformOrigin: "left" }}
        >
          <Box display="flex" flexDirection="column" gap={2} w="full">
            {[
              ["Loop Risk", "84%", "brand.primary"],
              ["Breadcrumb Tolerance", "71%", "brand.secondary"],
              ["Situationship Depth", "90%", "lexi.pink"],
            ].map(([label, pct, color]) => (
              <Box key={label} w="full">
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Text fontSize="xs" fontWeight="600" color="fg.muted">
                    {label}
                  </Text>
                  <Text fontSize="xs" fontWeight="800" color={color as string}>
                    {pct}
                  </Text>
                </Box>
                <Box
                  w="full"
                  h="6px"
                  bg="border.light"
                  borderRadius="full"
                  overflow="hidden"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: pct }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    style={{
                      height: "100%",
                      background:
                        color === "brand.secondary" ? "#C7A6F7" : "#FF7DBA",
                      borderRadius: "9999px",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </motion.div>

        <Button
          bg="brand.primary"
          color="white"
          borderRadius="full"
          py={6}
          w="full"
          fontFamily="body"
          fontWeight="700"
          fontSize="md"
          _hover={{
            transform: "translateY(-1px)",
            boxShadow: "0 8px 24px rgba(255,125,186,0.4)",
          }}
          _active={{ transform: "translateY(0)" }}
          transition="all 0.2s"
          onClick={goNext}
          mt="auto"
        >
          Provide Evidence
        </Button>
      </Box>
    </LexiLayout>
  );
}
