---
name: Obsidian Performance
colors:
  surface: '#12131a'
  surface-dim: '#12131a'
  surface-bright: '#383940'
  surface-container-lowest: '#0c0e14'
  surface-container-low: '#1a1b22'
  surface-container: '#1e1f26'
  surface-container-high: '#282a31'
  surface-container-highest: '#33343c'
  on-surface: '#e2e1eb'
  on-surface-variant: '#e0c0b1'
  inverse-surface: '#e2e1eb'
  inverse-on-surface: '#2f3037'
  outline: '#a78b7d'
  outline-variant: '#584237'
  surface-tint: '#ffb690'
  primary: '#ffb690'
  on-primary: '#552100'
  primary-container: '#f97316'
  on-primary-container: '#582200'
  inverse-primary: '#9d4300'
  secondary: '#c8c5cd'
  on-secondary: '#303036'
  secondary-container: '#49484e'
  on-secondary-container: '#bab7be'
  tertiary: '#c8c5ca'
  on-tertiary: '#303033'
  tertiary-container: '#9c9a9e'
  on-tertiary-container: '#323235'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#e4e1e9'
  secondary-fixed-dim: '#c8c5cd'
  on-secondary-fixed: '#1b1b20'
  on-secondary-fixed-variant: '#47464c'
  tertiary-fixed: '#e4e1e6'
  tertiary-fixed-dim: '#c8c5ca'
  on-tertiary-fixed: '#1b1b1e'
  on-tertiary-fixed-variant: '#47464a'
  background: '#12131a'
  on-background: '#e2e1eb'
  surface-variant: '#33343c'
  success-neon: '#4ade80'
  error-ruby: '#f87171'
  warning-gold: '#fbbf24'
  info-blue: '#60a5fa'
  surface-border: '#27272a'
typography:
  display-hero:
    fontFamily: Bebas Neue
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.02em
  display-lg:
    fontFamily: Bebas Neue
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.02em
  display-lg-mobile:
    fontFamily: Bebas Neue
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: 0.02em
  heading-2:
    fontFamily: Bebas Neue
    fontSize: 30px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  action-text:
    fontFamily: Bebas Neue
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  page-margin: 2rem
  card-gap: 1.5rem
  section-stack: 3rem
  container-padding: 1.25rem
  input-py: 0.75rem
  input-px: 1rem
---

## Brand & Style

The design system is engineered for a "pro-athlete" experience, prioritizing high-energy aesthetics with a premium, focused atmosphere. It targets elite fitness environments where performance and data are paramount. 

The visual style is **High-Contrast / Modern**, characterized by an ultra-dark "Obsidian" base and "Electric Orange" highlights. It utilizes subtle **Glassmorphism** for data overlays and **Tactile** accents through localized orange glows. The interface should feel aggressive yet disciplined—avoiding unnecessary clutter to focus on metrics and movement.

Key characteristics:
- **Atmospheric Depth:** Relying on dark surface layering and translucency rather than traditional elevation.
- **Aggressive Impact:** Using bold, condensed typography to demand attention for key metrics.
- **Precision:** Thin borders and sharp iconography convey professional-grade utility.

## Colors

The palette is optimized for low-light environments (gym floors and training pits). 

- **Primary (Electric Orange):** Used exclusively for high-priority actions, active navigation states, and critical performance highlights.
- **Background (Obsidian):** The foundation of the UI. A near-black zinc ensures deep contrast and reduces eye strain.
- **Surfaces (Zinc-900):** Used for cards and containers to create a distinct hierarchy against the background.
- **Functional Accents:** Success, Error, and Warning colors are highly saturated to ensure they remain legible against dark backgrounds.

**Interactive States:**
- Active elements should utilize an orange outer glow (`drop-shadow`) to simulate a "powered-on" hardware feel.
- Borders use a consistent Zinc-800 (`#27272a`) to define structure without breaking the dark aesthetic.

## Typography

This system employs a dual-font strategy to balance aggressive branding with functional utility.

- **Bebas Neue:** The voice of the brand. Used for all headings, massive stat numbers, and primary button labels. Its condensed nature allows for high-impact messaging even in constrained spaces.
- **Inter:** The functional workhorse. Used for all body text, input fields, and metadata. 

**Formatting Rules:**
- **Labels:** Always use `label-caps` for section headers and form labels to create a clear "system" look.
- **Stats:** Large numbers in dashboard cards should use `display-lg` to prioritize glanceability.
- **Tracking:** Headings and labels require increased letter spacing (tracking-wider/widest) to maintain legibility against the dark, high-contrast background.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid** model. Navigation is anchored to a fixed sidebar (256px), while the content area stretches to fill the viewport using a 12-column grid.

**Breakpoints & Reflow:**
- **Desktop (1280px+):** Full sidebar visible; 32px page margins; 24px gutters.
- **Tablet (768px - 1024px):** Sidebar collapses to icons only; 24px page margins; 16px gutters.
- **Mobile (Below 768px):** Navigation moves to a bottom bar or "hamburger" overlay; 16px page margins; content stacks vertically.

**Rhythm:**
A strict 4px/8px grid maintains vertical rhythm. Standard cards use 24px internal padding (`p-6`) to ensure performance data has room to breathe.

## Elevation & Depth

Depth is communicated through **Tonal Layers** and **Subtle Blurs** rather than traditional elevation shadows.

1.  **Floor (Level 0):** `#0a0a0f` (Deep Zinc). The base of the application.
2.  **Surfaces (Level 1):** `#18181b` (Zinc-900). For cards, panels, and sidebars.
3.  **Overlays (Level 2):** Backdrop blurs (`blur-sm` or `blur-md`) with 80% opacity black backgrounds for modals and flyouts.

**Glow Effects:**
To signify importance or active states, use a localized 10px-20px blur of the Primary Orange (`#f97316`) at 20-30% opacity. This creates a "backlit" effect that feels modern and high-tech. Use thin `1px` borders in `Zinc-800` to separate all adjacent Level 1 surfaces.

## Shapes

The shape language is bold and modern, utilizing significant rounding to contrast the "hard" condensed typography.

- **Primary Containers:** Cards and major panels use `rounded-2xl` (1.5rem).
- **Interactive Elements:** Buttons and inputs use `rounded-xl` (1rem).
- **Status Indicators:** Badges and user avatars are always `rounded-full` (pill/circle).

This juxtaposition—sharp, narrow text inside soft, rounded containers—creates the distinctive "premium tech" look required for the brand.

## Components

**Buttons:**
- **Primary:** Background `#f97316`, Text `#ffffff` (Bebas Neue), `rounded-xl`. Include a subtle orange drop-shadow on hover.
- **Secondary:** Transparent background, `1px` border `Zinc-800`, hover background `Zinc-800`.

**Input Fields:**
- Background `#18181b`, Border `Zinc-800`, Text `White`.
- **Focus State:** Border becomes `#f97316` (50% opacity) with a subtle inner glow.

**Cards:**
- Background `#18181b`, `rounded-2xl`, border `1px solid #27272a`.
- **Stat Cards:** Feature a large `Bebas Neue` number and a small `Inter` label with `tracking-widest`.

**Status Badges:**
- Utilize `bg-color/20` for the background and `text-color` for the label.
- Example: Success badge is `bg-green-400/20` with `text-green-400`.

**Iconography:**
- Use **Lucide** icons with a `1.5px` or `2px` stroke weight. Icons should be monochrome (Zinc-400) unless active, where they switch to Electric Orange.