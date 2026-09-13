import { getCategories } from "../api/categories";
import { useAsync } from "./useAsync";

/** Loads categories from the database. Ids are uuids, so never hard-code them. */
export function useCategories() {
  const { data, loading, error, refetch } = useAsync(getCategories, []);
  const categories = data ?? [];

  return {
    categories,
    loading,
    error,
    refetch,
    byId: (id?: string) => categories.find((c) => c.id === id),
    bySlug: (slug?: string) => categories.find((c) => c.slug === slug),
    options: categories.map((c) => ({ value: c.id, label: c.name })),
  };
}
