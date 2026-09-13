import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { getProduct, getRelatedProducts } from "../../api/products";
import { useAsync } from "../../hooks/useAsync";
import { useCart } from "../../context/CartContext";
import { useCategories } from "../../hooks/useCategories";
import { ProductImageGallery } from "../../components/store/ProductImageGallery";
import { WishlistButton } from "../../components/store/WishlistButton";
import { ProductGrid } from "../../components/store/ProductGrid";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { Rating } from "../../components/ui/Rating";
import { PriceDisplay } from "../../components/ui/PriceDisplay";
import { QuantitySelector } from "../../components/ui/QuantitySelector";
import { StockStatusBadge } from "../../components/ui/StatusBadge";
import { Button } from "../../components/ui/Button";
import { PageSpinner } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { cn } from "../../utils/cn";

const SHIP_INFO = [
  { icon: Truck, text: "Free insured shipping, arrives in 3-5 business days" },
  { icon: RotateCcw, text: "30-day free returns on unworn pieces" },
  { icon: ShieldCheck, text: "Lifetime warranty on craftsmanship" },
];

export function ProductDetail() {
  const { byId } = useCategories();
  const { slug } = useParams<{ slug: string }>();
  const { data: product, loading, error, refetch } = useAsync(() => getProduct(slug!), [slug]);
  const { data: related } = useAsync(() => (product ? getRelatedProducts(product) : Promise.resolve([])), [product?.id]);
  const { addItem } = useCart();

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [variantError, setVariantError] = useState(false);

  if (loading) return <PageSpinner label="Loading product" />;
  if (error) return <div className="container py-16"><ErrorState description={error} onRetry={refetch} /></div>;
  if (!product) {
    return (
      <div className="container py-16">
        <EmptyState
          title="Product not found"
          description="This product may have been removed or the link is incorrect."
          action={<Link to="/shop" className="text-small font-medium text-primary hover:underline">Back to Shop</Link>}
        />
      </div>
    );
  }

  const category = byId(product.categoryId);
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  // Before a size is chosen, show combined stock across all variants rather than 0 —
  // otherwise an in-stock product briefly reads as "Out of Stock" pre-selection.
  const availableStock =
    product.variants.length > 0
      ? selectedVariant
        ? selectedVariant.stock
        : product.variants.reduce((sum, v) => sum + v.stock, 0)
      : product.stock;
  const outOfStock = product.variants.length === 0 ? product.stock <= 0 : product.variants.every((v) => v.stock <= 0);

  const handleAddToCart = () => {
    if (product.variants.length > 0 && !selectedVariantId) {
      setVariantError(true);
      return;
    }
    setVariantError(false);
    addItem(product, quantity, selectedVariantId);
    setQuantity(1);
  };

  const details = [
    { label: "SKU", value: product.sku },
    { label: "Material", value: product.material },
    { label: "Color", value: product.color },
    { label: "Weight", value: product.weight },
    { label: "Dimensions", value: product.dimensions },
    { label: "Collection", value: product.collection },
  ].filter((d) => d.value);

  return (
    <div className="container py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          ...(category ? [{ label: category.name, href: `/shop?category=${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductImageGallery images={product.images} productName={product.name} />

        <div className="flex flex-col">
          {product.collection && <p className="text-label font-semibold uppercase tracking-wide text-accent">{product.collection}</p>}
          <h1 className="mt-2 font-display text-h1 font-semibold text-foreground">{product.name}</h1>
          <div className="mt-2">
            <Rating value={product.rating} reviewCount={product.reviewCount} size="md" />
          </div>
          <div className="mt-4">
            <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
          </div>

          <p className="mt-5 max-w-prose text-body text-muted-foreground">{product.description}</p>

          <div className="mt-5">
            <StockStatusBadge stock={availableStock} lowStockThreshold={product.lowStockThreshold} />
          </div>

          {product.variants.length > 0 && (
            <fieldset className="mt-6">
              <legend className="mb-2 text-label font-medium text-foreground">
                Size {selectedVariant && <span className="font-normal text-muted-foreground">— {selectedVariant.label}</span>}
              </legend>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <label
                    key={variant.id}
                    className={cn(
                      "inline-flex h-10 cursor-pointer items-center rounded border px-4 text-small transition-colors",
                      selectedVariantId === variant.id
                        ? "border-primary bg-primary/5 font-medium text-primary"
                        : "border-border text-foreground hover:border-primary/50",
                      variant.stock <= 0 && "cursor-not-allowed opacity-40",
                    )}
                  >
                    <input
                      type="radio"
                      name="variant"
                      value={variant.id}
                      checked={selectedVariantId === variant.id}
                      disabled={variant.stock <= 0}
                      onChange={() => {
                        setSelectedVariantId(variant.id);
                        setVariantError(false);
                        setQuantity(1);
                      }}
                      className="sr-only"
                    />
                    {variant.label}
                  </label>
                ))}
              </div>
              {variantError && (
                <p role="alert" className="mt-2 text-caption text-error">
                  Please select a size before adding to cart.
                </p>
              )}
            </fieldset>
          )}

          <div className="mt-6 flex items-center gap-3">
            <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={Math.max(1, availableStock)} />
            <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={outOfStock}>
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
          <div className="mt-3">
            <WishlistButton product={product} />
          </div>

          <div className="mt-8 space-y-3 border-t border-border pt-6">
            {SHIP_INFO.map((info) => (
              <div key={info.text} className="flex items-center gap-3 text-small text-muted-foreground">
                <info.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {info.text}
              </div>
            ))}
          </div>

          {details.length > 0 && (
            <div className="mt-8 border-t border-border pt-6">
              <h2 className="text-label font-semibold uppercase tracking-wide text-foreground">Product Details</h2>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-small">
                {details.map((d) => (
                  <div key={d.label} className="contents">
                    <dt className="text-muted-foreground">{d.label}</dt>
                    <dd className="text-foreground">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {related && related.length > 0 && (
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="mb-8 font-display text-h1 font-semibold text-foreground">You May Also Like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
