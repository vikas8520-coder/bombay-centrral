"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#menu", label: "Menu" },
    { href: "#locations", label: "Locations" },
    { href: "#gallery", label: "Gallery" },
    { href: "#about", label: "Our Story" },
    { href: "#reviews", label: "Reviews" },
    { href: "#order", label: "Order" },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#141210]/80 shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Bombay Centrral Logo"
            width={40}
            height={40}
            className="rounded-lg"
            priority
          />
          <span className="text-xl font-bold tracking-tight font-norwester">
            <span className="text-gradient-brand">Bombay</span>{" "}
            <span className="text-[#f5f0e8]">Centrral</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#f5f0e8]/80 transition-colors hover:text-[#f0c000]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          className="text-[#f5f0e8] md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="bg-[#141210]/80 md:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium text-[#f5f0e8]/80 transition-colors hover:text-[#f0c000]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
