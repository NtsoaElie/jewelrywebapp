import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Truck, Gem } from "lucide-react";
import { getFeaturedProducts } from "../../api/products";
import { useAsync } from "../../hooks/useAsync";
import { useToast } from "../../context/ToastContext";
import { useCategories } from "../../hooks/useCategories";
import { products } from "../../data/products";
import { ProductGrid, ProductGridSkeleton } from "../../components/store/ProductGrid";
import { CategoryCard } from "../../components/store/CategoryCard";
import { ErrorState } from "../../components/ui/ErrorState";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const heroProduct = products.find((p) => p.featured) ?? products[0];

const VALUE_PROPS = [
  { icon: Gem, title: "Ethically Sourced", description: "Every stone and metal is traced to responsible origins." },
  { icon: ShieldCheck, title: "Lifetime Warranty", description: "Complimentary cleaning and repair for as long as you own it." },
  { icon: Truck, title: "Free Shipping & Returns", description: "Complimentary insured shipping on every order, always." },
];

export function Home() {
  const { categories } = useCategories();
  const { data: featured, loading, error, refetch } = useAsync(() => getFeaturedProducts(8), []);
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    showToast("You're subscribed", { description: "Watch your inbox for new arrivals and exclusive offers." });
    setEmail("");
  };

  return (
    <div>
      <section className="bg-primary-dark">
        <div className="container grid items-center gap-8 py-14 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:py-28">
          <div className="order-2 lg:order-1">
            <p className="text-label font-semibold uppercase tracking-widest text-accent">New Collection</p>
            <h1 className="mt-3 font-display text-display font-semibold text-primary-foreground">
              Jewelry made for the moments you'll remember
            </h1>
            <p className="mt-4 max-w-md text-body text-primary-foreground/80">
              Thoughtfully designed rings, necklaces, earrings, and bracelets — crafted in fine metals to be worn
              every day and passed down for generations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="inline-flex h-12 items-center justify-center rounded bg-accent px-7 text-body font-medium text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                Shop the Collection
              </Link>
              <Link to="/about" className="inline-flex h-12 items-center justify-center rounded border border-primary-foreground/30 px-7 text-body font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground">
                Our Story
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="mx-auto aspect-square max-w-md overflow-hidden rounded-lg shadow-overlay">
              <img src={heroProduct.images[0]} alt={heroProduct.name} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14 sm:py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-h1 font-semibold text-foreground">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-surface py-14 sm:py-20">
        <div className="container">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-h1 font-semibold text-foreground">Featured Pieces</h2>
            <Link to="/shop" className="text-small font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          {loading && <ProductGridSkeleton />}
          {error && <ErrorState description={error} onRetry={refetch} />}
          {!loading && !error && featured && <ProductGrid products={featured} />}
        </div>
      </section>

      <section className="container py-14 sm:py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <prop.icon className="h-8 w-8 text-primary" aria-hidden="true" />
              <h3 className="mt-3 text-h3 font-display font-semibold text-foreground">{prop.title}</h3>
              <p className="mt-1 text-small text-muted-foreground">{prop.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary py-14 sm:py-16">
        <div className="container flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-h2 font-semibold text-primary-foreground">Stay in the Loop</h2>
          <p className="max-w-md text-small text-primary-foreground/80">
            Be the first to know about new arrivals, limited collections, and exclusive offers.
          </p>
          <form onSubmit={handleSubscribe} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="bg-surface"
              />
            </div>
            <Button type="submit" variant="secondary" size="md">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
