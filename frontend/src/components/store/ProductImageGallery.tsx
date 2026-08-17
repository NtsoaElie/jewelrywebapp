import { useState } from "react";
import { cn } from "../../utils/cn";

export function ProductImageGallery({ images, productName }: { images: string[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-md bg-muted">
        <img src={images[activeIndex]} alt={productName} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div role="tablist" aria-label="Product images" className="flex gap-2">
          {images.map((image, i) => (
            <button
              key={image + i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`View image ${i + 1} of ${images.length}`}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "h-16 w-16 shrink-0 overflow-hidden rounded border-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                i === activeIndex ? "border-primary" : "border-transparent",
              )}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
