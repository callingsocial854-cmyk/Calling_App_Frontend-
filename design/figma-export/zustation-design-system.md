# Zustation Design System — Figma Export & Handoff Guide

> Version 1.0.0 · Zustation Calling App Redesign

---

## Table of Contents

1. [Overview](#overview)
2. [Importing into Figma](#importing-into-figma)
3. [Component Naming Conventions](#component-naming-conventions)
4. [Design Token Structure](#design-token-structure)
5. [HTML Mockups → Figma Component Mapping](#html-mockups--figma-component-mapping)
6. [Design Team Handoff Instructions](#design-team-handoff-instructions)
7. [Link References & Resources](#link-references--resources)

---

## Overview

This document describes how the Zustation design system — defined in code via CSS custom properties, JSON design tokens, and HTML mockups — maps to Figma components and styles. It is intended to keep design and development perfectly in sync so that changes to either the Figma file or the codebase can be reflected in the other without ambiguity.

The Figma file mirrors the structure of this repository:

```
Figma File: "Zustation Design System v1"
├── 🎨 Foundations
│   ├── Color Styles
│   ├── Typography Styles
│   ├── Shadow / Effect Styles
│   └── Grid Styles
├── 🧩 Components
│   ├── Buttons
│   ├── Inputs
│   ├── Cards
│   ├── Badges
│   ├── Modals
│   ├── Dropdowns
│   └── Toggles
├── 🔷 Patterns
│   ├── Geometric Shapes
│   ├── Section Dividers
│   └── Backgrounds
├── 🖼 Icons
│   └── Icon Sprite (all symbols)
└── 📱 Screens
    ├── Mobile Flows
    └── Desktop Flows
```

---

## Importing into Figma

### Method 1: Design Tokens Plugin (Recommended)

Use the **Tokens Studio for Figma** plugin (formerly Figma Tokens) to import design tokens directly from `design/assets/colors.json`.

**Steps:**
1. Install [Tokens Studio for Figma](https://www.figma.com/community/plugin/843461159747178978) from the Figma Community.
2. Open the Tokens Studio panel (Plugins → Tokens Studio for Figma).
3. Click **"Sync"** → **"Add new source"** → choose **"Local JSON file"**.
4. Upload `/design/assets/colors.json` from this repository.
5. The plugin will create Color Styles matching each token in the JSON.
6. Run **"Apply tokens"** to push them into the document as Figma Color Styles.

After import, Figma Color Styles will be named using dot notation:
- `primary/primary` → `#E63946`
- `primary/primaryHover` → `#CC2F3C`
- `neutral/dark` → `#1A1A1A`
- `semantic/success` → `#2D9E5B`
- etc.

### Method 2: Manual Color Style Creation

If the plugin approach is not available, create Figma Color Styles manually:

1. Open the **Assets panel** → **Styles** → click **"+"** next to Color.
2. Name each style using the naming convention below.
3. Set the hex value from `design/assets/colors.json`.

Recommended Figma Color Style names:

```
Brand/Primary Red           #E63946
Brand/Primary Hover         #CC2F3C
Brand/Primary Pressed       #B52632
Brand/Primary Subtle        #FDE8EA
Brand/Accent Burgundy       #A4161A
Brand/Accent Hover          #8C1215
Neutral/Dark                #1A1A1A
Neutral/Dark 80             #343434
Neutral/Dark 60             #4D4D4D
Neutral/Gray 700            #616161
Neutral/Gray 500            #9E9E9E
Neutral/Gray 300            #D4D4D4
Neutral/Gray 100            #F0F0F0
Neutral/Light               #F5F5F5
Neutral/White               #FFFFFF
Semantic/Success            #2D9E5B
Semantic/Success Subtle     #E6F6ED
Semantic/Warning            #D97706
Semantic/Warning Subtle     #FEF3C7
Semantic/Error              #E63946
Semantic/Error Subtle       #FDE8EA
Semantic/Info               #1D6FA4
Semantic/Info Subtle        #DBEAFE
Call/Active                 #2D9E5B
Call/Ringing                #D97706
Call/Ended                  #E63946
Call/Muted                  #616161
Call/Hold                   #1D6FA4
```

### Method 3: SVG Icon Import

1. Open `/design/assets/icons.svg` in a text editor.
2. Copy each `<symbol>` block's inner SVG paths.
3. Paste into Figma as a new frame, name it after the `id` attribute.
4. Ungroup and apply **"Outline Stroke"** if needed.
5. Store each icon as a Figma Component in the **Icons** page.

Alternatively, import the entire sprite file (Figma supports direct SVG import):
- **File** → **Place Image / SVG** → select `icons.svg`
- Figma will import all visible elements. Because the sprite uses `display:none` on the root `<svg>`, import individual symbol contents by copy-pasting from the SVG source.

---

## Component Naming Conventions

All Figma components follow the **BEM-inspired naming** pattern used in the CSS codebase:

```
[Component]/[Variant]/[State]
```

### Examples

| Figma Component Name | CSS Equivalent | Notes |
|----------------------|----------------|-------|
| `Button/Primary/Default` | `.btn-primary` | Base state |
| `Button/Primary/Hover` | `.btn-primary:hover` | Hover simulation |
| `Button/Primary/Disabled` | `.btn-primary:disabled` | Disabled state |
| `Button/Secondary/Default` | `.btn-secondary` | |
| `Button/Outlined/Default` | `.btn-outlined` | |
| `Button/Danger/Default` | `.btn-danger` | |
| `Button/Ghost/Default` | `.btn-ghost` | |
| `Input/Default` | `input` (default) | |
| `Input/Focus` | `input:focus` | |
| `Input/Error` | `.input-error` | |
| `Input/Disabled` | `input:disabled` | |
| `Card/Base` | `.card` | |
| `Card/Interactive` | `.card-interactive` | |
| `Card/Accent` | `.card-accent` | |
| `Card/Dark` | `.card-dark` | |
| `Badge/Default` | `.badge` | |
| `Badge/Primary` | `.badge-primary` | |
| `Badge/Success` | `.badge-success` | |
| `Badge/Warning` | `.badge-warning` | |
| `Badge/Error` | `.badge-error` | |
| `Modal/Default` | `.modal` | |
| `Modal/Confirmation` | `.modal-confirm` | |
| `Dropdown/Menu` | `.dropdown-menu` | |
| `Toggle/On` | `.toggle[aria-checked="true"]` | |
| `Toggle/Off` | `.toggle[aria-checked="false"]` | |
| `Icon/[name]/sm` | `.icon.icon-sm` (16px) | |
| `Icon/[name]/md` | `.icon.icon-md` (20px) | |
| `Icon/[name]/lg` | `.icon.icon-lg` (24px) | |

### Naming Rules

1. **PascalCase** for component names; **lowercase** for variants and states.
2. Use `/` as the hierarchy separator in Figma (creates nested component groups).
3. State names must match CSS pseudo-class names where applicable: `default`, `hover`, `focus`, `active`, `disabled`, `error`, `success`.
4. Icon names must exactly match the `id` attribute in `icons.svg`.

---

## Design Token Structure

Design tokens are the shared vocabulary between Figma and the codebase. The token hierarchy below maps the JSON structure in `design/assets/colors.json` to Figma Style groups and CSS custom properties.

### Token Hierarchy

```
Token Group         JSON Path                    CSS Custom Property         Figma Style Group
──────────────────────────────────────────────────────────────────────────────────────────────
Primary             primary.primary              --color-primary             Brand/
Primary Hover       primary.primaryHover         --color-primary-hover       Brand/
Primary Pressed     primary.primaryPressed       --color-primary-pressed     Brand/
Primary Subtle      primary.primarySubtle        --color-primary-subtle      Brand/
On Primary          primary.onPrimary            --color-primary-on          Brand/

Accent              accent.accent                --color-accent              Brand/
Accent Hover        accent.accentHover           --color-accent-hover        Brand/
Accent Subtle       accent.accentSubtle          --color-accent-subtle       Brand/

Dark                neutral.dark                 --color-dark                Neutral/
Dark 80             neutral.dark80               --color-dark-80             Neutral/
Dark 60             neutral.dark60               --color-dark-60             Neutral/
Gray 700            neutral.gray700              --color-gray-700            Neutral/
Gray 500            neutral.gray500              --color-gray-500            Neutral/
Gray 300            neutral.gray300              --color-gray-300            Neutral/
Gray 100            neutral.gray100              --color-gray-100            Neutral/
Light               neutral.light                --color-light               Neutral/
White               neutral.white                --color-white               Neutral/

Success             semantic.success             --color-success             Semantic/
Success Subtle      semantic.successSubtle       --color-success-subtle      Semantic/
Warning             semantic.warning             --color-warning             Semantic/
Warning Subtle      semantic.warningSubtle       --color-warning-subtle      Semantic/
Error               semantic.error               --color-error               Semantic/
Error Subtle        semantic.errorSubtle         --color-error-subtle        Semantic/
Info                semantic.info                --color-info                Semantic/
Info Subtle         semantic.infoSubtle          --color-info-subtle         Semantic/

Call Active         callStates.callActive        --color-call-active         Call/
Call Ringing        callStates.callRinging       --color-call-ringing        Call/
Call Ended          callStates.callEnded         --color-call-ended          Call/
Call Muted          callStates.callMuted         --color-call-muted          Call/
Call Hold           callStates.callHold          --color-call-hold           Call/
```

### Typography Tokens

Typography is not currently exported to JSON, but maps directly to Figma Text Styles:

| Figma Text Style Name | Size | Weight | Line Height | Letter Spacing |
|-----------------------|------|--------|-------------|----------------|
| `Display` | 48/Auto | ExtraBold 800 | 110% | -2.5% |
| `Heading/H1` | 36/40 | Bold 700 | 110% | -2.5% |
| `Heading/H2` | 30/36 | Bold 700 | 120% | 0% |
| `Heading/H3` | 24/31 | SemiBold 600 | 130% | 0% |
| `Heading/H4` | 20/28 | SemiBold 600 | 140% | 0% |
| `Body/Large` | 18/25 | Regular 400 | 140% | 0% |
| `Body/Default` | 16/24 | Regular 400 | 150% | 0% |
| `Body/Small` | 14/21 | Regular 400 | 150% | 0% |
| `Label/Default` | 14/21 | Medium 500 | 150% | 2.5% |
| `Caption` | 12/18 | Regular 400 | 150% | 2.5% |
| `Overline` | 12/18 | SemiBold 600 | 150% | 10% |
| `Code` | 14/21 | Regular 400 | 150% | 0% |

All text styles use the font family **Inter** (import via Google Fonts before creating styles).

### Shadow / Effect Tokens

| Figma Effect Style Name | CSS Token | Box Shadow Value |
|-------------------------|-----------|-----------------|
| `Elevation/Level 1` | `--shadow-sm` | `0 1px 3px rgba(26,26,26,0.08), 0 1px 2px rgba(26,26,26,0.06)` |
| `Elevation/Level 2` | `--shadow-md` | `0 4px 12px rgba(26,26,26,0.10), 0 2px 4px rgba(26,26,26,0.06)` |
| `Elevation/Level 3` | `--shadow-lg` | `0 10px 24px rgba(26,26,26,0.12), 0 4px 8px rgba(26,26,26,0.08)` |
| `Elevation/Level 4` | `--shadow-xl` | `0 20px 48px rgba(26,26,26,0.16), 0 8px 16px rgba(26,26,26,0.10)` |
| `Brand/Red Glow` | `--shadow-brand` | `0 4px 16px rgba(230,57,70,0.35), 0 2px 6px rgba(230,57,70,0.20)` |

---

## HTML Mockups → Figma Component Mapping

The repository's HTML mockups map directly to Figma components. Use this reference when translating mockups to Figma frames or when extracting specs from Figma for development.

### Button Mapping

| HTML Class | Figma Component | Notes |
|------------|-----------------|-------|
| `.btn-primary` | `Button/Primary/Default` | Height 40px, radius 4px |
| `.btn-primary.btn-sm` | `Button/Primary/Small` | Height 32px |
| `.btn-primary.btn-lg` | `Button/Primary/Large` | Height 48px |
| `.btn-secondary` | `Button/Secondary/Default` | Outlined red |
| `.btn-outlined` | `Button/Outlined/Default` | Neutral border |
| `.btn-ghost` | `Button/Ghost/Default` | No border |
| `.btn-danger` | `Button/Danger/Default` | Destructive red |
| `.btn-icon` | `Button/Icon/Default` | 44×44 touch target |

### Input Mapping

| HTML / State | Figma Component | Notes |
|--------------|-----------------|-------|
| `<input>` (default) | `Input/Default` | Height 44px, radius 6px |
| `<input>:focus` | `Input/Focus` | Red ring |
| `.input-error` | `Input/Error` | Red border + helper text |
| `<input>:disabled` | `Input/Disabled` | Gray bg |
| `.input-with-icon` | `Input/WithIcon` | Left icon 20px |
| `<select>` | `Input/Select` | Custom chevron |
| `<textarea>` | `Input/Textarea` | Min 96px height |

### Card Mapping

| HTML Class | Figma Component | Notes |
|------------|-----------------|-------|
| `.card` | `Card/Base` | White, radius 8px, Level 1 shadow |
| `.card-interactive` | `Card/Interactive` | Hover state: Level 2 shadow, -2px lift |
| `.card-accent` | `Card/Accent` | Left border 4px Primary Red |
| `.card-dark` | `Card/Dark` | Dark bg, white text |
| `.card-call` | `Card/Call` | Dark bg with red accent top bar |

### Badge Mapping

| HTML Class | Figma Component |
|------------|-----------------|
| `.badge` | `Badge/Default` |
| `.badge-primary` | `Badge/Primary` |
| `.badge-success` | `Badge/Success` |
| `.badge-warning` | `Badge/Warning` |
| `.badge-error` | `Badge/Error` |
| `.badge-dark` | `Badge/Dark` |
| `.badge.badge-pill` | `Badge/Pill/[variant]` |
| `.notification-dot` | `Badge/Dot` |

### Geometric Pattern Mapping

| HTML / CSS Class | Figma Element | Notes |
|-----------------|---------------|-------|
| `.clip-apex` | `Pattern/Apex Triangle` | Vector triangle shape |
| `.clip-diagonal-tr` | `Pattern/Diagonal Cut TR` | Frame with clip mask |
| `.clip-parallelogram` | `Pattern/Parallelogram` | Skewed rectangle |
| `.clip-chevron` | `Pattern/Chevron` | Step indicator shape |
| `.chip-geo` | `Component/Chip Geo` | Parallelogram chip |
| `.step-geo` | `Component/Step Geo` | Chevron step |
| `.pattern-stripes-dark` | `Background/Stripe Dark` | Fill style |
| `.bg-brand-hero` | `Background/Brand Hero` | Gradient fill |
| `.accent-bar` | `Decoration/Accent Bar` | 4px diagonal bar |

---

## Design Team Handoff Instructions

### For Designers — When Updating the Figma File

1. **Always use defined Color Styles.** Never use raw hex values on fills or strokes. Every color applied in Figma must reference a named Color Style.

2. **Component overrides only.** When creating screen compositions, use the master component instances and use Figma's override system to swap text, icons, or states. Do not detach components unless absolutely necessary.

3. **Naming new components.** Follow the `[Component]/[Variant]/[State]` naming convention. When creating a new component type, discuss with the engineering team before finalizing the name — the CSS class name should align.

4. **Documenting changes.** Use Figma's **comment** feature on modified components to note what changed and why. Tag the engineering lead for review before handoff.

5. **Exporting assets.**
   - Icons: Export as SVG, 24×24 artboard, `currentColor` stroke.
   - Images: Export @1x PNG for fallbacks, @2x for retina.
   - Patterns: Export as SVG where possible; note CSS gradient values in the component annotation.

6. **Spacing annotations.** Use the **Redline** or **Measure** plugin to annotate spacing before handing off screens to development.

### For Developers — Reading the Figma Handoff

1. **Color values.** When Figma Inspect shows a color, cross-reference it with `design/assets/colors.json` to find the correct CSS custom property token (e.g., `--color-primary`) instead of hard-coding the hex value.

2. **Typography.** When Figma shows a text style like "Heading/H2", use the corresponding CSS class or font properties from the Typography section of `design/DESIGN_SYSTEM.md`.

3. **Shadows.** Map Figma Effect Styles to the CSS `--shadow-*` tokens documented in the shadow table above.

4. **Spacing.** All spacing in Figma frames should be multiples of 8px. Translate directly to `--space-*` tokens.

5. **Clip-paths.** If a Figma frame has a clipping mask applied at an angle, check `design/assets/patterns.css` for the matching `.clip-*` utility class before writing custom CSS.

6. **Component states.** Each Figma component variant (Default / Hover / Focus / etc.) maps to a CSS pseudo-class or modifier class. Implement all states — don't just implement Default.

### Handoff Checklist (Per Screen)

Before marking a screen as ready for development:

- [ ] All colors use Figma Color Styles (no raw hex)
- [ ] All text uses Figma Text Styles
- [ ] All shadows use Figma Effect Styles
- [ ] Spacing follows the 8px grid
- [ ] Interactive states (hover, focus, active, disabled) are shown for all interactive elements
- [ ] Mobile and desktop breakpoints are both designed
- [ ] Accessibility notes added (contrast ratios, touch targets, focus order)
- [ ] Asset exports prepared (SVGs optimized, images compressed)
- [ ] Component annotations completed in Figma

### Annotating Geometric Elements

For clip-path shapes in Figma, add a component annotation using Figma's annotation tools:

```
CSS: clip-path: polygon(50% 0%, 100% 100%, 0% 100%)
Class: .clip-apex
File: design/assets/patterns.css
```

---

## Link References & Resources

### Design Files

| Resource | Location / URL |
|----------|---------------|
| Design System Figma File | _(Share link from Figma — update when published)_ |
| Icon Sprite SVG | `design/assets/icons.svg` |
| Color Tokens JSON | `design/assets/colors.json` |
| Pattern CSS Utilities | `design/assets/patterns.css` |
| Full Design System Docs | `design/DESIGN_SYSTEM.md` |

### Figma Plugins Used

| Plugin | Purpose | Figma Community Link |
|--------|---------|---------------------|
| Tokens Studio for Figma | Design token sync | [figma.com/community/plugin/843461159747178978](https://www.figma.com/community/plugin/843461159747178978) |
| Iconify | Icon browsing & import | [figma.com/community/plugin/735098390272716381](https://www.figma.com/community/plugin/735098390272716381) |
| Contrast | Accessibility contrast checker | [figma.com/community/plugin/748533339900865323](https://www.figma.com/community/plugin/748533339900865323) |
| Redline | Spacing & measurement annotations | [figma.com/community/plugin/781354942349609042](https://www.figma.com/community/plugin/781354942349609042) |
| Clean Document | Organize layers and styles | [figma.com/community/plugin/767379019764649932](https://www.figma.com/community/plugin/767379019764649932) |

### Typography Resources

| Resource | URL |
|----------|-----|
| Inter Font (Google Fonts) | [fonts.google.com/specimen/Inter](https://fonts.google.com/specimen/Inter) |
| Inter Font (Official) | [rsms.me/inter](https://rsms.me/inter) |
| JetBrains Mono (monospace) | [fonts.google.com/specimen/JetBrains+Mono](https://fonts.google.com/specimen/JetBrains+Mono) |

### Accessibility Resources

| Resource | URL |
|----------|-----|
| WCAG 2.1 Guidelines | [w3.org/TR/WCAG21](https://www.w3.org/TR/WCAG21/) |
| WebAIM Contrast Checker | [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/) |
| ARIA Patterns (APG) | [w3.org/WAI/ARIA/apg](https://www.w3.org/WAI/ARIA/apg/) |
| axe DevTools (Browser ext) | [deque.com/axe](https://www.deque.com/axe/) |

### CSS & Standards References

| Resource | URL |
|----------|-----|
| CSS clip-path (MDN) | [developer.mozilla.org/en-US/docs/Web/CSS/clip-path](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path) |
| CSS Custom Properties (MDN) | [developer.mozilla.org/en-US/docs/Web/CSS/--*](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) |
| SVG Sprites Technique | [css-tricks.com/svg-sprites-use-better-icon-fonts](https://css-tricks.com/svg-sprites-use-better-icon-fonts/) |
| Design Tokens Spec (W3C) | [design-tokens.github.io/community-group](https://design-tokens.github.io/community-group/format/) |
| Clippy (clip-path generator) | [bennettfeely.com/clippy](https://bennettfeely.com/clippy/) |

---

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024 | Initial design system — colors, typography, components, geometric patterns, icon sprite, Figma handoff guide |

---

*Zustation Design System · Figma Export Guide · Maintained by the Product Design Team*
