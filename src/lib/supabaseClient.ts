import { createClient } from '@supabase/supabase-js';

// Sanitize Supabase URL if dashboard URL or trailing slashes were provided
function sanitizeSupabaseUrl(url?: string): string {
  const defaultUrl = 'https://jcofukpxhezhvzaonfxe.supabase.co';
  if (!url || typeof url !== 'string') return defaultUrl;
  
  const trimmed = url.trim().replace(/\/$/, '');
  const dashboardMatch = trimmed.match(/dashboard\/project\/([a-z0-9]+)/i);
  if (dashboardMatch && dashboardMatch[1]) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return defaultUrl;
}

const rawUrl = (import.meta.env && import.meta.env.VITE_SUPABASE_URL) || '';
const rawKey = (import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || '';

export const SUPABASE_URL = sanitizeSupabaseUrl(rawUrl);
export const SUPABASE_ANON_KEY =
  rawKey ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjb2Z1a3B4aGV6aHZ6YW9uZnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NDE0OTAsImV4cCI6MjEwMzQxNzQ5MH0.9eHKiPncFSRKKCe7BRXr5oMkIkjNjTXh3LzZ0RUWg-o';

// Browser-side Supabase client for Vercel, static hosting, and local development
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
