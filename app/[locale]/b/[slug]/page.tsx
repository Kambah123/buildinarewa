import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowLeft, ArrowUpRight, AtSign, Globe2, MapPin} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {BuilderAvatar} from '@/components/builder-avatar';
import {ProductGrid} from '@/components/product-grid';
import {StoryCard} from '@/components/story-card';
import {getBuilderBySlug, getUpvotedProductIds} from '@/lib/queries/community';
import {getCategories} from '@/lib/queries/catalog';
import type {Locale} from '@/lib/types';
import {localizedText} from '@/lib/utils';

export async function generateMetadata({params}: {params: Promise<{locale: Locale; slug: string}>}): Promise<Metadata> {
  const {locale, slug} = await params;
  const result = await getBuilderBySlug(slug);
  return result ? {title: result.builder.name, description: result.builder.headline, alternates: {languages: {en: `/en/b/${slug}`, ha: `/ha/b/${slug}`}}, openGraph: {title: result.builder.name, description: result.builder.headline, images: [{url: `/${locale}/b/${slug}/opengraph-image`, width: 1200, height: 630}]}} : {};
}

export default async function BuilderPage({params}: {params: Promise<{locale: Locale; slug: string}>}) {
  const {locale, slug} = await params;
  const [result, categories, t, productText] = await Promise.all([getBuilderBySlug(slug), getCategories(), getTranslations('Builder'), getTranslations('Product')]);
  if (!result) notFound();
  const {builder, products, story, states} = result;
  const upvotedProductIds = await getUpvotedProductIds(products.map((product) => product.id));
  const state = states.find((item) => item.code === builder.stateCode);
  const bio = localizedText(locale, builder.bioEn, builder.bioHa);
  return <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12"><Link href={`/${locale}/builders`} className="focus-ring inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]"><ArrowLeft size={16} />{t('back')}</Link><section className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]"><div><div className="flex flex-wrap items-start gap-5"><BuilderAvatar name={builder.name} src={builder.photoUrl} className="size-20" /><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[.13em] text-[var(--indigo)]">{t('eyebrow')}</p><h1 className="mt-2 font-display text-5xl font-semibold leading-[.96] sm:text-6xl">{builder.name}</h1><p className="mt-3 text-lg leading-7 text-[var(--muted)]">{builder.headline}</p></div></div>{builder.isSeed ? <p className="mt-7 max-w-2xl rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--muted)]">{t('seedNote')}</p> : null}<p className="mt-7 max-w-2xl text-base leading-8 text-[var(--muted)]">{bio}</p></div><aside className="border-l-0 border-[var(--line)] lg:border-l lg:pl-8"><div className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">{state ? <p className="inline-flex items-center gap-2 text-sm font-semibold"><MapPin size={15} className="text-[var(--indigo)]" />{state.name}</p> : null}{builder.links.website ? <a className="focus-ring flex items-center gap-2 text-sm font-semibold text-[var(--indigo)] hover:underline" href={builder.links.website} target="_blank" rel="noreferrer"><Globe2 size={15} />{t('website')} <ArrowUpRight size={14} /></a> : null}{builder.links.x ? <a className="focus-ring flex items-center gap-2 text-sm font-semibold text-[var(--indigo)] hover:underline" href={builder.links.x} target="_blank" rel="noreferrer">{t('x')} <ArrowUpRight size={14} /></a> : null}{builder.links.linkedin ? <a className="focus-ring flex items-center gap-2 text-sm font-semibold text-[var(--indigo)] hover:underline" href={builder.links.linkedin} target="_blank" rel="noreferrer"><AtSign size={15} />{t('linkedin')} <ArrowUpRight size={14} /></a> : null}</div></aside></section>{products.length ? <section className="mt-16 border-t border-[var(--line)] pt-10"><h2 className="font-display text-3xl font-semibold">{t('products')}</h2><div className="mt-6"><ProductGrid products={products} categories={categories} states={states} locale={locale} upvotedProductIds={upvotedProductIds} /></div></section> : null}{story ? <section className="mt-16 border-t border-[var(--line)] pt-10"><h2 className="font-display text-3xl font-semibold">{productText('story')}</h2><div className="mt-6 max-w-3xl"><StoryCard story={story} locale={locale} featured /></div></section> : null}</div>;
}
