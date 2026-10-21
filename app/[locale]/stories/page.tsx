import {getTranslations} from 'next-intl/server';
import {StoryCard} from '@/components/story-card';
import {getStories} from '@/lib/queries/community';
import type {Locale} from '@/lib/types';

export default async function StoriesPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const [stories, t] = await Promise.all([getStories(), getTranslations('Story')]);
  return <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">{t('eyebrow')}</p><h1 className="mt-3 font-display text-5xl font-semibold leading-[.98] sm:text-6xl">{t('title')}</h1><p className="mt-5 text-base leading-7 text-[var(--muted)]">{t('intro')}</p></div>{stories.length ? <div className="mt-10 grid gap-5 lg:grid-cols-2">{stories.map((story, index) => <StoryCard key={story.id} story={story} locale={locale} featured={index === 0} />)}</div> : <p className="mt-10 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-8 text-[var(--muted)]">{t('intro')}</p>}</div>;
}
