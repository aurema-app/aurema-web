"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const AuremaIcon = () => (
  <Image
    src="/logo.png"
    alt="Aurema Logo"
    width={48}
    height={48}
    className="object-contain"
  />
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
  <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden pointer-events-none">
    <Image
      src="/trees.png"
      alt="Trees landscape"
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      quality={90}
      priority={false}
      className="object-cover object-bottom"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#212529]" />
  </div>
);

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
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
    console.log("Form submitted:", { name, email });
    // Reset form after a delay
    setTimeout(() => {
      setName("");
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
        className="glass-card w-full max-w-2xl shadow-2xl"
      >
        <div className="p-8 pb-0 relative min-h-[500px] flex flex-col">
          <header className="flex justify-between items-center mb-8">
            <AuremaIcon />
            <nav className="flex gap-6">
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-white transition-colors font-sans"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs text-gray-400 hover:text-white transition-colors font-sans"
              >
                Terms of Service
              </a>
            </nav>
          </header>

          <div className="text-center flex-1 flex flex-col justify-center pb-40">
            <h1 className="font-serif text-gray-100 mb-2" style={{ fontSize: "40px" }}>
              Where{" "}
              <span
                className="font-bold"
                style={{ color: "#F5E0F8" }}
              >
                thoughts
              </span>{" "}
              meet{" "}
              <span
                className="font-bold"
                style={{ color: "#BACFFF" }}
              >
                clarity.
              </span>
            </h1>
            <h2 className="font-serif text-3xl md:text-4xl text-gray-200 mb-8">
              Meet Aurema.
            </h2>

            <p className="text-sm mb-8 mx-auto" style={{ color: "#6C757D" }}>
              We&apos;re almost ready. Get notified when Aurema goes live.
            </p>

            <form onSubmit={handleSubmit} className="w-11/12 mx-auto">
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full px-5 py-3 text-sm text-left"
                  disabled={isSubmitted}
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full px-5 py-3 text-sm text-left"
                  disabled={isSubmitted}
                />
                <motion.button
                  type="submit"
                  className="primary-button w-full py-3 text-sm mb-8"
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
