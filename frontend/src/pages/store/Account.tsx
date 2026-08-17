import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Package, Heart, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export function Account() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    showToast("Profile updated");
  };

  return (
    <div className="container py-8 sm:py-12">
      <h1 className="font-display text-h1 font-semibold text-foreground">My Account</h1>
      <p className="mt-1 text-small text-muted-foreground">Welcome back, {user?.name}.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Link to="/account/orders">
          <Card className="flex items-center gap-4 p-5 transition-colors hover:border-primary">
            <Package className="h-8 w-8 text-primary" aria-hidden="true" />
            <div>
              <p className="text-body font-medium text-foreground">Order History</p>
              <p className="text-small text-muted-foreground">Track and review past orders</p>
            </div>
          </Card>
        </Link>
        <Link to="/wishlist">
          <Card className="flex items-center gap-4 p-5 transition-colors hover:border-primary">
            <Heart className="h-8 w-8 text-primary" aria-hidden="true" />
            <div>
              <p className="text-body font-medium text-foreground">Wishlist</p>
              <p className="text-small text-muted-foreground">Pieces you've saved for later</p>
            </div>
          </Card>
        </Link>
      </div>

      <div className="mt-10 max-w-md">
        <h2 className="text-h3 font-display font-semibold text-foreground">Profile Details</h2>
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" value={user?.email ?? ""} disabled hint="Contact support to change your email." />
          <Button type="submit" loading={saving}>
            Save Changes
          </Button>
        </form>
      </div>

      <Button variant="outline" className="mt-10" onClick={logout}>
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Sign Out
      </Button>
    </div>
  );
}
