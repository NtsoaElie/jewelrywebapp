import { supabase } from "../supabaseClient";
import type { PagedResult, Product, ProductFilters } from "./types";
import { slugify } from "../utils/format";

export type ProductInput = Omit<Product, "id" | "sku" | "slug" | "createdAt" | "rating" | "reviewCount">;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function rowToProduct(row: any): Product {
  return {
    id: row.id,
    sku: row.sku ?? "",
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    categoryId: row.category_id ?? "",
    collection: row.collection ?? undefined,
    images: row.images ?? [],
    stock: row.stock,
    lowStockThreshold: row.low_stock_threshold,
    rating: row.rating,
    reviewCount: row.review_count,
    variants: row.variants ?? [],
    material: row.material ?? undefined,
    color: row.color ?? undefined,
    size: row.size ?? undefined,
    weight: row.weight ?? undefined,
    dimensions: row.dimensions ?? undefined,
    featured: row.featured,
    status: row.status,
    createdAt: row.created_at,
  };
}

function productToRow(input: Partial<ProductInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if ("name" in input) row.name = input.name;
  if ("description" in input) row.description = input.description ?? null;
  if ("price" in input) row.price = input.price;
  if ("compareAtPrice" in input) row.compare_at_price = input.compareAtPrice ?? null;
  if ("categoryId" in input) row.category_id = input.categoryId || null;
  if ("collection" in input) row.collection = input.collection ?? null;
  if ("images" in input) row.images = input.images;
  if ("stock" in input) row.stock = input.stock;
  if ("lowStockThreshold" in input) row.low_stock_threshold = input.lowStockThreshold;
  if ("variants" in input) row.variants = input.variants;
  if ("material" in input) row.material = input.material ?? null;
  if ("color" in input) row.color = input.color ?? null;
  if ("size" in input) row.size = input.size ?? null;
  if ("weight" in input) row.weight = input.weight ?? null;
  if ("dimensions" in input) row.dimensions = input.dimensions ?? null;
  if ("featured" in input) row.featured = input.featured;
  if ("status" in input) row.status = input.status;

  return row;
}

export async function getProducts(filters: ProductFilters = {}): Promise<PagedResult<Product>> {
  let query = supabase.from("products").select("*", { count: "exact" });

  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.collection) query = query.eq("collection", filters.collection);
  if (filters.status) query = query.eq("status", filters.status);
  if (typeof filters.minPrice === "number") query = query.gte("price", filters.minPrice);
  if (typeof filters.maxPrice === "number") query = query.lte("price", filters.maxPrice);
  if (filters.inStockOnly) query = query.gt("stock", 0);
  if (typeof filters.minRating === "number") query = query.gte("rating", filters.minRating);
  if (filters.query) query = query.ilike("name", `%${filters.query}%`);

  switch (filters.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    case "stock":
      query = query.order("stock", { ascending: false });
      break;
    case "featured":
    default:
      query = query.order("featured", { ascending: false });
      break;
  }

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;
  const start = (page - 1) * pageSize;
  query = query.range(start, start + pageSize - 1);

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  return {
    items: (data ?? []).map(rowToProduct),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getProduct(idOrSlug: string): Promise<Product | null> {
  const query = supabase
    .from("products")
    .select("*")
    .eq(UUID_RE.test(idOrSlug) ? "id" : "slug", idOrSlug);

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToProduct(data) : null;
}


export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("status", "active")
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToProduct);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (!product.categoryId) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", product.categoryId)
    .eq("status", "active")
    .neq("id", product.id)
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToProduct);
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert({ ...productToRow(input), slug: slugify(input.name) })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToProduct(data);
}

export async function updateProduct(productId: string, input: Partial<ProductInput>): Promise<Product> {
  const row = productToRow(input);
  if (input.name !== undefined) row.slug = slugify(input.name);

  const { data, error } = await supabase
    .from("products")
    .update(row)
    .eq("id", productId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToProduct(data);
}

export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw new Error(error.message);
}
