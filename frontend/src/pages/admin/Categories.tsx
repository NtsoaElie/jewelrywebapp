import { useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, Tags } from "lucide-react";
import type { Category } from "../../api/types";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../api/mock/categories";
import { useAsync } from "../../hooks/useAsync";
import { useToast } from "../../context/ToastContext";
import { products } from "../../data/products";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { Skeleton } from "../../components/ui/Skeleton";

function productCount(categoryId: string) {
  return products.filter((p) => p.categoryId === categoryId).length;
}

export function Categories() {
  const { data: categories, loading, error, refetch } = useAsync(getCategories, []);
  const { showToast } = useToast();

  const [editing, setEditing] = useState<Category | null | "new">(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openNew = () => {
    setName("");
    setDescription("");
    setFormError(null);
    setEditing("new");
  };

  const openEdit = (category: Category) => {
    setName(category.name);
    setDescription(category.description);
    setFormError(null);
    setEditing(category);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Category name is required.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editing === "new") {
        await createCategory({ name: name.trim(), description: description.trim() });
        showToast("Category created", { description: name.trim() });
      } else if (editing) {
        await updateCategory(editing.id, { name: name.trim(), description: description.trim() });
        showToast("Category updated", { description: name.trim() });
      }
      setEditing(null);
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "We couldn't save this category. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await deleteCategory(deletingCategory.id);
      showToast("Category deleted", { description: deletingCategory.name });
      setDeletingCategory(null);
      refetch();
    } catch (err) {
      showToast("Couldn't delete category", { description: err instanceof Error ? err.message : undefined, variant: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-h1 font-semibold text-foreground">Categories</h1>
          <p className="mt-1 text-small text-muted-foreground">Organize your catalog into shoppable collections.</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Category
        </Button>
      </div>

      <div className="mt-6">
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-32 w-full" />)}
          </div>
        )}

        {error && <ErrorState description={error} onRetry={refetch} />}

        {!loading && !error && categories && categories.length === 0 && (
          <EmptyState icon={Tags} title="No categories yet" description="Create your first category to start organizing products." action={<Button onClick={openNew}>Add Category</Button>} />
        )}

        {!loading && !error && categories && categories.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id} className="flex gap-4 p-4">
                <img src={category.image} alt="" className="h-16 w-16 shrink-0 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{category.name}</p>
                  <p className="line-clamp-2 text-caption text-muted-foreground">{category.description}</p>
                  <p className="mt-1 text-caption text-muted-foreground">{productCount(category.id)} products</p>
                  <div className="mt-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(category)}
                      aria-label={`Edit ${category.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingCategory(category)}
                      aria-label={`Delete ${category.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add Category" : editing ? `Edit ${editing.name}` : ""}>
        <form onSubmit={handleSave} className="space-y-4" noValidate>
          <Input label="Name" required value={name} onChange={(e) => setName(e.target.value)} error={formError ?? undefined} />
          <Textarea label="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing === "new" ? "Create Category" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        title="Delete this category?"
        description={deletingCategory ? `"${deletingCategory.name}" will be removed. Products in this category will keep their reference but won't be listed under it.` : undefined}
        confirmLabel="Delete Category"
        loading={isDeleting}
      />
    </div>
  );
}
