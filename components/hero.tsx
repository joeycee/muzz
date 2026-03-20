"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function Hero() {
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    function draw() {
      const { width: W, height: H } = canvas!;
      const img = ctx!.createImageData(W, H);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = Math.random() * 18;
      }
      ctx!.putImageData(img, 0, 0);
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="h-root">
      <canvas ref={grainRef} className="h-grain" aria-hidden="true" />

      <div className="h-bg">
        <Image
          src="/hero.jpg"
          alt="Mitch Murray"
          fill
          priority
          sizes="100vw"
          className="h-img"
        />
      </div>

      <div className="h-grad-left" />
      <div className="h-grad-bottom" />
      <div className="h-grad-top" />
      <div className="h-tint" />

      <div className="h-content">
        <div className="h-title-block">
          <div className="h-eyebrow">
            <span className="h-eyebrow-pip" />
            <span>Live music for elevated spaces</span>
          </div>
          <h1 className="h-title">
            <span className="h-tl h-tl-1">Pure</span>
            <span className="h-tl h-tl-2">
              <em>soul.</em>
            </span>
            <span className="h-tl h-tl-3">Live & raw.</span>
          </h1>
        </div>

        <div className="h-bottom">
          <div className="h-bottom-left">
            <p className="h-copy">
              Original music. Intimate live sets. Brought to weddings,
              private events, shows and creative collaborations across NZ.
            </p>
            <div className="h-ctas">
              <Link href="/book" className="h-btn-fill">
                Book a set <span className="h-arr">↗</span>
              </Link>
              <Link href="/shop" className="h-btn-ghost">
                Shop merch
              </Link>
            </div>
            <div className="h-stats">
              {[
                { n: "200+", l: "Live sets" },
                { n: "8 yrs", l: "Performing" },
                { n: "5★",   l: "Rating" },
              ].map((s) => (
                <div key={s.l} className="h-stat">
                  <span className="h-stat-n">{s.n}</span>
                  <span className="h-stat-l">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-scroll" aria-hidden="true">
          <div className="h-scroll-bar" />
          <span>Scroll</span>
        </div>
      </div>

      <style>{`
        .h-root {
          --sage:    #8faa84;
          --terra:   #c8a87a;
          --bone:    #ede5d5;
          --muted:   rgba(210,200,185,0.6);
          --dark:    #080a07;
          position: relative;
          width: 100%;
          min-height: 100svh;
          overflow: hidden;
          background: var(--dark);
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: var(--bone);
        }

        .h-grain {
          position: fixed;
          inset: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          z-index: 30;
          opacity: 0.48;
          mix-blend-mode: overlay;
        }

        /* ── PHOTO ── */
        .h-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .h-img {
          object-fit: cover;
          object-position: 30% center;
          transform: scale(1.04);
          transition: transform 7s ease;
        }
        .h-root:hover .h-img { transform: scale(1.0); }

        /* desktop: image pinned to right 65% so face sits right-of-centre */
        @media (min-width: 1024px) {
          .h-bg { left: 35%; }
        }

        /* tablet: same offset as mobile — works great */
        @media (min-width: 769px) and (max-width: 1023px) {
          .h-bg { left: -20%; right: 0; width: auto; }
          .h-img { object-position: 20% center; }
          .h-grad-left {
            background: linear-gradient(
              180deg,
              rgba(6,8,5,0.6)  0%,
              rgba(6,8,5,0.1) 40%,
              rgba(6,8,5,0.0) 60%,
              rgba(6,8,5,0.98) 100%
            );
          }
        }

        /* mobile */
        @media (max-width: 768px) {
          .h-img { object-position: 20% center; }
          .h-grad-left {
            background: linear-gradient(
              180deg,
              rgba(6,8,5,0.6)  0%,
              rgba(6,8,5,0.1) 40%,
              rgba(6,8,5,0.0) 60%,
              rgba(6,8,5,0.98) 100%
            );
          }
          .h-bottom { flex-direction: column; }
          .h-title-block { max-width: 100%; }
        }

        /* ── OVERLAYS ── */
        .h-grad-left {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(
            95deg,
            rgba(4,5,3,0.99) 0%,
            rgba(4,5,3,0.96) 35%,
            rgba(4,5,3,0.80) 50%,
            rgba(4,5,3,0.25) 65%,
            rgba(4,5,3,0.0)  80%,
            transparent      100%
          );
        }
        .h-grad-bottom {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(
            180deg,
            transparent 45%,
            rgba(6,8,5,0.6) 70%,
            rgba(6,8,5,0.96) 100%
          );
        }
        .h-grad-top {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(
            180deg,
            rgba(6,8,5,0.55) 0%,
            transparent 20%
          );
        }
        .h-tint {
          position: absolute; inset: 0; z-index: 3;
          background: linear-gradient(
            125deg,
            rgba(90,60,25,0.12) 0%,
            rgba(55,80,45,0.08) 55%,
            transparent 100%
          );
          mix-blend-mode: multiply;
        }

        /* ── CONTENT ── */
        .h-content {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: clamp(2.5rem, 5vw, 4.5rem) clamp(1.75rem, 6vw, 5rem);
          min-height: 100svh;
        }

        /* ── TITLE ── */
        .h-title-block {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-width: 680px;
        }
        .h-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.65rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--sage);
          opacity: 0;
          animation: hSlideDown 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s forwards;
        }
        .h-eyebrow-pip {
          display: inline-block;
          width: 28px; height: 1px;
          background: var(--sage);
          flex-shrink: 0;
        }
        .h-title {
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
          font-weight: 900;
          line-height: 0.88;
          letter-spacing: -0.03em;
          margin: 0;
          display: flex;
          flex-direction: column;
        }
        .h-tl { display: block; overflow: hidden; }
        .h-tl-1 {
          font-size: clamp(5rem, 13vw, 12rem);
          color: var(--bone);
          opacity: 0;
          animation: hSlideUp 1s cubic-bezier(0.16,1,0.3,1) 0.4s forwards;
        }
        .h-tl-2 {
          font-size: clamp(5rem, 13vw, 12rem);
          color: var(--sage);
          font-style: italic;
          opacity: 0;
          animation: hSlideUp 1s cubic-bezier(0.16,1,0.3,1) 0.58s forwards;
        }
        .h-tl-2 em { font-style: italic; }
        .h-tl-3 {
          font-size: clamp(2.5rem, 6vw, 5.5rem);
          color: var(--terra);
          font-weight: 700;
          font-style: normal;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 0.15em;
          opacity: 0;
          animation: hSlideUp 1s cubic-bezier(0.16,1,0.3,1) 0.75s forwards;
        }

        /* ── BOTTOM ── */
        .h-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          gap: clamp(2rem, 4vw, 4rem);
          flex-wrap: wrap;
          opacity: 0;
          animation: hFadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 1s forwards;
        }
        .h-bottom-left {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 420px;
        }
        .h-copy {
          font-size: clamp(0.9rem, 1.35vw, 1.05rem);
          line-height: 1.8;
          color: var(--muted);
          margin: 0;
        }
        .h-ctas { display: flex; gap: 0.85rem; flex-wrap: wrap; }
        .h-btn-fill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--sage);
          color: var(--dark);
          border-radius: 999px;
          padding: 0.85rem 2rem;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .h-btn-fill:hover {
          background: #a5bf9a;
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(143,170,132,0.3);
        }
        .h-arr { transition: transform 0.2s; }
        .h-btn-fill:hover .h-arr { transform: translate(2px,-2px); }
        .h-btn-ghost {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(143,170,132,0.28);
          color: rgba(220,212,198,0.8);
          border-radius: 999px;
          padding: 0.85rem 2rem;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.2s;
        }
        .h-btn-ghost:hover {
          border-color: var(--sage);
          color: var(--bone);
          background: rgba(143,170,132,0.07);
        }
        .h-stats {
          display: flex;
          gap: clamp(1.5rem, 3vw, 2.5rem);
          padding-top: 1.4rem;
          border-top: 1px solid rgba(143,170,132,0.13);
        }
        .h-stat { display: flex; flex-direction: column; gap: 0.18rem; }
        .h-stat-n {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.4rem, 2.5vw, 2rem);
          font-weight: 700;
          color: var(--terra);
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .h-stat-l {
          font-size: 0.6rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(140,132,118,0.75);
        }

        /* ── SCROLL ── */
        .h-scroll {
          position: absolute;
          right: clamp(1.75rem, 5vw, 5rem);
          bottom: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          opacity: 0;
          animation: hFadeIn 1s ease 2s forwards;
          z-index: 10;
        }
        .h-scroll span {
          font-size: 0.56rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(190,182,168,0.55);
          writing-mode: vertical-rl;
        }
        .h-scroll-bar {
          width: 1px; height: 52px;
          background: linear-gradient(180deg, rgba(143,170,132,0.65), transparent);
          animation: hScrollPulse 2.4s ease infinite;
        }
        @keyframes hScrollPulse {
          0%,100% { transform:scaleY(1);    opacity:0.65; }
          50%      { transform:scaleY(0.35); opacity:0.12; }
        }

        /* ── KEYFRAMES ── */
        @keyframes hSlideUp {
          from { opacity:0; transform:translateY(55px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes hSlideDown {
          from { opacity:0; transform:translateY(-12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes hFadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes hFadeIn { to { opacity:1; } }
      `}</style>
    </section>
  );
}