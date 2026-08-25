---
name: Editorial Ledger
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
  tertiary-container: '#1d1b1a'
  on-tertiary-container: '#868381'
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
  tertiary-fixed: '#e6e1df'
  tertiary-fixed-dim: '#cac6c3'
  on-tertiary-fixed: '#1d1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#fafaf5'
  on-background: '#1a1c19'
  surface-variant: '#e2e3de'
  surface-ivory: '#F7F7F2'
  ink: '#111111'
  pencil: '#666666'
  rule: '#D1D1CB'
  success-muted: '#4B5E40'
  warning-muted: '#8A7033'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  data-metric:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.06em
  table-cell:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: '0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  container-max: 1200px
---

## Brand & Style

The design system is a "Refined Editorial" framework that balances the precision of financial software with the warmth of high-end print media. It is designed for the modern professional who values clarity, sophistication, and a "calm" workspace. 

The aesthetic is **Minimalist** with a focus on **Tonal Layering**. It moves away from the starkness of standard SaaS by utilizing a warm, organic base and sophisticated typography. The emotional response should be one of "effortless organization"—making complex financial data feel approachable and prestigious. The style utilizes 1px hairlines and generous negative space to establish a rhythmic, document-like structure.

## Colors

The color strategy centers on a **Warm Ivory** canvas to reduce ocular strain and provide a premium, paper-like feel.

- **Primary (Ink):** A deep, near-black (#111111) used for all critical information, ensuring maximum legibility against the ivory base.
- **Secondary (Pencil):** A soft charcoal (#666666) for metadata, labels, and secondary actions.
- **Neutral (Surface):** The core background is #F7F7F2. 
- **Rule (Border):** A delicate gray (#D1D1CB) is used exclusively for 1px separators to define the layout without creating visual clutter.
- **Functional Accents:** Status colors are desaturated and "muddy" rather than neon, ensuring they don't break the sophisticated editorial palette.

## Typography

Typography is the cornerstone of this design system, using a mix of geometric warmth and utilitarian clarity.

- **Manrope (Primary):** Used for headlines, metrics, and labels. Its geometric nature provides a modern feel, while its open apertures keep it friendly and accessible.
- **Inter (Secondary):** Used for all body text, long-form reading, and interactive UI components. Inter provides the technical "workhorse" reliability needed for data-heavy views.
- **Hierarchy through Contrast:** Dramatic scale shifts (e.g., very large metrics paired with small labels) are encouraged to mimic modern editorial layouts. 
- **Numerical Data:** Always use tabular figures for financial numbers to ensure vertical alignment in tables.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy for desktop to maintain the "page-like" feel of a financial ledger.

- **Grid:** A 12-column grid on desktop (max-width 1200px) and a 4-column grid on mobile. 
- **Rhythm:** An 8px spacing system governs all internal and external padding.
- **Whitespace:** Prioritize "breathe room." Elements should be grouped logically with significant margins between distinct content sections to maintain the premium feel.
- **Alignment:** Everything must snap to the 1px rule lines. Text is strictly left-aligned (ragged right), while financial values are right-aligned to assist with scanning decimal points.

## Elevation & Depth

This system avoids soft, blurred shadows in favor of **Structural Partitioning**.

- **Tonal Layers:** Depth is created by placing containers (Level 1) with a 1px #D1D1CB border onto the #F7F7F2 background (Level 0).
- **No Floating Elements:** Elements do not "float" in space; they are anchored by lines or subtle background shifts.
- **Interaction Depth:** On hover, a button or card may use a **Hard Shadow** (e.g., 2px 2px 0px #111111) to indicate tactility, creating a subtle nod to neo-brutalism while remaining refined.
- **Backdrop:** Modals use a high-transparency #111111 overlay (10-20%) to dim the background without obscuring the editorial structure.

## Shapes

To balance the geometric precision of Manrope with a "friendly" feel, the system uses a **Soft** shape language.

- **Corner Radius:** A consistent 0.25rem (4px) radius is applied to buttons, cards, and input fields. This breaks the harshness of the 90-degree grid without veering into "bubbly" or overly casual territory.
- **Consistent Enclosures:** All interactive zones should maintain this radius, while structural dividers (lines) remain perfectly horizontal or vertical.

## Components

### Buttons
- **Primary:** Solid #111111 fill with #F7F7F2 text. 0.25rem rounded corners. High contrast.
- **Secondary:** 1px stroke of #111111, no fill. 
- **Ghost:** No stroke or fill, using `label-caps` typography style.

### Input Fields
- **Design:** 1px #D1D1CB border on all four sides. On focus, the border color changes to #111111. 
- **Labels:** Positioned strictly above the field using the `label-caps` style for a structured, form-like appearance.

### Cards & Modules
- **Structure:** 1px #D1D1CB border. Headers are separated from content by a 1px horizontal rule. 
- **Padding:** 32px internal padding is the standard to ensure data is never cramped.

### Data Tables
- **Aesthetic:** Minimalist. Use 1px horizontal rules only. No vertical dividers.
- **Typography:** Use `table-cell` (Inter) for data and `label-caps` (Manrope) for headers.
- **Hover:** Row highlight should be a subtle shift to a slightly darker ivory (#F0F0EB).

### Chips & Tags
- **Style:** Small, `label-caps` text inside a 1px #D1D1CB border. For status tags (e.g., "Paid"), use a very light, desaturated fill of the status color.