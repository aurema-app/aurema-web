import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

// ─── Lexi Design Tokens ────────────────────────────────────────────────────
// Change any value here and every component picks it up automatically.
//
//  lexi.primary       #EC4899  — hot pink CTA / accents
//  lexi.textSecondary #746476  — muted purple-gray body text
//  lexi.surface       #F6F2FF  — page background / cards

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        lexi: {
          // ── Core brand ────────────────────────────────────────────────────
          primary: { value: "#EC4899" },
          primaryLight: { value: "#FCE7F3" },

          // ── Lavender accent ───────────────────────────────────────────────
          lavender: { value: "#C7A6F7" },
          lavenderLight: { value: "#EDE5FF" },

          // ── Backgrounds ───────────────────────────────────────────────────
          surface: { value: "#F6F2FF" },
          card: { value: "#FFFFFF" },

          // ── Text ─────────────────────────────────────────────────────────
          charcoal: { value: "#1A1A2E" },
          textSecondary: { value: "#746476" },

          // ── Misc ─────────────────────────────────────────────────────────
          border: { value: "#EAE6F4" },
          skin: { value: "#FFBB88" },
        },
      },
      fonts: {
        // Poppins covers every weight from 400 (body) to 900 (display headlines)
        body: { value: "var(--font-poppins), system-ui, sans-serif" },
        heading: { value: "var(--font-poppins), system-ui, sans-serif" },
        display: { value: "var(--font-poppins), system-ui, sans-serif" },
      },
    },
    semanticTokens: {
      colors: {
        "bg.canvas": { value: "{colors.lexi.surface}" },
        "fg.default": { value: "{colors.lexi.charcoal}" },
        "fg.muted": { value: "{colors.lexi.textSecondary}" },
        "brand.primary": { value: "{colors.lexi.primary}" },
        "brand.secondary": { value: "{colors.lexi.lavender}" },
        "card.bg": { value: "{colors.lexi.card}" },
        "border.light": { value: "{colors.lexi.border}" },
      },
    },
  },
});

export const chakraSystem = createSystem(defaultConfig, config);
