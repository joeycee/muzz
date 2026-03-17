import { ProductDetailView } from "@/components/product-detail-view";
import { getProduct } from "@/lib/api";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-12 pb-20">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm uppercase tracking-[0.32em] text-[#7b9a70]">Shop</p>
        <h1 className="font-[family-name:var(--font-heading)] text-5xl text-stone-100 sm:text-6xl">
          {product.name}
        </h1>
      </div>

      <ProductDetailView product={product} />
    </div>
  );
}
