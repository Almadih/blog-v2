import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#09090b",
        graphite: "#121316",
        surface: "#18191d",
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.025em",
        tight: "-0.015em",
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};
export default config;
