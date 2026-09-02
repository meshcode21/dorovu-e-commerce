export async function serverFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:4000';
  const url = `${baseUrl}/api/v1${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    // Adding Next.js revalidation so data isn't stale forever (default cache can be too aggressive)
    next: {
      revalidate: options?.next?.revalidate ?? 60, // Revalidate every 60 seconds by default
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }

  return res.json();
}
