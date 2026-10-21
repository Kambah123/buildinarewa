import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {SubmitProductForm} from '@/components/submit-product-form';
import {getViewer} from '@/lib/queries/account';
import {getCategories, getStates} from '@/lib/queries/catalog';
import type {Locale} from '@/lib/types';

export default async function SubmitPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const [viewer, categories, states, t, common] = await Promise.all([getViewer(), getCategories(), getStates(), getTranslations('Submit'), getTranslations('Common')]);
  return <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
    <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">For builders</p><h1 className="mt-3 font-display text-5xl font-semibold leading-[0.98] sm:text-6xl">{t('title')}</h1><p className="mt-5 text-base leading-7 text-[var(--muted)]">{t('intro')}</p></div>
    <div className="mt-10">
      {viewer ? <SubmitProductForm locale={locale} categories={categories} states={states} /> : <div className="max-w-xl rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7 sm:p-9"><h2 className="font-display text-3xl font-semibold">{t('signInTitle')}</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{t('signInText')}</p><Link href={`/${locale}/sign-in?next=/${locale}/submit`} className="focus-ring mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--indigo)] px-5 py-3 text-sm font-bold text-white">{common('signIn')} <ArrowRight size={16} /></Link></div>}
    </div>
  </div>;
}
