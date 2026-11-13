---
name: Judicial GovTech Modern
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#404944'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#4a2400'
  on-tertiary: '#ffffff'
  tertiary-container: '#6a3700'
  on-tertiary-container: '#ff9939'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  status-sah-bg: '#DCFCE7'
  status-sah-text: '#166534'
  status-sah-border: '#86EFAC'
  status-pending-bg: '#FEF3C7'
  status-pending-text: '#92400E'
  status-pending-border: '#FCD34D'
  status-revision-bg: '#FEE2E2'
  status-revision-text: '#991B1B'
  status-revision-border: '#FCA5A5'
  seal-gold: '#F59E0B'
  border-subtle: '#E2E8F0'
  surface-white: '#FFFFFF'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
  code-register:
    fontFamily: Space Mono
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system embodies Modern Institutional & Clean Courtroom Professional aesthetics. Built for high-stakes judicial transactions, it projects uncompromising legal integrity, civic authority, and absolute procedural clarity while remaining frictionless for advocates, citizens, and judicial officers.

The emotional tone balances institutional solemnity with crisp digital agility. It eliminates bureaucratic ambiguity through precise typography, high-contrast statuses, and scannable verification seals.

Design Style: Modern Institutionalism. It merges functional GovTech efficiency with refined legal gravitas—employing crisp hairline slate dividers (`#E2E8F0`), pure white surface elevations, structured metadata grids, and prominent status pill badges to deliver zero-delay verification in both courtrooms and clerk service desks.

## Colors

The color system is rooted in the judicial heritage of the Supreme Court (*Mahkamah Agung*), featuring Deep Court Forest Green (`#064E3B`) as the anchor of institutional trust and Deep Navy Slate (`#0F172A`) for authoritative headings, interactive controls, and high-priority chrome.

Judicial Gold Amber (`#D97706`, `#F59E0B`) serves as an authentication accent, reserved strictly for legal seals, official registration counters, and certified verifications. The canvas uses Ultra-light Slate (`#F8FAFC`) with pure white card surfaces framed by 1px crisp borders (`#E2E8F0`) to ensure legibility across bright courtroom tablets and mobile devices.

Status badges employ a strict tri-token convention (Background, Border, and High-Contrast Text) to eliminate ambiguity during legal status inspection:
- **Terdaftar & Sah (Certified Valid):** `#DCFCE7` background, `#86EFAC` border, `#166534` text.
- **Menunggu Verifikasi / TTE (Pending Verification/Approval):** `#FEF3C7` background, `#FCD34D` border, `#92400E` text.
- **Perlu Perbaikan / Ditolak (Revision/Rejected):** `#FEE2E2` background, `#FCA5A5` border, `#991B1B` text.

## Typography

The typographic hierarchy prioritizes legibility, systematic metadata distinction, and rapid reading comprehension under courtroom conditions. Plus Jakarta Sans handles primary headline and body roles, combining geometric clarity with warm accessibility.

For registration numbers, case IDs (`Nomor Perkara`), transaction hashes, and billing codes (`NTPN/Simponi`), use the dedicated monospace token `code-register` (rendered with `Space Mono` or system monospaced stacks) with a slight character track of `0.05em`. This guarantees instant, error-free transcription during verbal proceedings and visual audits.

All metadata labels must utilize uppercase styling with `label-sm` or `label-md` accompanied by a letter spacing of `0.04em` to create distinct visual demarcation between property definitions and values.

## Layout & Spacing

The layout architecture employs a structured 12-column responsive fluid grid designed for dual utility:
1. **Public & Verification Portals:** Single-column, mobile-first flows capped at a max-width of `768px` for QR scan results and registration tracking.
2. **Staff & Judicial Workbenches:** Full-canvas 12-column responsive layouts with fixed navigation rails (`260px`) and collapsible inline preview drawers for simultaneous document examination and adjudication.

Grid specifications:
- **Desktop (1024px+):** 12 columns, `1.5rem` gutters, `2rem` outer page margins.
- **Tablet (768px - 1023px):** 8 columns, `1rem` gutters, `1.5rem` outer margins.
- **Mobile (< 768px):** 4 columns, `1rem` gutters, `1rem` outer canvas margins.

Rhythm is maintained on an 8px grid foundation (`space-sm` = 8px, `space-md` = 16px, `space-lg` = 24px, `space-xl` = 32px), ensuring vertical flow and balanced data-density across form wizards and table rows.

