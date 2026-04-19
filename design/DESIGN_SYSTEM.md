# Zustation Design System

> Version 1.0.0 · Last updated 2024

---

## Table of Contents

1. [Brand Overview](#brand-overview)
2. [Color Palette](#color-palette)
3. [Typography System](#typography-system)
4. [Spacing Scale](#spacing-scale)
5. [Component Guidelines](#component-guidelines)
6. [Geometric Design Patterns](#geometric-design-patterns)
7. [Icon System](#icon-system)
8. [Elevation & Shadow System](#elevation--shadow-system)
9. [Motion & Animation Guidelines](#motion--animation-guidelines)
10. [Accessibility Guidelines](#accessibility-guidelines)
11. [Usage Examples & Do/Don't](#usage-examples--dodont)

---

## Brand Overview

### Logo

The Zustation wordmark is anchored by a bold, geometric **"A"** logomark. The "A" is constructed from two sharp diagonal strokes that meet at an apex — with no crossbar — creating a dynamic, forward-leaning silhouette. The negative space inside the "A" forms an inverted triangle, reinforcing the brand's angular design language.

- **Shape language:** All acute angles, no rounded corners in the primary mark
- **Colour:** Rendered in Primary Red `#E63946` on light backgrounds; White `#FFFFFF` on dark/red backgrounds
- **Clear space:** Minimum 16px padding on all sides of the logomark
- **Minimum size:** 24×24px digital; 8mm print

### Brand Voice

| Attribute | Description |
|-----------|-------------|
| **Confident** | Direct, no filler words. Every word earns its place. |
| **Precise** | Technical accuracy without jargon overload. |
| **Energetic** | Active voice. Momentum in every sentence. |
| **Trustworthy** | Honest about capabilities; never over-promises. |

### Design Principles

1. **Geometric Clarity** — Sharp edges and angular geometry signal precision and speed.
2. **Red-Led Hierarchy** — Primary Red guides the user's eye to the most important action.
3. **Functional Minimalism** — Every element earns its place; ornamentation serves purpose.
4. **Accessible by Default** — Contrast, focus states, and touch targets are non-negotiable.

---

## Color Palette

### Primary Colors

| Token | Name | Hex | RGB | Usage |
|-------|------|-----|-----|-------|
| `--color-primary` | Primary Red | `#E63946` | `rgb(230, 57, 70)` | CTAs, active states, brand moments |
| `--color-primary-hover` | Primary Red Hover | `#CC2F3C` | `rgb(204, 47, 60)` | Hover state on primary actions |
| `--color-primary-pressed` | Primary Red Pressed | `#B52632` | `rgb(181, 38, 50)` | Active/pressed state |
| `--color-primary-subtle` | Primary Red Subtle | `#FDE8EA` | `rgb(253, 232, 234)` | Tinted backgrounds, alert backgrounds |
| `--color-primary-on` | On Primary | `#FFFFFF` | `rgb(255, 255, 255)` | Text/icons on primary red backgrounds |

### Secondary / Accent Colors

| Token | Name | Hex | RGB | Usage |
|-------|------|-----|-----|-------|
| `--color-accent` | Accent Burgundy | `#A4161A` | `rgb(164, 22, 26)` | Emphasis, decorative accents, depth |
| `--color-accent-hover` | Accent Burgundy Hover | `#8C1215` | `rgb(140, 18, 21)` | Hover on accent elements |
| `--color-accent-subtle` | Accent Subtle | `#F5D5D6` | `rgb(245, 213, 214)` | Light tinted backgrounds |

### Neutral Colors

| Token | Name | Hex | RGB | Usage |
|-------|------|-----|-----|-------|
| `--color-dark` | Dark | `#1A1A1A` | `rgb(26, 26, 26)` | Primary text, dark backgrounds |
| `--color-dark-80` | Dark 80% | `#343434` | `rgb(52, 52, 52)` | Secondary dark backgrounds |
| `--color-dark-60` | Dark 60% | `#4D4D4D` | `rgb(77, 77, 77)` | Muted dark surfaces |
| `--color-gray-700` | Gray 700 | `#616161` | `rgb(97, 97, 97)` | Secondary text |
| `--color-gray-500` | Gray 500 | `#9E9E9E` | `rgb(158, 158, 158)` | Placeholder text, disabled labels |
| `--color-gray-300` | Gray 300 | `#D4D4D4` | `rgb(212, 212, 212)` | Borders, dividers |
| `--color-gray-100` | Gray 100 | `#F0F0F0` | `rgb(240, 240, 240)` | Subtle backgrounds |
| `--color-light` | Light | `#F5F5F5` | `rgb(245, 245, 245)` | Page/app background |
| `--color-white` | White | `#FFFFFF` | `rgb(255, 255, 255)` | Card surfaces, input backgrounds |

### Semantic Colors

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--color-success` | Success Green | `#2D9E5B` | Positive states, confirmations |
| `--color-success-subtle` | Success Subtle | `#E6F6ED` | Success alert backgrounds |
| `--color-warning` | Warning Amber | `#D97706` | Caution states, degraded quality |
| `--color-warning-subtle` | Warning Subtle | `#FEF3C7` | Warning alert backgrounds |
| `--color-error` | Error Red | `#E63946` | Form errors, destructive feedback |
| `--color-error-subtle` | Error Subtle | `#FDE8EA` | Error alert backgrounds |
| `--color-info` | Info Blue | `#1D6FA4` | Informational states |
| `--color-info-subtle` | Info Subtle | `#DBEAFE` | Info alert backgrounds |

### Call State Colors

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--color-call-active` | Call Active | `#2D9E5B` | Active call indicator |
| `--color-call-ringing` | Call Ringing | `#D97706` | Incoming call pulse |
| `--color-call-ended` | Call Ended | `#E63946` | End call button |
| `--color-call-muted` | Muted | `#616161` | Muted microphone indicator |
| `--color-call-hold` | On Hold | `#1D6FA4` | Call on hold |

---

## Typography System

### Font Families

```css
--font-ui:      'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono:    'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

**Inter** is the primary typeface across all UI surfaces. Its geometric proportions and open apertures complement the angular brand identity while maintaining exceptional legibility at small sizes. Import via Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--text-xs` | 12px / 0.75rem | 1.5 (18px) | 400 | Captions, timestamps, legal |
| `--text-sm` | 14px / 0.875rem | 1.5 (21px) | 400 | Body small, helper text |
| `--text-base` | 16px / 1rem | 1.5 (24px) | 400 | Body default, input text |
| `--text-lg` | 18px / 1.125rem | 1.4 (25px) | 500 | Emphasized body, sub-headings |
| `--text-xl` | 20px / 1.25rem | 1.4 (28px) | 600 | Section headings, card titles |
| `--text-2xl` | 24px / 1.5rem | 1.3 (31px) | 600 | Page section headings |
| `--text-3xl` | 30px / 1.875rem | 1.2 (36px) | 700 | Large headings |
| `--text-4xl` | 36px / 2.25rem | 1.1 (40px) | 700 | Hero headings |
| `--text-5xl` | 48px / 3rem | 1.1 (53px) | 800 | Display / marketing headings |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-regular` | 400 | Body text, descriptions |
| `--font-medium` | 500 | Labels, navigation items |
| `--font-semibold` | 600 | Subheadings, button labels |
| `--font-bold` | 700 | Headings, emphasis |
| `--font-extrabold` | 800 | Display headings, hero text |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-tight` | -0.025em | Large display headings |
| `--tracking-normal` | 0em | Body text |
| `--tracking-wide` | 0.025em | Labels, tags |
| `--tracking-widest` | 0.1em | All-caps labels, badge text |

### Text Styles — Named Roles

| Role | Size | Weight | Tracking | Usage |
|------|------|--------|----------|-------|
| Display | 48px | 800 | -0.025em | Hero/splash screens |
| H1 | 36px | 700 | -0.025em | Page titles |
| H2 | 30px | 700 | 0 | Section headings |
| H3 | 24px | 600 | 0 | Card titles, modal headings |
| H4 | 20px | 600 | 0 | Sub-section headings |
| Body Large | 18px | 400 | 0 | Introductory paragraphs |
| Body | 16px | 400 | 0 | Default body text |
| Body Small | 14px | 400 | 0 | Supplemental content |
| Label | 14px | 500 | 0.025em | Form labels, nav items |
| Caption | 12px | 400 | 0.025em | Timestamps, metadata |
| Overline | 12px | 600 | 0.1em | Section markers (all-caps) |
| Code | 14px mono | 400 | 0 | Code snippets |

---

## Spacing Scale

The spacing system is built on an **8px base grid**. All spacing values are multiples of 4px (half-grid) at small sizes and 8px at larger sizes.

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--space-0` | 0 | 0px | Reset |
| `--space-1` | 0.25rem | 4px | Micro gaps (icon + label) |
| `--space-2` | 0.5rem | 8px | Compact element padding |
| `--space-3` | 0.75rem | 12px | Small internal padding |
| `--space-4` | 1rem | 16px | Default component padding |
| `--space-5` | 1.25rem | 20px | Comfortable padding |
| `--space-6` | 1.5rem | 24px | Section internal spacing |
| `--space-8` | 2rem | 32px | Between components |
| `--space-10` | 2.5rem | 40px | Section gaps |
| `--space-12` | 3rem | 48px | Large section gaps |
| `--space-16` | 4rem | 64px | Major layout divisions |
| `--space-24` | 6rem | 96px | Hero/display spacing |
| `--space-32` | 8rem | 128px | Maximum layout padding |

### Layout Grid

| Breakpoint | Name | Min Width | Columns | Gutter | Margin |
|------------|------|-----------|---------|--------|--------|
| `xs` | Mobile | 0px | 4 | 16px | 16px |
| `sm` | Mobile L | 480px | 4 | 16px | 24px |
| `md` | Tablet | 768px | 8 | 24px | 32px |
| `lg` | Desktop | 1024px | 12 | 24px | 48px |
| `xl` | Wide | 1280px | 12 | 32px | 64px |
| `2xl` | Ultra | 1536px | 12 | 32px | auto |

---

## Component Guidelines

### Buttons

Buttons are the primary affordance for user actions. The angular geometry of the brand is reflected through **sharp corners** (`border-radius: 4px`) on primary buttons, and slightly more relaxed corners (`border-radius: 6px`) on secondary variants.

#### Button Variants

**Primary Button**
- Background: `--color-primary` (`#E63946`)
- Text: White `#FFFFFF`, font-weight: 600, 14px
- Border: none
- Border-radius: 4px
- Padding: 10px 20px (height: 40px)
- Hover: Background `#CC2F3C`, transform: `translateY(-1px)`, shadow level 2
- Active/Pressed: Background `#B52632`, transform: `translateY(0)`
- Focus: 2px offset outline, color `#E63946`, outline-offset: 3px
- Disabled: Opacity 0.4, cursor not-allowed

```css
.btn-primary {
  background-color: var(--color-primary);
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 150ms ease, transform 100ms ease, box-shadow 150ms ease;
}
.btn-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 57, 70, 0.35);
}
.btn-primary:active { background-color: var(--color-primary-pressed); transform: translateY(0); }
.btn-primary:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 3px; }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
```

**Secondary Button**
- Background: Transparent
- Text: `--color-primary` (`#E63946`), font-weight: 600
- Border: 1.5px solid `#E63946`
- Border-radius: 4px
- Hover: Background `#FDE8EA`
- Focus: Same as primary

**Outlined Button (Neutral)**
- Background: Transparent
- Text: `--color-dark` (`#1A1A1A`), font-weight: 500
- Border: 1.5px solid `--color-gray-300`
- Border-radius: 6px
- Hover: Border `--color-gray-500`, background `--color-gray-100`

**Danger Button**
- Same as Primary but uses semantic destructive intent
- Background: `#E63946`; prefix icon always shown (trash or x)
- Confirmation dialog required for irreversible actions

**Ghost Button**
- Background: Transparent
- Text: `--color-gray-700`, font-weight: 500
- No border
- Hover: Background `--color-gray-100`, text `--color-dark`

#### Button Sizes

| Size | Height | Padding | Font Size | Border Radius |
|------|--------|---------|-----------|---------------|
| `sm` | 32px | 6px 14px | 12px | 4px |
| `md` (default) | 40px | 10px 20px | 14px | 4px |
| `lg` | 48px | 13px 28px | 16px | 4px |
| `xl` | 56px | 16px 32px | 16px | 4px |

#### Icon Buttons

Circular or square (border-radius: 4px) buttons containing only an icon. Minimum touch target: **44×44px**.

---

### Inputs

**Default State**
- Background: `#FFFFFF`
- Border: 1.5px solid `--color-gray-300`
- Border-radius: 6px
- Padding: 10px 14px
- Height: 44px
- Font: 16px Inter Regular
- Placeholder text: `--color-gray-500`

**Focus State**
- Border: 1.5px solid `--color-primary` (`#E63946`)
- Box-shadow: `0 0 0 3px rgba(230, 57, 70, 0.15)`
- No outline (replaced by box-shadow for aesthetic consistency)

**Error State**
- Border: 1.5px solid `--color-error` (`#E63946`)
- Box-shadow: `0 0 0 3px rgba(230, 57, 70, 0.1)`
- Helper text below: 12px, `--color-error`, with error icon

**Disabled State**
- Background: `--color-gray-100`
- Border: 1.5px solid `--color-gray-300`
- Text: `--color-gray-500`
- Cursor: not-allowed; opacity: 0.7

**Success State**
- Border: 1.5px solid `--color-success`
- Checkmark icon on right side

**Input with Icon**
- Padding-left: 40px (icon positioned absolutely, left: 12px, centered vertically)
- Icon size: 20px, color: `--color-gray-500` (turns `--color-primary` on focus)

**Textarea**
- Same styles as input
- Min-height: 96px; resize: vertical
- Line-height: 1.5

**Select**
- Same as input + custom chevron icon (SVG, `--color-gray-500`)
- `appearance: none` to hide native UI

---

### Cards

Cards are the primary surface for grouping related content.

**Base Card**
- Background: `#FFFFFF`
- Border-radius: 8px
- Border: 1px solid `--color-gray-300`
- Padding: 24px
- Shadow: Level 1 (see Elevation)

**Interactive Card** (hover/clickable)
- Hover: Shadow level 2, transform `translateY(-2px)`
- Transition: 200ms ease-out

**Accent Card** (brand moment)
- Left border: 4px solid `--color-primary`
- Used for featured items, announcements

**Dark Card**
- Background: `--color-dark`
- Text: `#FFFFFF`
- Used in video call overlays, dark-mode panels

**Call Card** (active call display)
- Background: `--color-dark`
- Accent bar: `--color-primary` on top or left edge
- Avatar: 56px circle
- Status badge: Absolutely positioned, bottom-right of avatar

---

### Badges

Small visual indicators for status, count, or category.

| Variant | Background | Text Color | Usage |
|---------|------------|------------|-------|
| Default | `--color-gray-100` | `--color-gray-700` | Generic tags |
| Primary | `--color-primary-subtle` | `--color-primary` | Brand highlight |
| Success | `--color-success-subtle` | `--color-success` | Online, active |
| Warning | `--color-warning-subtle` | `--color-warning` | Away, degraded |
| Error | `--color-error-subtle` | `--color-error` | Error, offline |
| Dark | `--color-dark` | `#FFFFFF` | Count indicators |

**Badge Specs**
- Height: 20px (small) / 24px (default)
- Padding: 2px 8px
- Border-radius: 4px (square) or 10px (pill)
- Font: 12px, font-weight: 600, tracking: 0.025em

**Notification Dot**
- 8px diameter circle
- Position: absolute, top-right of parent
- Color: `--color-primary`

---

### Modals

**Overlay**
- Background: `rgba(26, 26, 26, 0.7)`
- Backdrop-filter: `blur(4px)`
- z-index: 1000

**Modal Container**
- Background: `#FFFFFF`
- Border-radius: 12px
- Max-width: 480px (default), 640px (large), 320px (compact)
- Padding: 32px
- Shadow: Level 4
- Animation: Fade in + scale from 0.95 to 1.0, 200ms ease-out

**Modal Header**
- H3 heading (24px, weight 600)
- Optional subtitle: Body Small, `--color-gray-700`
- Close button: Top-right, 32px ghost icon button

**Modal Footer**
- Divider line above
- Actions right-aligned: Cancel (outlined) + Confirm (primary or danger)
- Stack to full-width on mobile

**Confirmation Modal**
- Compact: 320–400px wide
- Icon centered: 48px, `--color-error` for destructive actions
- Single body sentence, two action buttons

---

### Dropdowns

**Trigger**
- Appears as outlined button with chevron icon
- Active state: Border `--color-primary`, background `--color-primary-subtle`

**Menu Container**
- Background: `#FFFFFF`
- Border: 1px solid `--color-gray-300`
- Border-radius: 8px
- Shadow: Level 3
- Min-width: 180px; max-width: 280px
- Padding: 6px 0 (vertical list)
- Z-index: 200
- Animation: Fade in + slide down 4px, 150ms ease-out

**Menu Item**
- Height: 40px; Padding: 10px 16px
- Font: 14px, weight 400
- Hover: Background `--color-gray-100`
- Active: Background `--color-primary-subtle`, text `--color-primary`
- Destructive item: Text `--color-error`; hover background `--color-error-subtle`
- Divider: 1px `--color-gray-100`, margin: 4px 0

**Dropdown with Icon**
- Icon: 16px, `--color-gray-500`, margin-right: 10px
- Align center vertically with label

---

### Toggles

**Base Toggle (Switch)**
- Track width: 44px; height: 24px; border-radius: 12px
- Thumb: 20px circle, white, shadow level 1
- Thumb margin: 2px (offset from track edge)
- Off state: Track `--color-gray-300`
- On state: Track `--color-primary` (`#E63946`)
- Transition: 200ms cubic-bezier(0.4, 0, 0.2, 1)
- Thumb translation on: `translateX(20px)`

**Focus state:** Box-shadow `0 0 0 3px rgba(230, 57, 70, 0.2)` on track

**Disabled:** Opacity 0.5; cursor not-allowed

**Small Toggle**
- Track: 36px × 20px; Thumb: 16px; Translation: `translateX(16px)`

---

## Geometric Design Patterns

Zustation's visual identity is anchored in the angular geometry of the "A" logomark. These patterns are used as decorative accents, backgrounds, and structural layout elements.

### Core Shape Language

- **Acute angles:** 30°–60° diagonal cuts dominate the brand
- **No circles** in structural layout elements (only in avatars/icons/UI controls)
- **Parallelogram accent:** `clip-path: polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)` — used for highlighted sections
- **Chevron / Arrow motif:** `clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)` — used for progress steps

### Clip-Path Classes (Applied via CSS)

```css
/* Diagonal top-right cut — primary hero section shape */
.clip-diagonal-tr {
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 48px), 0 100%);
}

/* Diagonal bottom-right cut */
.clip-diagonal-br {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 48px));
}

/* "A" apex shape — decorative background element */
.clip-apex {
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}

/* Parallelogram — section accent, breadcrumb chips */
.clip-parallelogram {
  clip-path: polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%);
}

/* Chevron step indicator */
.clip-chevron {
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%);
}

/* Arrow right — for directional CTAs */
.clip-arrow-right {
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%);
}
```

### Diagonal Stripe Patterns

Used as subtle background textures on hero sections and feature cards.

```css
/* Fine diagonal stripes — primary red on dark */
.pattern-stripes-dark {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 8px,
    rgba(230, 57, 70, 0.12) 8px,
    rgba(230, 57, 70, 0.12) 9px
  );
}

/* Coarse diagonal stripes — light on light-gray */
.pattern-stripes-light {
  background-image: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 16px,
    rgba(26, 26, 26, 0.04) 16px,
    rgba(26, 26, 26, 0.04) 17px
  );
}
```

### Angled Section Dividers

Use the `::after` pseudo-element on section containers to create angled transitions between sections:

```css
.section-angled::after {
  content: '';
  display: block;
  position: absolute;
  bottom: -48px;
  left: 0;
  right: 0;
  height: 48px;
  background: inherit;
  clip-path: polygon(0 0, 100% 0, 0 100%);
  z-index: 1;
}
```

### Geometric Accent Bar

A diagonal accent bar used beside headings and featured content:

```css
.accent-bar {
  position: relative;
  padding-left: 20px;
}
.accent-bar::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--color-primary);
  clip-path: polygon(0 0, 100% 8px, 100% 100%, 0 calc(100% - 8px));
}
```

---

## Icon System

### Overview

All Zustation icons are **stroke-based** SVG symbols. They are not filled — the stroke weight defines the visual presence. Icons are sourced from the project's `/design/assets/icons.svg` SVG sprite.

### Sizes

| Size Token | Pixel Value | Usage |
|------------|-------------|-------|
| `icon-xs` | 12px | Inline decorators, badge indicators |
| `icon-sm` | 16px | Compact UI, table actions, list items |
| `icon-md` | 20px | Navigation, form input adornments |
| `icon-lg` | 24px | Primary action buttons, headings |
| `icon-xl` | 32px | Feature highlights, empty states |
| `icon-2xl` | 48px | Illustrations, modal icons |

### Stroke Weights

| Context | Stroke Width |
|---------|-------------|
| 16px icons | 2px |
| 20px icons | 2px |
| 24px icons | 1.5px–2px |
| 32px+ icons | 1.5px |

### Colors

Icons inherit color from `currentColor`, allowing CSS to control them:

```css
.icon { width: 24px; height: 24px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.icon-muted { color: var(--color-gray-500); }
.icon-primary { color: var(--color-primary); }
.icon-on-dark { color: #ffffff; }
```

### Usage — SVG Sprite

```html
<svg class="icon icon-lg" aria-hidden="true">
  <use href="/design/assets/icons.svg#phone"></use>
</svg>
```

For accessible icons that convey meaning, add a visually hidden label:

```html
<button class="btn-icon" aria-label="Start phone call">
  <svg class="icon icon-lg" aria-hidden="true">
    <use href="/design/assets/icons.svg#phone"></use>
  </svg>
</button>
```

### Available Icons

`phone`, `phone-off`, `mic`, `mic-off`, `video`, `video-off`, `message`, `user`, `users`, `settings`, `search`, `bell`, `home`, `logout`, `edit`, `trash`, `plus`, `check`, `x`, `arrow-left`, `arrow-right`, `send`, `paperclip`, `smile`

---

## Elevation & Shadow System

Elevation communicates hierarchy — raised surfaces sit above background content. Zustation uses a 4-level system with shadows tinted toward the brand's dark base.

| Level | Token | CSS Value | Usage |
|-------|-------|-----------|-------|
| 0 | `--shadow-none` | `none` | Flat surfaces, backgrounds |
| 1 | `--shadow-sm` | `0 1px 3px rgba(26,26,26,0.08), 0 1px 2px rgba(26,26,26,0.06)` | Cards at rest, inputs |
| 2 | `--shadow-md` | `0 4px 12px rgba(26,26,26,0.10), 0 2px 4px rgba(26,26,26,0.06)` | Hovered cards, popovers |
| 3 | `--shadow-lg` | `0 10px 24px rgba(26,26,26,0.12), 0 4px 8px rgba(26,26,26,0.08)` | Dropdowns, floating panels |
| 4 | `--shadow-xl` | `0 20px 48px rgba(26,26,26,0.16), 0 8px 16px rgba(26,26,26,0.10)` | Modals, dialogs |

**Brand Shadow (Red Glow)**
Used sparingly on primary action buttons and call-to-action elements:

```css
--shadow-brand: 0 4px 16px rgba(230, 57, 70, 0.35), 0 2px 6px rgba(230, 57, 70, 0.20);
```

---

## Motion & Animation Guidelines

### Principles

1. **Purposeful** — Motion communicates state change, not decoration
2. **Responsive** — UI should feel immediate; keep durations short
3. **Directional** — Elements move in a direction that reflects their conceptual relationship (menus slide down, dialogs scale up from center)

### Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 75ms | Hover fills, color swaps |
| `--duration-fast` | 150ms | Dropdown open, tooltip show |
| `--duration-normal` | 200ms | Modal open, slide transitions |
| `--duration-slow` | 300ms | Page transitions, accordions |
| `--duration-slower` | 500ms | Skeleton loading, emphasis |

### Easing Functions

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Most transitions |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving screen |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering screen |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful pop interactions |

### Standard Transitions

```css
/* Property transitions — apply to interactive elements */
.transition-colors  { transition: color var(--duration-instant) var(--ease-default), background-color var(--duration-instant) var(--ease-default), border-color var(--duration-instant) var(--ease-default); }
.transition-shadow  { transition: box-shadow var(--duration-fast) var(--ease-default); }
.transition-transform { transition: transform var(--duration-fast) var(--ease-default); }
.transition-all     { transition: all var(--duration-fast) var(--ease-default); }
```

### Animation Patterns

**Fade In**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Slide Down (Dropdown open)**
```css
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Scale In (Modal open)**
```css
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

**Pulse (Incoming call ringing)**
```css
@keyframes callPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(217, 119, 6, 0.6); }
  50% { box-shadow: 0 0 0 16px rgba(217, 119, 6, 0); }
}
```

**Ring (Bell notification)**
```css
@keyframes bellRing {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(18deg); }
  40% { transform: rotate(-14deg); }
  60% { transform: rotate(10deg); }
  80% { transform: rotate(-6deg); }
}
```

### Reduced Motion

Always respect `prefers-reduced-motion`. Wrap decorative animations:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility Guidelines

Zustation aims for **WCAG 2.1 AA** compliance across all UI components.

### Color Contrast

| Pair | Ratio | Grade |
|------|-------|-------|
| Primary Red `#E63946` on White `#FFFFFF` | 4.56:1 | ✅ AA (large text) |
| White `#FFFFFF` on Primary Red `#E63946` | 4.56:1 | ✅ AA |
| Dark `#1A1A1A` on White `#FFFFFF` | 16.1:1 | ✅ AAA |
| Gray 700 `#616161` on White `#FFFFFF` | 5.9:1 | ✅ AA |
| White `#FFFFFF` on Dark `#1A1A1A` | 16.1:1 | ✅ AAA |
| Primary Red `#E63946` on Light `#F5F5F5` | 4.4:1 | ✅ AA (large text) |
| Dark `#1A1A1A` on Light `#F5F5F5` | 15.3:1 | ✅ AAA |

> **Note:** Do not place Primary Red text on white at sizes below 18px bold / 24px regular without verifying contrast.

### Focus Management

- All interactive elements must have a visible focus indicator
- Focus ring: `outline: 2px solid #E63946; outline-offset: 3px;`
- Never use `outline: none` without providing an accessible replacement
- Modals trap focus within while open; restore focus to trigger on close
- Skip-to-content link at top of every page

### Touch Targets

- Minimum touch target: **44×44px** (WCAG 2.5.5)
- Small visual elements (badges, icons) must have larger invisible hit areas via padding or pseudo-elements

### Screen Readers

- Use semantic HTML: `<button>`, `<input>`, `<nav>`, `<main>`, `<dialog>`
- Icon-only buttons require `aria-label`
- Decorative SVGs: `aria-hidden="true"`
- Form inputs: `<label>` elements associated via `for`/`id`; never use placeholder as sole label
- Status badges: `role="status"` for dynamic content updates
- Loading states: `aria-live="polite"` for async updates

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move to next focusable element |
| `Shift+Tab` | Move to previous focusable element |
| `Enter` / `Space` | Activate button or control |
| `Escape` | Close modal, dropdown, or popover |
| `Arrow keys` | Navigate within menu, radio group, or slider |
| `Home` / `End` | Jump to first/last item in a list |

### ARIA Patterns

```html
<!-- Modal -->
<dialog role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Confirm Action</h2>
</dialog>

<!-- Dropdown menu -->
<button aria-haspopup="true" aria-expanded="false" aria-controls="dropdown-menu">Options</button>
<ul role="menu" id="dropdown-menu">
  <li role="menuitem">Edit</li>
</ul>

<!-- Toggle -->
<button role="switch" aria-checked="false" aria-label="Enable notifications">...</button>

<!-- Loading state -->
<div aria-live="polite" aria-atomic="true">
  <span class="sr-only">Loading contacts...</span>
</div>
```

---

## Usage Examples & Do/Don't

### Colors

✅ **Do:** Use Primary Red for the single most important action per screen.  
❌ **Don't:** Use Primary Red for decorative backgrounds or more than one CTA in a button group.

✅ **Do:** Pair dark text `#1A1A1A` on `#F5F5F5` backgrounds for body text.  
❌ **Don't:** Use Gray 500 `#9E9E9E` for body text — it fails AA contrast on white.

✅ **Do:** Reserve Accent Burgundy `#A4161A` for depth effects and decorative accents.  
❌ **Don't:** Use both Primary Red and Accent Burgundy as adjacent CTAs — they are too similar.

### Typography

✅ **Do:** Limit each screen to 2 heading levels maximum in the visible viewport.  
❌ **Don't:** Use font-weight 400 for buttons — always use 500 or 600 minimum.

✅ **Do:** Use all-caps sparingly (Overline style only) with tracked-out letter-spacing.  
❌ **Don't:** Set body paragraphs in all-caps — degraded readability.

### Spacing

✅ **Do:** Use 8px-grid multiples for all layout spacing.  
❌ **Don't:** Use arbitrary values like 7px, 13px, or 22px.

✅ **Do:** Provide at least 24px between distinct content sections.  
❌ **Don't:** Collapse section gaps below 16px — content becomes visually merged.

### Buttons

✅ **Do:** Show one Primary button per card or form.  
❌ **Don't:** Stack two Primary buttons side by side.

✅ **Do:** Label buttons with verb + noun: "Start Call", "Delete Contact", "Save Changes".  
❌ **Don't:** Use vague labels: "OK", "Submit", "Click Here".

### Geometric Patterns

✅ **Do:** Use clip-path diagonal cuts to transition between hero sections and content.  
❌ **Don't:** Apply multiple diagonal clips to adjacent stacked elements — the angles fight each other.

✅ **Do:** Use the stripe pattern as a subtle texture at low opacity (< 15%).  
❌ **Don't:** Use stripe patterns on text-heavy surfaces — they create visual noise.

### Accessibility

✅ **Do:** Test every interactive component using keyboard-only navigation.  
❌ **Don't:** Remove focus outlines in production CSS.

✅ **Do:** Provide `aria-label` for all icon-only buttons.  
❌ **Don't:** Use color as the only means of conveying information (e.g., red = error).

---

*Zustation Design System · Maintained by the Product Design Team*
