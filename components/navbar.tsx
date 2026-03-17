"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CartButton } from "@/components/cart-button";

const navLinks = [
  { href: "/book", label: "Book" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Muzz logo"
            width={44}
            height={44}
            className="rounded-full border border-[#4d6546] bg-[#111]"
            priority
          />
          <div>
            <p className="font-[family-name:var(--font-heading)] text-lg uppercase tracking-[0.28em] text-stone-100">
              Muzz
            </p>
            <p className="text-xs uppercase tracking-[0.22em] text-[#7b9a70]">
              Roots & Rhythm
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6">
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
    </header>
  );
}
