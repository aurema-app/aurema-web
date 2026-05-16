"use client";

import { useRef, useState } from "react";

import { Box, Button, Text, Textarea, VStack, Wrap } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track, EVENTS } from "@/funnel/analytics/track";

import { LexiLayout } from "@/funnel/components/lexi/LexiLayout";
import { LexiTopBar } from "@/funnel/components/lexi/LexiTopBar";
import { LexiAvatar } from "@/funnel/components/lexi/LexiAvatar";

const QUICK_CHIPS = [
  "I'm just so overwhelmed with work right now",
  "I really like you but I don't want to ruin what we have",
  "I'm fresh out of a relationship, I need space",
  "I'm not looking for anything serious but let's keep hanging out",
];

export function EvidenceStep() {
  const [text, setText] = useState("");
  const [uploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { setAnswer } = useFunnelAnswers();
  const { goNext } = useFunnelNavigation();

  const handleChip = (chip: string) => {
    setText((prev) => (prev ? `${prev}\n${chip}` : chip));
  };

  const handleSubmit = () => {
    const evidence = text.trim();
    if (!evidence) return;
    setAnswer("evidenceText", evidence);
    track(EVENTS.STEP_EXIT, { step: "evidence", hasText: true });
    goNext();
  };

  return (
    <LexiLayout>
      <LexiTopBar showProgress={false} />

      <Box flex="1" display="flex" flexDirection="column" gap={5}>
        <Box textAlign="center">
          <LexiAvatar mood="holding-out" size="md" />
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Text
            fontFamily="body"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="900"
            color="fg.default"
            letterSpacing="-0.5px"
          >
            Drop the receipts.
          </Text>
          <Text
            fontSize="sm"
            color="fg.muted"
            fontWeight="500"
            mt={1}
            lineHeight="1.6"
          >
            Give Lexi something real to read. Choose how you want to share the
            vibe.
          </Text>
        </motion.div>

        <VStack gap={4} align="stretch">
          {/* Option 1 — Text paste */}
          <Box
            bg="card.bg"
            borderRadius="2xl"
            border="1.5px solid"
            borderColor="border.light"
            overflow="hidden"
          >
            <Box px={4} pt={3} pb={1}>
              <Text
                fontSize="xs"
                fontWeight="800"
                color="brand.primary"
                letterSpacing="wider"
                textTransform="uppercase"
              >
                Paste it in ✍️ — Recommended
              </Text>
            </Box>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste a confusing text, a recurring excuse they use, or just vent the situation here..."
              border="none"
              focusRingColor="transparent"
              _focus={{ boxShadow: "none" }}
              resize="none"
              rows={4}
              fontSize="sm"
              color="fg.default"
              fontFamily="body"
              fontWeight="500"
              px={4}
              py={3}
            />
          </Box>

          {/* Option 2 — Quick chips */}
          <Box>
            <Text
              fontSize="xs"
              fontWeight="800"
              color="fg.muted"
              letterSpacing="wider"
              textTransform="uppercase"
              mb={2}
            >
              Classic Excuses — Zero Friction
            </Text>
            <Wrap gap={2}>
              {QUICK_CHIPS.map((chip) => (
                <Box
                  key={chip}
                  as="button"
                  px={3}
                  py={2}
                  borderRadius="full"
                  border="1.5px solid"
                  borderColor="border.light"
                  bg="card.bg"
                  fontSize="xs"
                  fontWeight="600"
                  color="fg.default"
                  cursor="pointer"
                  textAlign="left"
                  transition="all 0.15s"
                  _hover={{
                    borderColor: "brand.primary",
                    bg: "lexi.pinkLight",
                  }}
                  _active={{ transform: "scale(0.97)" }}
                  onClick={() => handleChip(chip)}
                >
                  &ldquo;{chip}&rdquo;
                </Box>
              ))}
            </Wrap>
          </Box>

          {/* Option 3 — File upload */}
          <Box
            as="button"
            border="2px dashed"
            borderColor="border.light"
            borderRadius="2xl"
            p={4}
            textAlign="center"
            cursor="pointer"
            transition="all 0.18s"
            _hover={{
              borderColor: "brand.secondary",
              bg: "lexi.lavenderLight",
            }}
            onClick={() => fileRef.current?.click()}
          >
            <Text fontSize="sm" color="fg.muted" fontWeight="600">
              📎 Upload a screenshot (JPEG/PNG)
            </Text>
            <Text fontSize="xs" color="fg.muted" mt={1} opacity="0.7">
              Tap to attach
            </Text>
          </Box>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && !text) {
                setText(`[Screenshot uploaded: ${file.name}]`);
              }
            }}
          />
        </VStack>

        <Button
          bg={text.trim() ? "brand.primary" : "border.light"}
          color={text.trim() ? "white" : "fg.muted"}
          borderRadius="full"
          py={6}
          w="full"
          fontFamily="body"
          fontWeight="700"
          fontSize="md"
          disabled={!text.trim() || uploading}
          _hover={
            text.trim()
              ? {
                  transform: "translateY(-1px)",
                  boxShadow: "0 8px 24px rgba(255,125,186,0.4)",
                }
              : {}
          }
          _active={{ transform: "translateY(0)" }}
          transition="all 0.2s"
          onClick={handleSubmit}
          mt="auto"
        >
          Decode the Mess
        </Button>
      </Box>
    </LexiLayout>
  );
}
