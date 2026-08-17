import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--color-primary) / <alpha-value>)",
          dark: "hsl(var(--color-primary-dark) / <alpha-value>)",
          light: "hsl(var(--color-primary-light) / <alpha-value>)",
          foreground: "hsl(var(--color-primary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--color-accent) / <alpha-value>)",
          muted: "hsl(var(--color-accent-muted) / <alpha-value>)",
          foreground: "hsl(var(--color-accent-foreground) / <alpha-value>)",
        },
        background: "hsl(var(--color-background) / <alpha-value>)",
        surface: "hsl(var(--color-surface) / <alpha-value>)",
        foreground: "hsl(var(--color-foreground) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--color-muted) / <alpha-value>)",
          foreground: "hsl(var(--color-muted-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--color-border) / <alpha-value>)",
        success: {
          DEFAULT: "hsl(var(--color-success) / <alpha-value>)",
          foreground: "hsl(var(--color-success-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--color-warning) / <alpha-value>)",
          foreground: "hsl(var(--color-warning-foreground) / <alpha-value>)",
        },
        error: {
          DEFAULT: "hsl(var(--color-error) / <alpha-value>)",
          foreground: "hsl(var(--color-error-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2.5rem, 4vw + 1rem, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        h1: ["clamp(1.875rem, 2.5vw + 1rem, 2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        h2: ["clamp(1.5rem, 1.5vw + 1rem, 2rem)", { lineHeight: "1.15" }],
        h3: ["1.25rem", { lineHeight: "1.3" }],
        body: ["1rem", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        label: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],
        caption: ["0.75rem", { lineHeight: "1.4" }],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)",
        raised: "0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
        overlay: "0 10px 40px -8px rgb(0 0 0 / 0.18)",
      },
      transitionDuration: {
        short: "150ms",
        base: "250ms",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "slide-in-right": { from: { transform: "translateX(100%)" }, to: { transform: "translateX(0)" } },
        "slide-in-left": { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(0)" } },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "slide-up": "slide-up 200ms ease-out",
        "slide-in-right": "slide-in-right 250ms ease-out",
        "slide-in-left": "slide-in-left 250ms ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
