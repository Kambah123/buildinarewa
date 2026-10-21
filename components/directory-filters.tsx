'use client';

import {Search, SlidersHorizontal, X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState, useTransition} from 'react';
import type {Category, Locale, ProductFilters, State} from '@/lib/types';

const stages = ['idea', 'beta', 'live', 'growing'] as const;
const fundingOptions = ['bootstrapped', 'funded'] as const;

export function DirectoryFilters({categories, states, filters, locale}: {categories: Category[]; states: State[]; filters: ProductFilters; locale: Locale}) {
  const t = useTranslations('Directory');
  const common = useTranslations('Common');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(filters.query ?? '');

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    startTransition(() => router.replace(`${pathname}${params.size ? `?${params.toString()}` : ''}`, {scroll: false}));
  }

  useEffect(() => {
    const current = searchParams.get('q') ?? '';
    if (query === current) return;
    const timer = window.setTimeout(() => update('q', query), 350);
    return () => window.clearTimeout(timer);
    // update intentionally reads the current URL to preserve other filters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function clear() {
    setQuery('');
    startTransition(() => router.replace(pathname, {scroll: false}));
  }

  const active = Boolean(filters.query || filters.category || filters.state || filters.stage || filters.funding || filters.alternative || filters.sort === 'newest');

  return (
    <aside className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 lg:sticky lg:top-24 lg:self-start">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal size={16} aria-hidden /> {t('filters')}</div>
        {active ? <button type="button" onClick={clear} className="focus-ring inline-flex items-center gap-1 rounded-sm text-xs font-semibold text-[var(--indigo)] hover:underline"><X size={13} />{common('clear')}</button> : null}
      </div>
      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{t('filtersDescription')}</p>
      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="sr-only">{common('search')}</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={15} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('searchPlaceholder')} className="focus-ring w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] py-2.5 pl-9 pr-3 text-sm placeholder:text-[var(--muted)]" />
          </span>
        </label>
        <FilterSelect label={t('category')} value={filters.category ?? ''} onChange={(value) => update('category', value)} options={categories.map((item) => ({value: item.slug, label: locale === 'ha' ? item.nameHa : item.nameEn}))} allLabel={common('all')} />
        <FilterSelect label={t('state')} value={filters.state ?? ''} onChange={(value) => update('state', value)} options={states.map((item) => ({value: item.code, label: item.name}))} allLabel={common('all')} />
        <FilterSelect label={t('stage')} value={filters.stage ?? ''} onChange={(value) => update('stage', value)} options={stages.map((value) => ({value, label: value.charAt(0).toUpperCase() + value.slice(1)}))} allLabel={common('all')} />
        <FilterSelect label={t('funding')} value={filters.funding ?? ''} onChange={(value) => update('funding', value)} options={fundingOptions.map((value) => ({value, label: value.charAt(0).toUpperCase() + value.slice(1)}))} allLabel={common('all')} />
        <label className="block space-y-1.5 text-xs font-bold text-[var(--ink)]">
          <span>{t('alternative')}</span>
          <input defaultValue={filters.alternative} onBlur={(event) => update('alternative', event.target.value)} placeholder="e.g. Notion" className="focus-ring w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 text-sm font-normal placeholder:text-[var(--muted)]" />
        </label>
        <FilterSelect label={t('sort')} value={filters.sort ?? 'featured'} onChange={(value) => update('sort', value)} options={[{value: 'featured', label: t('featured')}, {value: 'newest', label: t('newest')}]} allLabel="" hideAll />
      </div>
      {isPending ? <p className="mt-4 text-xs text-[var(--muted)]" aria-live="polite">{common('loading')}…</p> : null}
    </aside>
  );
}

function FilterSelect({label, value, onChange, options, allLabel, hideAll = false}: {label: string; value: string; onChange: (value: string) => void; options: Array<{value: string; label: string}>; allLabel: string; hideAll?: boolean}) {
  return (
    <label className="block space-y-1.5 text-xs font-bold text-[var(--ink)]">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 text-sm font-normal text-[var(--ink)]">
        {!hideAll ? <option value="">{allLabel}</option> : null}
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
