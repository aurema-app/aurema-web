"use client";

import { useRef, useState } from "react";

import Image from "next/image";

import { Box, Button, Text, Textarea, Wrap } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

import { LexiCtaFooter } from "@/funnel/components/lexi/LexiCtaFooter";
import { LexiLogoBanner } from "@/funnel/components/lexi/LexiLogoBanner";
import { LexiStepScroll } from "@/funnel/components/lexi/LexiStepScroll";
import { useFunnelAnswers } from "@/funnel/state/useFunnelAnswers";
import { useFunnelNavigation } from "@/funnel/flow/useFunnelNavigation";
import { track, EVENTS } from "@/funnel/analytics/track";
import { FUNNEL_STEP_TOP_PADDING } from "@/funnel/theme/layout.constants";

const SURFACE = "#F6F2FF";
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
  const [showTextInput, setShowTextInput] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { setAnswer } = useFunnelAnswers();
  const { goNext } = useFunnelNavigation();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setLoadingImages(true);
    try {
      const remaining = MAX_IMAGES - images.length;
      const dataUrls = await Promise.all(
        files.slice(0, remaining).map(readFileAsDataURL),
      );
      setImages((prev) => [...prev, ...dataUrls]);
    } catch {
      // silently drop unreadable files
    } finally {
      setLoadingImages(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const canSubmit = text.trim().length > 0 || images.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const evidenceType = images.length > 0 ? "screenshot" : "text";
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
        pt={FUNNEL_STEP_TOP_PADDING}
      >
        <LexiStepScroll display="flex" flexDirection="column" px={6} pb={3}>
          {/* Logo */}
          <Box
            display="flex"
            justifyContent="center"
            pt={2}
            mb={6}
            flexShrink={0}
          >
            <LexiLogoBanner />
          </Box>

          {/* Headline */}
          <Text
            fontFamily="body"
            fontSize="24px"
            fontWeight="800"
            lineHeight="1.25"
            letterSpacing="-0.3px"
            color="fg.default"
            textAlign="center"
            mb={3}
            flexShrink={0}
          >
            Drop the receipts.
          </Text>

          {/* Subtitle */}
          <Text
            fontSize="15px"
            fontStyle="italic"
            fontWeight="500"
            color="fg.muted"
            lineHeight="1.6"
            textAlign="center"
            mb={6}
            flexShrink={0}
          >
            Give Lexi something real to read. Let&apos;s look at what they
            actually said, not what you wish they meant.
          </Text>

          {/* Attach screenshot image — tappable */}
          <Box
            as="button"
            w="full"
            cursor={images.length >= MAX_IMAGES ? "default" : "pointer"}
            onClick={() => {
              if (images.length < MAX_IMAGES) fileRef.current?.click();
            }}
            flexShrink={0}
            mb={1}
            _active={{ transform: "scale(0.98)" }}
            transition="transform 0.15s"
            position="relative"
          >
            {loadingImages ? (
              <Box
                border="2px dashed"
                borderColor="brand.primary"
                borderRadius="20px"
                py={8}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="15px" color="fg.muted" fontWeight="600">
                  Loading...
                </Text>
              </Box>
            ) : (
              <Image
                src="/lexi/attach-screenshots.png"
                alt="Tap to attach screenshot"
                width={1014}
                height={492}
                sizes="(max-width: 430px) 100vw, 430px"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: "20px",
                  opacity: images.length >= MAX_IMAGES ? 0.5 : 1,
                }}
                priority
              />
            )}
            {images.length >= MAX_IMAGES && (
              <Box
                position="absolute"
                inset={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="20px"
                bg="rgba(246,242,255,0.7)"
              >
                <Text fontSize="14px" fontWeight="700" color="brand.primary">
                  {MAX_IMAGES} images added ✓
                </Text>
              </Box>
            )}
          </Box>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />

          {/* Thumbnails */}
          {images.length > 0 && (
            <Wrap gap={2} mb={3} justify="center">
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
              {images.length < MAX_IMAGES && (
                <Box
                  as="button"
                  w="72px"
                  h="72px"
                  borderRadius="12px"
                  border="2px dashed"
                  borderColor="brand.primary"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  onClick={() => fileRef.current?.click()}
                  color="brand.primary"
                  fontSize="24px"
                >
                  +
                </Box>
              )}
            </Wrap>
          )}

          {/* "or paste a confusing text below" toggle */}
          <Box
            as="button"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            py={2}
            w="full"
            onClick={() => setShowTextInput((v) => !v)}
            flexShrink={0}
          >
            <Text
              fontSize="15px"
              fontWeight="800"
              fontStyle="italic"
              color="brand.primary"
              textAlign="center"
            >
              or paste a confusing text below 👇
            </Text>
          </Box>

          {/* Expandable text input */}
          <AnimatePresence>
            {showTextInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ overflow: "hidden", flexShrink: 0 }}
              >
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste a confusing text, a recurring excuse, or just describe the situation..."
                  border="1.5px solid"
                  borderColor={text.trim() ? "brand.primary" : "lexi.border"}
                  borderRadius="16px"
                  focusRingColor="transparent"
                  _focus={{ boxShadow: "none", borderColor: "brand.primary" }}
                  resize="none"
                  rows={4}
                  fontSize="15px"
                  color="fg.default"
                  fontFamily="body"
                  fontWeight="500"
                  bg="white"
                  px={4}
                  py={3}
                  mt={2}
                  mb={3}
                  transition="border-color 0.15s"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero image anchored to bottom */}
          <Box flex="1" display="flex" alignItems="flex-end" mt={2}>
            <Image
              src="/lexi/hero-4.png"
              alt="Lexi"
              width={716}
              height={506}
              sizes="100vw"
              style={{ width: "100%", height: "auto", display: "block" }}
              priority
            />
          </Box>
        </LexiStepScroll>

        <LexiCtaFooter px={6}>
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
            Decode the Receipts
          </Button>
        </LexiCtaFooter>
      </Box>
    </Box>
  );
}
