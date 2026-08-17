import { Link } from "react-router-dom";
import type { Category } from "../../api/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-md bg-muted"
    >
      <img
        src={category.image}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-base group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-primary-dark/10 to-transparent" aria-hidden="true" />
      <span className="relative p-5 font-display text-h3 font-semibold text-primary-foreground">{category.name}</span>
    </Link>
  );
}
