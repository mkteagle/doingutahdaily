import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: { display: ["Bricolage Grotesque", "Instrument Sans", "sans-serif"] },
      colors: {
        canyon: { DEFAULT: "#9E4726", deep: "#81391e" },
        slate: "#2E3A4F",
        sage: "#7A9B7E",
        amber: "#E8A240",
        sky: "#4B7FA3",
        sand: "#f4eee4",
        cream: "#fffaf1",
        ink: "#203429",
      },
    },
  },
  plugins: [],
};
export default config;
