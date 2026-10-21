import {getTranslations} from 'next-intl/server';
import {SignInForm} from '@/components/sign-in-form';
import type {Locale} from '@/lib/types';

export default async function SignInPage({params, searchParams}: {params: Promise<{locale: Locale}>; searchParams: Promise<{next?: string; error?: string}>}) {
  const [{locale}, query, t] = await Promise.all([params, searchParams, getTranslations('Auth')]);
  const next = query.next?.startsWith('/') && !query.next.startsWith('//') ? query.next : `/${locale}/me`;
  return <div className="mx-auto grid min-h-[calc(100vh-20rem)] max-w-7xl items-center px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-20">
    <div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">Arewa Is Building</p><h1 className="mt-4 font-display text-5xl font-semibold leading-[0.98] sm:text-6xl">{t('title')}</h1><p className="mt-5 text-base leading-7 text-[var(--muted)]">{t('intro')}</p><div className="mt-10 hidden border-l-2 border-[var(--sand)] pl-5 text-sm leading-6 text-[var(--muted)] lg:block">{t('privacyNote')}</div></div>
    <div className="mt-10 max-w-md lg:mt-0"><SignInForm locale={locale} next={next} configError={query.error === 'config'} /></div>
  </div>;
}
