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
- ⬜ Create product endpoint
- ⬜ List/search products endpoint
- ⬜ Get single product endpoint
- ⬜ Update product endpoint
- ⬜ Delete product endpoint
- ⬜ Cloudinary image upload

### Orders
- ⬜ Create order endpoint
- ⬜ List orders endpoint
- ⬜ Get order detail endpoint
- ⬜ Update order status endpoint
- ⬜ Cancel order endpoint

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

### Public Pages
- [x] Homepage
- ⬜ Product search/browse page
- ⬜ Product detail page
- ⬜ Crafter shop page
- [x] Crafter application page

### Admin Dashboard
- [x] Overview / Applications list

### Buyer Pages
- ⬜ Cart page
- ⬜ Checkout page
- ⬜ Orders page
- ⬜ Wishlist page

### Crafter Dashboard
- [x] Dashboard overview
- ⬜ Product manager
- ⬜ Order manager
- ⬜ Shop settings

---

## Database
- ✅ PostgreSQL running locally
- ✅ Prisma schema written (users, crafter_profiles, products)
- ⬜ Full schema (orders, order_items, reviews, messages, payouts)
- ⬜ Initial migration run

---

## Update this file every time a feature is completed.