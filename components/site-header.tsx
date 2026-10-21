import Link from 'next/link';
import {Menu, X} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {ThemeToggle} from './theme-toggle';
import type {Locale, Viewer} from '@/lib/types';

export async function SiteHeader({locale, viewer}: {locale: Locale; viewer: Viewer | null}) {
  const t = await getTranslations('Navigation');
  const alternateLocale = locale === 'en' ? 'ha' : 'en';
  const nav = [
    {href: `/${locale}/products`, label: t('directory')},
    {href: `/${locale}/about`, label: t('about')}
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color:color-mix(in_srgb,var(--paper)_92%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href={`/${locale}`} className="focus-ring flex items-center gap-2.5 rounded-sm" aria-label="Arewa Is Building home">
          <span className="grid size-8 place-items-center rounded-[10px] bg-[var(--indigo)] text-sm font-black text-white">A</span>
          <span className="font-display text-xl font-semibold tracking-[-0.06em] text-[var(--ink)]">Arewa Is Building</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {nav.map((item) => <Link key={item.href} className="focus-ring rounded-sm text-sm font-medium text-[var(--muted)] transition hover:text-[var(--ink)]" href={item.href}>{item.label}</Link>)}
          {viewer?.role === 'admin' || viewer?.role === 'editor' ? <Link className="focus-ring rounded-sm text-sm font-medium text-[var(--muted)] transition hover:text-[var(--ink)]" href={`/${locale}/admin`}>{t('review')}</Link> : null}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link className="focus-ring rounded-full px-2.5 py-1.5 text-xs font-bold text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--ink)]" href={`/${alternateLocale}`}>{alternateLocale.toUpperCase()}</Link>
          <ThemeToggle />
          <Link className="focus-ring rounded-full border border-[var(--line)] px-3.5 py-2 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--ink)]" href={viewer ? `/${locale}/me` : `/${locale}/sign-in`}>{viewer ? t('mySpace') : t('signIn')}</Link>
          <Link className="focus-ring rounded-full bg-[var(--indigo)] px-3.5 py-2 text-sm font-semibold text-white transition hover:opacity-90" href={`/${locale}/submit`}>{t('submit')}</Link>
        </div>
        <details className="relative md:hidden">
          <summary className="focus-ring flex size-9 cursor-pointer list-none items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] [&::-webkit-details-marker]:hidden" aria-label={t('openMenu')}>
            <Menu size={18} aria-hidden />
          </summary>
          <div className="absolute right-0 top-12 w-64 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 shadow-xl shadow-black/10">
            <div className="mb-2 flex items-center justify-between px-2 py-1">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Menu</span>
              <X size={15} aria-hidden />
            </div>
            {[...nav, ...(viewer?.role === 'admin' || viewer?.role === 'editor' ? [{href: `/${locale}/admin`, label: t('review')}] : [])].map((item) => <Link key={item.href} href={item.href} className="focus-ring block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[var(--paper)]">{item.label}</Link>)}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[var(--line)] pt-3">
              <Link className="focus-ring rounded-lg border border-[var(--line)] px-3 py-2 text-center text-sm font-semibold" href={`/${alternateLocale}`}>{alternateLocale.toUpperCase()}</Link>
              <Link className="focus-ring rounded-lg border border-[var(--line)] px-3 py-2 text-center text-sm font-semibold" href={viewer ? `/${locale}/me` : `/${locale}/sign-in`}>{viewer ? t('mySpace') : t('signIn')}</Link>
            </div>
            <Link className="focus-ring mt-2 block rounded-lg bg-[var(--indigo)] px-3 py-2.5 text-center text-sm font-semibold text-white" href={`/${locale}/submit`}>{t('submit')}</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
