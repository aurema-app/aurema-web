import type { Metadata } from "next";
import { Quicksand, Cormorant_Garamond, Poppins } from "next/font/google";
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
        className={`${quicksand.variable} ${cormorantGaramond.variable} ${poppins.variable} font-sans`}
      >
        <div className="background-pattern"></div>
        {children}
      </body>
    </html>
  );
}
