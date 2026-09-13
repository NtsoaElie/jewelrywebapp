import { Link } from "react-router-dom";
import { categories } from "../../data/categories";

const FOOTER_COLUMNS = [
  {
    heading: "Shop",
    links: categories.map((c) => ({ label: c.name, to: `/shop?category=${c.slug}` })),
  },
  {
    heading: "Support",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "Shipping & Returns", to: "/contact" },
      { label: "Track an Order", to: "/account/orders" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Account", to: "/account" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container grid grid-cols-2 gap-8 py-12 sm:grid-cols-4 sm:py-16">
        <div className="col-span-2 sm:col-span-1">
          <Link to="/" className="font-display text-h3 font-semibold text-primary">
            KBC Gold Jewel & Accessories
          </Link>
          <p className="mt-3 max-w-xs text-small text-muted-foreground">
            Fine jewelry crafted with timeless elegance, made to be worn and loved for a lifetime.
          </p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <h3 className="text-label font-semibold uppercase tracking-wide text-foreground">{col.heading}</h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-small text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border py-5">
        <p className="container text-center text-caption text-muted-foreground">
          © {new Date().getFullYear()} KBC Gold Jewel & Accessories. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
