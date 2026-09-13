import { supabase } from "../supabaseClient";
import type { Category } from "./types";
import { slugify } from "../utils/format";
import { productPlaceholder } from "../utils/placeholder";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type CategoryInput = Pick<Category, "name" | "description"> & { image?: string };

function rowToCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    image: row.image ?? productPlaceholder("gem"),
  };
}

function categoryToRow(input: Partial<CategoryInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if ("name" in input) row.name = input.name;
  if ("description" in input) row.description = input.description ?? null;
  if ("image" in input) row.image = input.image ?? null;

  return row;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToCategory);
}

export async function getCategory(idOrSlug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq(UUID_RE.test(idOrSlug) ? "id" : "slug", idOrSlug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? rowToCategory(data) : null;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert({ ...categoryToRow(input), slug: slugify(input.name) })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToCategory(data);
}

export async function updateCategory(categoryId: string, input: Partial<CategoryInput>): Promise<Category> {
  const row = categoryToRow(input);
  if (input.name !== undefined) row.slug = slugify(input.name);

  const { data, error } = await supabase
    .from("categories")
    .update(row)
    .eq("id", categoryId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToCategory(data);
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);
  if (error) throw new Error(error.message);
}
