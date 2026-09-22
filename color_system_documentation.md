# Color System Specification & Token Guide

## 1. Executive Summary & Visual Hierarchy

This design system is built on a precise **60-30-10 visual distribution**, balancing clarity, structural elegance, and focal conversion moments. The palette shifts structural weight across deep classic tones and vibrant accent layers, reserving warm earth tones exclusively for high-intent user actions.

```
┌────────────────────────────────────────────────────────────────────────┐
│ PLATINUM (#F1F2F4) — 60% Base Canvas & Surface Backgrounds             │
│                                                                        │
│  ┌───────────────────────────────┐  ┌───────────────────────────────┐  │
│  │ DUSK BLUE (#4D5C9D) — 15%     │  │ BLUSH ROSE (#DC5E84) — 15%    │  │
│  │ Structural Nav, Headers, Text │  │ Structural Dividers, Tabs, UI │  │
│  └───────────────────────────────┘  └───────────────────────────────┘  │
│                                                                        │
│                    ┌──────────────────────────────┐                    │
│                    │ ROSY TAUPE (#B99388) — 10%   │                    │
│                    │ Focal Accent & Hero CTAs     │                    │
│                    └──────────────────────────────┘                    │
└────────────────────────────────────────────────────────────────────────┘
```

### The 60-30-10 Distribution Strategy

1. **60% Dominant Canvas (`Platinum`):** Sets the atmospheric ground plane. Used across base viewports, card backgrounds, empty space, and modal backdrops to provide visual rest.
2. **30% Secondary Structure (`Dusk Blue` & `Blush Rose`):** 
   * **Dusk Blue (15%):** Anchors the framework—primary navigation bars, high-contrast headings, data grids, and input framing.
   * **Blush Rose (15%):** Guides organizational flow—structural tab bars, active category highlights, notification counter backdrops, and interactive secondary controls.
3. **10% Focal Accent (`Rosy Taupe`):** Strictly reserved for focal conversion points, primary call-to-action (CTA) buttons, hero highlights, and critical path user indicators.

---

## 2. Core Colorimetric Values

The fundamental values across physical and digital gamuts:

| Token Name | Hex | sRGB | HSL | HSB | CMYK | CIE $L^*a^*b^*$ | Relative Luminance ($Y$) | Assigned Role |
|---|---|---|---|---|---|---|---|---|
| **Platinum** | `#F1F2F4` | `241, 242, 244` | `220°, 12%, 95%` | `220°, 1%, 96%` | `1, 1, 0, 4` | `95.0, 0.0, -1.0` | `0.884` | 60% Canvas & Surfaces |
| **Dusk Blue** | `#4D5C9D` | `77, 92, 157` | `229°, 34%, 46%` | `229°, 51%, 62%` | `51, 41, 0, 38` | `41.0, 13.0, -37.0` | `0.115` | 30% Structural Frame & Headers |
| **Blush Rose** | `#DC5E84` | `220, 94, 132` | `342°, 64%, 62%` | `342°, 57%, 86%` | `0, 57, 40, 14` | `57.0, 53.0, 4.0` | `0.247` | 30% Structural Accents & Tabs |
| **Rosy Taupe** | `#B99388` | `185, 147, 136` | `13°, 26%, 63%` | `13°, 26%, 73%` | `0, 21, 26, 27` | `64.0, 13.0, 11.0` | `0.342` | 10% Focal Accent & Hero CTAs |

---

## 3. Primitive Scale Architecture

Stepped numeric scales ($50$ to $950$) support micro-interactions, dark mode adaptations, active/hover states, and layered depth.

