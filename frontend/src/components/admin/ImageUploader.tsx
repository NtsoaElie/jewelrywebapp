import { useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Trash2, Loader2, Plus } from "lucide-react";
import { Badge } from "../ui/Badge";
import { cn } from "../../utils/cn";

interface PendingImage {
  id: string;
  url: string;
  status: "uploading" | "error";
}

export function ImageUploader({ images, onChange }: { images: string[]; onChange: (images: string[]) => void }) {
  const [pending, setPending] = useState<PendingImage[]>([]);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commitUpload = (item: PendingImage) => {
    setTimeout(() => {
      const failed = Math.random() < 0.12;
      if (failed) {
        setPending((p) => p.map((i) => (i.id === item.id ? { ...i, status: "error" } : i)));
      } else {
        setPending((p) => p.filter((i) => i.id !== item.id));
        onChange([...images, item.url]);
      }
    }, 700 + Math.random() * 600);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const item: PendingImage = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, url: URL.createObjectURL(file), status: "uploading" };
      setPending((p) => [...p, item]);
      commitUpload(item);
    });
  };

  const retry = (item: PendingImage) => {
    setPending((p) => p.map((i) => (i.id === item.id ? { ...i, status: "uploading" } : i)));
    commitUpload(item);
  };

  const removeImage = (index: number) => {
    setRemovingIndex(index);
    setTimeout(() => {
      onChange(images.filter((_, i) => i !== index));
      setRemovingIndex(null);
    }, 350);
  };

  const setPrimary = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {images.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className={cn(
              "group relative aspect-square overflow-hidden rounded border border-border bg-muted transition-opacity",
              removingIndex === index && "opacity-40",
            )}
          >
            <img src={url} alt="" className="h-full w-full object-cover" />
            {index === 0 && <Badge variant="primary" className="absolute left-1.5 top-1.5">Primary</Badge>}
            <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 transition-opacity group-hover:bg-primary-dark/50 group-hover:opacity-100 group-focus-within:opacity-100">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => setPrimary(index)}
                  aria-label="Set as primary image"
                  className="rounded bg-surface/90 p-1.5 text-foreground hover:bg-surface"
                >
                  <Star className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  aria-label="Move image earlier"
                  className="rounded bg-surface/90 p-1.5 text-foreground hover:bg-surface"
                >
                  <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
              {index < images.length - 1 && (
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  aria-label="Move image later"
                  className="rounded bg-surface/90 p-1.5 text-foreground hover:bg-surface"
                >
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                disabled={removingIndex === index}
                aria-label="Remove image"
                className="rounded bg-surface/90 p-1.5 text-error hover:bg-surface disabled:opacity-60"
              >
                {removingIndex === index ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        ))}

        {pending.map((item) => (
          <div key={item.id} className="relative aspect-square overflow-hidden rounded border border-border bg-muted">
            <img src={item.url} alt="" className={cn("h-full w-full object-cover", item.status === "uploading" && "opacity-50")} />
            {item.status === "uploading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary-dark/30">
                <Loader2 className="h-5 w-5 animate-spin text-primary-foreground" aria-hidden="true" />
                <span className="sr-only">Uploading</span>
              </div>
            )}
            {item.status === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-error/10 p-1 text-center" role="alert">
                <p className="text-caption text-error">Upload failed</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => retry(item)} className="text-caption font-medium text-primary underline">
                    Retry
                  </button>
                  <button
                    type="button"
                    onClick={() => setPending((p) => p.filter((i) => i.id !== item.id))}
                    className="text-caption font-medium text-muted-foreground underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
          <Plus className="h-5 w-5" aria-hidden="true" />
          <span className="text-caption">Add Image</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {images.length === 0 && pending.length === 0 && (
        <p className="mt-2 text-caption text-muted-foreground">Add at least one image so shoppers can see this product.</p>
      )}
    </div>
  );
}
