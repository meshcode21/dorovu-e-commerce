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

### Auth
- ⬜ Register endpoint
- ⬜ Login endpoint (httpOnly JWT cookie)
- ⬜ Logout endpoint
- ⬜ Get current user endpoint
- ⬜ authenticate middleware
- ⬜ requireRole middleware

### Crafter Onboarding
- ⬜ Apply as crafter endpoint
- ⬜ Admin list applications endpoint
- ⬜ Admin approve application endpoint
- ⬜ Admin reject application endpoint

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
- ⬜ Homepage
- ⬜ Product search/browse page
- ⬜ Product detail page
- ⬜ Crafter shop page

### Buyer Pages
- ⬜ Cart page
- ⬜ Checkout page
- ⬜ Orders page
- ⬜ Wishlist page

### Crafter Dashboard
- ⬜ Dashboard overview
- ⬜ Product manager
- ⬜ Order manager
- ⬜ Shop settings

### Admin Panel
- ⬜ Applications queue
- ⬜ User management

---

## Database
- ✅ PostgreSQL running locally
- ✅ Prisma schema written (users, crafter_profiles, products)
- ⬜ Full schema (orders, order_items, reviews, messages, payouts)
- ⬜ Initial migration run

---

## Update this file every time a feature is completed.