### Dusk Blue Scale (Structural Foundation)
* `dusk-blue-50`: `#F2F4F9` (Subtle active row fills, soft tinted badges)
* `dusk-blue-100`: `#E3E7F2` (Table row separators, soft container edges)
* `dusk-blue-200`: `#C6CEE4` (Structural border framing, inactive controls)
* `dusk-blue-300`: `#9FAECF` (Dark mode borders, subtle secondary text)
* `dusk-blue-400`: `#7387B8` (Dark mode structural elements)
* `dusk-blue-500`: `#4D5C9D` **[Base Structural Foundation]** (Main navigation headers, primary frame)
* `dusk-blue-600`: `#3D4A80` (Structural hover highlight)
* `dusk-blue-700`: `#303A64` (Active state, pressed frame elements)
* `dusk-blue-800`: `#242B4B` (Deep container backdrop)
* `dusk-blue-900`: `#1B1F35` (Structural typography, high-contrast headings)
* `dusk-blue-950`: `#0F1220` (Extreme dark structural ground)

### Blush Rose Scale (Structural Accents)
* `blush-rose-50`: `#FCF1F4` (Category pill backdrops, subtle message containers)
* `blush-rose-100`: `#F9E2E8` (Light badge fills, secondary selections)
* `blush-rose-200`: `#F4C4D2` (Subtle boundary dividers)
* `blush-rose-300`: `#EE9CB3` (Dark mode structural tab hover)
* `blush-rose-400`: `#E67897` (Dark mode structural indicators)
* `blush-rose-500`: `#DC5E84` **[Base Structural Accent]** (Active tab borders, secondary UI indicators)
* `blush-rose-600`: `#C2456B` (Structural accent hover state)
* `blush-rose-700`: `#9E3555` (Text-safe structural accent for small copy)
* `blush-rose-800`: `#7D2C44` (Deep accent borders)
* `blush-rose-900`: `#612437` (Dark mode category containers)

### Rosy Taupe Scale (10% Focal Accent)
* `rosy-taupe-50`: `#F9F6F5` (Focal glow backdrops, highlight callouts)
* `rosy-taupe-100`: `#F1E9E6` (Focal button disabled surface)
* `rosy-taupe-200`: `#E2D3CE` (Subtle focal outlines)
* `rosy-taupe-300`: `#D2BCB4` (Focal button focus ring)
* `rosy-taupe-400`: `#C5A79E` (Dark mode focal hero CTA)
* `rosy-taupe-500`: `#B99388` **[Base Focal Accent]** (Primary conversion buttons, hero CTAs)
* `rosy-taupe-600`: `#A57D71` (Hero CTA hover state)
* `rosy-taupe-700`: `#8D665B` (Hero CTA active/pressed state, accessible text variant)
* `rosy-taupe-800`: `#714E44` (Deep focal framing)
* `rosy-taupe-900`: `#52372F` (High-contrast focal typography)

### Neutral Scale (Calibrated with Platinum)
* `neutral-50`: `#FAFAFB` (Elevated card background)
* `neutral-100`: `#F1F2F4` **[Base Platinum Canvas]** (Viewport background)
* `neutral-200`: `#E2E4E8` (Card outlines, subtle dividers)
* `neutral-300`: `#CFD2D8` (Input border lines, control frames)
* `neutral-400`: `#9DA2AD` (Inactive icons, placeholder text)
* `neutral-500`: `#6E7482` (Secondary descriptive text)
* `neutral-700`: `#3B3F49` (Primary readable body text)
* `neutral-800`: `#262930` (Section subheadings)
* `neutral-900`: `#15171C` (Primary titles, maximum contrast headers)
* `neutral-950`: `#0B0C0E` (Dark mode canvas viewport)

---

## 4. Semantic Token Architecture

Semantic tokens isolate UI components from raw hex values, allowing dynamic theme swapping without touching component code.

```
Primitive Token ($rosy-taupe-500)
       │
       ▼
Semantic Token (--color-action-focal-default)
       │
       ▼
Component Implementation (.btn-hero { background: var(--color-action-focal-default); })
```

