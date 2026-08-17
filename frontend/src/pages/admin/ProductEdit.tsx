import { useParams, useNavigate, Link } from "react-router-dom";
import { getProduct, updateProduct, type ProductInput } from "../../api/mock/products";
import { useAsync } from "../../hooks/useAsync";
import { useToast } from "../../context/ToastContext";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { ProductForm } from "../../components/admin/ProductForm";
import { PageSpinner } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { buttonClasses } from "../../components/ui/Button";

export function ProductEdit() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: product, loading, error, refetch } = useAsync(() => getProduct(productId!), [productId]);

  const handleSubmit = async (data: ProductInput) => {
    const updated = await updateProduct(productId!, data);
    showToast("Product updated", { description: updated.name, variant: "success" });
    navigate("/admin/products");
  };

  if (loading) return <PageSpinner label="Loading product" />;
  if (error) return <ErrorState description={error} onRetry={refetch} />;
  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="This product may have been deleted."
        action={<Link to="/admin/products" className={buttonClasses("primary", "md")}>Back to Products</Link>}
      />
    );
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: "Products", href: "/admin/products" }, { label: product.name }]} />
      <h1 className="mt-4 font-display text-h1 font-semibold text-foreground">Edit Product</h1>
      <div className="mt-6 max-w-2xl">
        <ProductForm initialProduct={product} onSubmit={handleSubmit} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
