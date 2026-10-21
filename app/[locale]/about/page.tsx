import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {aboutContent, contentFor} from '@/lib/content';
import type {Locale} from '@/lib/types';

export const metadata: Metadata = {title: 'About'};

export default async function AboutPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const content = aboutContent[contentFor(locale)];
  const t = await getTranslations('Home');
  return <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">{content.eyebrow}</p><h1 className="mt-4 font-display text-5xl font-semibold leading-[0.98] sm:text-7xl">{content.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{content.intro}</p></div><div className="mt-16 grid border-t border-[var(--line)] md:grid-cols-2">{content.sections.map(([title, text], index) => <section key={title} className="border-b border-[var(--line)] py-8 md:px-8 md:[&:nth-child(odd)]:border-r md:[&:nth-child(odd)]:pl-0 md:[&:nth-child(even)]:pr-0"><p className="tabular-nums text-xs font-bold text-[var(--sand)]">0{index + 1}</p><h2 className="mt-3 font-display text-3xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p></section>)}</div><div className="mt-16 rounded-3xl bg-[var(--indigo)] p-8 text-white sm:p-10"><h2 className="font-display text-4xl font-semibold">{t('ctaTitle')}</h2><p className="mt-3 max-w-lg text-sm leading-6 text-white/75">{t('ctaText')}</p><Link className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[var(--indigo)]" href={`/${locale}/submit`}>{t('cta')} <ArrowRight size={16} /></Link></div></div>;
}
