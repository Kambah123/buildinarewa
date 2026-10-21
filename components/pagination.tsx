import Link from 'next/link';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {buildQueryString} from '@/lib/utils';

export async function Pagination({pathname, page, pageCount, query}: {pathname: string; page: number; pageCount: number; query: Record<string, string | number | undefined>}) {
  if (pageCount <= 1) return null;
  const t = await getTranslations('Common');
  const makeHref = (nextPage: number) => `${pathname}${buildQueryString({...query, page: nextPage})}`;
  return (
    <nav className="mt-10 flex items-center justify-between border-t border-[var(--line)] pt-5" aria-label="Pagination">
      {page > 1 ? <Link className="focus-ring inline-flex items-center gap-1 rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-semibold hover:bg-[var(--surface)]" href={makeHref(page - 1)}><ChevronLeft size={15} /> {t('previous')}</Link> : <span />}
      <p className="tabular-nums text-sm text-[var(--muted)]">{page} / {pageCount}</p>
      {page < pageCount ? <Link className="focus-ring inline-flex items-center gap-1 rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-semibold hover:bg-[var(--surface)]" href={makeHref(page + 1)}>{t('next')} <ChevronRight size={15} /></Link> : <span />}
    </nav>
  );
}
