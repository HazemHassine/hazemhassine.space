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

