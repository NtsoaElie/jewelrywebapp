import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { cn } from "../../utils/cn";

export function SearchBar({ className, onSubmit }: { className?: string; onSubmit?: () => void }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    navigate(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : "/shop");
    onSubmit?.();
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={cn("relative", className)}>
      <label htmlFor="storefront-search" className="sr-only">
        Search products
      </label>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input
        id="storefront-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search rings, necklaces, earrings…"
        className="h-11 w-full rounded border border-border bg-surface pl-10 pr-4 text-body text-foreground placeholder:text-muted-foreground transition-colors duration-short focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      />
    </form>
  );
}
