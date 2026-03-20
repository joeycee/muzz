"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getMediaUrl } from "@/lib/api";
import { Testimonial } from "@/lib/types";

export function TestimonialShowcase({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 3200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-6">
      <div className="overflow-hidden rounded-[2rem] border border-[#31402c] bg-[radial-gradient(circle_at_top_left,rgba(123,154,112,0.18),transparent_35%),linear-gradient(180deg,#111611_0%,#090909_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-[#7b9a70]">
              Testimonials
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl text-stone-100">
              Words from the room
            </h2>
            <p className="max-w-2xl text-stone-400">
              Notes from people who have experienced the live sets, the atmosphere,
              and the care that sits behind the music.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-stone-300">
            Rotating client notes
          </div>
        </div>

        <div className="relative mt-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0c0f0c] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#090909] to-transparent" />

          <div
            className="flex gap-4 transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(calc(-${activeIndex} * (17.5rem + 1rem)))`,
            }}
          >
            {testimonials.map((testimonial) => {
            const imageUrl = getMediaUrl(testimonial.profile_image);

            return (
              <article
                key={testimonial.id}
                className="min-h-[15.5rem] w-[17.5rem] shrink-0 rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,20,17,0.98),rgba(10,10,10,0.98))] p-5 transition hover:-translate-y-1 hover:border-[#52654c] sm:w-[18.5rem]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[#31402c] bg-[#121712]">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={testimonial.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-xs uppercase tracking-[0.16em] text-[#d9cfbf]">
                          {getInitials(testimonial.name)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-base text-stone-100">{testimonial.name}</p>
                      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-[#7b9a70]">
                        {renderStars(testimonial.rating)}
                      </p>
                    </div>
                  </div>
                  <span className="font-[family-name:var(--font-heading)] text-4xl leading-none text-[#7b9a70]/35">
                    “
                  </span>
                </div>

                <p className="mt-5 text-sm leading-7 text-stone-300">
                  {testimonial.description}
                </p>
              </article>
            );
            })}
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              aria-label={`Show testimonial ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition ${
                activeIndex === index ? "w-8 bg-[#7b9a70]" : "w-2.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function renderStars(rating: number) {
  return "★".repeat(Math.max(1, Math.min(5, rating)));
}
