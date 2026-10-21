'use server';

import {headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {getServerSupabase} from '@/lib/supabase/server';
import {emailSchema} from '@/lib/validations/product';

type AuthState = {status: 'idle' | 'error' | 'sent'; message?: string; email?: string};
export const initialAuthState: AuthState = {status: 'idle'};

async function getOrigin() {
  const headerList = await headers();
  const forwardedHost = headerList.get('x-forwarded-host');
  const host = forwardedHost ?? headerList.get('host');
  const protocol = headerList.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https');
  return host ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000');
}

function safeNext(value: string, locale: string) {
  const fallback = `/${locale}/me`;
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;
  return value;
}

export async function sendMagicLink(
  locale: 'en' | 'ha',
  _: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = emailSchema.safeParse({email: formData.get('email'), next: formData.get('next')});
  if (!parsed.success) return {status: 'error', message: parsed.error.issues[0]?.message ?? 'Enter a valid email.'};

  const supabase = await getServerSupabase();
  if (!supabase) return {status: 'error', message: 'Authentication is not configured yet.'};

  const origin = await getOrigin();
  const next = safeNext(parsed.data.next, locale);
  const {error} = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      shouldCreateUser: true
    }
  });
  if (error) return {status: 'error', message: error.message};
  return {status: 'sent', email: parsed.data.email};
}

export async function signInWithGoogle(locale: 'en' | 'ha', formData: FormData) {
  const supabase = await getServerSupabase();
  const next = safeNext(String(formData.get('next') ?? ''), locale);
  if (!supabase) redirect(`/${locale}/sign-in?error=config&next=${encodeURIComponent(next)}`);

  const origin = await getOrigin();
  const {data, error} = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`}
  });
  if (error || !data.url) redirect(`/${locale}/sign-in?error=oauth&next=${encodeURIComponent(next)}`);
  redirect(data.url);
}
