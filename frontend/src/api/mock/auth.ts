import type { AuthUser } from "../types";
import { simulate } from "./delay";

// Fully mocked — no real network call, no real credential storage. The user will
// wire this module up to their real backend/auth provider later.

export async function mockLogin(email: string, password: string): Promise<AuthUser> {
  return simulate(
    () => {
      if (!email.includes("@")) throw new Error("Enter a valid email address.");
      if (password.length < 6) throw new Error("Incorrect email or password. Please try again.");
      return { id: `user-${email}`, name: email.split("@")[0], email };
    },
    { ms: 550 },
  );
}

export async function mockRegister(name: string, email: string, password: string): Promise<AuthUser> {
  return simulate(
    () => {
      if (!email.includes("@")) throw new Error("Enter a valid email address.");
      if (password.length < 6) throw new Error("Password must be at least 6 characters.");
      return { id: `user-${email}`, name, email };
    },
    { ms: 600 },
  );
}

export async function mockAdminLogin(email: string, password: string): Promise<AuthUser> {
  return simulate(
    () => {
      if (!email.includes("@")) throw new Error("Enter a valid email address.");
      if (password.length < 6) throw new Error("Incorrect email or password. Please try again.");
      return { id: `admin-${email}`, name: "Admin", email };
    },
    { ms: 550 },
  );
}
