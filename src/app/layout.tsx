import type { Metadata } from "next";
import {
  Caveat,
  Cormorant_Garamond,
  Poppins,
  Quicksand,
} from "next/font/google";

import { SITE_TITLE } from "@/constants/site";

import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Primary funnel font — all weights available for headings (900) through body (400)
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Fallback for Bumbbled until public/fonts/Bumbbled-Regular.* is added
const lexiScript = Caveat({
  variable: "--font-lexi-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: "We're almost ready. Get notified when Aurema goes live.",
  keywords: ["Aurema", "clarity", "thoughts", "coming soon", "mindfulness"],
  authors: [{ name: "Aurema" }],
  openGraph: {
    title: SITE_TITLE,
    description: "We're almost ready. Get notified when Aurema goes live.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: "We're almost ready. Get notified when Aurema goes live.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} ${cormorantGaramond.variable} ${poppins.variable} ${lexiScript.variable} font-sans`}
      >
        <div className="background-pattern"></div>
        {children}
      </body>
    </html>
  );
}
