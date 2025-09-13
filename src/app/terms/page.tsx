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

export default function TermsOfService() {
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
                className="text-xs text-gray-400 hover:text-white transition-colors font-sans"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-white font-sans border-b border-white/30"
              >
                Terms of Service
              </Link>
            </nav>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
            <div className="max-w-none">
            <h1 className="text-gray-100 mb-8" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>
              Terms of Service
            </h1>
            
            <div className="text-sm text-gray-400 mb-8">
              <p><strong>Effective:</strong> March 1, 2025</p>
            </div>

            <div className="space-y-8 text-gray-300" style={{ fontFamily: "var(--font-quicksand)", fontSize: "16px", lineHeight: "1.6" }}>
              <section>
                <p>
                  Welcome to Aurema. These Terms of Service ("Terms") govern your use of our AI-powered therapy and guided meditation platform. By using our services, you agree to these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Our Services</h2>
                <p>
                  Aurema provides AI-powered mental health support, guided meditations, and wellness tools. Our services are designed to complement, not replace, professional medical treatment.
                </p>
                <p className="mt-4">
                  <strong>Important:</strong> Our AI therapist is not a replacement for licensed mental health professionals. If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline immediately.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Eligibility and Account Requirements</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must be at least 18 years old to use Aurema</li>
                  <li>You must provide accurate and complete account information</li>
                  <li>You are responsible for maintaining the security of your account</li>
                  <li>Each account is for individual use only</li>
                </ul>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Acceptable Use</h2>
                <p>When using Aurema, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Use our services for personal wellness and mental health support</li>
                  <li>Provide honest and accurate information during assessments</li>
                  <li>Respect the privacy and safety of other users</li>
                  <li>Follow guidance provided by our AI and human support team</li>
                </ul>
                
                <p className="mt-6">You agree NOT to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Share your account credentials with others</li>
                  <li>Attempt to reverse-engineer our AI technology</li>
                  <li>Use our services to harm yourself or others</li>
                  <li>Share inappropriate or harmful content through our platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Health and Safety Disclaimer</h2>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 my-6">
                  <p className="text-red-200 font-semibold mb-2">Important Health Notice:</p>
                  <ul className="list-disc pl-6 space-y-2 text-red-100">
                    <li>Aurema is not a substitute for professional medical or psychiatric care</li>
                    <li>Our AI cannot diagnose mental health conditions</li>
                    <li>Always consult licensed healthcare providers for serious mental health concerns</li>
                    <li>In case of emergency or suicidal thoughts, contact emergency services immediately</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Subscription and Payment</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Subscription fees are billed in advance on a recurring basis</li>
                  <li>You can cancel your subscription at any time through your account settings</li>
                  <li>Refunds are provided according to our refund policy</li>
                  <li>We may change subscription prices with 30 days' notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Intellectual Property</h2>
                <p>
                  Aurema owns all rights to our AI technology, meditation content, therapeutic approaches, and platform features. You retain ownership of your personal information and session content.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Privacy and Data</h2>
                <p>
                  Your privacy is important to us. Please review our{" "}
                  <Link href="/privacy" className="text-[#BACFFF] hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  to understand how we collect, use, and protect your information.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, Aurema shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Termination</h2>
                <p>
                  Either party may terminate these Terms at any time. Upon termination, you will lose access to our services, but you may request a copy of your data within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Changes to Terms</h2>
                <p>
                  We may update these Terms from time to time. We will notify you of significant changes via email or through our platform.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "36px", lineHeight: "1.2" }}>Contact Us</h2>
                <p>
                  If you have questions about these Terms, please contact us:
                </p>
                <div className="mt-4 space-y-2">
                  <p>Email: <a href="mailto:legal@aurema.com" className="text-[#BACFFF] hover:underline">legal@aurema.com</a></p>
                  <p>Address: Aurema Legal Team, [Your Address]</p>
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