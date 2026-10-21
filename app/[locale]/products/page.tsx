import {getTranslations} from 'next-intl/server';
import {DirectoryFilters} from '@/components/directory-filters';
import {Pagination} from '@/components/pagination';
import {ProductGrid} from '@/components/product-grid';
import {getCategories, getDirectory, getStates} from '@/lib/queries/catalog';
import type {Locale, ProductFilters} from '@/lib/types';
import {productFiltersSchema} from '@/lib/validations/product';
import {getUpvotedProductIds} from '@/lib/queries/community';

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsPage({
  params,
  searchParams
}: {
  params: Promise<{locale: Locale}>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{locale}, rawParams] = await Promise.all([params, searchParams]);
  const parsed = productFiltersSchema.safeParse({
    q: first(rawParams.q),
    category: first(rawParams.category),
    state: first(rawParams.state),
    stage: first(rawParams.stage),
    funding: first(rawParams.funding),
    alternative: first(rawParams.alternative),
    sort: first(rawParams.sort),
    page: first(rawParams.page)
  });
  const values = parsed.success ? parsed.data : productFiltersSchema.parse({});
  const filters: ProductFilters = {
    query: values.q,
    category: values.category,
    state: values.state,
    stage: values.stage || undefined,
    funding: values.funding || undefined,
    alternative: values.alternative,
    sort: values.sort,
    page: values.page
  };
  const [t, directory, categories, states] = await Promise.all([
    getTranslations('Directory'),
    getDirectory(filters),
    getCategories(),
    getStates()
  ]);

  const upvotedProductIds = await getUpvotedProductIds(directory.products.map((product) => product.id));

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">Arewa Is Building</p>
        <h1 className="mt-3 font-display text-5xl font-semibold text-[var(--ink)] sm:text-6xl">{t('title')}</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">{t('intro')}</p>
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[16.5rem_minmax(0,1fr)]">
        <DirectoryFilters categories={categories} states={states} filters={filters} locale={locale} />
        <section aria-live="polite">
          <p className="tabular-nums mb-5 text-sm font-medium text-[var(--muted)]">{t('results', {count: directory.total})}</p>
          {directory.products.length ? <>
            <ProductGrid products={directory.products} categories={categories} states={states} locale={locale} upvotedProductIds={upvotedProductIds} />
            <Pagination pathname={`/${locale}/products`} page={directory.page} pageCount={directory.pageCount} query={{q: filters.query, category: filters.category, state: filters.state, stage: filters.stage, funding: filters.funding, alternative: filters.alternative, sort: filters.sort}} />
          </> : <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] px-6 py-14 text-center">
            <h2 className="font-display text-2xl font-semibold">{t('noResults')}</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">{t('noResultsText')}</p>
            <a className="focus-ring mt-6 inline-block rounded-full bg-[var(--ink)] px-4 py-2.5 text-sm font-bold text-[var(--paper)]" href={`/${locale}/products`}>{t('clearFilters')}</a>
          </div>}
        </section>
      </div>
    </div>
  );
}
