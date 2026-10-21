import Link from 'next/link';
import {getLocale, getTranslations} from 'next-intl/server';

export default async function NotFound() {
  const [t, locale] = await Promise.all([getTranslations('NotFound'), getLocale()]);
  return <div className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-start justify-center px-5 py-20 sm:px-8"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">404</p><h1 className="mt-3 font-display text-5xl font-semibold">{t('title')}</h1><p className="mt-4 max-w-lg text-base leading-7 text-[var(--muted)]">{t('text')}</p><Link href={`/${locale}/products`} className="focus-ring mt-7 rounded-full bg-[var(--indigo)] px-5 py-3 text-sm font-bold text-white">{t('action')}</Link></div>;
}
