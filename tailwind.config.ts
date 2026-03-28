import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070707",
        foreground: "#ededed",
        card: "#111111",
        cardBorder: "#222222",
        brand: {
          light: "#ff758c",
          DEFAULT: "#ff7eb3",
          dark: "#fc6076",
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(to right, #fc6076, #ff9a44)',
        'brand-gradient-hover': 'linear-gradient(to right, #ff758c, #ff7eb3)',
      },
      fontFamily: {
        sans: ['var(--font-inter)'], // Will set up Inter next
      }
    },
  },
  plugins: [],
};
export default config;
