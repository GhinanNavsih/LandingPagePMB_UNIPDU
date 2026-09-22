/**
 * Design Tokens Specification & Color System
 * Generated according to color_system_documentation.md
 */

export const Palette = {
  Platinum: "#F1F2F4",
  DuskBlue: "#4D5C9D",
  BlushRose: "#DC5E84",
  RosyTaupe: "#B99388",
} as const;

export interface TokenTheme {
  canvas: {
    base: string;
    surface: string;
  };
  structure: {
    nav: string;
    navText: string;
    heading: string;
    accent: string;
  };
  focal: {
    cta: string;
    ctaHover: string;
    ctaText: string;
  };
}

export const LightTheme: TokenTheme = {
  canvas: {
    base: Palette.Platinum,
    surface: "#FFFFFF",
  },
  structure: {
    nav: Palette.DuskBlue,
    navText: "#FFFFFF",
    heading: "#1B1F35",
    accent: Palette.BlushRose,
  },
  focal: {
    cta: Palette.BlushRose,
    ctaHover: "#C2456B",
    ctaText: "#FFFFFF",
  },
};

export const DarkTheme: TokenTheme = {
  canvas: {
    base: "#0B0C0E",
    surface: "#15171C",
  },
  structure: {
    nav: "#1B1F35",
    navText: Palette.Platinum,
    heading: "#E3E7F2",
    accent: "#E67897",
  },
  focal: {
    cta: "#E67897",
    ctaHover: "#EE9CB3",
    ctaText: "#FFFFFF",
  },
};
