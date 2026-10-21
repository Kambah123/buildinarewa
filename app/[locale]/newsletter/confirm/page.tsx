import Link from 'next/link';
import {CircleCheck, CircleX} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {getServerSupabase} from '@/lib/supabase/server';
import type {Locale} from '@/lib/types';
import {newsletterConfirmationSchema} from '@/lib/validations/product';

export default async function ConfirmNewsletterPage({params, searchParams}: {params: Promise<{locale: Locale}>; searchParams: Promise<{token?: string}>}) {
  const [{locale}, query, t] = await Promise.all([params, searchParams, getTranslations('Newsletter')]);
  const token = newsletterConfirmationSchema.safeParse({token: query.token});
  let confirmed = false;
  if (token.success) {
    const supabase = await getServerSupabase();
    if (supabase) {
      const {data} = await supabase.rpc('confirm_newsletter', {token: token.data.token});
      confirmed = data === true;
    }
  }
  return <div className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-start justify-center px-5 py-20 sm:px-8"><div className={`grid size-13 place-items-center rounded-2xl ${confirmed ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'}`}>{confirmed ? <CircleCheck size={28} /> : <CircleX size={28} />}</div><h1 className="mt-6 font-display text-5xl font-semibold">{confirmed ? t('confirmTitle') : t('confirmInvalidTitle')}</h1><p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">{confirmed ? t('confirmText') : t('confirmInvalidText')}</p><Link href={`/${locale}`} className="focus-ring mt-7 rounded-full bg-[var(--indigo)] px-5 py-3 text-sm font-bold text-white">{t('backHome')}</Link></div>;
}
