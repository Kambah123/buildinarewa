/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import {ArrowUpRight, Play} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {BuilderAvatar} from './builder-avatar';
import type {Locale, Story} from '@/lib/types';
import {formatDate, localizedText} from '@/lib/utils';

export async function StoryCard({story, locale, featured = false}: {story: Story; locale: Locale; featured?: boolean}) {
  const t = await getTranslations('Story');
  const title = localizedText(locale, story.titleEn, story.titleHa);
  const excerpt = localizedText(locale, story.excerptEn, story.excerptHa);
  return <article className={`group overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 ${featured ? 'md:grid md:grid-cols-[1.1fr_.9fr]' : ''}`}>
    <div className={`relative min-h-42 bg-[color:color-mix(in_srgb,var(--indigo)_12%,var(--paper))] p-5 ${featured ? 'md:min-h-full' : ''}`}>
      {story.coverUrl ? <img src={story.coverUrl} alt="" className="absolute inset-0 size-full object-cover" /> : <div className="arewa-pattern absolute inset-0 opacity-80" />}
      <div className="relative flex h-full min-h-32 items-end justify-between"><span className="rounded-full border border-white/25 bg-black/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--indigo)]">{t('eyebrow')}</span>{story.videoUrl ? <span className="grid size-9 place-items-center rounded-full bg-white text-[var(--indigo)]"><Play size={15} fill="currentColor" /></span> : null}</div>
    </div>
    <div className="p-5"><div className="flex items-center gap-2 text-xs text-[var(--muted)]">{story.builder ? <><BuilderAvatar name={story.builder.name} src={story.builder.photoUrl} className="size-6" /><span>{t('by')} {story.builder.name}</span></> : null}{story.publishedAt ? <span className="ml-auto">{formatDate(story.publishedAt, locale)}</span> : null}</div><h2 className={`mt-5 font-display font-semibold leading-[1.05] ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}><Link className="focus-ring rounded-sm" href={`/${locale}/stories/${story.slug}`}>{title}</Link></h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{excerpt}</p>{story.isSeed ? <p className="mt-4 text-xs leading-5 text-[var(--muted)]">{t('seedNote')}</p> : null}<Link href={`/${locale}/stories/${story.slug}`} className="focus-ring mt-5 inline-flex items-center gap-1 rounded-sm text-sm font-bold text-[var(--indigo)] transition group-hover:gap-2">{t('read')} <ArrowUpRight size={15} /></Link></div>
  </article>;
}
