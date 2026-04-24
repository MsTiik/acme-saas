# Acme

Demo B2B SaaS scaffold for Probe.

## Stack

- Next.js 15 (App Router), TypeScript strict, Tailwind CSS, shadcn/ui
- No auth, no database, no real third-party SDKs

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # runs prebuild → generates public/probe.manifest.json
npm start
```

## Deploy

Render deploys automatically from `main` via `render.yaml`.
