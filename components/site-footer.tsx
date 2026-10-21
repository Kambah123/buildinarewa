import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import type {Locale} from '@/lib/types';

export async function SiteFooter({locale}: {locale: Locale}) {
  const t = await getTranslations('Footer');
  return (
    <footer className="arewa-pattern border-t border-[var(--line)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="font-display text-3xl font-semibold text-[var(--ink)]">{t('title')}</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">{t('text')}</p>
          <p className="mt-9 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">{t('builtWithCare')}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:max-w-sm">
          <div className="space-y-3">
            <Link className="focus-ring flex items-center gap-1 text-sm font-semibold text-[var(--ink)] hover:underline" href={`/${locale}/products`}>{t('directory')} <ArrowUpRight size={13} /></Link>
            <Link className="focus-ring flex items-center gap-1 text-sm font-semibold text-[var(--ink)] hover:underline" href={`/${locale}/submit`}>{t('submit')} <ArrowUpRight size={13} /></Link>
            <Link className="focus-ring block text-sm font-semibold text-[var(--ink)] hover:underline" href={`/${locale}/about`}>{t('about')}</Link>
          </div>
          <div className="space-y-3">
            <Link className="focus-ring block text-sm text-[var(--muted)] hover:text-[var(--ink)]" href={`/${locale}/terms`}>{t('terms')}</Link>
            <Link className="focus-ring block text-sm text-[var(--muted)] hover:text-[var(--ink)]" href={`/${locale}/privacy`}>{t('privacy')}</Link>
            <a className="focus-ring block text-sm text-[var(--muted)] hover:text-[var(--ink)]" href="mailto:hello@arewaisbuilding.com">hello@arewaisbuilding.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
