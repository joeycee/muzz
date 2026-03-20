import Image from "next/image";

import { externalLinks } from "@/lib/external-links";

export default function AboutPage() {
  const socialLinks = externalLinks.filter((link) => link.category === "social");
  const supportLinks = externalLinks.filter((link) => link.category === "support");
  const bookingLinks = externalLinks.filter((link) => link.category === "booking");

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-16 pb-20">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.35em] text-[#7b9a70]">About</p>
          <h1 className="font-[family-name:var(--font-heading)] text-5xl text-stone-100 sm:text-6xl">
            About Mitch
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-stone-300">
            Mitch is a roots-led music project built around warmth, movement, and songs
            that feel lived in. The sound pulls from reggae, soul, and stripped-back live
            performance, shaped for intimate rooms, honest recordings, and a community-first
            approach to sharing the work.
          </p>
          <p className="max-w-2xl text-lg leading-8 text-stone-400">
            This page gathers the key places to listen, follow, book, and support the
            project so everything sits in one calm, useful place.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-[#31402c] bg-[radial-gradient(circle_at_top,#182016,transparent_55%),linear-gradient(180deg,#0f130f,#090a09)] p-8">
          <div className="flex items-center gap-5">
            <Image
              src="/m-record.svg"
              alt="Mitch record logo"
              width={92}
              height={92}
              className="h-20 w-20"
            />
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.32em] text-[#7b9a70]">
                Roots, rhythm, and reach
              </p>
              <p className="text-2xl leading-9 text-stone-100">
                Follow the music, support the project, and keep the signal moving.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Section
        title="Listen and follow"
        intro="The main places to keep up with releases, videos, updates, and the wider sound."
        links={socialLinks}
      />

      <Section
        title="Support and shop"
        intro="A few direct ways to back the project, grab something tangible, or chip in to keep the creative engine running."
        links={supportLinks}
      />

      <Section
        title="Bookings and platforms"
        intro="Professional booking access and live coordination links."
        links={bookingLinks}
      />
    </div>
  );
}

function Section({
  title,
  intro,
  links,
}: {
  title: string;
  intro: string;
  links: typeof externalLinks;
}) {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <h2 className="font-[family-name:var(--font-heading)] text-4xl text-stone-100">
          {title}
        </h2>
        <p className="max-w-3xl text-stone-400">{intro}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-[1.75rem] border border-white/10 bg-[#101010] p-5 transition hover:border-[#42533d] hover:bg-[#121512]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2e3b2c] bg-[#0d110d]">
                <Image
                  src={link.iconUrl}
                  alt=""
                  width={24}
                  height={24}
                  unoptimized
                  className="h-6 w-6 opacity-90"
                />
              </div>
              <span className="text-xs uppercase tracking-[0.28em] text-[#7b9a70] transition group-hover:text-[#dce7d5]">
                Open link
              </span>
            </div>
            <div className="mt-5 space-y-2">
              <h3 className="text-2xl text-stone-100">{link.label}</h3>
              <p className="text-sm leading-7 text-stone-400">{link.blurb}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
