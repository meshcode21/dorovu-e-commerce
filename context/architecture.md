# Dorovu — Architecture & Project Context

> Read this file before writing any code. It tells you what the project is, how it is structured, what patterns to follow, and what conventions are enforced.

---

## What is Dorovu?

Dorovu is a **Nepal-focused handmade crafts marketplace** — similar to Etsy. People register as **crafters** (not sellers) and sell handmade goods like crochet, knitting, weaving, pottery, and clothing. Buyers discover and purchase these items directly from crafters.

Key differences from a generic e-commerce site:
- Only handmade goods — no resale, no mass-produced items
- People register as **crafters** with a craft identity, portfolio, and story
- Crafters must apply and get **admin approval** before going live
- Supports **custom/made-to-order** listings with configurable lead times
- Nepal-first payment gateways: **eSewa** and **Khalti**
- Buyers can **message crafters** before purchasing

---

## Monorepo Structure

This is a **Turborepo monorepo** managed with **pnpm workspaces**.

```
dorovu/
├── apps/
│   ├── web/                  ← Next.js 14 (App Router) — frontend
│   └── api/                  ← Express 5 + TypeScript — backend
├── packages/
│   ├── shared/               ← shared Zod schemas, TypeScript types, constants
│   ├── eslint-config/        ← shared ESLint config
│   └── typescript-config/    ← shared tsconfig
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Never put business logic in `packages/shared`.** Shared only contains:
- Zod schemas (used for validation on both API and frontend forms)
- TypeScript types/interfaces
- Constants (craft types, order statuses, etc.)

---

## Tech Stack

### Frontend — `apps/web`
| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework |
| TypeScript | Language |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| TanStack Query | Server state & Global state |
| React Hook Form + Zod | Forms and validation |
| Socket.io-client | Real-time (messages, order updates) |
| `@dorovu/shared` | Shared schemas and types |

### Backend — `apps/api`
| Tool | Purpose |
|---|---|
| Node.js + Express 5 | Server framework |
| TypeScript | Language |
| Prisma ORM | Database queries and migrations |
| PostgreSQL | Primary database |
| Socket.io | Real-time events |
| Multer + Cloudinary | Image upload and storage |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth |
| Zod | Request validation |
| Resend | Transactional emails |
| `@dorovu/shared` | Shared schemas and types |

### External Services
| Service | Purpose |
|---|---|
| eSewa | Primary Nepal payment gateway |
| Khalti | Secondary Nepal payment gateway |
| Cloudinary | Product image storage and CDN |
| Resend | Emails (order confirm, crafter approval) |
| Google OAuth | Optional social sign-in |
| Supabase | Managed PostgreSQL hosting |

---

## Backend Architecture Pattern

The backend follows **MVC — Model View Controller** pattern.  
Since this is a REST API, there is no View layer — View is handled by Next.js.  
The pattern used is: **Thin Controller / Fat Service**

```
Request
  → Router       (defines the URL and method)
  → Middleware   (auth check, role guard, validation)
  → Controller   (parses request, calls service, sends response)
  → Service      (ALL business logic lives here)
  → Prisma       (database read/write)
  → Response
```

### Rules
- **Controllers are thin** — they only call the service and return the response. No business logic in controllers.
- **Services are fat** — all logic, DB queries, error throwing, and data transformation happen in services.
- **Routes only wire URLs to controllers** — no logic in route files.
- **Middleware handles cross-cutting concerns** — auth, role checks, validation.

### Folder Structure — `apps/api/src/`

```
src/
├── routes/
│   ├── auth.routes.ts
│   ├── product.routes.ts
│   ├── order.routes.ts
│   ├── crafter.routes.ts
│   ├── message.routes.ts
│   └── payment.routes.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── product.controller.ts
│   ├── order.controller.ts
│   ├── crafter.controller.ts
│   └── payment.controller.ts
├── services/
│   ├── auth.service.ts
│   ├── product.service.ts
│   ├── order.service.ts
│   ├── crafter.service.ts
│   ├── payment.service.ts
│   └── payout.service.ts
├── middleware/
│   ├── auth.middleware.ts      ← authenticate (JWT cookie check)
│   ├── role.middleware.ts      ← requireRole('CRAFTER') etc
│   └── error.middleware.ts     ← global error handler + AppError class
├── socket/
│   └── socket.handler.ts       ← Socket.io event handlers
├── lib/
│   ├── prisma.ts               ← singleton Prisma client
│   └── cloudinary.ts           ← Cloudinary config
└── index.ts                    ← Express app entry point
```

---

## Frontend Architecture Pattern

Next.js 14 App Router with **route groups** separating concerns:

```
apps/web/src/
├── app/
│   ├── (auth)/                 ← login, register pages (no layout)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (buyer)/                ← public + buyer pages
│   │   ├── page.tsx            ← homepage
│   │   ├── products/
│   │   │   ├── page.tsx        ← search/browse
│   │   │   └── [id]/page.tsx   ← product detail
│   │   ├── shop/[slug]/page.tsx ← crafter public shop
│   │   ├── cart/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── wishlist/page.tsx
│   │   └── messages/page.tsx
│   ├── (crafter)/              ← crafter dashboard (protected)
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── products/
│   │       ├── orders/
│   │       ├── payouts/
│   │       └── shop/
│   └── (admin)/                ← admin panel (protected)
│       └── admin/
│           ├── page.tsx
│           ├── applications/
│           ├── users/
│           ├── products/
│           └── disputes/
├── components/
│   ├── ui/                     ← shadcn/ui components (do not modify)
│   ├── shared/                 ← Navbar, Footer, PageWrapper
│   ├── product/                ← ProductCard, ProductGrid, ProductForm
│   ├── crafter/                ← CrafterCard, ShopBanner, CrafterForm
│   └── order/                  ← OrderStatus, OrderTimeline, OrderItem
├── hooks/                      ← custom React hooks (useAuth, useCart etc)
└── lib/
    ├── api.ts                  ← axios instance with baseURL + credentials
    └── socket.ts               ← Socket.io client instance
