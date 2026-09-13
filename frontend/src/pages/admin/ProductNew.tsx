import { useNavigate } from "react-router-dom";
import { createProduct, type ProductInput } from "../../api/products";
import { useToast } from "../../context/ToastContext";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { ProductForm } from "../../components/admin/ProductForm";

export function ProductNew() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (data: ProductInput) => {
    const product = await createProduct(data);
    showToast("Product created", { description: product.name, variant: "success" });
    navigate(`/admin/products/${product.id}/edit`);
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: "Products", href: "/admin/products" }, { label: "New Product" }]} />
      <h1 className="mt-4 font-display text-h1 font-semibold text-foreground">Add Product</h1>
      <div className="mt-6 max-w-2xl">
        <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
      </div>
    </div>
  );
}
