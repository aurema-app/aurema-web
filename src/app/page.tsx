"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AuremaIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-gray-300"
  >
    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" />
    <g transform="translate(16, 16)">
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path
            d="M0 -11 C 6 -6, 6 6, 0 11"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </g>
      ))}
    </g>
  </svg>
);

const MailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ml-2"
  >
    <path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="22,6 12,13 2,6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Landscape = () => (
  <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden pointer-events-none">
    <svg
      className="absolute bottom-0 w-full h-auto"
      viewBox="0 0 800 200"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <filter id="soft-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
        <linearGradient id="sky-gradient" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#222428" stopOpacity="0" />
          <stop offset="100%" stopColor="#222428" stopOpacity="1" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="800" height="200" fill="url(#sky-gradient)" />

      <g filter="url(#soft-blur)" opacity="0.7">
        <path
          d="M-50,150 Q150,120 400,145 T850,155 L850,200 L-50,200 Z"
          fill="#1e2024"
        />
        <path
          d="M-50,160 Q200,140 400,155 T850,145 L850,200 L-50,200 Z"
          fill="#1a1c20"
        />
      </g>

      <g transform="translate(250 145)" opacity="0.7" filter="url(#soft-blur)">
        <path d="M0,0 l-5,-20 a25,25 0 1,1 10,0 Z" fill="#111" />
        <path
          d="M-20,-10 a40,25 0 0,1 40,0"
          fill="#111"
          stroke="#111"
          stroke-width="4"
        />
      </g>

      <g transform="translate(550 155)" opacity="0.7" filter="url(#soft-blur)">
        <path d="M0,0 l-4,-18 a20,20 0 1,1 8,0 Z" fill="#111" />
        <path
          d="M-15,-8 a30,20 0 0,1 30,0"
          fill="#111"
          stroke="#111"
          stroke-width="3"
        />
      </g>
    </svg>
  </div>
);

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setIsSubmitted(true);
    console.log("Email submitted:", email);
    // Reset form after a delay
    setTimeout(() => {
      setEmail("");
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <main className="flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-card w-full max-w-xl shadow-2xl"
      >
        <div className="p-10 relative">
          <header className="flex justify-between items-center mb-12">
            <AuremaIcon />
            <nav className="flex gap-6">
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </nav>
          </header>

          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl text-gray-100 mb-2">
              Where thoughts meet{" "}
              <span
                className="font-bold"
                style={{ color: "var(--accent-blue)" }}
              >
                clarity.
              </span>
            </h1>
            <h2 className="font-serif text-3xl md:text-4xl text-gray-200 mb-8">
              Aurema.
            </h2>

            <p className="text-sm text-gray-300 mb-8 max-w-sm mx-auto">
              We&apos;re almost ready. Get notified when Aurema goes live.
            </p>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full px-5 py-3 text-sm text-center"
                  disabled={isSubmitted}
                />
                <motion.button
                  type="submit"
                  className="primary-button w-full py-3 text-sm"
                  disabled={isSubmitted}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitted ? (
                      <motion.span
                        key="submitted"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        Welcome to the list!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="join"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-center"
                      >
                        Join Waiting List <MailIcon />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-400 mt-2"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
          <Landscape />
        </div>
      </motion.div>
    </main>
  );
}
