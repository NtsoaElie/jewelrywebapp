import type { Order, OrderStatus } from "../types";
import { orders as seedOrders } from "../../data/orders";
import { simulate } from "./delay";
import { loadStore, saveStore } from "./store";

const STORE_KEY = "aurelle:orders";

let orders: Order[] = loadStore(STORE_KEY, seedOrders);

function persist() {
  saveStore(STORE_KEY, orders);
}

export interface OrderFilters {
  status?: OrderStatus;
  query?: string;
}

export async function getOrders(filters: OrderFilters = {}): Promise<Order[]> {
  return simulate(() => {
    let result = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (filters.status) {
      result = result.filter((o) => o.status === filters.status);
    }
    if (filters.query) {
      const q = filters.query.trim().toLowerCase();
      result = result.filter(
        (o) => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q),
      );
    }
    return result;
  });
}

export async function getOrder(id: string): Promise<Order | null> {
  return simulate(() => orders.find((o) => o.id === id || o.orderNumber === id) ?? null);
}

export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
  return simulate(() =>
    orders
      .filter((o) => o.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  );
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  return simulate(() => {
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("This order no longer exists.");
    const updated = { ...orders[index], status };
    orders = [...orders.slice(0, index), updated, ...orders.slice(index + 1)];
    persist();
    return updated;
  }, { ms: 500 });
}
