import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          bg: { value: "#212529" },
          fg: { value: "#f0f0f0" },
          muted: { value: "#adb5bd" },
          accent: { value: "#a3b8ff" },
          lilac: { value: "#f5e0f8" },
        },
      },
      fonts: {
        body: { value: "var(--font-quicksand), system-ui, sans-serif" },
        heading: {
          value: "var(--font-cormorant-garamond), Georgia, serif",
        },
      },
    },
    semanticTokens: {
      colors: {
        "bg.canvas": { value: "{colors.brand.bg}" },
        "fg.default": { value: "{colors.brand.fg}" },
        "fg.muted": { value: "{colors.brand.muted}" },
        "brand.primary": { value: "{colors.brand.accent}" },
      },
    },
  },
});

export const chakraSystem = createSystem(defaultConfig, config);