```

---

## User Roles

There are exactly 3 roles stored in `users.role`:

| Role | Description |
|---|---|
| `BUYER` | Default role on registration. Can browse, cart, order, message, review. |
| `CRAFTER` | Approved crafters. All buyer permissions + shop management, listings, order fulfilment, payouts. |
| `ADMIN` | Platform managers. Full access including crafter approvals, moderation, disputes, analytics. |

### Becoming a Crafter
A user registers as BUYER → submits crafter application → admin approves → role updated to CRAFTER. This is **not automatic**.

---

## Database Schema Overview

All tables use **UUID primary keys**. All tables have `createdAt` and `updatedAt` via Prisma.

```
users
  ├── crafter_stores       (1:1 — only if role = CRAFTER)
  │    └── products
  │         └── product_variants
  └── orders               (as buyer)
       └── order_items
            └── reviews

crafter_stores → payouts
users ↔ users    → message_threads → messages
```

### Core Tables

**`users`** — Everyone on the platform. `role` field determines access. Auth is verified using stateless JWT tokens.

**`crafter_stores`** — Extended profile for crafters. Decoupled from the `User` auth object. Contains shop name, bio, craft types, portfolio images, approval status, commission rate. Linked 1:1 to users. Frontend fetches this via `useCrafterStore`.

**`products`** — Items listed for sale. Belongs to a crafter. Has title, description, price, images (Cloudinary URLs), tags, craft type, category, custom order flag, lead time, and `totalSales` (used for the trending products algorithm).

**`product_variants`** — Variations of a product (colour, size). Each variant has its own stock count and optional price adjustment. One product can have many variants.

**`orders`** — One order per checkout session. Belongs to a buyer. Has total amount, payment status, payment reference (from eSewa/Khalti gateway), shipping address (jsonb).

**`order_items`** — Individual products within an order. One row per product per crafter. Crafters manage their own order items independently (accept, ship, add tracking). Crafter ID is denormalised here for easy querying.

**`reviews`** — Star rating + text. Linked to a specific order_item so only verified purchasers can review. One review per order_item (unique constraint). Crafters can reply via `crafterReply` field.

**`messages`** — Chat between buyer and crafter. Grouped by `threadId`. Has sender, content, attachment URL, read timestamp.

**`payouts`** — Tracks earnings sent to crafters. Records amount, commission deducted, payout method, and status (PENDING / PROCESSING / DONE).

---

## Authentication

- JWT stored in **httpOnly cookies** (not localStorage)
- Two tokens: `accessToken` (15min) and `refreshToken` (7 days)
- Cookie names: `accessToken`, `refreshToken`
- All authenticated routes read token from cookie, not Authorization header
- On logout: both cookies are cleared

### Middleware Usage
```ts
// protect any route
router.get('/me', authenticate, controller.getMe)

// protect + require specific role
router.post('/products', authenticate, requireRole('CRAFTER'), controller.create)
router.get('/admin/applications', authenticate, requireRole('ADMIN'), controller.list)
```

---

## API Conventions

- Base URL: `/api/v1`
- All responses are JSON
- Error responses: `{ message: string }`
- Success responses: `{ data?, message? }`
- Use `AppError` class to throw handled errors:
  ```ts
  throw new AppError(404, 'Product not found')
  ```
- All request bodies validated with Zod schemas from `@dorovu/shared`
- Pagination: `?page=1&limit=20` query params

### Endpoint Pattern
```
GET    /api/v1/products          ← list / search
GET    /api/v1/products/:id      ← single item
POST   /api/v1/products          ← create (CRAFTER only)
PUT    /api/v1/products/:id      ← update (CRAFTER only, own products)
DELETE /api/v1/products/:id      ← delete (CRAFTER only, own products)
```

---

## Payment Flow

### eSewa (Primary)
1. Frontend calls `POST /api/v1/payments/esewa/initiate`
2. Backend creates order (status: PENDING_PAYMENT), returns signed form fields
3. Frontend auto-submits POST form to eSewa gateway
4. Buyer completes payment on eSewa
5. eSewa redirects to `GET /api/v1/payments/esewa/verify?data={base64}`
6. Backend decodes base64, verifies HMAC-SHA256 signature
7. Backend calls eSewa status API to confirm
8. On success: order → PAID, order_items created, crafter notified

### Khalti (Secondary)
1. Frontend calls `POST /api/v1/payments/khalti/initiate`
2. Backend returns payment URL
3. Buyer completes on Khalti
4. Frontend calls `POST /api/v1/payments/khalti/verify` with token
5. Backend calls Khalti lookup API, confirms amount matches
6. On success: order → PAID

---

## Order Lifecycle

```
PENDING_PAYMENT
  → PAID              (payment confirmed)
    → ACCEPTED         (crafter accepts the order item)
      → IN_PRODUCTION  (crafter is making the item)
        → SHIPPED      (crafter adds tracking, marks shipped)
          → DELIVERED  (buyer confirms receipt)
            → COMPLETED (review window opens)

