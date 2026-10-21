import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowLeft, MapPin} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {ProductGrid} from '@/components/product-grid';
import {getCategories, getDirectory, getStateBySlug, getStates} from '@/lib/queries/catalog';
import type {Locale} from '@/lib/types';

export async function generateMetadata({params}: {params: Promise<{locale: Locale; state: string}>}): Promise<Metadata> {
  const {state: stateSlug} = await params;
  const state = await getStateBySlug(stateSlug);
  return state ? {title: `Built in ${state.name}`, alternates: {languages: {en: `/en/states/${stateSlug}`, ha: `/ha/states/${stateSlug}`}}} : {};
}

export default async function StatePage({params}: {params: Promise<{locale: Locale; state: string}>}) {
  const {locale, state: stateSlug} = await params;
  const [state, categories, states, common, directoryText] = await Promise.all([getStateBySlug(stateSlug), getCategories(), getStates(), getTranslations('Common'), getTranslations('Directory')]);
  if (!state) notFound();
  const directory = await getDirectory({state: state.code, sort: 'featured'});
  return <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
    <Link href={`/${locale}/products`} className="focus-ring inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]"><ArrowLeft size={16} />{common('backToDirectory')}</Link>
    <div className="mt-10 flex max-w-2xl items-start gap-5"><span className="grid size-15 shrink-0 place-items-center rounded-2xl bg-[color:color-mix(in_srgb,var(--sand)_24%,transparent)] text-[var(--ink)]"><MapPin size={26} /></span><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">{state.region}</p><h1 className="mt-2 font-display text-5xl font-semibold">{state.name}</h1><p className="mt-3 text-base leading-7 text-[var(--muted)]">{directoryText('results', {count: directory.total})}</p></div></div>
    <section className="mt-11"><ProductGrid products={directory.products} categories={categories} states={states} locale={locale} /></section>
  </div>;
}
