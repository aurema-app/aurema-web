"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const AuremaIcon = () => (
  <Image
    src="/logo.png"
    alt="Aurema Logo"
    width={48}
    height={48}
    className="object-contain"
  />
);

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="background-pattern absolute inset-0"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-card w-full max-w-4xl shadow-2xl relative z-10"
      >
        <div className="p-8 relative h-[85vh] flex flex-col">
          {/* Header */}
          <header className="flex justify-between items-center mb-8 flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <AuremaIcon />
              <span className="font-serif text-xl text-gray-100">Aurema</span>
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/privacy"
                className="text-xs text-white font-sans border-b border-white/30"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-gray-400 hover:text-white transition-colors font-sans"
              >
                Terms of Service
              </Link>
            </nav>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
            <div className="max-w-none">
            <h1 className="text-gray-100 mb-8" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>
              Aurema Privacy Policy
            </h1>
            
            <div className="text-sm text-gray-400 mb-8">
              <p>This Privacy Policy has been prepared in English. The English version is the official version, and other versions are provided for reference.</p>
              <p className="mt-2"><strong>Effective:</strong> March 1, 2025</p>
            </div>

            <div className="space-y-8 text-gray-300" style={{ fontFamily: "var(--font-quicksand)", fontSize: "16px", lineHeight: "1.6" }}>
              <section>
                <p>
                  If you are visually impaired, have another disability, or need support in other languages, you may access this Privacy Policy by emailing us at{" "}
                  <a href="mailto:privacy@aurema.com" className="text-[#BACFFF] hover:underline">
                    privacy@aurema.com
                  </a>
                </p>
              </section>

              <section>
                <p>
                  At Aurema, our company values include putting members first. We are committed to protecting and respecting your privacy in connection with your use of our mental health and meditation services via our websites, including the Aurema mobile app ("Apps"), or other delivery methods (websites, Apps, and other delivery methods are collectively referred to as our "Products"). Aurema may deliver coaching services (as therapy), and other mental wellness collectively referred to as our ("Services") using the Products or via other delivery methods, as applicable.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Information We Collect</h2>
                
                <h3 className="text-gray-100 mt-8 mb-4" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Personal Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, and other information you provide when creating an account</li>
                  <li><strong>Health Information:</strong> Mental health assessments, mood tracking data, meditation preferences, and therapy session notes</li>
                  <li><strong>Communication Data:</strong> Messages exchanged with our AI therapist and human support team</li>
                  <li><strong>Payment Information:</strong> Billing details processed securely through our payment partners</li>
                </ul>

                <h3 className="text-gray-100 mt-8 mb-4" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Information Collected Automatically</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Usage Data:</strong> How you interact with our meditation sessions, AI therapist, and app features</li>
                  <li><strong>Device Information:</strong> Device type, operating system, and app version</li>
                  <li><strong>Analytics Data:</strong> Session duration, feature usage, and progress tracking</li>
                </ul>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Provide personalized AI therapy sessions and guided meditations</li>
                  <li>Track your mental wellness progress and adapt our recommendations</li>
                  <li>Improve our AI algorithms and therapeutic approaches</li>
                  <li>Ensure the safety and effectiveness of our mental health services</li>
                  <li>Communicate important updates about our services</li>
                  <li>Comply with healthcare regulations and legal requirements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Health Information Protection</h2>
                <p>
                  As a mental health service provider, we take special care with your sensitive health information:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>All therapy sessions and mental health data are encrypted end-to-end</li>
                  <li>We comply with HIPAA regulations and other applicable healthcare privacy laws</li>
                  <li>Our AI models are trained on anonymized, aggregated data that cannot identify individuals</li>
                  <li>Mental health professionals may review anonymized session data to improve our services</li>
                  <li>We never share your personal therapy content with third parties without explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Information Sharing</h2>
                <p>We may share your information in limited circumstances:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>Emergency Situations:</strong> If we believe there's imminent risk of harm to yourself or others</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or regulatory authorities</li>
                  <li><strong>Service Providers:</strong> With trusted partners who help us deliver our services (under strict confidentiality agreements)</li>
                  <li><strong>Aggregated Data:</strong> Anonymized, non-identifiable data for research and service improvement</li>
                </ul>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Your Rights and Choices</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Access, update, or delete your personal information</li>
                  <li>Download your therapy session data and meditation history</li>
                  <li>Opt out of non-essential communications</li>
                  <li>Request restrictions on how we use your health information</li>
                  <li>File a complaint with healthcare privacy authorities</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, contact us at{" "}
                  <a href="mailto:privacy@aurema.com" className="text-[#BACFFF] hover:underline">
                    privacy@aurema.com
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Data Security</h2>
                <p>
                  We implement industry-leading security measures to protect your sensitive mental health information, including encryption, secure servers, regular security audits, and strict access controls. However, no system is completely secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>International Users</h2>
                <p>
                  If you are outside the US, please note that we may transfer your information to the US, where our servers are located. We ensure appropriate safeguards are in place for international data transfers.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or through our app.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="mt-4 space-y-2">
                  <p>Email: <a href="mailto:privacy@aurema.com" className="text-[#BACFFF] hover:underline">privacy@aurema.com</a></p>
                  <p>Address: Aurema Privacy Team, [Your Address]</p>
                </div>
              </section>
            </div>

              {/* Back to Home */}
              <div className="mt-16 pt-8 border-t border-gray-700">
                <Link
                  href="/"
                  className="inline-flex items-center text-[#BACFFF] hover:text-white transition-colors font-sans"
                >
                  ← Back to Aurema
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}