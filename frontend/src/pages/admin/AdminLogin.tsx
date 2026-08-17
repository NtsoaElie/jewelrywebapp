import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Gem } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

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
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-dark px-4">
      <div className="w-full max-w-sm rounded-lg bg-surface p-8 shadow-overlay">
        <div className="flex flex-col items-center text-center">
          <Gem className="h-8 w-8 text-primary" aria-hidden="true" />
          <h1 className="mt-3 font-display text-h2 font-semibold text-foreground">Aurelle Admin</h1>
          <p className="mt-1 text-small text-muted-foreground">Sign in to manage your store.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
          <Input label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
      </div>
    </div>
  );
}
