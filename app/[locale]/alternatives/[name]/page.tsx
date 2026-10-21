import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {ProductGrid} from '@/components/product-grid';
import {getCategories, getStates} from '@/lib/queries/catalog';
import {getAlternative, getUpvotedProductIds} from '@/lib/queries/community';
import type {Locale} from '@/lib/types';

function displayName(value: string) {
  return decodeURIComponent(value).replace(/-/g, ' ');
}

export async function generateMetadata({params}: {params: Promise<{locale: Locale; name: string}>}): Promise<Metadata> {
  const {name} = await params;
  const productName = displayName(name);
  return {title: `Alternatives to ${productName}`, alternates: {languages: {en: `/en/alternatives/${name}`, ha: `/ha/alternatives/${name}`}}};
}

export default async function AlternativesPage({params}: {params: Promise<{locale: Locale; name: string}>}) {
  const {locale, name} = await params;
  const alternative = displayName(name);
  const [products, categories, states, t] = await Promise.all([getAlternative(alternative), getCategories(), getStates(), getTranslations('Alternative')]);
  const upvotedProductIds = await getUpvotedProductIds(products.map((product) => product.id));
  return <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12"><Link href={`/${locale}/products`} className="focus-ring inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]"><ArrowLeft size={16} />{t('browse')}</Link><div className="mt-10 max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--indigo)]">{t('eyebrow')}</p><h1 className="mt-3 font-display text-5xl font-semibold leading-[.98] sm:text-6xl">{t('title', {name: alternative})}</h1><p className="mt-4 text-base leading-7 text-[var(--muted)]">{t('intro', {name: alternative})}</p></div>{products.length ? <div className="mt-10"><ProductGrid products={products} categories={categories} states={states} locale={locale} upvotedProductIds={upvotedProductIds} /></div> : <div className="mt-10 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-8"><p className="max-w-lg text-sm leading-6 text-[var(--muted)]">{t('empty', {name: alternative})}</p><Link href={`/${locale}/products`} className="focus-ring mt-5 inline-block rounded-full bg-[var(--indigo)] px-4 py-2.5 text-sm font-bold text-white">{t('browse')}</Link></div>}</div>;
}
