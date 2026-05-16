import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// Lexi color palette — from character sheet:
// Pink: #FF7DBA | Lavender: #C7A6F7 | Skin: #FFBB88 | Neutral bg: #F2F2F6

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        lexi: {
          pink: { value: "#FF7DBA" },
          pinkLight: { value: "#FFE8F3" },
          lavender: { value: "#C7A6F7" },
          lavenderLight: { value: "#EDE5FF" },
          charcoal: { value: "#1A1A2E" },
          muted: { value: "#7C7C9A" },
          bg: { value: "#FAFAFF" },
          card: { value: "#FFFFFF" },
          border: { value: "#EAEAF4" },
          skin: { value: "#FFBB88" },
        },
      },
      fonts: {
        // Quicksand — friendly, rounded, Gen Z energy
        body: { value: "var(--font-quicksand), system-ui, sans-serif" },
        heading: { value: "var(--font-quicksand), system-ui, sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        "bg.canvas": { value: "{colors.lexi.bg}" },
        "fg.default": { value: "{colors.lexi.charcoal}" },
        "fg.muted": { value: "{colors.lexi.muted}" },
        "brand.primary": { value: "{colors.lexi.pink}" },
        "brand.secondary": { value: "{colors.lexi.lavender}" },
        "card.bg": { value: "{colors.lexi.card}" },
        "border.light": { value: "{colors.lexi.border}" },
      },
    },
  },
});

export const chakraSystem = createSystem(defaultConfig, config);
