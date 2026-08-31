# Dorovu — Project Overview

## What is it?
Dorovu is a Nepal-focused handmade crafts marketplace. People register as
"crafters" and sell handmade goods like crochet, knitting, weaving, pottery,
and clothing. Buyers discover and purchase directly from crafters.

Think Etsy — but built specifically for Nepal.

## Who is it for?
- **Crafters** — Nepali artisans who make things by hand and want to sell online
- **Buyers** — People who want to buy unique handmade products
- **Admins** — Platform team who approve crafters and manage the marketplace

## What makes it different from Daraz?
- Only handmade goods — no resale, no mass-produced items
- Sellers are called "crafters" — identity and craft story are first-class
- Crafters must apply and get approved before going live
- Supports custom/made-to-order listings
- Nepal-first payments: eSewa and Khalti
- Buyers can message crafters before purchasing
- **Secure Delivery & Payouts**: Uses a 6-digit OTP delivery system. Admins manage logistics; crafters only handle making and packaging the item.
- **Buy Now**: Supports direct instant purchases alongside traditional cart checkout.

## Current Stage
MVP — building core features: auth, crafter onboarding, product listings,
cart, Buy Now, checkout, eSewa payment, strict order state machine, admin logistics portal, and delivery OTPs.

## Stack
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind, shadcn/ui
- Backend: Express 5, TypeScript, Prisma, PostgreSQL
- Monorepo: Turborepo + pnpm workspaces

## Repo Structure

dorovu/
  ├── apps/web ← Next.js frontend
  ├── apps/api ← Express backend
  ├── packages/shared ← shared types + zod schemas
  └── context/ ← all agent context files (this folder)