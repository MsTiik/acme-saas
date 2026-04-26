# Acme — Design System

Source of truth for visual design. If something here conflicts with code, the code is wrong — fix the code.

---

## Voice & vibe

**Stripe/Notion warmth × Ramp/Mercury editorial.** Warm-cream backgrounds, generous whitespace, soft layered shadows, and a single bold accent. Display headlines are an editorial serif; everything else is geometric sans. Reads "growth-stage SaaS, almost finance-grade" — not playful, not dev-tool-coded.

The product must look believable on a conference projector. That biases every choice toward **high contrast, large type, and clear hierarchy** over delicate flourishes.

---

## Typography

Three families, one per role. No others.

| Role                      | Family            | CSS variable     | Tailwind class | Usage                                         |
|---------------------------|-------------------|------------------|----------------|-----------------------------------------------|
| Display / H1 / H2         | Instrument Serif  | `--font-serif`   | `font-serif`   | Page heroes, section titles. `text-3xl`+ only |
| Body, UI, buttons, labels | Geist             | `--font-sans`    | `font-sans`    | Default — everything not display              |
| Numerals, code, IDs       | Geist Mono        | `--font-mono`    | `font-mono`    | KPIs, table money cells, API keys             |

**Rules**
- Never set serif below `text-2xl` — it falls apart at small sizes.
- Tabular figures on every numeric cell: `font-feature-settings: 'tnum'` (or Tailwind `tabular-nums`).
- Leading: `leading-tight` for serif headlines, `leading-relaxed` for prose, default for UI.
- Tracking: `tracking-tight` on serif H1/H2 only. Default elsewhere.

**Scale**

| Token         | Size                | Use                              |
|---------------|---------------------|----------------------------------|
| Display XL    | `text-5xl` (48px)   | Marketing hero only (rare)       |
| H1            | `text-3xl` (30px)   | Page hero — serif                |
| H2            | `text-2xl` (24px)   | Section title — serif            |
| H3            | `text-lg` (18px)    | Card title — sans, medium weight |
| Body          | `text-sm` (14px)    | Default UI                       |
| Small / meta  | `text-xs` (12px)    | Timestamps, captions, badges     |

---

## Color

Palette is warm-neutral with one bold accent (deep teal). All values in oklch.

```css
--background:   oklch(0.992 0.004 85);  /* warm cream */
--foreground:   oklch(0.18  0.012 70);  /* warm near-black */
--card:         oklch(1     0     0);   /* pure white */
--primary:      oklch(0.42  0.08  175); /* deep teal — accent */
--muted:        oklch(0.965 0.006 85);
--muted-fg:     oklch(0.50  0.012 70);
--border:       oklch(0.91  0.008 85);
--destructive:  oklch(0.55  0.20  25);

--chart-1: oklch(0.42 0.08 175);  /* teal */
--chart-2: oklch(0.62 0.10 50);   /* warm amber */
--chart-3: oklch(0.55 0.06 280);  /* dusty violet */
--chart-4: oklch(0.70 0.08 160);  /* sage */
--chart-5: oklch(0.40 0.04 30);   /* clay */
```

