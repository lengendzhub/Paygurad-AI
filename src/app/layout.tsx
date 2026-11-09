import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PayPalProvider } from "@/components/providers/PayPalProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PayGuard AI — Autonomous Escrow & Bounty Arbiter",
  description:
    "Autonomous Escrow & Work-Verification Protocol powered by PayPal Orders v2, PayPal Payouts v1, and Google Gemini.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0B0F] text-[#F4F4F7]">
        <PayPalProvider>{children}</PayPalProvider>
      </body>
    </html>
  );
}
