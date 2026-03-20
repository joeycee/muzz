import Image from "next/image";
import Link from "next/link";

import { externalLinks } from "@/lib/external-links";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/book", label: "Book" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <div className="flex items-end gap-4">
          <div className="hidden md:block">
            <Image
              src="/m-record.svg"
              alt="Mitch record logo"
              width={72}
              height={72}
              className="h-[4.5rem] w-[4.5rem]"
            />
          </div>
          <div className="max-w-md space-y-3">
            <Image
              src="/mmm-logo.svg"
              alt="Mitch logo"
              width={160}
              height={44}
              className="h-11 w-auto"
            />
            <p className="text-sm leading-7 text-stone-400">
              Premium reggae and roots experiences for live bookings, exclusive merch,
              and intimate event moments.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-6 text-sm text-stone-400 sm:flex-row sm:items-center sm:gap-10">
            <div className="flex gap-4 uppercase tracking-[0.18em]">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
              Find, follow, support
            </p>
            <div className="flex flex-wrap gap-3">
              {externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  title={link.label}
                  aria-label={link.label}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#0d110d] transition hover:border-[#7b9a70] hover:bg-[#121812]"
                >
                  <Image
                    src={link.iconUrl}
                    alt=""
                    width={20}
                    height={20}
                    unoptimized
                    className="h-5 w-5 opacity-90"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