At any point before ACCEPTED:
  → CANCELLED
  → REFUNDED
```

Each `order_item` has its own `crafterStatus` field — buyers can order from multiple crafters in one checkout and each crafter manages their item independently.

---

## Real-time Events (Socket.io)

Socket connection is authenticated — JWT verified on handshake.

| Event | Direction | Trigger |
|---|---|---|
| `new_order` | Server → Crafter | Buyer places order |
| `order_status_update` | Server → Buyer | Crafter updates order item status |
| `new_message` | Server → Recipient | New chat message sent |
| `notification` | Server → User | Generic platform notification |

---

## Shared Package Usage

Always import from `@dorovu/shared` for types and schemas:

```ts
// in apps/api — validate request body
import { CreateProductSchema } from '@dorovu/shared'
const data = CreateProductSchema.parse(req.body)

// in apps/web — validate form
import { CreateProductSchema } from '@dorovu/shared'
const form = useForm({ resolver: zodResolver(CreateProductSchema) })

// types
import type { User, CraftType, OrderStatus } from '@dorovu/shared'
```

Never duplicate types or schemas. If a type is needed in both apps, it belongs in `packages/shared`.

---

## Environment Variables

### `apps/api/.env`
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dorovu
JWT_SECRET=
JWT_REFRESH_SECRET=
CLIENT_URL=http://localhost:3000
PORT=3001
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
ESEWA_SECRET_KEY=
ESEWA_MERCHANT_ID=
KHALTI_SECRET_KEY=
```

### `apps/web/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

---

## Code Conventions

### Naming
- Files: `kebab-case` → `auth.service.ts`, `product.controller.ts`
- Components: `PascalCase` → `ProductCard.tsx`, `OrderStatus.tsx`
- Variables/functions: `camelCase`
- Database columns: `camelCase` in Prisma schema (maps to snake_case in PostgreSQL via `@map`)
- Constants: `UPPER_SNAKE_CASE`

### Import Order (enforce with ESLint)
1. Node built-ins
2. External packages
3. Internal packages (`@dorovu/shared`)
4. Local imports (`../services/...`)

### Error Handling
- Always use `AppError` for expected errors (400, 401, 403, 404)
- Let the global `errorHandler` middleware catch and format responses
- Never send raw error messages from catch blocks to the client
- Always wrap controller methods in try/catch and call `next(err)`

### Prisma
- Always use the singleton from `src/lib/prisma.ts` — never instantiate `new PrismaClient()` elsewhere
- Run `npx prisma migrate dev --name <description>` after schema changes
- Run `npx prisma generate` after migrate to regenerate the client

---

## Running the Project

```bash
# from root — runs both web and api
pnpm dev

# web only
pnpm --filter @dorovu/web dev

# api only
pnpm --filter @dorovu/api dev

# database migrations
cd apps/api && npx prisma migrate dev --name <name>

# prisma studio (visual DB browser)
cd apps/api && npx prisma studio

# install a package in a specific app
pnpm --filter @dorovu/api add <package>
pnpm --filter @dorovu/web add <package>
pnpm --filter @dorovu/shared add <package>
```

---

## What NOT to Do

- Do not write business logic in controllers — put it in services
- Do not call Prisma directly from controllers — always go through services
- Do not store JWT in localStorage — use httpOnly cookies only
- Do not duplicate types between apps — use `@dorovu/shared`
- Do not create a new Prisma client instance — use the singleton in `lib/prisma.ts`
- Do not use `any` type in TypeScript
- Do not skip Zod validation on incoming request bodies
- Do not hardcode API URLs — use environment variables
- Do not commit `.env` files — use `.env.example` instead
- Do not modify files inside `components/ui/` — these are shadcn managed

---

## Key Business Rules

1. A user can only have one crafter profile
2. A crafter must be APPROVED before their products are visible in search
3. Only buyers who have a DELIVERED order_item for a product can leave a review
4. One review per order_item (enforced by unique constraint in DB)
5. Platform commission is deducted before payout (default 10%)
6. Funds are held in escrow until order status is DELIVERED
7. Crafter can only manage their own products and order items — never another crafter's
8. Admin can approve/reject crafters, moderate any content, and resolve disputes
9. Custom order listings require `leadTimeDays` to be set
10. Product images are uploaded to Cloudinary — store only the URL in the database