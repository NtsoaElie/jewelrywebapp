import type { Category } from "../api/types";
import { productPlaceholder } from "../utils/placeholder";

export const categories: Category[] = [
  {
    id: "cat-rings",
    name: "Rings",
    slug: "rings",
    description: "Solitaires, bands, and statement rings crafted for everyday elegance.",
    image: productPlaceholder("ring", 1),
  },
  {
    id: "cat-necklaces",
    name: "Necklaces",
    slug: "necklaces",
    description: "Pendants, chains, and chokers to layer or wear alone.",
    image: productPlaceholder("necklace", 2),
  },
  {
    id: "cat-earrings",
    name: "Earrings",
    slug: "earrings",
    description: "Studs, hoops, and drops for every occasion.",
    image: productPlaceholder("earring", 3),
  },
  {
    id: "cat-bracelets",
    name: "Bracelets",
    slug: "bracelets",
    description: "Bangles, cuffs, and tennis bracelets with lasting shine.",
    image: productPlaceholder("bracelet", 4),
  },
  {
    id: "cat-watches",
    name: "Watches",
    slug: "watches",
    description: "Timeless timepieces that pair precision with elegance.",
    image: productPlaceholder("watch", 0),
  },
];
