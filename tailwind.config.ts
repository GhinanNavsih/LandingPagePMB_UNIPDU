import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#17111a",
        body: "#3d3542",
        muted: "#6b6370",
        canvas: "#ffffff",
        paper: "#faf7f8",
        line: "#e9e4e8",
        pink: {
          DEFAULT: "#d61f6f",
          dark: "#a8175a",
          soft: "#fce8f1",
          border: "#f3c2d8",
          bright: "#ff5ea1",
        },
      },
    },
  },
  plugins: [],
};

export default config;
