// supabase.js – inisialisasi klien Supabase (ESM) dengan versi terkunci
// Versi Supabase JS v2.38.0 (sesuai dokumentasi pada 2026)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/dist/esm/index.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Persist session in localStorage (hanya token), aman karena hanya anon key
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    // Aktifkan realtime untuk tabel products
    // Default sudah termasuk, tidak perlu konfigurasi khusus
  },
});
