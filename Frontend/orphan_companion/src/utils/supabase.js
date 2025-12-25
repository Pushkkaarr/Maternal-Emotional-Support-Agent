// Supabase client removed from frontend.
// This file intentionally throws to prevent accidental use of client-side DB access.
export function supabaseClientNotAvailable() {
  throw new Error('Supabase client removed from frontend. Use backend API endpoints under /api/* instead.');
}