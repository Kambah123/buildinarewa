import {describe, expect, it} from 'vitest';
import {seedCategories, seedProducts, seedStates} from '@/lib/seed';
import {filterProducts, splitCommaList, toSlug} from '@/lib/utils';

describe('directory utilities', () => {
  it('finds a product using an alternative search term', () => {
    const matches = filterProducts(seedProducts, {query: 'shopify'}, seedCategories, seedStates);
    expect(matches.map((product) => product.slug)).toContain('kasuwa-kit');
  });

  it('filters products by state and keeps featured listings first', () => {
    const matches = filterProducts(seedProducts, {state: 'KN', sort: 'featured'}, seedCategories, seedStates);
    expect(matches).toHaveLength(1);
    expect(matches[0]?.slug).toBe('zipa');
  });

  it('normalises comma-separated values and product slugs', () => {
    expect(splitCommaList(' Notion, Trello, Notion ,, ')).toEqual(['Notion', 'Trello']);
    expect(toSlug('  Gina Arewa! 2026 ')).toBe('gina-arewa-2026');
  });
});
