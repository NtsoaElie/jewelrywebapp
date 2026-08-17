import type { Customer } from "../api/types";

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

export const customers: Customer[] = [
  { id: "cust-1", name: "Amelia Hart", email: "amelia.hart@example.com", orderCount: 6, totalSpent: 542000, status: "active", createdAt: isoDaysAgo(410) },
  { id: "cust-2", name: "Noah Bennett", email: "noah.bennett@example.com", orderCount: 3, totalSpent: 218000, status: "active", createdAt: isoDaysAgo(320) },
  { id: "cust-3", name: "Sofia Marín", email: "sofia.marin@example.com", orderCount: 9, totalSpent: 987000, status: "active", createdAt: isoDaysAgo(560) },
  { id: "cust-4", name: "Liam Chen", email: "liam.chen@example.com", orderCount: 1, totalSpent: 68000, status: "active", createdAt: isoDaysAgo(40) },
  { id: "cust-5", name: "Isabella Rossi", email: "isabella.rossi@example.com", orderCount: 4, totalSpent: 356000, status: "active", createdAt: isoDaysAgo(210) },
  { id: "cust-6", name: "Ethan Walker", email: "ethan.walker@example.com", orderCount: 2, totalSpent: 124000, status: "inactive", createdAt: isoDaysAgo(680) },
  { id: "cust-7", name: "Mia Thompson", email: "mia.thompson@example.com", orderCount: 7, totalSpent: 612000, status: "active", createdAt: isoDaysAgo(300) },
  { id: "cust-8", name: "Lucas Meyer", email: "lucas.meyer@example.com", orderCount: 1, totalSpent: 92000, status: "active", createdAt: isoDaysAgo(18) },
  { id: "cust-9", name: "Chloe Dubois", email: "chloe.dubois@example.com", orderCount: 5, totalSpent: 445000, status: "active", createdAt: isoDaysAgo(250) },
  { id: "cust-10", name: "Oliver Nguyen", email: "oliver.nguyen@example.com", orderCount: 0, totalSpent: 0, status: "inactive", createdAt: isoDaysAgo(5) },
];
