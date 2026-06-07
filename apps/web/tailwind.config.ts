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
        brand: {
          50:  "#eff7ff",
          100: "#dbeffe",
          200: "#bfe3fd",
          300: "#7cc8fb",
          400: "#38aff8",
          500: "#0d8fe6",
          600: "#0171c4",
          700: "#015da0",
          800: "#064d83",
          900: "#0b416d",
        },
        neutral: {
          0:   "#ffffff",
          25:  "#fafafa",
          50:  "#f5f5f5",
          100: "#ebebeb",
          150: "#e0e0e0",
          200: "#d4d4d4",
          300: "#b3b3b3",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
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
      },
      boxShadow: {
        xs:  "0 1px 2px rgba(0,0,0,.05)",
        sm:  "0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04)",
        md:  "0 4px 6px rgba(0,0,0,.06), 0 2px 4px rgba(0,0,0,.04)",
        lg:  "0 10px 15px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.04)",
        xl:  "0 20px 25px rgba(0,0,0,.08), 0 8px 10px rgba(0,0,0,.04)",
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
