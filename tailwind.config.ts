import type { Config } from "next";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        acid: {
             yellow: "#facc15",
             black: "#000000",
        }
      },
      fontFamily: {
        sans: ["var(--font-syne)", "sans-serif"],
        archivo: ["var(--font-archivo)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
