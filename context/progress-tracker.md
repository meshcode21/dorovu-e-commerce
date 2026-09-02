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
- ✅ Query Key Factory implemented
- ✅ Architecture: Removed Zustand, using React Query for state

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
- ✅ Shop settings

---

## Database
- ✅ PostgreSQL running locally
- ✅ Prisma schema written (users, crafter_stores, products)
- ✅ Full schema (orders, order_items, reviews, messages, payouts, avg_rating, cart, cart_items)
- ✅ Added `totalSales` to `products` schema for trending algorithms
- ✅ Initial migrations run (db push)

---

## Recent Fixes & Features (August 2026)
- ✅ Trending Products dynamically fetched using actual `totalSales`
- ✅ Dynamic Notification Badges for pending orders (Crafter Navbar) using shadcn
- ✅ Crafter Store page routing and UI overhaul (fully public and themed)
- ✅ Product Review System (Buyer reviews, Crafter replies, dynamic rating recalculation)
- ✅ "Buy Now" flow for instant checkout bypassing the cart
- ✅ Strict Order State Machine (Pending -> Accepted -> Ready for Pickup -> Shipped -> Out for Delivery -> Delivered)
- ✅ Public Order Tracking System (`/tracking`)
- ✅ Admin Logistics Portal (`/admin/logistics`) to manage active shipments
- ✅ Secure Delivery OTP system tied to crafter payouts
- ✅ **Major Architecture Refactor:** Migrated public frontend pages to React Server Components (RSC) for SSR/SEO, dropping client-side SPA fetching and replacing custom loaders with Next.js native `loading.tsx` streaming.
- ✅ Implemented `/:id/recommendations` API and Similar Products Grid on product details page.
- ✅ Fixed Global Navbar Search to properly sync URL query params and filter products.
- ✅ **Admin Category Management:** Added database-backed images for categories with Cloudinary upload and full CRUD support.
- ✅ **Admin Craft Types CRUD:** Implemented full CRUD management for craft types with edit capabilities.
- ✅ **Crafter Product Image Management:** Fixed image removal and state synchronization on product edit.
- ✅ **Dynamic Hero Action Buttons:** Role-aware landing page hero CTA adapting between Crafter Studio, Admin Portal, and Start Selling.
- ✅ **Debounced Product Search:** Added 350ms search debounce for smooth, responsive product filtering.

---

## Update this file every time a feature is completed.