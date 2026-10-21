import {createBrowserClient} from '@supabase/ssr';
import {getSupabaseConfig} from './shared';

export function getBrowserSupabase() {
  const config = getSupabaseConfig();
  if (!config) return null;
  return createBrowserClient(config.url, config.anonKey);
}
