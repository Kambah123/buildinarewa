'use server';

import {newsletterSchema} from '@/lib/validations/product';
import {getServerSupabase} from '@/lib/supabase/server';
import {sendNewsletterConfirmation} from '@/lib/email';

type NewsletterState = {status: 'idle' | 'error' | 'success' | 'already'; message?: string};
export const initialNewsletterState: NewsletterState = {status: 'idle'};

export async function subscribeToNewsletter(
  locale: 'en' | 'ha',
  _: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const parsed = newsletterSchema.safeParse({email: formData.get('email'), lang: formData.get('lang') ?? locale});
  if (!parsed.success) return {status: 'error', message: parsed.error.issues[0]?.message ?? 'Enter a valid email address.'};

  const supabase = await getServerSupabase();
  if (!supabase) return {status: 'error', message: 'Newsletter subscriptions need Supabase configuration.'};
  const {data: token, error} = await supabase.rpc('subscribe_to_newsletter', {
    input_email: parsed.data.email,
    input_lang: parsed.data.lang
  });
  if (error) return {status: 'error', message: error.message};
  if (!token) return {status: 'already'};

  await sendNewsletterConfirmation({to: parsed.data.email, lang: parsed.data.lang, token: String(token)});
  return {status: 'success'};
}
