import type { Metadata } from "next";
import { EB_Garamond, Poppins, Arimo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PayPalProvider } from "@/components/providers/PayPalProvider";

const display = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const ui = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
  display: "swap",
});

const body = Arimo({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
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
      suppressHydrationWarning
      className={`${display.variable} ${ui.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-[var(--bg)] text-[var(--fg)] antialiased selection:bg-[#0088cc]/30 selection:text-white">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <PayPalProvider>{children}</PayPalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