**Rules**
- Backgrounds are warm cream. Cards on top of cream are pure white — that's where the layered feel comes from.
- The teal is the **only** accent. No additional brand colors. Charts use the chart-1 through chart-5 ramp; never invent new hues.
- Status semantics: green is reserved for positive deltas only (use a plain `oklch(0.65 0.15 145)`, no token — it's only ever the dot in a delta indicator). Red is `--destructive`. Avoid traffic-light overload in normal UI.
- Borders over hard separators. Dividers are `--border` at 1px.

---

## Spacing & layout

4/8 grid. Density follows Notion (generous), not Linear (tight).

- Section vertical rhythm: `py-16` to `py-24` between major sections.
- Card padding: `p-6` (24px) standard, `p-8` (32px) for hero panels.
- Stack gaps: `space-y-2` (label→input), `space-y-6` (form fields), `space-y-10` (page sections).
- Page max-width:
  - `max-w-7xl` — table/data pages (Customers, Billing invoices)
  - `max-w-5xl` — dashboards, onboarding, content
  - `max-w-2xl` — settings forms, single-column reads

---

## Radii

| Token         | Value | Use                          |
|---------------|-------|------------------------------|
| `rounded-md`  | 10px  | Buttons, inputs              |
| `rounded-lg`  | 12px  | Small cards, badges with bg  |
| `rounded-xl`  | 14px  | Cards (default)              |
| `rounded-2xl` | 18px  | Hero panels, modals          |
| `rounded-full`| —     | Avatars, dots, pill badges   |

No `rounded-3xl`+. Mega-rounded surfaces read chat-app, not finance-grade.

---

## Shadows

Soft, layered, warm-tinted (the alpha is on warm-black `rgb(20 14 4)`, not pure black — keeps the cream feeling).

```css
--shadow-xs: 0 1px 2px 0 rgb(20 14 4 / 0.04);
--shadow-sm: 0 1px 2px 0 rgb(20 14 4 / 0.05), 0 1px 3px 0 rgb(20 14 4 / 0.04);
--shadow-md: 0 4px 8px -2px rgb(20 14 4 / 0.06), 0 2px 4px -2px rgb(20 14 4 / 0.04);
--shadow-lg: 0 12px 24px -6px rgb(20 14 4 / 0.08), 0 4px 8px -4px rgb(20 14 4 / 0.04);
```

**Rules**
- Cards default to `border` + `shadow-xs`. Hover bumps to `shadow-sm`.
- Modals and popovers use `shadow-lg`.
- Never use shadow without a border on white-on-cream cards — the border defines the edge, the shadow gives depth.

---

## Components

### Buttons
- Variants: `default` (teal bg, white text), `outline` (border, foreground text), `ghost` (no border, hover bg), `destructive`.
- Sizes: `sm` (h-8), `default` (h-9), `lg` (h-10).
- Always `rounded-md`. Always have a focus ring (`--ring` at 2px offset).
- Icon-only buttons get `aria-label`.

### Cards
- White on cream. `rounded-xl`. `border` + `shadow-xs`.
- Header uses `text-lg font-medium` (sans, not serif — H3 size).
- Card descriptions use `text-sm text-muted-foreground`.

### Tables
- Borders only between rows, not columns. `divide-y` not `divide-x`.
- First column has more left padding than the table edge (`pl-6`).
- Numeric cells right-aligned, `font-mono tabular-nums`.
- Row hover: `hover:bg-muted/40`.
- Sticky header on scroll.

### Badges
- `text-xs`, `rounded-full`, `px-2 py-0.5`, weight `medium`.
- Status colors: use `bg-{token}/10 text-{token}` patterns (e.g. teal-bg-10 + teal-fg for "Active").
- Never solid-fill a badge except for the destructive variant.

### Inputs
- `h-9`, `rounded-md`, `border`, white bg.
- Disabled state: `bg-muted` with `cursor-not-allowed` and reduced opacity on text.
- Always pair with a `<Label>`. Never rely on placeholder as label.

### Avatars
- `rounded-full`, initials on `bg-muted` with `text-foreground`. No external image URLs (avoids hotlink failures on stage).
- Sizes: `h-6` (table), `h-8` (nav, lists), `h-10` (settings).

### Charts
- Hand-rolled inline SVG. **No chart library.** Demo target — adding recharts/visx is overreach.
- Area charts: stroke at full saturation (`--chart-1`), fill at 12% opacity.
- Sparklines: 30 points, 60×20px, no axis, no labels.
- Always show 3 horizontal gridlines on full charts; never more.

---

## Iconography

`lucide-react` only. Already installed.

| Context         | Size       | Stroke |
|-----------------|------------|--------|
| Dense UI inline | `h-4 w-4`  | 1.5    |
| Sidebar nav     | `h-5 w-5`  | 1.5    |
| Feature panels  | `h-6 w-6`  | 1.5    |
| Hero illustrations | `h-10 w-10` | 1.25 |

No emoji in UI. No mixed icon sets.

---

## Empty states

Every list, table, and feed has one. Pattern:

1. A muted background tile (96px square, `rounded-xl`, `bg-muted`) with a centered lucide icon.
2. Headline (sans, `font-medium`, `text-base`).
3. One-line description in `text-muted-foreground`.
4. A primary CTA button.

---

## Mock data conventions

Demo determinism matters more than realism in detail.

- Reference time: `DEMO_NOW = new Date("2026-04-25T10:00:00-04:00")` exported from `lib/mocks/now.ts`. All "X hours ago" timestamps compute against this.
- Names: multicultural mix, no Looney Tunes (Jamie Lee, Sam Kim, Alex Rivera, Morgan Chen, Taylor Nguyen, Priya Shah, Liam O'Connor, Nadia Hassan, Diego Ortiz, Yuki Tanaka, Aisha Khan, Ben Cohen).
- Companies: Northwind Logistics, Globex, Initech, Stark Industries, Soylent Corp.
- Money: USD, comma-thousands, no decimals on KPIs (`$48,920`), two decimals on invoices (`$499.00`).
- All mocks live under `lib/mocks/`. No mock data inline in page files except the smallest (≤ 5 rows) lookup tables.

---

## Probe integration conventions

`<ProbeTracked changeId="...">` from `components/ProbeTracked.tsx` wraps every demo-target zone.

**Naming**: `{route}-{zone}` in kebab-case. Examples: `dashboard-hero`, `customers-table`, `billing-upsell`.

**Where to wrap**:
- Page hero (every page)
- Each KPI/section block
- Any list, table, or feed
- Any CTA cluster (banners, upsells, primary action rows)
- The `<main>` element in the app shell (`app-main`)

**Rules**
- `changeId`s are stable. Renaming one is a breaking change for Probe — only do it intentionally.
- Never reuse a `changeId` on the same page.
- New `changeId`s must round-trip through `scripts/build-manifest.ts` into `public/probe.manifest.json`.

---

## Things we explicitly don't do

- Gradients (except the welcome-video thumbnail).
- Glassmorphism / backdrop blur. Reads "2021 startup."
- Multiple accent colors. Teal only.
- Emoji in UI copy.
- Real third-party SDK calls (Stripe, Notion, Intercom). All mocked.
- Auth flows. There is no auth.
- Animations longer than 200ms. UI feels slow above that.
- Chart libraries. Hand-rolled SVG only.
