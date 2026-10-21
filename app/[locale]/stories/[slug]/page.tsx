/* eslint-disable @next/next/no-img-element */
import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowLeft, CalendarDays, ExternalLink, Play} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {BuilderAvatar} from '@/components/builder-avatar';
import {StoryMdx} from '@/components/story-mdx';
import {getStoryBySlug} from '@/lib/queries/community';
import type {Locale} from '@/lib/types';
import {formatDate, localizedText} from '@/lib/utils';

export async function generateMetadata({params}: {params: Promise<{locale: Locale; slug: string}>}): Promise<Metadata> {
  const {locale, slug} = await params;
  const story = await getStoryBySlug(slug);
  if (!story) return {};
  const description = localizedText(locale, story.excerptEn, story.excerptHa);
  return {title: localizedText(locale, story.titleEn, story.titleHa), description, alternates: {canonical: `/${locale}/stories/${slug}`, languages: {en: `/en/stories/${slug}`, ha: `/ha/stories/${slug}`}}, openGraph: {title: localizedText(locale, story.titleEn, story.titleHa), description, images: [{url: `/${locale}/stories/${slug}/opengraph-image`, width: 1200, height: 630}]}};
}

export default async function StoryPage({params}: {params: Promise<{locale: Locale; slug: string}>}) {
  const {locale, slug} = await params;
  const [story, t] = await Promise.all([getStoryBySlug(slug), getTranslations('Story')]);
  if (!story) notFound();
  const title = localizedText(locale, story.titleEn, story.titleHa);
  const body = localizedText(locale, story.bodyEn, story.bodyHa);
  return <article className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12"><Link href={`/${locale}/stories`} className="focus-ring inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]"><ArrowLeft size={16} />{t('back')}</Link><header className="mt-10 max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--indigo)]">{t('eyebrow')}</p><h1 className="mt-4 font-display text-5xl font-semibold leading-[.96] sm:text-7xl">{title}</h1><p className="mt-6 text-lg leading-8 text-[var(--muted)]">{localizedText(locale, story.excerptEn, story.excerptHa)}</p><div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">{story.builder ? <Link className="focus-ring inline-flex items-center gap-2 rounded-sm font-semibold text-[var(--ink)]" href={`/${locale}/b/${story.builder.slug}`}><BuilderAvatar name={story.builder.name} src={story.builder.photoUrl} className="size-8" />{t('by')} {story.builder.name}</Link> : null}{story.publishedAt ? <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} />{formatDate(story.publishedAt, locale)}</span> : null}</div></header>{story.coverUrl ? <img src={story.coverUrl} alt="" className="mt-10 aspect-[16/8] w-full rounded-3xl border border-[var(--line)] object-cover" /> : <div className="arewa-pattern mt-10 h-50 rounded-3xl border border-[var(--line)]" />}{story.isSeed ? <p className="mt-7 max-w-2xl rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--muted)]">{t('seedNote')}</p> : null}<div className="mt-8"><StoryMdx source={body} /></div>{story.videoUrl ? <a href={story.videoUrl} target="_blank" rel="noreferrer" className="focus-ring mt-10 inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-3 text-sm font-bold text-[var(--indigo)] hover:bg-[var(--paper)]"><Play size={16} />{t('watch')} <ExternalLink size={15} /></a> : null}</article>;
}
