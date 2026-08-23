---
name: Satoshi Ledger Modern
colors:
  surface: '#fafaf5'
  surface-dim: '#dadad5'
  surface-bright: '#fafaf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4ef'
  surface-container: '#eeeee9'
  surface-container-high: '#e8e8e4'
  surface-container-highest: '#e2e3de'
  on-surface: '#1a1c19'
  on-surface-variant: '#444748'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f1f1ec'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdf'
  on-secondary-container: '#626262'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c18'
  on-tertiary-container: '#83847f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e3e3dd'
  tertiary-fixed-dim: '#c7c7c1'
  on-tertiary-fixed: '#1a1c18'
  on-tertiary-fixed-variant: '#464743'
  background: '#fafaf5'
  on-background: '#1a1c19'
  surface-variant: '#e2e3de'
  surface-ivory: '#F7F7F2'
  ink-black: '#111111'
  pencil-gray: '#666666'
  rule-stroke: '#D1D1CB'
  success-muted: '#4B5E40'
  warning-muted: '#8C733E'
typography:
  display-lg:
    fontFamily: Satoshi
    fontSize: 56px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Satoshi
    fontSize: 36px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Satoshi
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Satoshi
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Satoshi
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.08em
  data-metric:
    fontFamily: Satoshi
    fontSize: 40px
    fontWeight: '900'
    lineHeight: '1'
    letterSpacing: -0.02em
  table-header:
    fontFamily: Satoshi
    fontSize: 13px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.02em
spacing:
  base: 8px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 20px
  container-max: 1360px
  stack-xl: 64px
  stack-md: 24px
  stack-sm: 12px
---

## Brand & Style

The design system is a high-fidelity evolution of the "Swiss-Editorial" aesthetic, pivoting toward a **Premium Modern SaaS** style. It balances the warmth of traditional financial ledgers with the clinical precision of modern technology. The brand personality is sophisticated, tech-forward, and authoritative, designed to instill confidence in high-earning freelancers and digital entrepreneurs.

The style is characterized by **Minimalism** with **High-Contrast Grotesk** elements. It utilizes an ivory-to-ink palette to maintain an "analog" warmth while employing razor-sharp edges and high-density information layouts. The visual narrative is one of "Technical Luxury"—where the software feels as intentional and well-crafted as a high-end physical timepiece or a piece of architectural stationery.

## Colors

The color strategy relies on a foundational "Warm Ivory" (#F7F7F2) to differentiate the product from generic "cold" white SaaS platforms. This choice reduces eye strain and provides a premium, paper-like canvas.

- **Primary (Ink):** Used for all critical typography, primary CTAs, and structural lines. It is a deep near-black that provides maximum legibility and authority.
- **Secondary (Pencil):** A refined charcoal used for supporting information, captions, and non-essential UI decorators.
- **Neutral (Surface):** The core canvas color. All layout containers originate from this ivory base.
- **Rules & Strokes:** A specific mid-tone gray (#D1D1CB) is reserved for the 1px borders that define the grid. It is dark enough to be visible on ivory but light enough to remain secondary to the content.

## Typography

Typography is the design system's most critical asset. We use **Satoshi** for its geometric precision and variable weight range, creating a distinctive, tech-forward voice for headlines and branding. **Inter** is used for the "workhorse" UI elements where maximum readability and system-standard clarity are required.

Scale is used aggressively to create an editorial hierarchy. High-value financial metrics use the `data-metric` style (Satoshi Black) to command attention. Meta-information and table headers utilize `label-caps` to reinforce a structured, ledger-like appearance.

## Layout & Spacing

The layout is built on a **12-column Fixed Grid** for desktop, prioritizing "Active Whitespace." This means whitespace is not just empty area but a deliberate design tool used to isolate key data and reduce cognitive load.

- **Grid:** On desktop, the central container is capped at 1360px with generous 48px side margins. On mobile, it switches to a fluid 4-column system.
- **Rhythm:** An 8px spacing scale (8, 16, 24, 32, 48, 64) ensures vertical rhythm. Elements should "hang" from the grid, with content typically left-aligned and financial figures right-aligned for balance.
- **Sectioning:** Rather than using heavy background fills, sections are separated by `stack-xl` (64px) spacing or thin 1px horizontal rules.

## Elevation & Depth

This system intentionally avoids soft, diffused shadows to maintain its sharp, modern character. Depth is achieved through **Structural Partitioning** and **Tonal Tiers**.

- **Level 0 (Base):** The primary Ivory surface (#F7F7F2).
- **Level 1 (Containers):** Cards and panels are defined by 1px solid borders (#D1D1CB). They do not float; they sit flush on the base layer.
- **Focus & Interaction:** Depth is communicated through high-contrast shifts. For example, a focused input or an active card might gain a 1px solid black border, creating immediate visual prominence without the "mushy" feel of blurs.
- **Overlays:** Modals and menus use a 1px black border and a sharp, 4px "hard shadow" offset (0px blur) to mimic a physical card being placed on a desk.

## Shapes

The design system adheres to a **Strict Sharp (0px)** philosophy. There are no rounded corners in the interface. Every button, input, container, and modal uses 90-degree angles. This architectural approach emphasizes the "Satoshi" font’s geometric nature and creates a sense of rigorous, professional precision suitable for financial management.

## Components

### Buttons
- **Primary:** Solid #111111 background with white text. Sharp corners. Hover state: #333333.
- **Secondary:** Transparent background with a 1px #111111 border. 
- **Ghost:** No border or background. Satoshi Bold text with a 1px underline on hover.

### Inputs
- **Text Fields:** 1px bottom border only (#D1D1CB) for a "form-entry" feel. On focus, the border becomes 2px and #111111.
- **Labels:** Use `label-caps` in Pencil Gray, always placed 8px above the input field.

### Cards & Modules
- **Structure:** 1px border (#D1D1CB). Headers are separated by a 1px horizontal rule. 
- **Internal Padding:** Always 32px (stack-lg equivalent) to ensure content never feels crowded.

### Data Tables
- **Styling:** Minimalist. 1px horizontal lines only. No vertical lines.
- **Headers:** Satoshi Bold in `label-caps`. 
- **Alignment:** Strings are left-aligned; all numeric values, dates, and currency are right-aligned to the grid.

### Status Indicators
- **Style:** Small, sharp-edged chips with desaturated background fills (e.g., desaturated olive for "Paid") and #111111 text. Avoid vibrant, "neon" status colors to protect the premium aesthetic.