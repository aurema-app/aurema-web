import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Account Deletion | Aurema",
  description:
    "Request account and data deletion for your Aurema account.",
};

export default function AccountDeletionPage() {
  return (
    <main className="flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-2xl shadow-2xl">
        <div className="p-8 relative min-h-[500px] flex flex-col">
          <header className="flex justify-between items-center mb-8">
            <Image
              src="/logo.png"
              alt="Aurema Logo"
              width={48}
              height={48}
              className="object-contain"
            />
            <a
              href="/"
              className="text-xs text-gray-400 hover:text-white transition-colors font-sans"
            >
              Back to Home
            </a>
          </header>

          <section className="flex-1 flex flex-col justify-center">
            <h1 className="font-serif text-gray-100 mb-3 text-4xl">
              Account Deletion
            </h1>
            <p className="text-sm mb-6 text-gray-300">
              To request deletion of your Aurema account and associated personal
              data, send an email from the address linked to your account.
            </p>

            <a
              href="mailto:hello@aurema-app.com?subject=Account%20Deletion%20Request"
              className="primary-button inline-flex w-fit items-center px-5 py-3 text-sm mb-8"
            >
              Email hello@aurema-app.com
            </a>

            <div className="space-y-4 text-sm text-gray-300">
              <p>
                Please include the email used for your account and, if possible,
                the subject line "Account Deletion Request".
              </p>
              <p>
                We will review your request and process deletion as soon as
                possible, typically within 30 days.
              </p>
              <p>
                Some data may be retained when required by law or for fraud
                prevention and security purposes.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
