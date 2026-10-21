import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {ProductGrid} from '@/components/product-grid';
import {CategoryIcon} from '@/components/category-icon';
import {getCategories, getCategoryBySlug, getDirectory, getStates} from '@/lib/queries/catalog';
import type {Locale} from '@/lib/types';
import {localizedText} from '@/lib/utils';

export async function generateMetadata({params}: {params: Promise<{locale: Locale; slug: string}>}): Promise<Metadata> {
  const {locale, slug} = await params;
  const category = await getCategoryBySlug(slug);
  return category ? {title: localizedText(locale, category.nameEn, category.nameHa), alternates: {languages: {en: `/en/categories/${slug}`, ha: `/ha/categories/${slug}`}}} : {};
}

export default async function CategoryPage({params}: {params: Promise<{locale: Locale; slug: string}>}) {
  const {locale, slug} = await params;
  const [category, categories, states, common, productText, directoryText] = await Promise.all([getCategoryBySlug(slug), getCategories(), getStates(), getTranslations('Common'), getTranslations('Product'), getTranslations('Directory')]);
  if (!category) notFound();
  const directory = await getDirectory({category: category.slug, sort: 'featured'});
  const name = localizedText(locale, category.nameEn, category.nameHa);
  return <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
    <Link href={`/${locale}/products`} className="focus-ring inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]"><ArrowLeft size={16} />{common('backToDirectory')}</Link>
    <div className="mt-10 flex max-w-2xl items-start gap-5"><span className="grid size-15 shrink-0 place-items-center rounded-2xl bg-[color:color-mix(in_srgb,var(--indigo)_10%,transparent)] text-[var(--indigo)]"><CategoryIcon name={category.icon} size={25} /></span><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">{productText('category')}</p><h1 className="mt-2 font-display text-5xl font-semibold">{name}</h1><p className="mt-3 text-base leading-7 text-[var(--muted)]">{directoryText('results', {count: directory.total})}</p></div></div>
    <section className="mt-11"><ProductGrid products={directory.products} categories={categories} states={states} locale={locale} /></section>
  </div>;
}
