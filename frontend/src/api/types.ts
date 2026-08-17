export type ProductStatus = "active" | "draft" | "archived";

export interface ProductVariant {
  id: string;
  label: string; // e.g. "Size 6", "18k Gold / Small"
  priceDelta?: number; // cents, added to base price
  stock: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number; // cents
  compareAtPrice?: number; // cents
  categoryId: string;
  collection?: string;
  images: string[];
  stock: number;
  lowStockThreshold: number;
  rating: number; // 0-5
  reviewCount: number;
  variants: ProductVariant[];
  material?: string;
  color?: string;
  size?: string;
  weight?: string;
  dimensions?: string;
  featured: boolean;
  status: ProductStatus;
  createdAt: string; // ISO date
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "refunded" | "failed";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  variantLabel?: string;
  quantity: number;
  price: number; // cents, unit price at time of order
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  createdAt: string;
}

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export type CustomerStatus = "active" | "inactive";

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  orderCount: number;
  totalSpent: number; // cents
  status: CustomerStatus;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  minRating?: number;
  collection?: string;
  query?: string;
  status?: ProductStatus;
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "rating" | "name" | "stock";
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
