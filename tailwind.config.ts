import type { Config } from "tailwindcss";

const duskBlue = {
  50: "#F2F4F9",
  100: "#E3E7F2",
  200: "#C6CEE4",
  300: "#9FAECF",
  400: "#7387B8",
  500: "#4D5C9D",
  600: "#3D4A80",
  700: "#303A64",
  800: "#242B4B",
  900: "#1B1F35",
  950: "#0F1220",
};

const blushRose = {
  50: "#FCF1F4",
  100: "#F9E2E8",
  200: "#F4C4D2",
  300: "#EE9CB3",
  400: "#E67897",
  500: "#DC5E84",
  600: "#C2456B",
  700: "#9E3555",
  800: "#7D2C44",
  900: "#612437",
};

const rosyTaupe = {
  50: "#F9F6F5",
  100: "#F1E9E6",
  200: "#E2D3CE",
  300: "#D2BCB4",
  400: "#C5A79E",
  500: "#B99388",
  600: "#A57D71",
  700: "#8D665B",
  800: "#714E44",
  900: "#52372F",
};

const neutral = {
  50: "#FAFAFB",
  100: "#F1F2F4",
  200: "#E2E4E8",
  300: "#CFD2D8",
  400: "#9DA2AD",
  500: "#6E7482",
  700: "#3B3F49",
  800: "#262930",
  900: "#15171C",
  950: "#0B0C0E",
};

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        serif: ["'Lora'", "Georgia", "serif"],
      },
      colors: {
        // Primitive scales
        platinum: "#F1F2F4",
        "dusk-blue": duskBlue,
        "blush-rose": blushRose,
        "rosy-taupe": rosyTaupe,
        neutral,

        // Semantic tokens from color_system_documentation.md
        canvas: {
          DEFAULT: "#F1F2F4", // 60% Base canvas
          surface: "#FFFFFF",
          inset: "#FAFAFB",
          dark: "#0B0C0E",
        },
        structure: {
          blue: duskBlue,     // 15% Structural frame & nav
          rose: blushRose,    // 15% Structural accents & tabs
        },
        focal: {
          DEFAULT: blushRose[500], // Blush Rose (#DC5E84)
          hover: blushRose[600],   // (#C2456B)
          active: blushRose[700],  // (#9E3555)
          text: "#FFFFFF",
          ...blushRose,
        },

        // Backward compatibility mappings for existing component classes
        ink: neutral[900],        // "#15171C"
        body: neutral[700],       // "#3B3F49"
        muted: neutral[500],      // "#6E7482"
        paper: "#F1F2F4",         // Platinum canvas
        "paper-alt": "#FAFAFB",   // Inset / elevated surface
        line: neutral[200],       // "#E2E4E8"
        "line-dark": duskBlue[800],// "#242B4B"

        // Emerald mapping -> Dusk Blue scale
        emerald: {
          950: duskBlue[950],
          900: duskBlue[900],
          800: duskBlue[800],
          700: duskBlue[700],
          600: duskBlue[600],
          500: duskBlue[500],
          400: duskBlue[400],
          300: duskBlue[300],
          200: duskBlue[200],
          100: duskBlue[100],
          50: duskBlue[50],
        },

        // Gold mapping -> Rosy Taupe / Blush Rose focal accents
        gold: {
          DEFAULT: rosyTaupe[500],
          dark: rosyTaupe[700],
          light: rosyTaupe[400],
          soft: rosyTaupe[50],
          border: rosyTaupe[200],
        },

        // Pink mapping -> Blush Rose scale
        pink: {
          DEFAULT: blushRose[500],
          dark: blushRose[700],
          soft: blushRose[50],
          border: blushRose[200],
          bright: rosyTaupe[500],
        },
      },
    },
  },
  plugins: [],
};

export default config;
