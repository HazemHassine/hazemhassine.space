import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

// Polyfill WebSocket in environments where native WebSocket is absent (e.g. Node < 22)
if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = WebSocket;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
);

// Cached (ISR) pages pass { strict: true } to their loaders. In the running
// production server a failed read then throws, so Next.js keeps serving the last
// good page instead of caching fallback content. Builds and development keep the
// repository fallback so they still work when Supabase cannot be reached.
export function shouldThrowOnReadError(strict) {
  return Boolean(
    strict &&
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PHASE !== 'phase-production-build'
  );
}

const clientOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: WebSocket,
  },
};

// Public client for fetching data in client or server components
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  clientOptions
);

// Admin client with full service-role privileges for server-side CRUD & storage operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  clientOptions
);

