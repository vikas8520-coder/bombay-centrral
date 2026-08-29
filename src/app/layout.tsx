import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import InteractiveBackgroundClient from "@/components/InteractiveBackgroundClient";
import ScrollToTop from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bombay Centrral — Mumbai Street Food in Hyderabad",
  description:
    "Bringing you taste from the streets of Mumbai to the city of Nizams! Locations in Begumpet, Diamond Point Secunderabad, and Cloud Kitchen. Vada Pav, Pav Bhaji, Bhel Puri, and more.",
  keywords: [
    "Bombay Centrral",
    "Mumbai street food Hyderabad",
    "Vada Pav Hyderabad",
    "Pav Bhaji Secunderabad",
    "Bhel Puri Begumpet",
    "street food restaurant",
  ],
  openGraph: {
    title: "Bombay Centrral — Mumbai Street Food in Hyderabad",
    description:
      "Bringing you taste from the streets of Mumbai to the city of Nizams!",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0908] text-[#f5f0e8]">
        {/* Force scroll to top on load — prevents auto-scroll bug */}
        <ScrollToTop />
        {/* Fixed menu PDF background — 100% opacity, static, full page */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('/menu-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#0a0908",
          }}
        />
        {/* Interactive floating text layer — reacts to scroll */}
        <InteractiveBackgroundClient />
        {/* Content wrapper — transparent so PDF + floating text show through */}
        <div className="relative z-10 flex flex-col flex-1">{children}</div>
      </body>
    </html>
  );
}
