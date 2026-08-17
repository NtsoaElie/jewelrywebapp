import type { Product, ProductStatus } from "../api/types";
import { categories } from "./categories";
import { productPlaceholder, type PlaceholderKind } from "../utils/placeholder";
import { slugify } from "../utils/format";

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

function categoryId(slug: string): string {
  return categories.find((c) => c.slug === slug)!.id;
}

interface ProductSeed {
  name: string;
  categorySlug: string;
  kind: PlaceholderKind;
  price: number;
  compareAtPrice?: number;
  description: string;
  material: string;
  color?: string;
  weight?: string;
  dimensions?: string;
  sizes?: string[];
  collection: string;
  stock: number;
  lowStockThreshold?: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  daysAgo: number;
  status?: ProductStatus;
}

function build(seed: ProductSeed, index: number): Product {
  const slug = slugify(seed.name);
  const lowStockThreshold = seed.lowStockThreshold ?? 5;
  return {
    id: `prod-${slug}`,
    sku: `AUR-${slug.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
    name: seed.name,
    slug,
    description: seed.description,
    price: seed.price,
    compareAtPrice: seed.compareAtPrice,
    categoryId: categoryId(seed.categorySlug),
    collection: seed.collection,
    images: [
      productPlaceholder(seed.kind, index),
      productPlaceholder(seed.kind, index + 7),
      productPlaceholder(seed.kind, index + 13),
    ],
    stock: seed.stock,
    lowStockThreshold,
    rating: seed.rating,
    reviewCount: seed.reviewCount,
    variants: (seed.sizes ?? []).map((label, i) => ({
      id: `${slug}-var-${i}`,
      label,
      stock: Math.max(0, Math.round(seed.stock / (seed.sizes?.length ?? 1))),
    })),
    material: seed.material,
    color: seed.color,
    weight: seed.weight,
    dimensions: seed.dimensions,
    featured: seed.featured ?? false,
    status: seed.status ?? "active",
    createdAt: isoDaysAgo(seed.daysAgo),
  };
}

const seeds: ProductSeed[] = [
  // Rings
  {
    name: "Aurora Solitaire Ring",
    categorySlug: "rings",
    kind: "ring",
    price: 185000,
    compareAtPrice: 219000,
    description:
      "A timeless solitaire featuring a brilliant-cut diamond set in a delicate 18k gold band. Designed to catch the light from every angle, it's the quiet centerpiece of any collection.",
    material: "18k Yellow Gold",
    color: "Gold",
    weight: "3.2g",
    sizes: ["5", "6", "7", "8", "9"],
    collection: "Bridal Edit",
    stock: 14,
    rating: 4.8,
    reviewCount: 132,
    featured: true,
    daysAgo: 40,
  },
  {
    name: "Vesper Halo Ring",
    categorySlug: "rings",
    kind: "ring",
    price: 224000,
    description:
      "A cluster of pavé diamonds encircles a central stone for maximum sparkle, set in cool white gold for a modern bridal look.",
    material: "18k White Gold",
    color: "White Gold",
    weight: "3.8g",
    sizes: ["5", "6", "7", "8"],
    collection: "Bridal Edit",
    stock: 9,
    rating: 4.9,
    reviewCount: 87,
    featured: true,
    daysAgo: 22,
  },
  {
    name: "Luna Twist Band",
    categorySlug: "rings",
    kind: "ring",
    price: 68000,
    description:
      "Two ribbons of rose gold intertwine in this sculptural everyday band — effortless to stack or wear alone.",
    material: "14k Rose Gold",
    color: "Rose Gold",
    weight: "2.6g",
    sizes: ["5", "6", "7", "8", "9"],
    collection: "Everyday Luxe",
    stock: 26,
    rating: 4.6,
    reviewCount: 54,
    daysAgo: 65,
  },
  {
    name: "Celeste Pavé Eternity Ring",
    categorySlug: "rings",
    kind: "ring",
    price: 156000,
    compareAtPrice: 175000,
    description:
      "A full circle of pavé-set diamonds for a band that sparkles uninterrupted from every side — a modern take on the eternity ring.",
    material: "18k White Gold",
    color: "White Gold",
    weight: "3.0g",
    sizes: ["5", "6", "7", "8", "9"],
    collection: "Heirloom Classics",
    stock: 4,
    lowStockThreshold: 5,
    rating: 4.7,
    reviewCount: 61,
    daysAgo: 88,
  },
  {
    name: "Nova Signet Ring",
    categorySlug: "rings",
    kind: "ring",
    price: 92000,
    description:
      "A bold, polished signet in solid gold with a clean engravable face — a modern heirloom in the making.",
    material: "18k Yellow Gold",
    color: "Gold",
    weight: "6.1g",
    sizes: ["7", "8", "9", "10", "11"],
    collection: "Modern Minimal",
    stock: 0,
    rating: 4.5,
    reviewCount: 29,
    daysAgo: 12,
  },
  {
    name: "Orion Sapphire Ring",
    categorySlug: "rings",
    kind: "ring",
    price: 268000,
    description:
      "A deep blue sapphire flanked by two brilliant diamonds, set in platinum for a striking, colour-forward statement piece.",
    material: "Platinum",
    color: "Platinum",
    weight: "4.4g",
    sizes: ["5", "6", "7", "8"],
    collection: "Heirloom Classics",
    stock: 7,
    rating: 4.9,
    reviewCount: 41,
    featured: true,
    daysAgo: 5,
  },

  // Necklaces
  {
    name: "Meridian Bar Pendant",
    categorySlug: "necklaces",
    kind: "necklace",
    price: 78000,
    description:
      "A slender polished gold bar suspended from a fine chain — refined minimalism for daily wear.",
    material: "14k Yellow Gold",
    color: "Gold",
    dimensions: "16-18in adjustable",
    sizes: ["16in", "18in"],
    collection: "Modern Minimal",
    stock: 31,
    rating: 4.6,
    reviewCount: 98,
    featured: true,
    daysAgo: 50,
  },
  {
    name: "Seraphine Diamond Pendant",
    categorySlug: "necklaces",
    kind: "necklace",
    price: 198000,
    compareAtPrice: 225000,
    description:
      "A single brilliant-cut diamond floats on an almost-invisible chain, designed to sit perfectly at the collarbone.",
    material: "18k White Gold",
    color: "White Gold",
    dimensions: "18in",
    collection: "Bridal Edit",
    stock: 11,
    rating: 4.9,
    reviewCount: 76,
    featured: true,
    daysAgo: 18,
  },
  {
    name: "Cascade Layered Necklace",
    categorySlug: "necklaces",
    kind: "necklace",
    price: 112000,
    description:
      "Three delicate chains of graduating length, pre-layered so you never have to untangle a thing.",
    material: "14k Gold Vermeil",
    color: "Gold",
    dimensions: "14-18in",
    collection: "Everyday Luxe",
    stock: 19,
    rating: 4.5,
    reviewCount: 63,
    daysAgo: 33,
  },
  {
    name: "Aria Pearl Strand Necklace",
    categorySlug: "necklaces",
    kind: "necklace",
    price: 145000,
    description:
      "Hand-knotted freshwater pearls in a classic strand with a gold clasp — timeless and endlessly versatile.",
    material: "Freshwater Pearl / 14k Gold",
    color: "White",
    dimensions: "18in",
    collection: "Heirloom Classics",
    stock: 3,
    lowStockThreshold: 5,
    rating: 4.7,
    reviewCount: 45,
    daysAgo: 71,
  },
  {
    name: "Solstice Chain Necklace",
    categorySlug: "necklaces",
    kind: "necklace",
    price: 54000,
    description:
      "A substantial curb chain in warm gold, worn solo or layered as the foundation of a stack.",
    material: "18k Gold Vermeil",
    color: "Gold",
    dimensions: "20in",
    collection: "Modern Minimal",
    stock: 42,
    rating: 4.4,
    reviewCount: 37,
    daysAgo: 9,
  },
  {
    name: "Belle Choker Necklace",
    categorySlug: "necklaces",
    kind: "necklace",
    price: 89000,
    description:
      "A fine cable chain choker with a single pavé accent — sits close to the neck for a modern, sculptural line.",
    material: "18k White Gold",
    color: "White Gold",
    dimensions: "14in",
    collection: "Everyday Luxe",
    stock: 0,
    rating: 4.3,
    reviewCount: 22,
    daysAgo: 3,
    status: "active",
  },

  // Earrings
  {
    name: "Whisper Diamond Studs",
    categorySlug: "earrings",
    kind: "earring",
    price: 96000,
    description:
      "Classic four-prong diamond studs in white gold — the earring you reach for every single day.",
    material: "18k White Gold",
    color: "White Gold",
    collection: "Everyday Luxe",
    stock: 24,
    rating: 4.8,
    reviewCount: 154,
    featured: true,
    daysAgo: 60,
  },
  {
    name: "Drape Drop Earrings",
    categorySlug: "earrings",
    kind: "earring",
    price: 124000,
    description:
      "An articulated gold chain drapes below a pavé stud for movement that catches the light with every turn.",
    material: "18k Yellow Gold",
    color: "Gold",
    collection: "Modern Minimal",
    stock: 16,
    rating: 4.6,
    reviewCount: 48,
    daysAgo: 27,
  },
  {
    name: "Halo Cluster Earrings",
    categorySlug: "earrings",
    kind: "earring",
    price: 168000,
    compareAtPrice: 189000,
    description:
      "A cluster of diamonds forms a soft halo silhouette, set in white gold for a formal-occasion favourite.",
    material: "18k White Gold",
    color: "White Gold",
    collection: "Bridal Edit",
    stock: 6,
    rating: 4.9,
    reviewCount: 39,
    daysAgo: 15,
  },
  {
    name: "Gold Huggie Hoops",
    categorySlug: "earrings",
    kind: "earring",
    price: 48000,
    description:
      "Snug, close-fitting hoops in polished gold — small enough for everyday, substantial enough to stand alone.",
    material: "14k Yellow Gold",
    color: "Gold",
    collection: "Everyday Luxe",
    stock: 55,
    rating: 4.7,
    reviewCount: 211,
    featured: true,
    daysAgo: 80,
  },
  {
    name: "Ember Chandelier Earrings",
    categorySlug: "earrings",
    kind: "earring",
    price: 214000,
    description:
      "A cascading arrangement of gold and gemstone tiers for a dramatic, occasion-ready silhouette.",
    material: "18k Yellow Gold",
    color: "Gold",
    collection: "Heirloom Classics",
    stock: 4,
    lowStockThreshold: 5,
    rating: 4.8,
    reviewCount: 17,
    daysAgo: 2,
  },

  // Bracelets
  {
    name: "Linked Tennis Bracelet",
    categorySlug: "bracelets",
    kind: "bracelet",
    price: 236000,
    description:
      "A continuous line of brilliant-cut diamonds in a secure link setting — a modern classic worn alone or stacked.",
    material: "18k White Gold",
    color: "White Gold",
    sizes: ["S", "M", "L"],
    collection: "Heirloom Classics",
    stock: 8,
    rating: 4.9,
    reviewCount: 58,
    featured: true,
    daysAgo: 44,
  },
  {
    name: "Cuff Bangle",
    categorySlug: "bracelets",
    kind: "bracelet",
    price: 88000,
    description:
      "A sculptural open cuff in brushed gold, designed to sit confidently on its own.",
    material: "14k Yellow Gold",
    color: "Gold",
    sizes: ["S/M", "M/L"],
    collection: "Modern Minimal",
    stock: 21,
    rating: 4.5,
    reviewCount: 33,
    daysAgo: 58,
  },
  {
    name: "Charm Link Bracelet",
    categorySlug: "bracelets",
    kind: "bracelet",
    price: 71000,
    description:
      "A classic paperclip-link chain ready for the charms you'll collect for years to come.",
    material: "14k Gold Vermeil",
    color: "Gold",
    sizes: ["6.5in", "7in", "7.5in"],
    collection: "Everyday Luxe",
    stock: 0,
    rating: 4.4,
    reviewCount: 26,
    daysAgo: 7,
  },
  {
    name: "Pearl Wrap Bracelet",
    categorySlug: "bracelets",
    kind: "bracelet",
    price: 62000,
    description:
      "Freshwater pearls on a double-wrap silk cord with a gold toggle clasp — soft, tactile, and easy to layer.",
    material: "Freshwater Pearl / 14k Gold",
    color: "White",
    sizes: ["One Size"],
    collection: "Heirloom Classics",
    stock: 18,
    rating: 4.6,
    reviewCount: 21,
    daysAgo: 36,
  },
  {
    name: "Infinity Bangle",
    categorySlug: "bracelets",
    kind: "bracelet",
    price: 99000,
    description:
      "A single seamless band with a subtle infinity motif — polished to a mirror finish.",
    material: "18k White Gold",
    color: "White Gold",
    sizes: ["S", "M", "L"],
    collection: "Modern Minimal",
    stock: 13,
    rating: 4.5,
    reviewCount: 19,
    daysAgo: 20,
  },

  // Watches
  {
    name: "Heritage Automatic Watch",
    categorySlug: "watches",
    kind: "watch",
    price: 385000,
    description:
      "A self-winding automatic movement housed in a brushed gold case with a hand-stitched leather strap.",
    material: "18k Gold-Plated Steel",
    color: "Gold",
    sizes: ["38mm", "42mm"],
    collection: "Heirloom Classics",
    stock: 5,
    lowStockThreshold: 5,
    rating: 4.8,
    reviewCount: 24,
    featured: true,
    daysAgo: 48,
  },
  {
    name: "Minimalist Gold Watch",
    categorySlug: "watches",
    kind: "watch",
    price: 148000,
    description:
      "A clean, uncluttered dial and slim gold case for a watch that goes with everything.",
    material: "Gold-Plated Steel",
    color: "Gold",
    sizes: ["34mm", "38mm"],
    collection: "Modern Minimal",
    stock: 17,
    rating: 4.6,
    reviewCount: 41,
    daysAgo: 30,
  },
  {
    name: "Mother-of-Pearl Dial Watch",
    categorySlug: "watches",
    kind: "watch",
    price: 176000,
    compareAtPrice: 198000,
    description:
      "An iridescent mother-of-pearl dial catches subtle colour shifts in the light, framed in polished white gold tone.",
    material: "White Gold-Plated Steel",
    color: "White Gold",
    sizes: ["34mm"],
    collection: "Everyday Luxe",
    stock: 9,
    rating: 4.7,
    reviewCount: 16,
    daysAgo: 14,
  },
  {
    name: "Classic Two-Tone Watch",
    categorySlug: "watches",
    kind: "watch",
    price: 162000,
    description:
      "Gold and silver-tone links combine on the bracelet band of this versatile everyday timepiece.",
    material: "Two-Tone Steel",
    color: "Two-Tone",
    sizes: ["36mm", "40mm"],
    collection: "Everyday Luxe",
    stock: 0,
    rating: 4.3,
    reviewCount: 12,
    daysAgo: 4,
    status: "draft",
  },
];

export const products: Product[] = seeds.map(build);
