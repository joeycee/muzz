import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/api";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-16 pb-20">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-[#7b9a70]">Shop</p>
        <h1 className="font-[family-name:var(--font-heading)] text-5xl text-stone-100 sm:text-6xl">
          Merchandise
        </h1>
        <p className="text-lg leading-8 text-stone-300">
          A storefront backed by the live shop product API, with local cart storage
          so visitors can build an order before checkout wiring is added.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
