import type { Order, OrderItem, OrderStatus, PaymentStatus } from "../api/types";
import { products } from "./products";
import { customers } from "./customers";

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

function findProduct(slug: string) {
  const product = products.find((p) => p.slug === slug);
  if (!product) throw new Error(`Unknown product slug in order seed: ${slug}`);
  return product;
}

function lineItem(slug: string, quantity: number, variantLabel?: string): OrderItem {
  const product = findProduct(slug);
  return {
    productId: product.id,
    name: product.name,
    image: product.images[0],
    variantLabel,
    quantity,
    price: product.price,
  };
}

const SHIPPING_FLAT = 1500;
const TAX_RATE = 0.0825;

interface OrderSeed {
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  daysAgo: number;
}

function build(seed: OrderSeed, index: number): Order {
  const customer = customers.find((c) => c.id === seed.customerId)!;
  const subtotal = seed.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = SHIPPING_FLAT;
  const tax = Math.round(subtotal * TAX_RATE);
  return {
    id: `order-${index + 1}`,
    orderNumber: `AUR-${String(10042 + index)}`,
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    items: seed.items,
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax,
    status: seed.status,
    paymentStatus: seed.paymentStatus,
    shippingAddress: {
      fullName: customer.name,
      line1: "128 Maple Avenue",
      city: "Portland",
      state: "OR",
      postalCode: "97201",
      country: "United States",
    },
    createdAt: isoDaysAgo(seed.daysAgo),
  };
}

const seeds: OrderSeed[] = [
  { customerId: "cust-1", items: [lineItem("aurora-solitaire-ring", 1, "Size 6")], status: "delivered", paymentStatus: "paid", daysAgo: 120 },
  { customerId: "cust-1", items: [lineItem("gold-huggie-hoops", 2), lineItem("solstice-chain-necklace", 1)], status: "delivered", paymentStatus: "paid", daysAgo: 60 },
  { customerId: "cust-3", items: [lineItem("linked-tennis-bracelet", 1, "M"), lineItem("whisper-diamond-studs", 1)], status: "shipped", paymentStatus: "paid", daysAgo: 6 },
  { customerId: "cust-3", items: [lineItem("seraphine-diamond-pendant", 1)], status: "delivered", paymentStatus: "paid", daysAgo: 200 },
  { customerId: "cust-5", items: [lineItem("meridian-bar-pendant", 1), lineItem("cuff-bangle", 1, "M/L")], status: "processing", paymentStatus: "paid", daysAgo: 2 },
  { customerId: "cust-7", items: [lineItem("heritage-automatic-watch", 1, "42mm")], status: "pending", paymentStatus: "pending", daysAgo: 1 },
  { customerId: "cust-9", items: [lineItem("halo-cluster-earrings", 1), lineItem("infinity-bangle", 1, "S")], status: "delivered", paymentStatus: "paid", daysAgo: 95 },
  { customerId: "cust-2", items: [lineItem("luna-twist-band", 1, "7")], status: "cancelled", paymentStatus: "refunded", daysAgo: 30 },
  { customerId: "cust-4", items: [lineItem("gold-huggie-hoops", 1)], status: "delivered", paymentStatus: "paid", daysAgo: 38 },
  { customerId: "cust-8", items: [lineItem("minimalist-gold-watch", 1, "38mm")], status: "processing", paymentStatus: "paid", daysAgo: 3 },
  { customerId: "cust-6", items: [lineItem("cascade-layered-necklace", 1)], status: "delivered", paymentStatus: "paid", daysAgo: 260 },
  { customerId: "cust-7", items: [lineItem("aria-pearl-strand-necklace", 1), lineItem("pearl-wrap-bracelet", 1)], status: "shipped", paymentStatus: "paid", daysAgo: 9 },
  { customerId: "cust-9", items: [lineItem("orion-sapphire-ring", 1, "6")], status: "pending", paymentStatus: "pending", daysAgo: 0 },
  { customerId: "cust-5", items: [lineItem("drape-drop-earrings", 1)], status: "delivered", paymentStatus: "failed", daysAgo: 14 },
  { customerId: "cust-3", items: [lineItem("mother-of-pearl-dial-watch", 1, "34mm"), lineItem("charm-link-bracelet", 1, "7in")], status: "delivered", paymentStatus: "paid", daysAgo: 150 },
];

export const orders: Order[] = seeds.map(build);
