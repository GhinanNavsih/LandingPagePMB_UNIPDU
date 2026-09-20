import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        serif: ["'Lora'", "Georgia", "serif"],
      },
      colors: {
        ink: "#121b16",
        body: "#33443d",
        muted: "#667770",
        canvas: "#ffffff",
        paper: "#fbfaf7",
        "paper-alt": "#f4f1ea",
        line: "#e7e3da",
        "line-dark": "#30433a",
        emerald: {
          950: "#061a12",
          900: "#092e21",
          800: "#0d4331",
          700: "#135d45",
          600: "#1a7c5d",
          50: "#f0f7f4",
          100: "#dcf0e7",
        },
        gold: {
          DEFAULT: "#c59328",
          dark: "#a37618",
          light: "#ddae4a",
          soft: "#fcf8eb",
          border: "#eedaa8",
        },
        pink: {
          DEFAULT: "#0d4331",
          dark: "#092e21",
          soft: "#f0f7f4",
          border: "#dcf0e7",
          bright: "#c59328",
        },
      },
    },
  },
  plugins: [],
};

export default config;
