---
description: Architecture guidelines for the Next.js App Router frontend, focusing on Server Components, Data Fetching, and Loading states.
---

# Next.js App Router Architecture

When working on the Dorovu frontend (`apps/web`), strictly follow these Next.js App Router conventions:

1. **Default to Server Components**: All pages (`page.tsx`) must default to React Server Components (RSC) to prevent "blank screen" flashes on initial load.
2. **Server-Side Data Fetching**: Perform data fetching directly on the server (using `serverFetch` or `fetch` with absolute URLs to the backend) rather than using client-side `useQuery` hooks for initial page loads.
3. **Extract Client Components**: Only use `'use client'` at the leaf-node level for components that strictly require interactivity (e.g., buttons, forms, variant selectors). Do not make an entire page a client component unless absolutely necessary.
4. **Native Loading States**: Use Next.js's built-in `loading.tsx` convention to stream skeleton loaders while the server fetches data. Do not use intrusive, full-screen custom overlays or global loaders.
