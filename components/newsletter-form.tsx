'use client';

import {useActionState} from 'react';
import {ArrowRight, CheckCircle2} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {initialNewsletterState, subscribeToNewsletter} from '@/app/[locale]/newsletter/actions';
import type {Locale} from '@/lib/types';

export function NewsletterForm({locale, compact = false}: {locale: Locale; compact?: boolean}) {
  const [state, action, pending] = useActionState(subscribeToNewsletter.bind(null, locale), initialNewsletterState);
  const t = useTranslations('Newsletter');
  if (state.status === 'success' || state.status === 'already') return <div className={`rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--ink)] ${compact ? '' : 'max-w-xl'}`}><CheckCircle2 className="inline text-[var(--indigo)]" size={18} /> <span className="ml-1">{state.status === 'already' ? t('alreadySubscribed') : t('success')}</span></div>;
  return <form action={action} className={`grid gap-3 ${compact ? 'sm:grid-cols-[minmax(0,1fr)_auto_auto]' : 'sm:grid-cols-[minmax(0,1fr)_9rem_auto]'}`}>
    <label className="sr-only" htmlFor={`newsletter-email-${locale}`}>{t('email')}</label>
    <input id={`newsletter-email-${locale}`} name="email" type="email" required autoComplete="email" placeholder={t('email')} className="focus-ring min-w-0 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)]" />
    <label className="sr-only" htmlFor={`newsletter-lang-${locale}`}>{t('language')}</label>
    <select id={`newsletter-lang-${locale}`} name="lang" defaultValue={locale} className="focus-ring rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-3 text-sm font-semibold text-[var(--ink)]"><option value="en">English</option><option value="ha">Hausa</option></select>
    <button type="submit" disabled={pending} className="focus-ring inline-flex items-center justify-center gap-1 rounded-xl bg-[var(--indigo)] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{t('subscribe')} <ArrowRight size={16} /></button>
    {state.status === 'error' ? <p className="sm:col-span-3 text-sm text-red-700 dark:text-red-300" role="alert">{state.message ?? t('error')}</p> : null}
  </form>;
}
