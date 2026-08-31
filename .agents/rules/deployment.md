---
description: Critical deployment requirements for the Vercel (Frontend) + Render (Backend) architecture
---

# Deployment Patterns (Vercel & Render)

When modifying server configuration, database connections, or API clients in this monorepo, you must adhere to the following deployment invariants:

## 1. Database Connections (Render)
Render's PostgreSQL requires SSL for external connections. When instantiating a `pg.Pool` (especially for `PrismaPgAdapter`), you must include SSL configuration if connecting to Render:
```typescript
const pool = new Pool({ 
  connectionString,
  ssl: process.env.NODE_ENV === 'production' || connectionString?.includes('render.com')
    ? { rejectUnauthorized: false }
    : false,
});
```

## 2. Express Trust Proxy
The Express backend (`apps/api`) is hosted on Render, which sits behind a load balancer that terminates SSL. To ensure Express sets `Secure: true` cookies correctly, it must trust the proxy:
```typescript
const app = express();
app.set('trust proxy', 1);
```

## 3. First-Party Cookies & API Proxying (Next.js)
To avoid third-party cookie blocking by browsers (Safari, Incognito), the frontend must **never** call the Render backend directly via absolute URLs in production.
- **Frontend Axios:** Must use relative paths (e.g., `baseURL: '/api/v1'`).
- **Next.js Config:** Must use `rewrites` to proxy `/api/v1/:path*` to `process.env.BACKEND_URL`.

## 4. Turborepo Environment Variables
If you introduce a new environment variable that affects the Next.js build output (such as `BACKEND_URL` for rewrites), you **must** add it to the `env` array of the `build` task in `turbo.json` to prevent Vercel caching issues.
