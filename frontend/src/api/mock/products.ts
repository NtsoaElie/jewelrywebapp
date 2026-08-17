import type { PagedResult, Product, ProductFilters } from "../types";
import { products as seedProducts } from "../../data/products";
import { simulate } from "./delay";
import { loadStore, saveStore } from "./store";
import { slugify } from "../../utils/format";

const STORE_KEY = "aurelle:products";

let products: Product[] = loadStore(STORE_KEY, seedProducts);

function persist() {
  saveStore(STORE_KEY, products);
}

function applyFilters(list: Product[], filters: ProductFilters = {}): Product[] {
  let result = [...list];

  if (filters.categoryId) {
    result = result.filter((p) => p.categoryId === filters.categoryId);
  }
  if (filters.collection) {
    result = result.filter((p) => p.collection === filters.collection);
  }
  if (filters.status) {
    result = result.filter((p) => p.status === filters.status);
  }
  if (typeof filters.minPrice === "number") {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (typeof filters.maxPrice === "number") {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.inStockOnly) {
    result = result.filter((p) => p.stock > 0);
  }
  if (typeof filters.minRating === "number") {
    result = result.filter((p) => p.rating >= filters.minRating!);
  }
  if (filters.query) {
    const q = filters.query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.collection?.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q),
      );
    }
  }

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "stock":
      result.sort((a, b) => b.stock - a.stock);
      break;
    case "featured":
    default:
      result.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
  }

  return result;
}

export async function getProducts(filters: ProductFilters = {}): Promise<PagedResult<Product>> {
  return simulate(() => {
    const filtered = applyFilters(products, filters);
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 12;
    const start = (page - 1) * pageSize;
    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  });
}

export async function getProduct(idOrSlug: string): Promise<Product | null> {
  return simulate(() => products.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return simulate(() => products.filter((p) => p.featured && p.status === "active").slice(0, limit));
}

export async function getProductsByCategory(categoryId: string, limit?: number): Promise<Product[]> {
  return simulate(() => {
    const result = products.filter((p) => p.categoryId === categoryId && p.status === "active");
    return typeof limit === "number" ? result.slice(0, limit) : result;
  });
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return simulate(() =>
    products
      .filter((p) => p.id !== product.id && p.categoryId === product.categoryId && p.status === "active")
      .slice(0, limit),
  );
}

export async function searchProducts(query: string): Promise<Product[]> {
  return simulate(() => applyFilters(products.filter((p) => p.status === "active"), { query }));
}

export type ProductInput = Omit<Product, "id" | "sku" | "slug" | "createdAt" | "rating" | "reviewCount">;

export async function createProduct(data: ProductInput): Promise<Product> {
  return simulate(() => {
    const slug = slugify(data.name);
    const product: Product = {
      ...data,
      id: `prod-${slug}-${Date.now().toString(36)}`,
      slug,
      sku: `AUR-${slug.slice(0, 3).toUpperCase()}-${String(products.length + 1).padStart(3, "0")}`,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    products = [product, ...products];
    persist();
    return product;
  }, { ms: 600 });
}

export async function updateProduct(id: string, data: Partial<ProductInput>): Promise<Product> {
  return simulate(() => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("This product no longer exists. It may have been deleted.");
    const updated: Product = {
      ...products[index],
      ...data,
      slug: data.name ? slugify(data.name) : products[index].slug,
    };
    products = [...products.slice(0, index), updated, ...products.slice(index + 1)];
    persist();
    return updated;
  }, { ms: 600 });
}

export async function deleteProduct(id: string): Promise<void> {
  return simulate(() => {
    products = products.filter((p) => p.id !== id);
    persist();
  }, { ms: 500 });
}
