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
            <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
              <AuremaIcon />
              <span className="text-lg sm:text-xl text-gray-100" style={{ fontFamily: "var(--font-cormorant-garamond)" }}>Aurema</span>
            </Link>
            <nav className="flex gap-3 sm:gap-6">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors whitespace-nowrap"
                style={{ fontFamily: "var(--font-quicksand)", fontWeight: "700", fontSize: "16px", color: "#6C757D" }}
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-white whitespace-nowrap pb-0.5 border-b-2 border-white/50"
                style={{ fontFamily: "var(--font-quicksand)", fontWeight: "700", fontSize: "16px" }}
              >
                Terms
              </Link>
            </nav>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
            <div className="max-w-none">
            <h1 className="text-gray-100 mb-8" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>
              Terms of Service
            </h1>
            
            <div className="mb-8 text-gray-400" style={{ fontFamily: "var(--font-quicksand)", fontWeight: "600", fontSize: "16px" }}>
              <p><strong>Last Updated:</strong> January 2025</p>
              <p className="mt-2">TECH FRONTIERS S.R.L., CUI 49498553, J40/1841/2024</p>
            </div>

            <div className="space-y-8 text-gray-300" style={{ fontFamily: "var(--font-quicksand)", fontWeight: "600", fontSize: "16px", lineHeight: "1.6" }}>
              <section>
                <p>
                  These Terms and Conditions (&ldquo;Terms&rdquo;) constitute the legal agreement between you, as a user of the Aurema application, and TECH FRONTIERS S.R.L. (hereinafter referred to as &ldquo;Tech Frontiers,&rdquo; &ldquo;the Company,&rdquo; &ldquo;we,&rdquo; or &ldquo;our&rdquo;).
                </p>
                <p className="mt-4">
                  Tech Frontiers S.R.L, CUI 49498553, J40/1841/2024, is a company registered in Romania, with its registered office at Str. Miron Cristea nr. 10, Copăceni, Ilfov County. Tech Frontiers is the developer and owner of the Aurema mobile application, which it operates and makes available to users.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>What is Aurema</h2>
                <p>
                  Aurema is an artificial intelligence-based self-awareness and emotional well-being application, offering guided conversations and personalized meditations. The use of Aurema is governed exclusively by the agreement between you and Tech Frontiers.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Acceptance of Terms</h2>
                <p>
                  By creating an account in Aurema, or by downloading, installing, accessing, or using the application, you expressly declare that you have read, understood, and agree to these Terms and the Privacy Policy. If you do not agree with any of the provisions, please do not use the Services.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Eligibility</h2>
                <p className="mb-4">
                  You must be at least 18 years old to use Aurema Services. The application is not intended for minors under the age of 18. By creating an account and/or using the Services, you represent and warrant that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You are at least 18 years old and have full legal capacity</li>
                  <li>You are not located in a country subject to a U.S. government embargo</li>
                  <li>You are not listed on any U.S. government list of restricted or prohibited persons</li>
                  <li>Your right to use services of this type has not been restricted by any applicable law</li>
                </ul>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Accounts and Security</h2>
                <p className="mb-4">
                  You can create a user account by registering an email address and setting a password (or through other authentication methods offered). You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide true, accurate, current, and complete registration information</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Not disclose your account password to anyone</li>
                  <li>Notify us immediately at support@techfrontiers.ro if you suspect unauthorized access</li>
                </ul>
                <p className="mt-4">
                  You are fully responsible for all activity conducted through your account. You can delete your account at any time from the Aurema app settings. Account deletion is irreversible.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Description of Services</h2>
                <p>
                  Aurema is an AI companion mobile app focused on conversations aimed at self-awareness and improving emotional well-being. Through Aurema, you have access to a virtual coach guided by artificial intelligence with whom you can have conversations about your emotional state, thoughts, and feelings. Based on these discussions, Aurema can automatically generate personalized meditations (audio or text) designed to help you relax and reflect.
                </p>
                <p className="mt-4">
                  Aurema&rsquo;s basic features are available for free. To access all available tools (extended conversations, unlimited or personalized meditations, premium content, etc.), you may need to activate a Subscription.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Rules of Use</h2>
                <p className="mb-4">When using Aurema, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the Services only for lawful, personal, and reasonable purposes</li>
                  <li>Not engage in any abusive, fraudulent, defamatory, obscene, or discriminatory behavior</li>
                  <li>Not send or upload content that infringes on the rights of others</li>
                  <li>Not attempt to reverse-engineer, decompile, or extract the source code of the application</li>
                  <li>Not introduce viruses, malware, or any harmful code</li>
                  <li>Not use the Services for unauthorized commercial activities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Health and Safety Disclaimer</h2>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 my-6">
                  <p className="text-red-200 font-semibold mb-4 text-lg">IMPORTANT HEALTH NOTICE</p>
                  <p className="text-red-100 mb-4">
                    <strong>AUREMA IS NOT A MEDICAL OR PROFESSIONAL COUNSELING SERVICE.</strong> Tech Frontiers is not a provider of mental health services or medical devices and does not offer psychotherapy, clinical diagnosis, medical treatment, or other authorized professional services.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-red-100">
                    <li>Aurema is not a substitute for professional medical or psychiatric care</li>
                    <li>The AI does not diagnose, treat, cure, or prevent any medical condition or mental disorder</li>
                    <li>Only licensed professionals can provide diagnosis, treatment, or medical advice</li>
                    <li><strong>DO NOT USE AUREMA IN A MEDICAL OR PSYCHOLOGICAL EMERGENCY!</strong></li>
                    <li>If you are thinking about harming yourself or others, call emergency services immediately</li>
                    <li>Contact 911 (or your local emergency number) or go to the nearest emergency room</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Intellectual Property</h2>
                <p className="mb-4">
                  Aurema, its source code, interface design, logos, trademarks, and all content offered through the Services are protected by copyright, trademark, and other intellectual property laws. These rights belong entirely to Tech Frontiers and/or its licensors.
                </p>
                <p>
                  Tech Frontiers grants you a limited, revocable, non-exclusive, non-transferable, and non-sublicensable license to install and use the Aurema application on your mobile device, strictly for personal, non-commercial purposes.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>User-Generated and AI-Generated Content</h2>
                <p className="mb-4">
                  You retain ownership of the content you create and submit. By submitting content through Aurema, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, process, modify, and store that content strictly to provide you with the Services.
                </p>
                <p>
                  AI-generated content (including responses and personalized meditations) is provided to you &ldquo;as is&rdquo; for your personal use. This content is probabilistic in nature and may contain errors or inaccuracies. You should use your personal judgment when interpreting Aurema&rsquo;s responses.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Subscription and Payment</h2>
                <p className="mb-4">
                  Subscriptions are purchased through app stores (Apple App Store or Google Play Store). Subscription fees are billed in advance on a recurring basis.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You can cancel your subscription at any time through your app store account settings</li>
                  <li>If you do not cancel before the end of a trial period, the paid subscription will automatically activate</li>
                  <li>Refunds are provided according to the app store&rsquo;s refund policy and applicable consumer protection laws</li>
                  <li>Deleting your account or the app does not automatically cancel your subscription</li>
                </ul>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Privacy and Data</h2>
                <p>
                  Your privacy is important to us. Please review our{" "}
                  <Link href="/privacy" className="text-[#BACFFF] hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  to understand how we collect, use, and protect your information. All therapy sessions and mental health data are encrypted end-to-end.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, Tech Frontiers shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Services. This includes but is not limited to damages for loss of profits, data, or other intangible losses.
                </p>
                <p className="mt-4">
                  For consumers, the above limitations apply only to the extent permitted by consumer protection law.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Termination</h2>
                <p className="mb-4">
                  We reserve the right to suspend or terminate your access to the Services in situations including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violation of these Terms</li>
                  <li>Security or integrity risks</li>
                  <li>Legal obligation or request from an authority</li>
                  <li>Termination of Services</li>
                </ul>
                <p className="mt-4">
                  You may terminate your use of the Services at any time by deleting your account. Upon termination, you will lose access to your account and stored content.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Applicable Law and Dispute Resolution</h2>
                <p className="mb-4">
                  These Terms are governed by Romanian law. Any dispute arising out of or in connection with these Terms shall be resolved:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>For non-consumer users: by the competent courts in Bucharest, Romania</li>
                  <li>For consumer users: you have the right to submit the dispute to the courts of your place of residence</li>
                </ul>
                <p className="mt-4">
                  We encourage you to contact us directly to discuss any issues before resorting to the courts.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Changes to Terms</h2>
                <p>
                  We may update these Terms from time to time. When we do so, we will post the updated version and indicate the &ldquo;Last Updated&rdquo; date. If the changes are significant, we will notify you by email or through the app. Your continued use of Aurema after changes take effect constitutes acceptance of the modified Terms.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Contact Us</h2>
                <p className="mb-4">
                  If you have questions about these Terms, please contact us:
                </p>
                <div className="mt-4 space-y-2">
                  <p>Email: <a href="mailto:support@techfrontiers.ro" className="text-[#BACFFF] hover:underline">support@techfrontiers.ro</a></p>
                  <p>Address: TECH FRONTIERS S.R.L., Str. Miron Cristea nr. 10, Copăceni, Ilfov County, 077005, Romania</p>
                </div>
              </section>

              <section className="mt-12 pt-8 border-t border-gray-700">
                <p className="text-sm text-gray-400 italic">
                  © 2025 Tech Frontiers S.R.L. – All rights reserved.
                </p>
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