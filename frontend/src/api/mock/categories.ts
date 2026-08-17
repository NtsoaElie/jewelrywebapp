import type { Category } from "../types";
import { categories as seedCategories } from "../../data/categories";
import { simulate } from "./delay";
import { loadStore, saveStore } from "./store";
import { slugify } from "../../utils/format";
import { productPlaceholder } from "../../utils/placeholder";

const STORE_KEY = "aurelle:categories";

let categories: Category[] = loadStore(STORE_KEY, seedCategories);

function persist() {
  saveStore(STORE_KEY, categories);
}

export async function getCategories(): Promise<Category[]> {
  return simulate(() => categories);
}

export async function getCategory(idOrSlug: string): Promise<Category | null> {
  return simulate(() => categories.find((c) => c.id === idOrSlug || c.slug === idOrSlug) ?? null);
}

export type CategoryInput = Pick<Category, "name" | "description"> & { image?: string };

export async function createCategory(data: CategoryInput): Promise<Category> {
  return simulate(() => {
    const slug = slugify(data.name);
    const category: Category = {
      id: `cat-${slug}-${Date.now().toString(36)}`,
      name: data.name,
      slug,
      description: data.description,
      image: data.image ?? productPlaceholder("gem", categories.length),
    };
    categories = [...categories, category];
    persist();
    return category;
  }, { ms: 500 });
}

export async function updateCategory(id: string, data: Partial<CategoryInput>): Promise<Category> {
  return simulate(() => {
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("This category no longer exists. It may have been deleted.");
    const updated: Category = {
      ...categories[index],
      ...data,
      slug: data.name ? slugify(data.name) : categories[index].slug,
    };
    categories = [...categories.slice(0, index), updated, ...categories.slice(index + 1)];
    persist();
    return updated;
  }, { ms: 500 });
}

export async function deleteCategory(id: string): Promise<void> {
  return simulate(() => {
    categories = categories.filter((c) => c.id !== id);
    persist();
  }, { ms: 450 });
}
