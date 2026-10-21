import type {Category, Locale, Product, State} from '@/lib/types';
import {ProductCard} from './product-card';

export async function ProductGrid({products, categories, states, locale}: {products: Product[]; categories: Category[]; states: State[]; locale: Locale}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          category={categories.find((category) => category.slug === product.categorySlug)}
          state={states.find((state) => state.code === product.stateCode)}
          locale={locale}
        />
      ))}
    </div>
  );
}
