// Supabase client removed from frontend.
// Use backend API endpoints instead (e.g., /api/auth, /api/db/*).
export function supabaseClientNotAvailable() {
  throw new Error('Supabase client removed from frontend. Use backend API endpoints under /api/* instead.');
}