import { useRef, type KeyboardEvent } from "react";
import { cn } from "../../utils/cn";

export interface TabItem {
  value: string;
  label: string;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ items, value, onChange, className }: TabsProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const index = items.findIndex((i) => i.value === value);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const nextIndex = e.key === "ArrowRight" ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
      const next = items[nextIndex];
      onChange(next.value);
      refs.current[next.value]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={cn("flex gap-1 overflow-x-auto border-b border-border scrollbar-none", className)}
    >
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            ref={(el) => { refs.current[item.value] = el; }}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.value)}
            className={cn(
              "relative shrink-0 px-4 py-3 text-small font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              selected ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
            {selected && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
