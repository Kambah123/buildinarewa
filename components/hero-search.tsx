'use client';

import {Search} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next/navigation';
import {FormEvent, useState} from 'react';
import type {Locale} from '@/lib/types';

export function HeroSearch({locale}: {locale: Locale}) {
  const [query, setQuery] = useState('');
  const t = useTranslations('Home');
  const router = useRouter();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
    router.push(`/${locale}/products${params}`);
  }
  return (
    <form onSubmit={submit} className="relative mx-auto mt-8 max-w-2xl">
      <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={20} aria-hidden />
      <input value={query} onChange={(event) => setQuery(event.target.value)} className="focus-ring h-16 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] py-3 pl-14 pr-28 text-base shadow-sm placeholder:text-[var(--muted)] sm:h-16 sm:text-lg" placeholder={t('searchPlaceholder')} aria-label={t('searchPlaceholder')} />
      <button className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[var(--ink)] px-4 py-2.5 text-sm font-bold text-[var(--paper)] transition hover:opacity-85" type="submit">{t('browseDirectory')}</button>
    </form>
  );
}
