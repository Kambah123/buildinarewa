import {getTranslations} from 'next-intl/server';
import {BuilderCard} from '@/components/builder-card';
import {getBuilders} from '@/lib/queries/community';
import {getStates} from '@/lib/queries/catalog';
import type {Locale} from '@/lib/types';

export default async function BuildersPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const [builders, states, t] = await Promise.all([getBuilders(), getStates(), getTranslations('Builder')]);
  return <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">{t('eyebrow')}</p><h1 className="mt-3 font-display text-5xl font-semibold leading-[.98] sm:text-6xl">{t('title')}</h1><p className="mt-5 text-base leading-7 text-[var(--muted)]">{t('intro')}</p></div>{builders.length ? <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{builders.map((builder) => <BuilderCard key={builder.id} builder={builder} locale={locale} state={states.find((state) => state.code === builder.stateCode)} />)}</div> : <p className="mt-10 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-8 text-[var(--muted)]">{t('empty')}</p>}</div>;
}
