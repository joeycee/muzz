"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/cart-provider";
import { DigitalBadge } from "@/components/digital-badge";
import { formatCurrency } from "@/lib/format";
import { getMediaUrl } from "@/lib/api";
import { Product } from "@/lib/types";
import { normalizeProductSizes } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const imageUrl = getMediaUrl(product.primary_image || product.image);
  const sizeOptions = normalizeProductSizes(product.available_sizes);

  function handleAddToCart() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="pc-card">
      {/* Image */}
      <div className="pc-img-wrap">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="pc-img"
          />
        ) : (
          <div className="pc-img-fallback">
            <p className="pc-img-fallback-text">{product.name}</p>
          </div>
        )}
        {/* Price badge overlaid on image */}
        <div className="pc-price-badge">{formatCurrency(product.price)}</div>
      </div>

      {/* Body */}
      <div className="pc-body">
        <div className="pc-meta">
          {product.is_digital ? <DigitalBadge className="pc-badge" /> : null}
          <h3 className="pc-name">{product.name}</h3>
          <p className="pc-desc">{product.description}</p>
          {product.product_type === "digital_album" ? (
            <p className="pc-download-note">
              {product.digital_tracks.length} tracks included
            </p>
          ) : null}
          {product.is_digital ? (
            <p className="pc-download-note">No shipping required</p>
          ) : null}
          {product.has_size_options ? (
            <p className="pc-download-note">Available sizes: {sizeOptions.map((size) => size.label).join(", ")}</p>
          ) : null}
          <p className="pc-stock">{product.stock} in stock</p>
        </div>

        <div className="pc-actions">
          <Link href={`/shop/${product.slug}`} className="pc-link">
            View details
          </Link>
          {product.has_size_options ? (
            <Link href={`/shop/${product.slug}`} className="pc-btn pc-btn--link">
              Choose size
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className={added ? "pc-btn pc-btn--added" : "pc-btn"}
            >
              {added ? "Added ✓" : "Add to cart"}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .pc-card {
          background: #0d0f0c;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
          display: flex;
          flex-direction: column;
          transition: border-color 0.2s, transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .pc-card:hover {
          border-color: rgba(143,170,132,0.18);
          transform: translateY(-3px);
        }
        .pc-img-wrap {
          position: relative;
          aspect-ratio: 4/3;
          background: linear-gradient(135deg, #111813, #1a2016);
          overflow: hidden;
        }
        .pc-img {
          object-fit: cover;
          transition: transform 5s ease;
        }
        .pc-card:hover .pc-img { transform: scale(1.04); }
        .pc-img-fallback {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(143,170,132,0.15) 0%, rgba(10,12,9,0.98) 100%);
          display: flex;
          align-items: flex-end;
          padding: 1.5rem;
        }
        .pc-img-fallback-text {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #ede5d5;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          line-height: 1.2;
          margin: 0;
        }
        .pc-price-badge {
          position: absolute;
          top: 1rem; right: 1rem;
          background: rgba(8,10,7,0.82);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(200,168,122,0.3);
          border-radius: 999px;
          padding: 0.3rem 0.85rem;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #c8a87a;
          font-family: 'DM Sans', sans-serif;
        }
        .pc-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          flex: 1;
        }
        .pc-meta { display: flex; flex-direction: column; gap: 0.6rem; flex: 1; }
        .pc-badge { width: fit-content; }
        .pc-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #ede5d5;
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }
        .pc-desc {
          font-size: 0.83rem;
          line-height: 1.75;
          color: rgba(190,182,165,0.6);
          margin: 0;
        }
        .pc-stock {
          font-size: 0.6rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #8faa84;
          margin: 0;
        }
        .pc-download-note {
          font-size: 0.7rem;
          line-height: 1.6;
          color: rgba(220,231,213,0.78);
          margin: 0;
        }
        .pc-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .pc-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.08);
          color: #ede5d5;
          border-radius: 999px;
          padding: 0.78rem 1.4rem;
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .pc-link:hover {
          border-color: rgba(143,170,132,0.35);
          color: #dce7d5;
          background: rgba(143,170,132,0.06);
        }
        .pc-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #8faa84;
          color: #080a07;
          border: none;
          border-radius: 999px;
          padding: 0.8rem 1.6rem;
          font-size: 0.67rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s, transform 0.2s;
        }
        .pc-btn:hover { background: #a5bf9a; transform: translateY(-1px); }
        .pc-btn--added {
          background: rgba(143,170,132,0.15);
          color: #8faa84;
          border: 1px solid rgba(143,170,132,0.3);
        }
        .pc-btn--link {
          text-decoration: none;
        }
        .pc-btn--added:hover { background: rgba(143,170,132,0.2); transform: none; }
      `}</style>
    </article>
  );
}
