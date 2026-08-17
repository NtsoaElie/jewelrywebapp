import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      showToast("Welcome back", { description: "You're signed in." });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-h1 font-semibold text-foreground">Sign In</h1>
        <p className="mt-2 text-center text-small text-muted-foreground">
          Sign in to view your orders, wishlist, and account details.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
          <Input
            label="Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            hint="Any password of 6+ characters works in this demo."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p role="alert" className="text-small text-error">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" className="w-full" loading={submitting}>
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-small text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
