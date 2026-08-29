import Image from "next/image";
import { business } from "@/data/business";

export default function Footer() {
  return (
    <footer className="border-t border-[#1f1c18] bg-[#0a0908]/85 backdrop-blur-sm py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <Image
                src="/logo.png"
                alt="Bombay Centrral Logo"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-lg font-bold font-norwester">
                <span className="text-gradient-brand">Bombay</span>{" "}
                <span className="text-[#f5f0e8]">Centrral</span>
              </span>
            </div>
            <p className="mt-2 text-sm text-[#f5f0e8]/40">{business.tagline}</p>
          </div>

          <div className="flex gap-4">
            <a
              href={business.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f1c18] text-[#f5f0e8]/60 transition-all hover:border-[#f0c000] hover:text-[#f0c000]"
              aria-label="Instagram"
            >
              📸
            </a>
            <a
              href={business.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f1c18] text-[#f5f0e8]/60 transition-all hover:border-[#06a77d] hover:text-[#06a77d]"
              aria-label="WhatsApp"
            >
              💬
            </a>
            <a
              href={business.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f1c18] text-[#f5f0e8]/60 transition-all hover:border-[#f0c000] hover:text-[#f0c000]"
              aria-label="Facebook"
            >
              📘
            </a>
            <a
              href={business.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f1c18] text-[#f5f0e8]/60 transition-all hover:border-[#ff0000] hover:bg-[#ff0000]/10 hover:text-[#ff0000]"
              aria-label="YouTube"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a
              href={business.linktree}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f1c18] text-[#f5f0e8]/60 transition-all hover:border-[#f0c000] hover:text-[#f0c000]"
              aria-label="Linktree"
            >
              🔗
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-[#1f1c18] pt-6 text-center text-sm text-[#f5f0e8]/30">
          <p>© {new Date().getFullYear()} Bombay Centrral. Made with 🧡 in Hyderabad.</p>
          <p className="mt-1">Begumpet · Diamond Point · Cloud Kitchen</p>
        </div>
      </div>
    </footer>
  );
}
