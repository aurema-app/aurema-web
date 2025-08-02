import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aurema - Where thoughts meet clarity",
  description: "We're almost ready. Get notified when Aurema goes live.",
  keywords: ["Aurema", "clarity", "thoughts", "coming soon", "mindfulness"],
  authors: [{ name: "Aurema" }],
  openGraph: {
    title: "Aurema - Where thoughts meet clarity",
    description: "We're almost ready. Get notified when Aurema goes live.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurema - Where thoughts meet clarity",
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
        className={`${inter.variable} ${playfairDisplay.variable} font-sans`}
      >
        <div className="background-pattern"></div>
        {children}
      </body>
    </html>
  );
}
