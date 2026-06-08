import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Neumorphic base palette
        neu: {
          base:  "#e8eef5",   // main background
          dark:  "#c5cad3",   // dark shadow
          light: "#ffffff",   // light shadow
          mid:   "#d4d9e3",   // subtle dividers
        },
        // Brand blue (for links/accents inside light bg)
        brand: {
          50:  "#f0f4fc",
          100: "#dce5f7",
          200: "#b9ccee",
          300: "#8aa9df",
          400: "#5c83cc",
          500: "#3a61b5",
          600: "#2b4d9a",
          700: "#1e3b7a",
          800: "#142a5e",
          900: "#0c1a3e",
          950: "#060d22",
        },
        // Gold accent
        gold: {
          50:  "#fffbeb",
          100: "#fff3c4",
          200: "#ffe88a",
          300: "#ffd83d",
          400: "#ffc400",
          500: "#ffb300",
          600: "#e09500",
          700: "#b87200",
          800: "#965808",
          900: "#7a450d",
        },
        neutral: {
          0:   "#ffffff",
          25:  "#fafafa",
          50:  "#f5f6f8",
          100: "#eaecf0",
          150: "#dde0e7",
          200: "#cdd1da",
          300: "#b0b7c3",
          400: "#9aa2b1",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        sm:   "6px",
        md:   "10px",
        lg:   "14px",
        xl:   "18px",
        "2xl": "24px",
        "3xl": "32px",
      },
      boxShadow: {
        // Neumorphic shadows
        "neu":        "8px 8px 16px #c5cad3, -8px -8px 16px #ffffff",
        "neu-sm":     "4px 4px 8px #c5cad3, -4px -4px 8px #ffffff",
        "neu-xs":     "3px 3px 6px #c5cad3, -3px -3px 6px #ffffff",
        "neu-lg":     "12px 12px 24px #c5cad3, -12px -12px 24px #ffffff",
        "neu-inset":  "inset 4px 4px 8px #c5cad3, inset -4px -4px 8px #ffffff",
        "neu-inset-sm": "inset 2px 2px 5px #c5cad3, inset -2px -2px 5px #ffffff",
        "neu-active": "inset 3px 3px 7px #c0c5ce, inset -1px -1px 4px #ffffff",
        // Legacy / utility
        xs:        "0 1px 2px rgba(0,0,0,.05)",
        sm:        "0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04)",
        md:        "0 4px 8px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.04)",
        lg:        "0 10px 20px rgba(0,0,0,.09), 0 4px 8px rgba(0,0,0,.05)",
        "gold-glow": "0 0 0 3px rgba(255,179,0,.25)",
        "card":    "0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)",
        "card-hover": "0 8px 24px rgba(0,0,0,.09), 0 2px 6px rgba(0,0,0,.05)",
      },
      fontSize: {
        "2xs": ["10.5px", { lineHeight: "1.5" }],
        xs:    ["12px",   { lineHeight: "1.5" }],
        sm:    ["13.5px", { lineHeight: "1.55" }],
        base:  ["14.5px", { lineHeight: "1.6" }],
        md:    ["15px",   { lineHeight: "1.6" }],
        lg:    ["17px",   { lineHeight: "1.4" }],
        xl:    ["20px",   { lineHeight: "1.3" }],
        "2xl": ["24px",   { lineHeight: "1.2" }],
        "3xl": ["30px",   { lineHeight: "1.1" }],
        "4xl": ["38px",   { lineHeight: "1.05" }],
        "5xl": ["48px",   { lineHeight: "1.05" }],
      },
    },
  },
  plugins: [],
};

export default config;
