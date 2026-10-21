import type {Category, Locale, Product, ProductFilters, State} from './types';

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function localizedText(locale: Locale, english: string, hausa?: string | null) {
  return locale === 'ha' && hausa?.trim() ? hausa : english;
}

export function productSearchText(product: Product, category?: Category, state?: State) {
  return [
    product.name,
    product.taglineEn,
    product.taglineHa,
    product.descriptionEn,
    product.descriptionHa,
    product.city,
    product.categorySlug,
    category?.nameEn,
    category?.nameHa,
    state?.name,
    ...product.alternativeTo,
    ...product.tags
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase();
}

export function filterProducts(
  products: Product[],
  filters: ProductFilters,
  categories: Category[],
  states: State[]
) {
  const query = filters.query?.trim().toLocaleLowerCase();
  const filtered = products.filter((product) => {
    const category = categories.find((item) => item.slug === product.categorySlug);
    const state = states.find((item) => item.code === product.stateCode);
    const matchesQuery = !query || productSearchText(product, category, state).includes(query);
    const matchesCategory = !filters.category || product.categorySlug === filters.category;
    const matchesState = !filters.state || product.stateCode === filters.state;
    const matchesStage = !filters.stage || product.stage === filters.stage;
    const matchesFunding = !filters.funding || product.funding === filters.funding;
    const matchesAlternative =
      !filters.alternative ||
      product.alternativeTo.some((item) => item.toLocaleLowerCase().includes(filters.alternative!.toLocaleLowerCase()));

    return matchesQuery && matchesCategory && matchesState && matchesStage && matchesFunding && matchesAlternative;
  });

  return filtered.sort((left, right) => {
    if (filters.sort === 'newest') {
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    }

    const leftRank = left.status === 'featured' ? 1 : 0;
    const rightRank = right.status === 'featured' ? 1 : 0;
    if (leftRank !== rightRank) return rightRank - leftRank;
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

export function splitCommaList(value: string, max = 10) {
  return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))].slice(0, max);
}

export function toSlug(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'ha' ? 'ha-NG' : 'en-NG', {
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
}

export function buildQueryString(values: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  });
  const query = params.toString();
  return query ? `?${query}` : '';
}