| Semantic Token | Light Mode Primitive | Dark Mode Primitive | Description / Usage |
|---|---|---|---|
| `--color-canvas-base` | `neutral-100` (`#F1F2F4`) | `neutral-950` (`#0B0C0E`) | Base background surface (60%) |
| `--color-canvas-surface` | `#FFFFFF` | `neutral-900` (`#15171C`) | Raised cards, panels, modals |
| `--color-canvas-inset` | `neutral-50` (`#FAFAFB`) | `neutral-900` (`#15171C`) | Inset code containers, well areas |
| `--color-structure-nav` | `dusk-blue-500` (`#4D5C9D`) | `dusk-blue-900` (`#1B1F35`) | Top navigation bar, header background |
| `--color-structure-nav-text` | `#FFFFFF` | `platinum-100` (`#F1F2F4`) | Nav links, menu branding |
| `--color-structure-heading` | `dusk-blue-900` (`#1B1F35`) | `dusk-blue-100` (`#E3E7F2`) | Section titles, structural headings |
| `--color-structure-border` | `neutral-200` (`#E2E4E8`) | `neutral-800` (`#262930`) | Default card frames, dividers |
| `--color-structure-accent` | `blush-rose-500` (`#DC5E84`) | `blush-rose-400` (`#E67897`) | Active tab lines, secondary UI indicators |
| `--color-structure-pill-bg` | `blush-rose-50` (`#FCF1F4`) | `blush-rose-900` (`#612437`) | Structural metadata tag backgrounds |
| `--color-structure-pill-text`| `blush-rose-700` (`#9E3555`) | `blush-rose-200` (`#F4C4D2`) | High-contrast label inside structural pill |
| `--color-action-focal` | `rosy-taupe-500` (`#B99388`) | `rosy-taupe-400` (`#C5A79E`) | **10% Focal Hero CTA** (Primary conversion) |
| `--color-action-focal-hover`| `rosy-taupe-600` (`#A57D71`) | `rosy-taupe-300` (`#D2BCB4`) | Focal CTA hover state |
| `--color-action-focal-active`| `rosy-taupe-700` (`#8D665B`) | `rosy-taupe-200` (`#E2D3CE`) | Focal CTA pressed state |
| `--color-text-on-focal` | `neutral-900` (`#15171C`) | `neutral-900` (`#15171C`) | Text label on focal CTA button |

---

## 5. Accessibility Compliance Matrix (WCAG 2.1)

Contrast ratios are evaluated against WCAG 2.1 formulas:

$$CR = \frac{L_1 + 0.05}{L_2 + 0.05}$$

Where $L_1$ is the relative luminance of the lighter color and $L_2$ is the relative luminance of the darker color.

* **Normal Text ($< 24\text{px}$ regular or $< 18.66\text{px}$ bold):** Requires minimum contrast ratio $\ge 4.5:1$ (Level AA).
* **Large Text ($\ge 24\text{px}$ regular or $\ge 18.66\text{px}$ bold) & UI Components:** Requires minimum contrast ratio $\ge 3.0:1$ (Level AA).

| Foreground Color | Background Context | Contrast Ratio | Compliance | Design & Implementation Directive |
|---|---|---|---|---|
| **Dark Neutral** (`#15171C`) | **Rosy Taupe** (`#B99388`) | **6.03:1** | **AA / AAA Pass** | **Mandatory:** Always use dark text on Rosy Taupe CTAs |
| **White** (`#FFFFFF`) | **Rosy Taupe** (`#B99388`) | **2.68:1** | **Fail** | **Prohibited:** Never use white text on Rosy Taupe buttons |
| **Rosy Taupe 700** (`#8D665B`)| **Platinum** (`#F1F2F4`) | **4.71:1** | **AA Pass** | Use this darker variant for readable focal text on canvas |
| **White** (`#FFFFFF`) | **Dusk Blue** (`#4D5C9D`) | **6.35:1** | **AA / AAA Pass** | Standard pairing for navigation bars and filled blue badges |
| **Dusk Blue** (`#4D5C9D`) | **Platinum** (`#F1F2F4`) | **5.62:1** | **AA Pass** | Fully compliant for structural copy and headings on canvas |
| **Blush Rose** (`#DC5E84`) | **Platinum** (`#F1F2F4`) | **3.13:1** | **Pass (Large UI only)** | Reserved for active tab bars, large icons, graphical edges |
| **Blush Rose 700** (`#9E3555`)| **Platinum** (`#F1F2F4`) | **5.80:1** | **AA Pass** | Compliant pairing for colored tags and subheaders |
| **Neutral 900** (`#15171C`) | **Platinum** (`#F1F2F4`) | **14.85:1** | **AAA Pass** | Standard baseline for body text and critical data copy |

