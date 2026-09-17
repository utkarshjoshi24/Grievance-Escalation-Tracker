---
name: GET Integrity System
colors:
  surface: '#111418'
  surface-dim: '#111418'
  surface-bright: '#36393e'
  surface-container-lowest: '#0b0e12'
  surface-container-low: '#191c20'
  surface-container: '#1d2024'
  surface-container-high: '#272a2e'
  surface-container-highest: '#323539'
  on-surface: '#e1e2e8'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e1e2e8'
  inverse-on-surface: '#2e3135'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#a5e7ff'
  on-secondary: '#003543'
  secondary-container: '#00d2ff'
  on-secondary-container: '#00566a'
  tertiary: '#d0bcff'
  on-tertiary: '#3c0091'
  tertiary-container: '#a078ff'
  on-tertiary-container: '#340080'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#b6ebff'
  secondary-fixed-dim: '#47d6ff'
  on-secondary-fixed: '#001f28'
  on-secondary-fixed-variant: '#004e60'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#111418'
  on-background: '#e1e2e8'
  surface-variant: '#323539'
typography:
  display:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The design system delivers an institutional-grade, privacy-conscious platform engineered to project procedural authority, uncompromised confidentiality, and rigorous operational speed. Designed for higher education administrators, ombudspersons, faculty chairs, and students navigating delicate institutional matters, the interface channels the visual precision and developer-grade velocity of platforms like Linear and Vercel. 

The stylistic architecture pairs deep, multi-tiered charcoal surfaces with razor-thin hairline boundaries, refined sans-serif metrics, and purposeful luminescence. Visual noise is eliminated to maintain calm during contentious or high-consequence disputes. Contrast, status demarcation, and strict time-to-resolution (SLA) telemetry take precedent over purely decorative flourishes, ensuring institutional accountability and absolute discretion.

## Colors
The palette leverages deep, stepped luminance levels to establish distinct spatial planes without heavy fill changes:
- **Canvas Base (`#050505`):** Ground-floor viewports and application framework.
- **Surface Level 1 (`#0B0D10`):** Outer panels, sidebars, and structural containers.
- **Surface Level 2 (`#111418`):** Cards, standard modules, and interactive table rows.
- **Surface Level 3 (`#161A20`):** Elevated popovers, dropdown lists, and modal bodies.

### Accents & Operational Status
Functional accents use calibrated chromatic thresholds to enforce immediate cognitive triage:
- **Primary Action & Focus:** Electric Blue (`#3B82F6`) with hover states scaling toward Cyan (`#00D2FF`).
- **Pending / Inactive:** Slate Gray (`#64748B` foreground on `#1E293B33` background with a `#334155` border).
- **In Review:** Royal Electric Blue (`#3B82F6` on `#1D4ED820` with a `#2563EB66` border).
- **Escalated / Tier-2 Notice:** Luminous Amber (`#F59E0B` on `#B4530920` with a `#D9770666` border).
- **Resolved / Closed:** Emerald Green (`#10B981` on `#04785720` with a `#05966966` border).
- **Overdue / SLA Breach / Critical:** Bright Ruby Red (`#EF4444` on `#B91C1C24` with a `#DC262680` border) paired with an exterior directional luminescent flare.
- **Hairline Dividers & Framing:** Monochromatic structural borders set exclusively at `#22272E` (base) and `#2D333B` (interactive/active).

## Typography
Typographic discipline underpins the platform's credibility. Geist provides clinical, modern clarity across all analytical and editorial interactions, utilizing tight tracking on headers to preserve structural density. 

Monospaced metrics via JetBrains Mono are strictly reserved for institutional grievance IDs (`GRV-2024-88A`), case filing dates, countdown SLA clocks, routing hash tags, and status indicators. This distinction enforces high-density data parsing while preventing clerical fatigue. Primary text displays at `#EDEDED`, while secondary annotations and muted metadata use `#8B949E` and `#6E7681` respectively.

## Layout & Spacing
The layout follows a precise 12-column adaptive fluid-grid framework pinned against a 4px sub-pixel vertical rhythm. Side navigation operates in a persistent collapsible rail (64px mini / 260px expanded) on desktop displays, maintaining a clean 1440px maximum content column for grievance queues, audit trails, and investigation timelines.

Breakpoints transition through:
- **Mobile (< 768px):** Single-column stack, outer canvas margin of 1rem (`16px`), zero-gutter modular tiles, sticky actionable footers for escalation controls.
- **Tablet (768px - 1024px):** Dual-split layout (3:9 or 4:8 ratios), outer margin of 1.5rem (`24px`), nested scroll targets for document viewers.
- **Desktop (> 1024px):** Full multi-pane tri-split system (260px navigation, dynamic triage queue, 480px anchored audit/evidence inspector), with 2.5rem (`40px`) margins and 1.5rem (`24px`) gutters.

