---
name: FreelanceLedger India
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
  tertiary-container: '#1b1c17'
  on-tertiary-container: '#84847e'
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
  tertiary-fixed: '#e4e3db'
  tertiary-fixed-dim: '#c7c7bf'
  on-tertiary-fixed: '#1b1c17'
  on-tertiary-fixed-variant: '#464742'
  background: '#fafaf5'
  on-background: '#1a1c19'
  surface-variant: '#e2e3de'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  data-metric:
    fontFamily: Geist
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
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  table-cell:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: '0'
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system embodies a "Swiss-Editorial" aesthetic—a fusion of rigorous functionalism and high-end publishing. It is tailored for the modern Indian freelancer who requires a professional financial operating system that feels both expensive and utilitarian. 

The style prioritizes clarity through a **Modern Minimalist SaaS** lens with **Subtle Neo-Brutalist** undertones. This is achieved through the use of hairline strokes (1px), a strict grid-based layout, and an absence of decorative flourishes. The emotional response is one of "calm authority"—reducing the anxiety associated with tax compliance and bookkeeping through structured, predictable, and beautiful information design.

## Colors
The palette is rooted in a warm, sophisticated "Ivory" base to prevent the digital fatigue common with pure white screens.

- **Surface (Background):** #F7F7F2 (Warm Ivory). Used for the primary canvas to evoke high-quality stationery.
- **Ink (Primary Text):** #111111 (Near-Black). Used for high-contrast headlines and primary data points.
- **Pencil (Secondary Text):** #666666 (Charcoal). Used for labels, descriptions, and metadata.
- **Rule (Borders):** #D1D1CB. A subtle gray used for 1px strokes that define the Swiss grid.
- **Accents:** Muted, desaturated tones are used sparingly for status indicators (e.g., desaturated greens for "Paid", soft ochre for "Pending") to maintain the monochrome editorial feel.

## Typography
Typography is the primary driver of hierarchy in this design system. We utilize **Geist** for its mathematical precision in headlines and numerical data, and **Inter** for its superior legibility in long-form text and UI controls.

- **Numerical Data:** Large, bold Geist figures are used for financial metrics (GST, Income, Deductions).
- **Hierarchy:** Use extreme contrast in scale. A very large `display-lg` headline should sit atop `body-md` text to create an editorial feel.
- **Labels:** Use uppercase `label-caps` for table headers and small captions to reinforce the structured, document-like quality.

## Layout & Spacing
The layout follows a strict **12-column Swiss Grid** for desktop and a **4-column grid** for mobile.

- **Rhythm:** An 8px linear scale governs all padding and margins. 
- **Whitespace:** Emphasize "active whitespace." Do not feel the need to fill the screen; allow content to breathe to maintain a sense of luxury and calm.
- **Data Tables:** Tables are the heart of the application. They should use a "Fixed Grid" approach with 1px horizontal dividers and no vertical dividers. Column widths should be explicit and aligned to the grid.
- **Alignment:** Every element must snap to the grid. Text should be left-aligned (ragged right) to preserve the editorial feel, with numbers right-aligned in tables for financial clarity.

## Elevation & Depth
This design system avoids traditional shadows in favor of **Tonal Layering** and **Structural Outlines**.

- **Flat Hierarchy:** Depth is communicated through 1px strokes (#D1D1CB). Surfaces do not "float" with shadows; they are partitioned by lines.
- **Surface Tiers:** 
  - Level 0: Primary background (#F7F7F2).
  - Level 1: Cards or containers with a slightly lighter/whiter background or a 1px border.
- **Interaction:** On hover, elements may take on a very subtle "paper-lift" effect using a sharp, low-spread shadow (e.g., 4px 4px 0px rgba(0,0,0,0.05)) to mimic neo-brutalist depth without the "mushiness" of modern SaaS blurs.

## Shapes
In alignment with the Swiss-Editorial style, this design system uses **Sharp (0px)** corners for almost all UI elements. 

The use of 90-degree angles reinforces the architectural, structural nature of the financial OS. Softness is introduced through the warm color palette and typography rather than rounded corners. The only exception to this rule is for specific small icons or currency symbols where a natural circular form is required.

## Components

### Buttons
- **Primary:** Solid #111111 background, #F7F7F2 text. Sharp corners. 
- **Secondary:** Transparent background, 1px #111111 border.
- **Tertiary:** Text-only with a 1px underline that appears on hover.

### Input Fields
- **Style:** Underline only or 1px stroke box. Focus state is indicated by a thicker 2px bottom border or a subtle fill change.
- **Labels:** Always use the `label-caps` style positioned above the input.

### Cards
- **Structure:** 1px border, no shadow. Card headers should be separated from the body by a 1px horizontal rule.
- **Spacing:** Generous internal padding (32px) to keep data feeling "premium."

### Data Visualization
- **Charts:** Monochrome (Black/Gray/Ivory). Use patterns (dots, diagonal lines) instead of multiple colors to differentiate datasets where possible.
- **Metrics:** Large bold numbers with the currency symbol (₹) in a lighter weight or smaller size to emphasize the value.

### Lists & Tables
- **Rows:** Minimum height 48px. 1px bottom border only.
- **States:** Hover state for rows should use a subtle tint shift (e.g., #F0F0EB).