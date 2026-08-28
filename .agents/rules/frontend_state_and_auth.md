# Frontend State & Auth Architecture

1. **State Management (No Zustand)**
   - Zustand has been completely removed from this project. Do not use or reinstall it.
   - Use **TanStack React Query** for all server-state and global-state needs.
2. **Query Key Factory**
   - ALL React Query keys must be centralized in `apps/web/src/utils/queryKeys.ts`.
   - Never hardcode query keys directly in hooks.
   - When generating query keys, drop `undefined` properties from the array to allow proper fuzzy-matching during cache invalidation (e.g., `status ? ['admin', 'applications', status] : ['admin', 'applications']`).
3. **Next.js App Router & Suspense**
   - Any client component using `useSearchParams()` must be wrapped in a `<Suspense>` boundary, otherwise the production build will fail.
4. **JWT Auth & Roles**
   - The backend `requireRole` middleware trusts the role encoded in the JWT token (stateless). If a user's role is manually updated in the database, they must log out and log back in to get a new token.
