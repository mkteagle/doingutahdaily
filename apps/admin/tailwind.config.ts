import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canyon: { DEFAULT: "#C45C2A", deep: "#A84420" },
        slate: "#2E3A4F",
        sage: "#7A9B7E",
        amber: "#E8A240",
        sky: "#4B7FA3",
        sand: "#F2E8D9",
        cream: "#FFF8EE",
        ink: "#1C1410",
      },
    },
  },
  plugins: [],
};
export default config;
