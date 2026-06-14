import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadQual.ai — Real Estate Lead Qualification Engine",
  description:
    "AI-powered lead qualification for real estate teams. Instantly score, prioritize, and act on every inquiry.",
  keywords: ["real estate", "lead qualification", "AI", "CRM", "sales automation"],
  authors: [{ name: "LeadQual.ai" }],
  openGraph: {
    title: "LeadQual.ai — Real Estate Lead Qualification Engine",
    description: "AI-powered lead qualification for real estate teams.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <body className="min-h-screen bg-[#080808] font-sans antialiased">
        <div className="bg-grid fixed inset-0 pointer-events-none" aria-hidden />
        <div className="bg-glow fixed inset-0 pointer-events-none" aria-hidden />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              borderRadius: "16px",
            },
          }}
        />
      </body>
    </html>
  );
}
