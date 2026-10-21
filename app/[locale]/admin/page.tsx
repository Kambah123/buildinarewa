import {getTranslations} from 'next-intl/server';
import {redirect} from 'next/navigation';
import {ReviewCard} from '@/components/review-card';
import {getReviewProducts, getViewer} from '@/lib/queries/account';
import {getCategories, getStates} from '@/lib/queries/catalog';
import type {Locale} from '@/lib/types';

export default async function AdminPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const viewer = await getViewer();
  if (!viewer) redirect(`/${locale}/sign-in?next=/${locale}/admin`);
  const t = await getTranslations('Admin');
  if (viewer.role !== 'admin' && viewer.role !== 'editor') return <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8"><h1 className="font-display text-4xl font-semibold">{t('notAllowed')}</h1></div>;
  const [queue, categories, states] = await Promise.all([getReviewProducts(), getCategories(), getStates()]);
  return <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">Editorial workspace</p><h1 className="mt-3 font-display text-5xl font-semibold">{t('title')}</h1><p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">{t('intro')}</p><div className="mt-10 space-y-5">{queue.length ? queue.map(({product, submitter}) => <ReviewCard key={product.id} locale={locale} product={product} submitter={submitter} categories={categories} states={states} />) : <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-10 text-center"><p className="font-display text-3xl font-semibold">{t('empty')}</p></div>}</div></div>;
}