## Elevation & Depth

Visual hierarchy relies on low-contrast structural outlines combined with ambient, diffused shadows. This keeps the interface crisp and prevents visual clutter on dense clerk dashboards.

Key depth layers:
- **Level 0 (Canvas Base):** Ultra-light Slate (`#F8FAFC`). Flat, unshadowed.
- **Level 1 (Card & Content Panels):** Pure White (`#FFFFFF`) framed with a 1px solid border in `#E2E8F0` and subtle ambient drop shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Hovered Cards & Actionable Rows):** Raised elevation with border tinting to primary forest green (`rgba(6, 78, 59, 0.2)`) and shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Modals, TTE Passkey Dialogs, Inline Viewers):** Foreground focus with deep ambient attenuation: `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)`. Backdrops use a semi-opaque `#0F172A` with 40% opacity and `backdrop-filter: blur(4px)`.

## Shapes

The shape system applies balanced curvature tailored to institutional legitimacy:
- **Cards, Panels & Data Containers:** `12px` border-radius (`rounded-lg`), delivering structural neatness without aggressive rounding.
- **Interactive Controls (Buttons, Inputs, Selects):** `8px` border-radius, preserving the tactile feel of an institutional productivity tool.
- **Badges, Tags & Official Pills:** `9999px` (Full Pill) radius, providing immediate visual contrast against square metadata cards.
- **QR Code Verification Containers:** Crisp `8px` container framing with inward `4px` padding to preserve camera read performance.

## Components

### 1. Buttons
- **Primary Action (Disahkan / Loloskan):** Deep Court Forest Green (`#064E3B`) background, pure white text, 8px radius, `font-weight: 600`. Hover state transitions to `#043C2E`. Focus state introduces a 2px offset ring in `#10B981`.
- **Secondary / Actionable (Lihat Berkas / Edit):** Pure white background, `#0F172A` text, 1px border in `#E2E8F0`. Hover triggers background `#F8FAFC`.
- **Destructive / Tolak (Minta Revisi):** Pure white background with Crimson border `#FCA5A5` and `#991B1B` text. Active state fills with `#FEE2E2`.
- **Seal / Otorisasi TTE Button:** Deep Navy Slate (`#0F172A`) paired with Gold Accent trim (`#F59E0B`), signaling executive judicial approval.

### 2. Status Badges & Pills
- Built with full-pill geometry (`border-radius: 9999px`), `11px` uppercase bold typography, `padding: 4px 12px`, and a 1px matching solid border:
  - **Terdaftar & Sah:** Background `#DCFCE7`, text `#166534`, border `#86EFAC`. Features a verified checkmark icon.
  - **Menunggu Verifikasi / Siap Disahkan:** Background `#FEF3C7`, text `#92400E`, border `#FCD34D`. Features a pulsing amber dot.
  - **Perlu Perbaikan:** Background `#FEE2E2`, text `#991B1B`, border `#FCA5A5`. Features an alert triangle icon.

### 3. Form Input Fields & Upload Drops
- **Input Fields:** Pure white background, 8px radius, 1px border `#CBD5E1`, text `#0F172A`. Active focus ring: 2px `#064E3B` outline with zero blur.
- **File Upload Droppers:** Soft dashed 2px border `#94A3B8` over `#F8FAFC` background. Contains file format guidelines, upload limits, and live preview badges.

### 4. Cards & Information Displays
- **Registry Record Card:** White surface, 12px border radius, `#E2E8F0` border. Key registration numbers are isolated in a gold-tinted highlight strip (`#FFFBEB` background with `#D97706` text using the monospace token).
- **KPI Summary Cards:** Minimalist metrics card displaying large bold numerical tallies with small metadata captions and subtle green/gold indicator bars on the top edge.

### 5. Checkboxes, Radio Buttons & Lists
- Checkboxes and radios use `#064E3B` active states with crisp white glyphs and high-contrast borders for accessibility.
- Definition lists (`dl`, `dt`, `dd`) organize legal party metadata into a two-column key-value matrix with `#64748B` labels and `#0F172A` bold values.

### 6. Verification QR Card (Courtroom Ready)
- High-contrast card centered on a mobile viewport: White background, green header crest, centrally aligned QR code with minimum dimensions of `180px x 180px`, followed by the bold green badge **"DOKUMEN RESMI TERDAFTAR DI PENGADILAN"** and timestamped cryptographic hash.