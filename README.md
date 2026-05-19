# Insurely — Public Waitlist Website

Public marketing and waitlist website for Insurely, a licensed insurance agency helping customers discover motor insurance through licensed insurance partners.

This repo contains only the public website. Backend infrastructure (payment webhooks, Edge Functions, migrations, certificate issuance) lives in a separate repository.

## What this site does

- Explains what Insurely is and how it will work at launch
- Captures waitlist emails via Supabase (anonymous insert only, RLS-restricted)
- Provides motor insurance product information
- Links to Privacy Policy and Terms of Service

## Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router v6 (real URL routes)
- **Backend**: Supabase (waitlist email capture only)
- **Deployment**: Vercel

## Pages

| Route | Page |
|---|---|
| `/` | Home — hero, how it works, cover options, trust, waitlist CTA |
| `/motor-insurance` | Motor Insurance — cover types, requirements, process |
| `/about` | About Insurely |
| `/faq` | Frequently asked questions |
| `/contact` | Contact form |
| `/privacy` | Privacy Policy (waitlist scope) |
| `/terms` | Terms of Service (waitlist scope) |
| `/confirmation` | Post-signup confirmation |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase credentials
npm run dev
```

## Environment variables

See `.env.example`. Only two frontend-safe variables are needed:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

The anon key has RLS locked down: anonymous users can only insert into `pending_verifications`, not read or update.

## Build and deploy

```bash
npm run build    # outputs to dist/
npm run preview  # preview production build locally
```

Vercel deployment is configured via `vercel.json`. All paths rewrite to `index.html` for client-side routing.

## CI

GitHub Actions runs `npm ci && npm run build` on every PR and push to `main`. See `.github/workflows/ci.yml`.

## Scope notes

- Do not add payment, certificate issuance, or live quote functionality to this repo.
- All copy must reflect waitlist/lead-capture scope — no promises of instant bind, DMVIC issuance, or live pricing.
- Named carrier logos or names require formal partnership agreements before use.

## License

Private — Insurely © 2026
