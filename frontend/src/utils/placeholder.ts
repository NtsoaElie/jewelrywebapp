// Generates elegant, on-brand SVG placeholder "product photos" as data URIs.
// Swapping to real product photography later is a one-line change per product
// in src/data/products.ts — this function is only ever called from there.

export type PlaceholderKind = "ring" | "necklace" | "earring" | "bracelet" | "watch" | "gem";

const PALETTES: Array<{ from: string; to: string; icon: string }> = [
  { from: "#f4ede0", to: "#e8dcc8", icon: "#8a6a2f" },
  { from: "#eee6f4", to: "#ddd0ea", icon: "#3d2359" },
  { from: "#f3ece2", to: "#e5d5c0", icon: "#5c3a17" },
  { from: "#efe8f6", to: "#dccdea", icon: "#4a2a6b" },
  { from: "#f6efe2", to: "#ead9bb", icon: "#7a5620" },
];

const ICONS: Record<PlaceholderKind, string> = {
  ring: `<circle cx="400" cy="440" r="120" fill="none" stroke="currentColor" stroke-width="14"/>
    <path d="M400 320 L370 260 L430 260 Z" fill="currentColor"/>
    <circle cx="400" cy="270" r="16" fill="currentColor"/>`,
  necklace: `<path d="M260 260 C260 420 540 420 540 260" fill="none" stroke="currentColor" stroke-width="10"/>
    <path d="M400 420 L365 480 L400 530 L435 480 Z" fill="currentColor"/>`,
  earring: `<circle cx="360" cy="300" r="14" fill="currentColor"/>
    <path d="M360 314 Q360 360 360 380" stroke="currentColor" stroke-width="8" fill="none"/>
    <path d="M330 380 a30 34 0 1 0 60 0 Z" fill="currentColor"/>
    <circle cx="470" cy="300" r="14" fill="currentColor"/>
    <path d="M470 314 Q470 360 470 380" stroke="currentColor" stroke-width="8" fill="none"/>
    <path d="M440 380 a30 34 0 1 0 60 0 Z" fill="currentColor"/>`,
  bracelet: `<ellipse cx="400" cy="400" rx="160" ry="90" fill="none" stroke="currentColor" stroke-width="14"/>
    <circle cx="240" cy="400" r="10" fill="currentColor"/>
    <circle cx="320" cy="317" r="10" fill="currentColor"/>
    <circle cx="480" cy="317" r="10" fill="currentColor"/>
    <circle cx="560" cy="400" r="10" fill="currentColor"/>`,
  watch: `<circle cx="400" cy="400" r="110" fill="none" stroke="currentColor" stroke-width="14"/>
    <path d="M400 330 L400 400 L450 420" stroke="currentColor" stroke-width="10" fill="none" stroke-linecap="round"/>
    <rect x="370" y="260" width="60" height="40" rx="8" fill="currentColor"/>
    <rect x="370" y="500" width="60" height="40" rx="8" fill="currentColor"/>`,
  gem: `<path d="M300 320 L500 320 L560 400 L400 560 L240 400 Z" fill="none" stroke="currentColor" stroke-width="12"/>
    <path d="M300 320 L400 400 L500 320 M240 400 L560 400 M400 400 L400 560" stroke="currentColor" stroke-width="6" fill="none"/>`,
};

export function productPlaceholder(kind: PlaceholderKind, seed = 0): string {
  const palette = PALETTES[Math.abs(seed) % PALETTES.length];
  const icon = ICONS[kind];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${palette.from}"/>
        <stop offset="1" stop-color="${palette.to}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="800" fill="url(#bg)"/>
    <g color="${palette.icon}" opacity="0.85" transform="translate(0,0)">${icon}</g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
