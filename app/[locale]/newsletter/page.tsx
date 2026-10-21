import {NewsletterForm} from '@/components/newsletter-form';
import type {Locale} from '@/lib/types';
import {getTranslations} from 'next-intl/server';

export default async function NewsletterPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const t = await getTranslations('Newsletter');
  return <div className="arewa-pattern"><div className="mx-auto flex min-h-[58vh] max-w-4xl items-center px-5 py-16 sm:px-8 sm:py-24"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">{t('eyebrow')}</p><h1 className="mt-4 font-display text-5xl font-semibold leading-[0.98] sm:text-7xl">{t('title')}</h1><p className="mt-6 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">{t('intro')}</p><div className="mt-9"><NewsletterForm locale={locale} /></div></div></div></div>;
}