---

## 6. Implementation Code Blocks

### A. CSS Custom Properties (`tokens.css`)

```css
:root {
  /* Primitive Foundations */
  --primitive-platinum: #f1f2f4;
  --primitive-dusk-blue-500: #4d5c9d;
  --primitive-dusk-blue-600: #3d4a80;
  --primitive-dusk-blue-900: #1b1f35;
  --primitive-blush-rose-50: #fcf1f4;
  --primitive-blush-rose-500: #dc5e84;
  --primitive-blush-rose-600: #c2456b;
  --primitive-blush-rose-700: #9e3555;
  --primitive-rosy-taupe-500: #b99388;
  --primitive-rosy-taupe-600: #a57d71;
  --primitive-rosy-taupe-700: #8d665b;
  --primitive-neutral-900: #15171c;
  --primitive-white: #ffffff;

  /* 60% Canvas & Surfaces */
  --color-canvas-base: var(--primitive-platinum);
  --color-canvas-surface: var(--primitive-white);

  /* 30% Structural Framework (Dusk Blue & Blush Rose) */
  --color-structure-nav: var(--primitive-dusk-blue-500);
  --color-structure-nav-text: var(--primitive-white);
  --color-structure-heading: var(--primitive-dusk-blue-900);
  --color-structure-accent: var(--primitive-blush-rose-500);
  --color-structure-accent-hover: var(--primitive-blush-rose-600);
  --color-structure-tag-bg: var(--primitive-blush-rose-50);
  --color-structure-tag-text: var(--primitive-blush-rose-700);

  /* 10% Focal Accent (Rosy Taupe) */
  --color-action-focal: var(--primitive-rosy-taupe-500);
  --color-action-focal-hover: var(--primitive-rosy-taupe-600);
  --color-action-focal-active: var(--primitive-rosy-taupe-700);
  --color-action-focal-text: var(--primitive-neutral-900);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-canvas-base: #0b0c0e;
    --color-canvas-surface: #15171c;

    --color-structure-nav: #1b1f35;
    --color-structure-nav-text: var(--primitive-platinum);
    --color-structure-heading: #e3e7f2;
    --color-structure-accent: #e67897;
    --color-structure-accent-hover: #ee9cb3;
    --color-structure-tag-bg: #612437;
    --color-structure-tag-text: #f4c4d2;

    --color-action-focal: #c5a79e;
    --color-action-focal-hover: #d2bcb4;
    --color-action-focal-active: #e2d3ce;
    --color-action-focal-text: #15171c;
  }
}

/* Component Level Classes */
.btn-focal {
  background-color: var(--color-action-focal);
  color: var(--color-action-focal-text);
  font-weight: 600;
  border: 1px solid transparent;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 150ms ease-in-out;
}

.btn-focal:hover {
  background-color: var(--color-action-focal-hover);
}

.btn-focal:active {
  background-color: var(--color-action-focal-active);
}

.structural-header {
  background-color: var(--color-structure-nav);
  color: var(--color-structure-nav-text);
  border-bottom: 3px solid var(--color-structure-accent);
}
```

