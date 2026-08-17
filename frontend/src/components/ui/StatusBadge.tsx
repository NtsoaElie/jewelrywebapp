import { CheckCircle2, AlertTriangle, XCircle, Clock, Truck, PackageCheck, FileEdit, Archive, Ban } from "lucide-react";
import { Badge, type BadgeVariant } from "./Badge";
import type { OrderStatus, PaymentStatus, ProductStatus, CustomerStatus } from "../../api/types";

function StatusBadgeBase({ icon: Icon, label, variant }: { icon: typeof CheckCircle2; label: string; variant: BadgeVariant }) {
  return (
    <Badge variant={variant}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label}
    </Badge>
  );
}

export function StockStatusBadge({ stock, lowStockThreshold }: { stock: number; lowStockThreshold: number }) {
  if (stock <= 0) return <StatusBadgeBase icon={XCircle} label="Out of Stock" variant="error" />;
  if (stock <= lowStockThreshold) return <StatusBadgeBase icon={AlertTriangle} label="Low Stock" variant="warning" />;
  return <StatusBadgeBase icon={CheckCircle2} label="In Stock" variant="success" />;
}

const ORDER_STATUS_MAP: Record<OrderStatus, { icon: typeof CheckCircle2; label: string; variant: BadgeVariant }> = {
  pending: { icon: Clock, label: "Pending", variant: "neutral" },
  processing: { icon: PackageCheck, label: "Processing", variant: "primary" },
  shipped: { icon: Truck, label: "Shipped", variant: "accent" },
  delivered: { icon: CheckCircle2, label: "Delivered", variant: "success" },
  cancelled: { icon: Ban, label: "Cancelled", variant: "error" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = ORDER_STATUS_MAP[status];
  return <StatusBadgeBase icon={config.icon} label={config.label} variant={config.variant} />;
}

const PAYMENT_STATUS_MAP: Record<PaymentStatus, { icon: typeof CheckCircle2; label: string; variant: BadgeVariant }> = {
  paid: { icon: CheckCircle2, label: "Paid", variant: "success" },
  pending: { icon: Clock, label: "Pending", variant: "neutral" },
  refunded: { icon: Archive, label: "Refunded", variant: "warning" },
  failed: { icon: XCircle, label: "Failed", variant: "error" },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = PAYMENT_STATUS_MAP[status];
  return <StatusBadgeBase icon={config.icon} label={config.label} variant={config.variant} />;
}

const PRODUCT_STATUS_MAP: Record<ProductStatus, { icon: typeof CheckCircle2; label: string; variant: BadgeVariant }> = {
  active: { icon: CheckCircle2, label: "Active", variant: "success" },
  draft: { icon: FileEdit, label: "Draft", variant: "neutral" },
  archived: { icon: Archive, label: "Archived", variant: "warning" },
};

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const config = PRODUCT_STATUS_MAP[status];
  return <StatusBadgeBase icon={config.icon} label={config.label} variant={config.variant} />;
}

const CUSTOMER_STATUS_MAP: Record<CustomerStatus, { icon: typeof CheckCircle2; label: string; variant: BadgeVariant }> = {
  active: { icon: CheckCircle2, label: "Active", variant: "success" },
  inactive: { icon: Clock, label: "Inactive", variant: "neutral" },
};

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const config = CUSTOMER_STATUS_MAP[status];
  return <StatusBadgeBase icon={config.icon} label={config.label} variant={config.variant} />;
}
