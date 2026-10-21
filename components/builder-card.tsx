import Link from 'next/link';
import {ArrowUpRight, MapPin} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {BuilderAvatar} from './builder-avatar';
import type {Builder, Locale, State} from '@/lib/types';

export async function BuilderCard({builder, locale, state}: {builder: Builder; locale: Locale; state?: State}) {
  const [t, common] = await Promise.all([getTranslations('Builder'), getTranslations('Common')]);
  return <article className="group flex flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"><div className="flex items-start gap-3"><BuilderAvatar name={builder.name} src={builder.photoUrl} /><div><h2 className="font-display text-xl font-semibold"><Link className="focus-ring rounded-sm" href={`/${locale}/b/${builder.slug}`}>{builder.name}</Link></h2>{state ? <p className="mt-1 inline-flex items-center gap-1 text-xs text-[var(--muted)]"><MapPin size={13} />{state.name}</p> : null}</div></div><p className="mt-5 text-sm leading-6 text-[var(--muted)]">{builder.headline}</p>{builder.isSeed ? <p className="mt-4 rounded-lg bg-[var(--paper)] px-3 py-2 text-xs leading-5 text-[var(--muted)]">{t('seedNote')}</p> : null}<Link href={`/${locale}/b/${builder.slug}`} className="focus-ring mt-auto inline-flex items-center gap-1 self-start pt-5 text-sm font-bold text-[var(--indigo)] transition group-hover:gap-2">{common('viewAll')} <ArrowUpRight size={15} /></Link></article>;
}
