---
name: FreelanceLedger Professional Funky
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#454556'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#757588'
  outline-variant: '#c5c5d9'
  surface-tint: '#3642f4'
  primary: '#000cd8'
  on-primary: '#ffffff'
  primary-container: '#2e3aee'
  on-primary-container: '#c8cbff'
  inverse-primary: '#bec2ff'
  secondary: '#4a6700'
  on-secondary: '#ffffff'
  secondary-container: '#bcf540'
  on-secondary-container: '#4f6e00'
  tertiary: '#811600'
  on-tertiary: '#ffffff'
  tertiary-container: '#ac2000'
  on-tertiary-container: '#ffc0b3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bec2ff'
  on-primary-fixed: '#00036b'
  on-primary-fixed-variant: '#101cde'
  secondary-fixed: '#bcf540'
  secondary-fixed-dim: '#a1d820'
  on-secondary-fixed: '#141f00'
  on-secondary-fixed-variant: '#374e00'
  tertiary-fixed: '#ffdad3'
  tertiary-fixed-dim: '#ffb4a4'
  on-tertiary-fixed: '#3d0600'
  on-tertiary-fixed-variant: '#8c1800'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: archivoNarrow
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: archivoNarrow
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: archivoNarrow
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: archivoNarrow
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  sticker-offset: -8px
---

## Brand & Style

The design system strikes a balance between the unwavering authority of high-end fintech and the expressive energy of a creative editorial studio. It is designed for freelancers who treat their business as a craft—demanding professional-grade tools without the sterile corporate aesthetic.

The visual style is **Professional Funky**: a "Zine-inspired Swiss" hybrid. It utilizes a rigorous, structured grid as a foundation, then disrupts it with vibrant accents, "sticker" style overlays, and expressive typography. The emotional response should be one of confidence and inspiration, moving away from "banking" toward "building."

## Colors

The palette is anchored by a warm ivory background and deep charcoal/black text to maintain professional legibility and "high-fashion" contrast.

- **Foundation**: Use `#FAF9F6` (Ivory) for all main surfaces. Text and primary structural borders use `#121212` (Charcoal).
- **Electric Cobalt (#2E3AEE)**: The primary action color. Use for main buttons, active states, and focus indicators.
- **Acid Lime (#C5FF4A)**: High-energy accent. Use for success states, badges, and highlighting critical growth metrics.
- **Punchy Terracotta (#FF5733)**: Secondary accent. Use for warnings, secondary data points, or "sticker" elements to add warmth.

## Typography

This design system utilizes a high-contrast typographic pairing to bridge the gap between editorial and functional.

- **Headlines**: Using *Archivo Narrow* (as a proxy for high-impact display faces) provides a bold, condensed, and authoritative look reminiscent of modern fashion magazines. Use tight letter-spacing for large displays.
- **Body & Interface**: *Geist* provides a technical, developer-centric precision. It ensures that complex financial data remains legible and trustworthy. 
- **Application**: Always use the Charcoal neutral for text. Never use Cobalt or Lime for long-form body text to ensure WCAG compliance.

## Layout & Spacing

The layout follows a strict 12-column Swiss grid but permits "intentional breaks."

- **The Grid**: Use 24px gutters. Content blocks should align strictly to the grid lines using 1px solid charcoal borders.
- **The "Sticker" Effect**: Certain elements (like badges, floating promo cards, or tooltips) should use the `sticker-offset` to overlap the borders of their parent containers. This creates the zine-inspired depth.
- **Mobile Adaptation**: On mobile, the 12-column grid collapses to 4 columns. Margins shrink to 20px, and horizontal padding within cards is reduced to 16px.

## Elevation & Depth

This system avoids traditional soft shadows and blurs, opting for a flat, structural depth model.

- **Hard Shadows**: Instead of Gaussian blurs, use "Hard Shadows" (2px to 4px offset, 100% opacity, Charcoal color) to give elements a physical, cut-out appearance.
- **Borders as Depth**: Use 1px solid Charcoal borders for all containers. 
- **Layering**: Depth is achieved through the overlap of elements. A "Lime" colored badge should sit on top of a Charcoal border with a 1px white "knockout" margin to ensure separation.

## Shapes

The shape language is a "Geometric Mix."

- **Containers**: All main cards and layout sections use a `0` roundedness (sharp corners) to maintain the professional, fintech-grid feel.
- **Interactive Elements**: Buttons and Tags use a custom "Squircle" or pill-shape (set `rounded-xl` for these specific components) to provide a "funky" contrast against the sharp grid.
- **Icons**: Use thick (2px) stroke icons with sharp terminals to match the font weight of Geist.

## Components

- **Buttons**: Primary buttons are pill-shaped, Cobalt background, Ivory text. They use a hard 4px charcoal shadow that disappears on "active" (press) state to simulate a physical button.
- **Inputs**: Sharp-edged boxes with a 1px Charcoal border. On focus, the border thickness remains 1px but the color shifts to Cobalt with a subtle Lime "halo" (2px solid offset).
- **Chips/Badges**: Use irregular pill shapes. Acid Lime for "Paid" or "Active," Terracotta for "Overdue," and Ivory with a Charcoal border for "Draft."
- **Cards**: Sharp corners, Ivory background, 1px Charcoal border. Header sections of cards should have a 1px bottom border to separate data from titles.
- **Data Tables**: Remove vertical lines. Use only horizontal 1px Charcoal lines. Row hover states should use a very faint Ivory-to-Lime tint transition.