import type { Customer } from "../types";
import { customers as seedCustomers } from "../../data/customers";
import { simulate } from "./delay";

const customers: Customer[] = seedCustomers;

export async function getCustomers(query?: string): Promise<Customer[]> {
  return simulate(() => {
    let result = [...customers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (query) {
      const q = query.trim().toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }
    return result;
  });
}

export async function getCustomer(id: string): Promise<Customer | null> {
  return simulate(() => customers.find((c) => c.id === id) ?? null);
}
