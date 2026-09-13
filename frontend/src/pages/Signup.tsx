import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export function Signup() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(name, email, password);
      showToast("Account created", { description: `Welcome to KBC Gold Jewel & Accessories, ${name.split(" ")[0]}.` });
      navigate("/account", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-center font-display text-h1 font-semibold text-foreground">Create Account</h1>
        <p className="mt-2 text-center text-small text-muted-foreground">
          Join KBC Gold Jewel & Accessories to track orders, save favorites, and check out faster.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
          <Input label="Full Name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            label="Password"
            type="password"
            required
            autoComplete="new-password"
            hint="At least 6 characters."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p role="alert" className="text-small text-error">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" className="w-full" loading={submitting}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-small text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
