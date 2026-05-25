"use client";

import { useRef, useState } from "react";

import { Box, Button, Text, Textarea, VStack, Wrap } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track, EVENTS } from "@/funnel/analytics/track";

import { LexiAvatar } from "@/funnel/components/lexi/LexiAvatar";

const SURFACE = "#F6F2FF";

const QUICK_CHIPS = [
  "I'm just so overwhelmed with work right now",
  "I really like you but I don't want to ruin what we have",
  "I'm fresh out of a relationship, I need space",
  "I'm not looking for anything serious but let's keep hanging out",
];

const MAX_IMAGES = 3;

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function EvidenceStep() {
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isChipSelected, setIsChipSelected] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { setAnswer } = useFunnelAnswers();
  const { goNext } = useFunnelNavigation();

  const handleChip = (chip: string) => {
    setText(chip);
    setIsChipSelected(true);
  };

  const handleTextChange = (value: string) => {
    setText(value);
    setIsChipSelected(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setLoadingImages(true);
    try {
      const remaining = MAX_IMAGES - images.length;
      const toProcess = files.slice(0, remaining);
      const dataUrls = await Promise.all(toProcess.map(readFileAsDataURL));
      setImages((prev) => [...prev, ...dataUrls]);
    } catch {
      // Silently drop unreadable files
    } finally {
      setLoadingImages(false);
      // Reset so same file can be re-selected
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const canSubmit = text.trim().length > 0 || images.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const evidenceType =
      images.length > 0 ? "screenshot" : isChipSelected ? "chip" : "text";

    setAnswer("evidenceText", text.trim());
    setAnswer("evidenceImages", images.length > 0 ? images : undefined);
    setAnswer("evidenceType", evidenceType);
    track(EVENTS.STEP_EXIT, {
      step: "evidence",
      evidenceType,
      hasText: text.trim().length > 0,
      imageCount: images.length,
    });
    goNext();
  };

  return (
    <Box
      h="100dvh"
      maxH="100dvh"
      w="full"
      bg={SURFACE}
      display="flex"
      flexDirection="column"
      alignItems="center"
      overflow="hidden"
    >
      <Box
        w="full"
        maxW="430px"
        h="full"
        display="flex"
        flexDirection="column"
        bg={SURFACE}
        pt="max(24px, env(safe-area-inset-top))"
      >
        <Box
          flex="1"
          overflowY="auto"
          overflowX="hidden"
          minH={0}
          px={5}
          pb={3}
          css={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Box display="flex" flexDirection="column" gap={5}>
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
                Give Lexi something real to read. Choose how you want to share
                the vibe.
              </Text>
            </motion.div>

            <VStack gap={4} align="stretch">
              {/* Option 1 — Text paste */}
              <Box
                bg="card.bg"
                borderRadius="2xl"
                border="1.5px solid"
                borderColor={
                  text.trim() && !isChipSelected
                    ? "brand.primary"
                    : "border.light"
                }
                overflow="hidden"
                transition="border-color 0.15s"
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
                  onChange={(e) => handleTextChange(e.target.value)}
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
                      borderColor={
                        isChipSelected && text === chip
                          ? "brand.primary"
                          : "border.light"
                      }
                      bg={
                        isChipSelected && text === chip
                          ? "lexi.primaryLight"
                          : "card.bg"
                      }
                      fontSize="xs"
                      fontWeight="600"
                      color="fg.default"
                      cursor="pointer"
                      textAlign="left"
                      transition="all 0.15s"
                      _hover={{
                        borderColor: "brand.primary",
                        bg: "lexi.primaryLight",
                      }}
                      _active={{ transform: "scale(0.97)" }}
                      onClick={() => handleChip(chip)}
                    >
                      &ldquo;{chip}&rdquo;
                    </Box>
                  ))}
                </Wrap>
              </Box>

              {/* Option 3 — Screenshot upload */}
              <Box>
                <Box
                  as="button"
                  border="2px dashed"
                  borderColor={
                    images.length > 0 ? "brand.primary" : "border.light"
                  }
                  borderRadius="2xl"
                  p={4}
                  textAlign="center"
                  cursor={images.length >= MAX_IMAGES ? "default" : "pointer"}
                  transition="all 0.18s"
                  w="full"
                  _hover={
                    images.length < MAX_IMAGES
                      ? {
                          borderColor: "brand.secondary",
                          bg: "lexi.lavenderLight",
                        }
                      : {}
                  }
                  onClick={() => {
                    if (images.length < MAX_IMAGES) fileRef.current?.click();
                  }}
                >
                  {loadingImages ? (
                    <Text fontSize="sm" color="fg.muted" fontWeight="600">
                      Loading...
                    </Text>
                  ) : (
                    <>
                      <Text fontSize="sm" color="fg.muted" fontWeight="600">
                        📎{" "}
                        {images.length === 0
                          ? "Upload screenshots (JPEG/PNG)"
                          : images.length >= MAX_IMAGES
                            ? `${MAX_IMAGES} screenshots added`
                            : `Add more screenshots (${images.length}/${MAX_IMAGES})`}
                      </Text>
                      {images.length === 0 && (
                        <Text
                          fontSize="xs"
                          color="fg.muted"
                          mt={1}
                          opacity={0.7}
                        >
                          Tap to attach · up to {MAX_IMAGES} images
                        </Text>
                      )}
                    </>
                  )}
                </Box>

                {/* Thumbnails */}
                {images.length > 0 && (
                  <Wrap gap={2} mt={3}>
                    {images.map((url, idx) => (
                      <Box key={idx} position="relative" w="72px" h="72px">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Screenshot ${idx + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "12px",
                          }}
                        />
                        <Box
                          as="button"
                          position="absolute"
                          top="-6px"
                          right="-6px"
                          w="20px"
                          h="20px"
                          borderRadius="full"
                          bg="brand.primary"
                          color="white"
                          fontSize="10px"
                          fontWeight="800"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          cursor="pointer"
                          onClick={() => removeImage(idx)}
                        >
                          ✕
                        </Box>
                      </Box>
                    ))}
                  </Wrap>
                )}

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </Box>
            </VStack>
          </Box>
        </Box>

        <Box
          flexShrink={0}
          w="full"
          px={5}
          pt={3}
          pb="max(16px, env(safe-area-inset-bottom))"
          bg={SURFACE}
          borderTop="1px solid"
          borderColor="lexi.border"
        >
          <Button
            bg={canSubmit ? "brand.primary" : "border.light"}
            color={canSubmit ? "white" : "fg.muted"}
            borderRadius="full"
            h="56px"
            w="full"
            fontFamily="display"
            fontWeight="700"
            fontSize="17px"
            disabled={!canSubmit || loadingImages}
            _hover={
              canSubmit
                ? {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 32px rgba(236,72,153,0.38)",
                  }
                : {}
            }
            _active={{ transform: "translateY(0)" }}
            _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
            transition="all 0.18s ease"
            onClick={handleSubmit}
          >
            Decode the Mess
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
