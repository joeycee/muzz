import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/book", label: "Book" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md space-y-3">
          <p className="font-[family-name:var(--font-heading)] text-xl uppercase tracking-[0.28em] text-stone-100">
            Muzz
          </p>
          <p className="text-sm leading-7 text-stone-400">
            Premium reggae and roots experiences for live bookings, exclusive merch,
            and intimate event moments.
          </p>
        </div>

        <div className="flex flex-col gap-6 text-sm text-stone-400 sm:flex-row sm:items-center sm:gap-10">
          <div className="flex gap-4 uppercase tracking-[0.18em]">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-4 uppercase tracking-[0.18em]">
            <span>Instagram</span>
            <span>YouTube</span>
            <span>TikTok</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
