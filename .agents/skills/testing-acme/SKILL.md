# Testing Acme SaaS

How to run and test the Acme SaaS demo scaffold.

## Dev Server

```bash
cd /home/ubuntu/repos/acme-saas
npm install
npm run dev
```

The dev server runs on port 3000 by default. If port 3000 is in use, Next.js auto-selects the next available port (e.g., 3001, 3002). Check the terminal output for the actual port.

## Build Verification

```bash
npm run build
```

This triggers the `prebuild` script (`tsx scripts/build-manifest.ts`) which writes `public/probe.manifest.json` with `{ "changes": {} }`. Verify the file exists and has the correct content after build.

## Pages to Test

| Route | Heading | Key Content |
|---|---|---|
| `/dashboard` | "Dashboard" | 4 KPI cards, 10-entry activity feed, 6 project cards |
| `/projects` | "Projects" | 10 project cards with progress bars |
| `/customers` | "Customers" | 10 customer rows with plan/MRR/status |
| `/activity` | "Activity" | 12 activity entries with categories |
| `/settings` | "Settings" | Profile, Team (3), Billing, Integrations (3), Notifications |
| `/onboarding` | "Welcome to Acme" | ProbeTracked wrapper with empty children |

The root `/` redirects to `/dashboard`.

## Exact Contract Values

These values are from static mocks and must match exactly:

### Dashboard KPIs
- Active projects: **12**
- MRR: **$14,300**
- New customers: **8**
- Activation rate: **62%**

### Settings Billing
- Plan: "Growth plan" at "$49/mo"
- Status badge: "Active" (must be capitalized)
- Invoices: 2026-04-01 $49.00, 2026-03-01 $49.00, 2026-02-01 $29.00

### Settings Team
- Jamie Lee (Admin), Sam Kim (Member), Alex Rivera (Member)

### Settings Integrations
- Stripe, Notion, Intercom — all "Connected" with checked toggles

### Onboarding ProbeTracked
- Verify DOM attribute: `data-probe-change="activation-checklist-2026-04-25"`
- Can verify via curl: `curl -s http://localhost:3000/onboarding | grep 'data-probe-change'`
- The ProbeTracked wrapper should have empty children (no ActivationChecklist, WelcomeVideo, or ProductTour rendered)

## App Shell

- Sidebar: Dashboard, Projects, Customers, Activity, Settings (active link highlights)
- Top bar: workspace switcher dropdown ("Acme Corp", "Acme Staging", "Create workspace"), search input, notification bell, user avatar dropdown ("Profile", "Settings", "Sign out")
- Bottom of sidebar: Jamie Lee / Admin user card

## Contract Files (Do NOT Modify)

- `components/ProbeTracked.tsx` — exact prop shape and `data-probe-change` attribute
- `scripts/build-manifest.ts` — prebuild hook that writes probe.manifest.json
- `components/ActivationChecklist.tsx`, `components/WelcomeVideo.tsx`, `components/ProductTour.tsx` — stubs returning null
- `lib/acme-events.ts` — stub event emitter

## Known Issues

- **shadcn v4 (base-ui)**: The `asChild` prop is not supported on DropdownMenuTrigger. Style triggers directly with Tailwind classes instead.
- **ESLint warnings**: `npx eslint .` may show warnings from shadcn/base-ui generated code in `node_modules`. These are not app code issues. Scope lint to app code: `npx eslint app/ components/AppShell.tsx`
- **Port conflicts**: If port 3000 is in use, Next.js picks the next port automatically. Always check terminal output.

## Devin Secrets Needed

None — this is a mock-only app with no real third-party integrations.