## Elevation & Depth
Elevation is rendered strictly via tonal luminance layering, sub-pixel edge lighting, and targeted luminescent rings rather than generic muddy drop shadows:

- **Surface Tiers:** Stacked depth progresses upward from base canvas (`#050505`) to raised structural items (`#111418`) and floating overlays (`#161A20`).
- **Hairline Outer Strokes:** Every card, flyout, and modal possesses a continuous 1px perimeter border (`#22272E`), which elevates to `#2D333B` on hover or focused states.
- **Top-Edge Highlight (Inner Keylight):** Modals and raised cards utilize an internal top border effect created with `box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.08)` to simulate directional downlighting.
- **Luminescent Rings & Glows:** Urgent status conditions utilize restrained colored halos:
  - Critical SLA breach (< 2 hours remaining): Continuous pulse utilizing `0 0 0 1px #EF4444, 0 0 16px -2px rgba(239, 68, 68, 0.35)`.
  - Active Escalation: Amber aura with `0 0 0 1px #F59E0B, 0 0 12px -2px rgba(245, 158, 11, 0.25)`.
  - Selected Entity Focus: Radial gradient aura using Electric Blue `0 0 0 1px #3B82F6, 0 0 14px -1px rgba(59, 130, 246, 0.3)`.

## Shapes
Geometry strikes a balance between technical precision and human touchpoints:
- **Core Cards and Panels:** Configured with a uniform 16px (`1rem`) border radius, matching the high-end industrial aesthetic of modern engineering consoles.
- **Form Controls & Action Buttons:** Standardized to 8px (`0.5rem`) corner rounding, reinforcing an intentional, actionable feel.
- **Status Badges, SLA Trackers, and Metadata Chips:** Fixed at a subtle 4px to 6px corner radius to emphasize tabular data integrity.
- **Avatars & Secure Identifiers:** Redacted or anonymized student/whistleblower profiles utilize strict 50% circular boundaries to signal protected identity tokens.

## Components

### Buttons
- **Primary Action:** Solid electric blue background (`#3B82F6`), high-contrast white text (`#FFFFFF`), 8px border radius, subtle top inner stroke (`inset 0 1px 0 rgba(255,255,255,0.2)`). On hover, transitions to `#2563EB` with an ambient glow (`0 0 12px rgba(59,130,246,0.4)`).
- **Secondary (Neutral Outline):** Surface fill `#111418`, 1px border `#2D333B`, text `#EDEDED`. On hover, surface changes to `#161A20` and border to `#3B82F666`.
- **Destructive/Critical Action:** Surface fill `#1C1215`, border `#7F1D1D`, text `#F87171`. On hover, background shifts to `#991B1B` and text to `#FFFFFF`.
- **Keyboard Shortcut Indicators:** Integrated directly into ghost buttons via JetBrains Mono tags styled in `#484F58` with a `#21262D` backing.

### Status Chips & Badges
Compact, mono-formatted badges built with 1px borders and low-opacity fills:
- Uses `label-sm` with uppercase transformation and `letter-spacing: 0.04em`.
- Includes an integrated 6px circular status beacon dot on the leading edge (flashing for breached SLAs).

### Cards & Grievance Row Units
- Standard row items on the triage board utilize `#111418` background, `#22272E` borders, and 16px radius.
- Padding adheres strictly to `space-md` (`16px`) vertically and `space-lg` (`24px`) horizontally.
- On mouse hover, cards trigger an instantaneous border color shift to `#2D333B` and an elevation shift via an inset linear top highlight.

### Input Fields & Search Bars
- Background surface `#0B0D10`, border 1px `#22272E`, text `#EDEDED`, placeholder text `#484F58`.
- Focus state eliminates standard browser outlines, applying a sharp 1px border `#3B82F6` and a focused glow ring (`0 0 0 3px rgba(59, 130, 246, 0.15)`).
- Global query input supports integrated filter syntax (`is:unassigned`, `sla:<24h`, `dept:dean`) rendered as styled chip pills within the field.

### Checkboxes & Selection Controls
- Rectangular 16x16mm checkboxes with a 4px corner radius, `#0B0D10` surface, and `#2D333B` border.
- Selected state fills with `#3B82F6` featuring a centered crisp white checkmark icon; indeterminate state features a solid horizontal bar.

### Domain-Specific Components
- **SLA Countdown Timer:** A hybrid badge component showing remaining hours/minutes in `JetBrains Mono`. Changes dynamically from slate gray (> 48h), to luminous amber (12–48h), to ruby red pulsing halo (< 12h or overdue).
- **Anonymized Identity Capsule:** A secure card element displaying redacted user records (`STUDENT-HASH-9941`) accompanied by verification signatures, end-to-end encryption badges, and access clearance levels.
- **Audit Timeline Stepper:** A vertical hairline thread linking dispute milestones with state-dependent node rings (solid, loading, warning, or resolved).