# Dorovu — Build Plan

## Phase 1 — MVP (Current Phase)
Build in this exact order. Do not jump ahead.

### Step 1 — Backend Foundation ✅
- [x] Turborepo monorepo setup
- [x] Express app scaffolding
- [x] Prisma + PostgreSQL connected
- [x] Shared package setup

### Step 2 — Auth (Completed) ✅
- [x] POST /api/v1/auth/register
- [x] POST /api/v1/auth/login (httpOnly cookie JWT)
- [x] POST /api/v1/auth/logout
- [x] GET  /api/v1/auth/me
- [x] authenticate middleware
- [x] requireRole middleware
- [x] Google OAuth Integration

### Step 3 — Crafter Onboarding (Completed) ✅
- [x] POST /api/v1/crafters/apply
- [x] GET  /api/v1/admin/applications (admin only)
- [x] PUT  /api/v1/admin/applications/:id/approve
- [x] PUT  /api/v1/admin/applications/:id/reject
- [x] Build Admin Panel UI for managing applications

### Step 4 — Products
- [ ] POST   /api/v1/products (crafter only)
- [ ] GET    /api/v1/products (public, with search + filter)
- [ ] GET    /api/v1/products/:id (public)
- [ ] PUT    /api/v1/products/:id (crafter only, own product)
- [ ] DELETE /api/v1/products/:id (crafter only, own product)
- [ ] Image upload via Cloudinary

### Step 5 — Cart + Orders
- [ ] POST /api/v1/orders (create order from cart)
- [ ] GET  /api/v1/orders (buyer: my orders, crafter: incoming)
- [ ] GET  /api/v1/orders/:id
- [ ] PUT  /api/v1/orders/:id/status (crafter updates)
- [ ] POST /api/v1/orders/:id/cancel

### Step 6 — eSewa Payment
- [ ] POST /api/v1/payments/esewa/initiate
- [ ] GET  /api/v1/payments/esewa/verify (callback)

### Step 7 — Frontend Auth Pages
- [ ] /login page
- [ ] /register page
- [ ] auth store (Zustand)
- [ ] protected route middleware

### Step 8 — Frontend Core Pages
- [ ] Homepage
- [ ] Product listing/search page
- [ ] Product detail page
- [ ] Crafter shop page

### Step 9 — Frontend Crafter Dashboard
- [ ] /dashboard overview
- [ ] /dashboard/products (CRUD)
- [ ] /dashboard/orders

### Step 10 — Frontend Checkout
- [ ] Cart page
- [ ] Checkout flow
- [ ] eSewa payment redirect

## Phase 2 — Core (After MVP)
- [ ] Khalti payment
- [ ] Product variants
- [ ] Reviews and ratings
- [ ] Direct messaging (Socket.io)
- [ ] Crafter analytics dashboard
- [ ] Payout tracking
- [ ] Wishlist + follow system
## Phase 3 — Polish
- [ ] Google OAuth
- [ ] Full-text search (PostgreSQL tsvector)
- [ ] Email notifications (Resend)
- [ ] Mobile responsiveness audit

## Rules
- Always complete the current step before moving to the next
- Backend route must exist before building the frontend page for it
- Update progress-tracker.md when a step is completed