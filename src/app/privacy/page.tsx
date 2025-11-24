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
            <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
              <AuremaIcon />
              <span className="text-lg sm:text-xl text-gray-100" style={{ fontFamily: "var(--font-cormorant-garamond)" }}>Aurema</span>
            </Link>
            <nav className="flex gap-3 sm:gap-6">
              <Link
                href="/privacy"
                className="text-white whitespace-nowrap pb-0.5 border-b-2 border-white/50"
                style={{ fontFamily: "var(--font-quicksand)", fontWeight: "700", fontSize: "16px" }}
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors whitespace-nowrap"
                style={{ fontFamily: "var(--font-quicksand)", fontWeight: "700", fontSize: "16px", color: "#6C757D" }}
              >
                Terms
              </Link>
            </nav>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
            <div className="max-w-none">
            <h1 className="text-gray-100 mb-8" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>
              Privacy Policy and Personal Data Processing
            </h1>
            
            <div className="mb-8 text-gray-400" style={{ fontFamily: "var(--font-quicksand)", fontWeight: "600", fontSize: "16px" }}>
              <p>This Privacy Policy describes how Tech Frontiers S.R.L. processes your personal data in connection with your use of the Aurema application.</p>
            </div>

            <div className="space-y-8 text-gray-300" style={{ fontFamily: "var(--font-quicksand)", fontWeight: "600", fontSize: "16px", lineHeight: "1.6" }}>
              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Introduction</h2>
                <p>
                  Welcome! The confidentiality of your data is a priority for us. This privacy policy explains what personal data the Aurema application collects and processes, how we use it, for what purposes, and what rights you have in relation to this data. We are committed to processing personal data responsibly and in accordance with applicable data protection legislation, including Regulation (EU) 2016/679 (&ldquo;GDPR&rdquo;) and applicable national rules.
                </p>
                <p className="mt-4">
                  By using the Aurema application and creating an account, you confirm that you have read and understood this Privacy Policy. We will not use your personal data in a manner inconsistent with the purposes stated in this policy. We will not sell, rent, or disclose personal data to third parties for marketing or advertising purposes without your explicit consent.
                </p>
                <p className="mt-4">
                  If you are visually impaired, have another disability, or need support in other languages, you may access this Privacy Policy by emailing us at{" "}
                  <a href="mailto:support@aurema.app" className="text-[#BACFFF] hover:underline">
                    support@aurema.app
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>What Data We Collect and Why</h2>
                
                <h3 className="text-gray-100 mt-8 mb-4" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Account and Login Data</h3>
                <p className="mb-2">
                  When you create an account with Aurema, we ask for your email address and a password. The password is stored in encrypted form through Firebase Authentication.
                </p>
                <p className="mb-2">
                  <strong>Purpose:</strong> To create and manage your account, allow secure login, and send essential communications about your account.
                </p>
                <p>
                  <strong>Legal basis:</strong> Performance of a contract—necessary to provide the service in accordance with the Terms and Conditions.
                </p>

                <h3 className="text-gray-100 mt-8 mb-4" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Conversation Content</h3>
                <p className="mb-2">
                  When you use the AI chat feature, we process the content of the messages you enter. Your messages are securely transmitted to OpenAI GPT-4.1 to generate responses and conversation summaries.
                </p>
                <p className="mb-2">
                  <strong>Purpose:</strong> To provide personalized responses, create conversation summaries, generate personalized meditations, and store your conversation history.
                </p>
                <p className="mb-2">
                  <strong>Legal basis:</strong> Performance of the contract; explicit consent for sensitive data. To the extent you disclose information relating to your emotional or mental health, we process this sensitive information only on the basis of your explicit consent.
                </p>
                <p className="mt-2 text-yellow-200">
                  Sensitive information is treated with a high level of confidentiality: it is processed automatically and is not accessed by the Aurema team unless absolutely necessary (e.g., at your express request for technical support or when required by law).
                </p>

                <h3 className="text-gray-100 mt-8 mb-4" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Generated Personalized Meditations</h3>
                <p className="mb-2">
                  After each conversation, Aurema offers personalized audio meditation. A summary of your conversation is transmitted to Cartesia AI to produce the audio recording.
                </p>
                <p className="mb-2">
                  <strong>Purpose:</strong> To provide personalized meditation content tailored to the issues and emotions you expressed.
                </p>
                <p>
                  <strong>Legal basis:</strong> Contract performance—necessary to provide the personalized mindfulness functionality.
                </p>

                <h3 className="text-gray-100 mt-8 mb-4" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Subscription and Payment Information</h3>
                <p className="mb-2">
                  We use trusted third-party services (Apple App Store, Google Play Store, and RevenueCat) to manage payments and subscriptions. We do not collect or store sensitive financial details (card numbers, CVV codes) ourselves.
                </p>
                <p className="mb-2">
                  <strong>Purpose:</strong> To manage your subscription, validate access to premium features, and maintain transaction history for support purposes.
                </p>
                <p>
                  <strong>Legal basis:</strong> Contract performance—necessary to fulfill our contract with you.
                </p>

                <h3 className="text-gray-100 mt-8 mb-4" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Technical and Application Usage Data</h3>
                <p className="mb-2">
                  We automatically collect technical data including IP address, device type, operating system, app version, language settings, unique device identifiers, usage session times and durations, event and error logs.
                </p>
                <p className="mb-2">
                  <strong>Purpose:</strong> To ensure proper functioning and security of the application, detect and prevent unauthorized access, identify and fix technical issues, and understand feature usage.
                </p>
                <p>
                  <strong>Legal basis:</strong> Our legitimate interest—necessary to maintain integrity, availability, and security of the service.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Sharing Data with Third Parties</h2>
                <p className="mb-4">
                  In order to provide Aurema services, we collaborate with certain third-party services. Data is only transferred to the extent necessary:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong>Firebase (Google LLC):</strong> User authentication, database for storing conversations and meditations, infrastructure hosting. Your email, encrypted password, conversation data, and account settings are stored in Firebase databases.
                  </li>
                  <li>
                    <strong>OpenAI (OpenAI, L.L.C.):</strong> Provides AI technology to generate responses and conversation summaries. The content of your messages is sent to OpenAI&rsquo;s GPT-4.1 model to provide intelligent functionality. According to OpenAI policies, data sent through their API is not used to train general models.
                  </li>
                  <li>
                    <strong>Cartesia AI:</strong> Generates personalized audio meditations. Conversation summaries are sent to create audio content. Cartesia uses the summary exclusively for this purpose.
                  </li>
                  <li>
                    <strong>RevenueCat:</strong> Manages subscriptions and in-app purchases. Receives unique user identifier, subscription information, and purchase transaction status to verify and synchronize subscription status across platforms.
                  </li>
                  <li>
                    <strong>App Stores (Apple/Google):</strong> Process financial transactions directly. We do not access or store your financial details. We only receive confirmation that payment was successful and subscription validity dates.
                  </li>
                  <li>
                    <strong>Render:</strong> Hosts our backend infrastructure. Data may transit through Render servers during application operation.
                  </li>
                </ul>
                <p className="mt-4">
                  We also may disclose data if legally required by public authorities, necessary to establish or defend legal claims, or during reorganization/merger/acquisition.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Transfer of Data Outside the EEA</h2>
                <p>
                  Some of our partners (OpenAI, Google/Firebase, Render, RevenueCat) may process or store data outside the European Economic Area (EEA), particularly in the United States. In all cases of international data transfers, we take appropriate measures to ensure a level of protection similar to that provided in the EU, including implementing Standard Contractual Clauses (SCCs) approved by the European Commission.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Data Retention Period</h2>
                <p className="mb-4">
                  We retain your personal data only for as long as necessary:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account data and conversation/meditation content:</strong> Kept for as long as you have an active account. When you delete your account, all associated data will be irreversibly deleted or anonymized.</li>
                  <li><strong>Subscription and transaction data:</strong> Retained for as long as you have an active subscription and thereafter for periods required by financial and tax legislation (up to 5-10 years).</li>
                  <li><strong>Logs and technical data:</strong> Retained for short periods (several weeks or months) to allow security incident analysis, then automatically deleted.</li>
                </ul>
                <p className="mt-4 text-yellow-200">
                  Important: Simply uninstalling the app does not delete your account and data from our servers. To delete your data, use the Delete Account option in the application or send us an explicit request.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Personal Data Security</h2>
                <p className="mb-4">
                  We take the security of your data seriously and have implemented appropriate technical and organizational measures:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Encrypted communication:</strong> All communications use secure protocols (HTTPS/TLS)</li>
                  <li><strong>Secure storage:</strong> Data stored in secure environments with advanced physical and digital security measures</li>
                  <li><strong>Internal control:</strong> Strict confidentiality principles, limited access to user data, all access logged</li>
                  <li><strong>Testing and updating:</strong> Constant updates, security testing, monitoring for suspicious activity</li>
                </ul>
                <p className="mt-4">
                  Despite all our efforts, no method of data transmission or storage is 100% secure. In the unlikely event of a security incident, we will act in accordance with our legal obligations and notify you and relevant authorities as required.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Your Rights in Relation to Personal Data</h2>
                <p className="mb-4">
                  As a data subject under GDPR, you have the following rights:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Right of access:</strong> Obtain confirmation about whether we process your data and access to that data</li>
                  <li><strong>Right to rectification:</strong> Request correction of inaccurate or incomplete data</li>
                  <li><strong>Right to erasure (&ldquo;right to be forgotten&rdquo;):</strong> Request deletion of your personal data</li>
                  <li><strong>Right to restrict processing:</strong> Request temporary suspension of data processing in certain cases</li>
                  <li><strong>Right to data portability:</strong> Receive your data in a structured, machine-readable format</li>
                  <li><strong>Right to object:</strong> Object to processing based on our legitimate interest</li>
                  <li><strong>Right to withdraw consent:</strong> Withdraw consent at any time (for processing based on consent)</li>
                  <li><strong>Right to lodge a complaint:</strong> File a complaint with the National Supervisory Authority for Personal Data Processing (ANSPDCP) in Romania or your local supervisory authority</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, contact us using the details below. We will respond within one month of receipt.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Use by Minors</h2>
                <p>
                  Aurema is not intended for children under the age of 18. We do not knowingly collect personal data from individuals under this age. If you are under 16, please do not create an account without verified parental consent. If we discover we have collected data from a minor, we will delete it as soon as possible.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Changes to the Privacy Policy</h2>
                <p>
                  This Privacy Policy may be updated periodically. When we make substantial changes, we will notify you by prominently posting a new version and, if changes are significant, we may send you an email or in-app notification. Each version will be marked with an effective date.
                </p>
              </section>

              <section>
                <h2 className="text-gray-100 mt-12 mb-6" style={{ fontFamily: "var(--font-cormorant-garamond)", fontWeight: "bold", fontSize: "40px", lineHeight: "1.2" }}>Contact</h2>
                <p className="mb-4">
                  The controller of your data is TECH FRONTIERS S.R.L., a Romanian company with its registered office at Str. Miron Cristea nr. 10, Copăceni, Ilfov County, 077005, Romania. If you have any questions, concerns, or requests regarding this Privacy Policy or wish to exercise your data protection rights, please contact us:
                </p>
                <div className="mt-4 space-y-2">
                  <p>Email: <a href="mailto:support@aurema.app" className="text-[#BACFFF] hover:underline">support@aurema.app</a></p>
                  <p>Postal address: TECH FRONTIERS S.R.L., Str. Miron Cristea nr. 10, Copăceni, Ilfov County, 077005, Romania</p>
                </div>
                <p className="mt-6 text-sm italic">
                  Thank you for using Aurema and for trusting us to accompany you on your journey of self-reflection and well-being.
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