### B. Tailwind CSS Configuration (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F1F2F4', // 60%
          surface: '#FFFFFF',
          dark: '#0B0C0E',
        },
        structure: {          // 30%
          blue: {
            50: '#F2F4F9',
            500: '#4D5C9D',
            600: '#3D4A80',
            900: '#1B1F35',
          },
          rose: {
            50: '#FCF1F4',
            500: '#DC5E84',
            600: '#C2456B',
            700: '#9E3555',
          },
        },
        focal: {              // 10%
          DEFAULT: '#B99388',
          hover: '#A57D71',
          active: '#8D665B',
          text: '#15171C',
        },
      },
    },
  },
  plugins: [],
};
```

### C. W3C Design Tokens Community Group Standard (`tokens.json`)

```json
{
  "$name": "Corporate Design System",
  "$version": "2.0.0",
  "color": {
    "primitive": {
      "platinum": { "$value": "#f1f2f4", "$type": "color" },
      "dusk-blue": {
        "500": { "$value": "#4d5c9d", "$type": "color" },
        "600": { "$value": "#3d4a80", "$type": "color" },
        "900": { "$value": "#1b1f35", "$type": "color" }
      },
      "blush-rose": {
        "50": { "$value": "#fcf1f4", "$type": "color" },
        "500": { "$value": "#dc5e84", "$type": "color" },
        "600": { "$value": "#c2456b", "$type": "color" },
        "700": { "$value": "#9e3555", "$type": "color" }
      },
      "rosy-taupe": {
        "500": { "$value": "#b99388", "$type": "color" },
        "600": { "$value": "#a57d71", "$type": "color" },
        "700": { "$value": "#8d665b", "$type": "color" }
      }
    },
    "semantic": {
      "canvas": {
        "base": { "$value": "{color.primitive.platinum}", "$type": "color" }
      },
      "structure": {
        "nav": { "$value": "{color.primitive.dusk-blue.500}", "$type": "color" },
        "indicator": { "$value": "{color.primitive.blush-rose.500}", "$type": "color" }
      },
      "action": {
        "focal": { "$value": "{color.primitive.rosy-taupe.500}", "$type": "color" },
        "focal-hover": { "$value": "{color.primitive.rosy-taupe.600}", "$type": "color" }
      }
    }
  }
}
```

### D. TypeScript Type-Safe Definitions (`tokens.ts`)

```typescript
export const Palette = {
  Platinum: '#F1F2F4',
  DuskBlue: '#4D5C9D',
  BlushRose: '#DC5E84',
  RosyTaupe: '#B99388',
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
    surface: '#FFFFFF',
  },
  structure: {
    nav: Palette.DuskBlue,
    navText: '#FFFFFF',
    heading: '#1B1F35',
    accent: Palette.BlushRose,
  },
  focal: {
    cta: Palette.RosyTaupe,
    ctaHover: '#A57D71',
    ctaText: '#15171C',
  },
};
```

---

## 7. Operational Rules & Governance

### Rules for the 10% Focal Accent (Rosy Taupe)
* **One Primary Action per Viewport:** Rosy Taupe should only appear once as an interactive CTA on any given screen (e.g., "Complete Purchase", "Schedule Demo", "Create Account"). If multiple buttons are present, secondary actions must use an outline style with Dusk Blue borders.
* **Strict Dark Text Requirement:** Because Rosy Taupe (`#B99388`) has a luminance of $Y = 0.342$, white text on this surface yields an unacceptable contrast ratio ($2.68:1$). Every Rosy Taupe button label **must** be set in deep neutral (`#15171C`).

### Rules for the 30% Secondary Structure (Dusk Blue & Blush Rose)
* **Dusk Blue as Anchor:** Dusk Blue grounds navigation shells, headers, sidebars, and structural dividers. It maintains visual authority without competing with the focal CTA.
* **Blush Rose as Visual Guide:** Use Blush Rose sparingly within the structural layer for active tab indicators, step progress markers, and category tags. Never combine Blush Rose fills with Rosy Taupe fills in the same card component.

### Rules for the 60% Dominant Canvas (Platinum)
* **Preserve Whitespace:** Platinum must dominate at least 60% of visible layout real estate. Do not flood background panels with Dusk Blue or Blush Rose; elevated cards should be white (`#FFFFFF`) against the Platinum canvas to ensure natural depth.