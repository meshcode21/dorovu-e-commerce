# Dorovu — Progress Tracker

Last updated: August 2026

## Legend
- ✅ Done
- 🔄 In Progress
- ⬜ Not Started

---

## Backend

### Infrastructure
- ✅ Turborepo monorepo setup
- ✅ pnpm workspaces configured
- ✅ Express app scaffolded
- ✅ Prisma + PostgreSQL connected
- ✅ Shared package configured
- ✅ TypeScript configured across all apps

### Phase 1: Core Foundation & API
- [x] **Step 1: Setup Workspace**
  - Next.js 14 + Tailwind v4 + Express + Prisma + Turborepo 
- [x] **Step 2: Auth (Backend)**
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login` (httpOnly cookie JWT)
  - `POST /api/v1/auth/google` (OAuth integration)
  - `POST /api/v1/auth/logout`
  - `GET /api/v1/auth/me`
  - `authenticate` middleware
  - `requireRole` middleware

### Crafter Onboarding
- [x] Apply as crafter endpoint
- [x] Admin list applications endpoint
- [x] Admin approve application endpoint
- [x] Admin reject application endpoint

### Products
- [x] Create product endpoint
- [x] List/search products endpoint
- [x] Get single product endpoint
- [x] Update product endpoint
- [x] Delete product endpoint
- [x] Cloudinary image upload integration
- [x] Categories & Craft Types admin endpoints

### Orders
- [x] Create order endpoint
- [x] List orders endpoint
- [x] Get order detail endpoint
- [x] Update order status endpoint
- [x] Cancel order endpoint

### Payments
- ⬜ eSewa initiate endpoint
- ⬜ eSewa verify callback endpoint
- ⬜ Khalti initiate endpoint
- ⬜ Khalti verify endpoint

---

## Frontend

### Setup
- ✅ Next.js 14 app created
- ✅ Tailwind configured
- ✅ shadcn/ui installed
- ✅ TanStack Query provider setup
- ✅ Axios instance configured
- ✅ Zustand cart store created
- ✅ Zustand auth store created

### Auth Pages
- ✅ Login page
- ✅ Register page
- ✅ Protected route logic

### Frontend Pages
- [x] Homepage & Navigation
- [x] Product search/filter page
- [x] Product detail page
- [x] Crafter shop page
- [x] Crafter application page

### Admin Dashboard
- [x] Overview / Applications list

### Buyer Pages
- [x] Cart page
- [x] Checkout page
- [x] Orders page
- ⬜ Wishlist page (Skipped for now)

### Crafter Dashboard
- [x] Dashboard overview
- [x] Product manager
- [x] Order manager
- ⬜ Shop settings

---

## Database
- ✅ PostgreSQL running locally
- ✅ Prisma schema written (users, crafter_profiles, products)
- ✅ Full schema (orders, order_items, reviews, messages, payouts, avg_rating, cart, cart_items)
- ✅ Initial migration run (db push)

---

## Update this file every time a feature is completed.