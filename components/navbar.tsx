"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CartButton } from "@/components/cart-button";

const navLinks = [
  { href: "/book", label: "Book" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/m-record.svg"
              alt="Mitch record logo"
              width={96}
              height={96}
              className="h-20 w-20 md:hidden"
              priority
            />
            <Image
              src="/mmm-logo.svg"
              alt="Mitch logo"
              width={160}
              height={44}
              className="hidden h-11 w-auto md:block"
              priority
            />
          </Link>

          <div className="flex items-center gap-3 md:hidden">
            <CartButton />
            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-stone-100 transition hover:border-white/30 hover:bg-white/10"
            >
              <span className="flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 w-5 bg-current transition ${
                    isMobileMenuOpen ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-current transition ${
                    isMobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-current transition ${
                    isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>

          <nav className="hidden items-center gap-3 md:flex md:gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold uppercase tracking-[0.2em] transition ${
                    isActive ? "text-[#dce7d5]" : "text-stone-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <CartButton />
          </nav>
        </div>

        {isMobileMenuOpen ? (
          <nav className="mt-4 rounded-[1.75rem] border border-white/10 bg-[#0a0a0a]/95 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition ${
                      isActive
                        ? "bg-[#7b9a70]/20 text-[#dce7d5]"
                        : "text-stone-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
