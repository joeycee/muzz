"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { DigitalBadge } from "@/components/digital-badge";
import { getMediaUrl } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { Product } from "@/lib/types";
import { normalizeProductSizes } from "@/lib/utils";

export function ProductDetailView({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const sizeOptions = normalizeProductSizes(product.available_sizes);
  const [selectedSize, setSelectedSize] = useState(
    sizeOptions.length === 1 ? sizeOptions[0].value : "",
  );

  const gallery = useMemo(() => {
    const imageSet = product.images.length > 0
      ? product.images.map((image) => ({
          src: getMediaUrl(image.image),
          alt: image.alt_text || product.name,
          id: image.id,
        }))
      : [];

    if (imageSet.length === 0) {
      const fallbackImage = getMediaUrl(product.primary_image || product.image);

      return fallbackImage
        ? [{ id: product.id, src: fallbackImage, alt: product.name }]
        : [];
    }

    return imageSet.filter((image): image is { id: number; src: string; alt: string } => !!image.src);
  }, [product]);

  const activeImage = gallery[selectedImageIndex] || null;

  function handleAddToCart() {
    if (product.has_size_options && !selectedSize) {
      return;
    }

    addItem(product, { size: selectedSize || undefined });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="space-y-4">
        <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0d0f0c] shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
          <div className="relative aspect-[4/3] bg-[linear-gradient(135deg,#111813,#1a2016)]">
            {activeImage ? (
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes="(max-width: 1280px) 100vw, 60vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-end p-8">
                <p className="font-[family-name:var(--font-heading)] text-4xl text-stone-100">
                  {product.name}
                </p>
              </div>
            )}
          </div>
        </div>

        {gallery.length > 1 ? (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {gallery.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-2xl border transition ${
                  index === selectedImageIndex
                    ? "border-[#7b9a70] bg-[#141d13]"
                    : "border-white/10 bg-[#0d0f0c] hover:border-[#42533d]"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <aside className="space-y-5 rounded-[1.8rem] border border-[#31402c] bg-[linear-gradient(180deg,rgba(18,23,17,0.98),rgba(8,9,8,0.98))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.32)] xl:sticky xl:top-24 h-fit">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs uppercase tracking-[0.28em] text-[#7b9a70]">
              Product detail
            </p>
            {product.is_digital ? <DigitalBadge /> : null}
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-5xl text-stone-100">
            {product.name}
          </h1>
          <p className="text-sm leading-7 text-stone-400">{product.description}</p>
        </div>

        <div className="rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between text-sm text-stone-300">
            <span>Price</span>
            <span className="text-lg text-stone-100">{formatCurrency(product.price)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-stone-300">
            <span>Stock</span>
            <span>{product.stock} available</span>
          </div>
          {product.product_type === "digital_album" ? (
            <div className="mt-3 flex items-center justify-between text-sm text-stone-300">
              <span>Track count</span>
              <span>{product.digital_tracks.length} tracks</span>
            </div>
          ) : null}
          {product.is_digital ? (
            <div className="mt-3 flex items-center justify-between text-sm text-stone-300">
              <span>Shipping</span>
              <span>Not required</span>
            </div>
          ) : null}
          {product.has_size_options ? (
            <div className="mt-3 flex items-center justify-between text-sm text-stone-300">
              <span>Sizes</span>
              <span>{sizeOptions.map((size) => size.label).join(", ")}</span>
            </div>
          ) : null}
        </div>

        {product.has_size_options ? (
          <label className="block rounded-[1.2rem] border border-[#31402c] bg-[#111611] p-4">
            <span className="text-xs uppercase tracking-[0.24em] text-[#7b9a70]">
              Select size
            </span>
            <select
              value={selectedSize}
              onChange={(event) => setSelectedSize(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-[#7b9a70]"
            >
              <option value="">Choose a size</option>
              {sizeOptions.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {product.is_digital ? (
          <div className="rounded-[1.2rem] border border-[#31402c] bg-[#111611] p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#7b9a70]">
              Digital download
            </p>
            <div className="mt-3 space-y-3 text-sm leading-7 text-stone-300">
              <p>
                This release will be available for download immediately after payment.
              </p>
              <p>
                Once your purchase is complete, you&apos;ll receive access to download the
                track(s) from your order confirmation page.
              </p>
              <p>No physical product will be shipped.</p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] transition ${
              added
                ? "border border-[#50664b] bg-[#141d13] text-[#dce7d5]"
                : "bg-[#7b9a70] text-black hover:bg-[#93b586]"
            }`}
            disabled={product.has_size_options && !selectedSize}
          >
            {added ? "Added to cart" : product.has_size_options && !selectedSize ? "Select size" : "Add to cart"}
          </button>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-stone-100 transition hover:border-[#42533d] hover:text-[#dce7d5]"
          >
            Back to shop
          </Link>
        </div>
      </aside>
    </div>
  );
}
