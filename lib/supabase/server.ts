import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';
import {createClient} from '@supabase/supabase-js';
import {getSupabaseConfig, hasServiceRole} from './shared';

export async function getServerSupabase() {
  const config = getSupabaseConfig();
  if (!config) return null;

  const cookieStore = await cookies();
  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({name, value, options}) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies. Middleware and route handlers refresh sessions.
        }
      }
    }
  });
}

export function getAdminSupabase() {
  const config = getSupabaseConfig();
  if (!config || !hasServiceRole) return null;
  return createClient(config.url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {autoRefreshToken: false, persistSession: false}
  });
}
