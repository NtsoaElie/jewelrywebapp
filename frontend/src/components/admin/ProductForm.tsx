import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Product, ProductVariant } from "../../api/types";
import type { ProductInput } from "../../api/mock/products";
import { categories } from "../../data/categories";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { ImageUploader } from "./ImageUploader";

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (data: ProductInput) => Promise<void>;
  submitLabel: string;
}

interface FormState {
  name: string;
  description: string;
  categoryId: string;
  price: string;
  compareAtPrice: string;
  status: Product["status"];
  stock: string;
  lowStockThreshold: string;
  material: string;
  color: string;
  size: string;
  weight: string;
  dimensions: string;
  collection: string;
  featured: boolean;
  images: string[];
  variants: ProductVariant[];
}

function toFormState(product?: Product): FormState {
  return {
    name: product?.name ?? "",
    description: product?.description ?? "",
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    price: product ? (product.price / 100).toFixed(2) : "",
    compareAtPrice: product?.compareAtPrice ? (product.compareAtPrice / 100).toFixed(2) : "",
    status: product?.status ?? "draft",
    stock: product ? String(product.stock) : "0",
    lowStockThreshold: product ? String(product.lowStockThreshold) : "5",
    material: product?.material ?? "",
    color: product?.color ?? "",
    size: product?.size ?? "",
    weight: product?.weight ?? "",
    dimensions: product?.dimensions ?? "",
    collection: product?.collection ?? "",
    featured: product?.featured ?? false,
    images: product?.images ?? [],
    variants: product?.variants ?? [],
  };
}

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

export function ProductForm({ initialProduct, onSubmit, submitLabel }: ProductFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(initialProduct));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Product name is required.";
    if (!form.categoryId) next.categoryId = "Select a category.";
    const priceValue = parseFloat(form.price);
    if (!form.price || Number.isNaN(priceValue) || priceValue <= 0) next.price = "Enter a price greater than $0.";
    const stockValue = parseInt(form.stock, 10);
    if (form.stock === "" || Number.isNaN(stockValue) || stockValue < 0) next.stock = "Enter a valid stock quantity.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data: ProductInput = {
        name: form.name.trim(),
        description: form.description.trim(),
        categoryId: form.categoryId,
        price: Math.round(parseFloat(form.price) * 100),
        compareAtPrice: form.compareAtPrice ? Math.round(parseFloat(form.compareAtPrice) * 100) : undefined,
        status: form.status,
        stock: parseInt(form.stock, 10),
        lowStockThreshold: parseInt(form.lowStockThreshold, 10) || 5,
        material: form.material.trim() || undefined,
        color: form.color.trim() || undefined,
        size: form.size.trim() || undefined,
        weight: form.weight.trim() || undefined,
        dimensions: form.dimensions.trim() || undefined,
        collection: form.collection.trim() || undefined,
        featured: form.featured,
        images: form.images,
        variants: form.variants,
      };
      await onSubmit(data);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "We couldn't save this product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const addVariant = () => set("variants", [...form.variants, { id: `v-${Date.now()}`, label: "", stock: 0 }]);
  const updateVariant = (index: number, patch: Partial<ProductVariant>) =>
    set("variants", form.variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  const removeVariant = (index: number) => set("variants", form.variants.filter((_, i) => i !== index));

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">
      <fieldset className="space-y-4">
        <legend className="text-h3 font-display font-semibold text-foreground">Basic Information</legend>
        <Input label="Product Name" required value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
        <Textarea label="Description" rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Category"
            required
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            error={errors.categoryId}
          />
          <Select label="Status" value={form.status} onChange={(e) => set("status", e.target.value as Product["status"])} options={STATUS_OPTIONS} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Price"
            required
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            error={errors.price}
            hint="USD, e.g. 185.00"
          />
          <Input
            label="Compare-at Price"
            type="number"
            step="0.01"
            min="0"
            value={form.compareAtPrice}
            onChange={(e) => set("compareAtPrice", e.target.value)}
            hint="Optional — shown as a strikethrough price"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-h3 font-display font-semibold text-foreground">Inventory</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Stock Quantity" required type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} error={errors.stock} />
          <Input
            label="Low Stock Threshold"
            type="number"
            min="0"
            value={form.lowStockThreshold}
            onChange={(e) => set("lowStockThreshold", e.target.value)}
            hint="Flag as 'Low Stock' at or below this quantity"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-h3 font-display font-semibold text-foreground">Product Details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Material" value={form.material} onChange={(e) => set("material", e.target.value)} placeholder="18k Yellow Gold" />
          <Input label="Color" value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="Gold" />
          <Input label="Weight" value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="3.2g" />
          <Input label="Dimensions" value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} placeholder="18in" />
          <Input label="Collection" value={form.collection} onChange={(e) => set("collection", e.target.value)} placeholder="Everyday Luxe" />
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <div className="flex items-center justify-between">
          <legend className="text-h3 font-display font-semibold text-foreground">Variants</legend>
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Variant
          </Button>
        </div>
        {form.variants.length === 0 ? (
          <p className="text-small text-muted-foreground">No variants — this product will sell as a single option.</p>
        ) : (
          <div className="space-y-3">
            {form.variants.map((variant, index) => (
              <div key={variant.id} className="flex items-end gap-3">
                <Input
                  label={index === 0 ? "Label" : undefined}
                  aria-label={index === 0 ? undefined : "Variant label"}
                  value={variant.label}
                  onChange={(e) => updateVariant(index, { label: e.target.value })}
                  placeholder="Size 7"
                  className="flex-1"
                />
                <Input
                  label={index === 0 ? "Stock" : undefined}
                  aria-label={index === 0 ? undefined : "Variant stock"}
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) => updateVariant(index, { stock: parseInt(e.target.value, 10) || 0 })}
                  className="w-28"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  aria-label="Remove variant"
                  className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-error"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-h3 font-display font-semibold text-foreground">Images</legend>
        <ImageUploader images={form.images} onChange={(images) => set("images", images)} />
      </fieldset>

      {submitError && (
        <p role="alert" className="text-small text-error">
          {submitError}
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <Button type="submit" size="lg" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
