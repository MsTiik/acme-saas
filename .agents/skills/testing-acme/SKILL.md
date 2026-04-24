# Testing Acme SaaS Scaffold

## Quick Start

```bash
npm install
npm run dev   # starts Next.js dev server on localhost:3000
```

## Routes

| Route | What to verify |
|-------|----------------|
| `/` | Redirects to `/dashboard` |
| `/dashboard` | Header, 3 stat cards, recent-activity list (all static data) |
| `/onboarding` | "Welcome to Acme" heading, two-column layout, `data-probe-change="onboarding-root"` attribute in DOM |
| `/settings` | 4 disabled inputs with default values, disabled "Save changes" button |

## Contract Verification

### ProbeTracked wrapper
The onboarding page wraps its content in `<ProbeTracked changeId="onboarding-root">`. Verify the DOM attribute exists:

```bash
curl -s http://localhost:3000/onboarding | grep -o 'data-probe-change="onboarding-root"'
# Expected: data-probe-change="onboarding-root"
```

### Build manifest
`npm run build` triggers the `prebuild` script which generates `public/probe.manifest.json`:

```bash
npm run build
cat public/probe.manifest.json
# Expected: { "changes": {} }
```

### Stub components
`ActivationChecklist`, `WelcomeVideo`, and `ProductTour` all return `null`. They should produce no visible output on the onboarding page.

## Contract Files Checklist

All must exist at exact paths:
- `components/ProbeTracked.tsx`
- `components/ActivationChecklist.tsx`
- `components/WelcomeVideo.tsx`
- `components/ProductTour.tsx`
- `lib/acme-events.ts`
- `lib/mocks/stripe.ts`
- `lib/mocks/notion.ts`
- `lib/mocks/intercom.ts`
- `scripts/build-manifest.ts`
- `public/probe.manifest.json`
- `app/onboarding/page.tsx`
- `app/dashboard/page.tsx`
- `app/settings/page.tsx`
- `render.yaml`

## Stack Notes

- Next.js 15 App Router, TypeScript strict, Tailwind CSS v4, shadcn/ui
- No auth, no database, no real third-party SDKs
- Mock data only in `lib/mocks/`
- Deployed via Render (`render.yaml`)
- ESLint config uses `@eslint/eslintrc` FlatCompat wrapper for Next.js 15 compatibility

## Devin Secrets Needed

None — no authentication or external services required for local testing.
