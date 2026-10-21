import Link from 'next/link';
import {ArrowUpRight, MapPin} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {ProductLogo} from './product-logo';
import {localizedText} from '@/lib/utils';
import type {Category, Locale, Product, State} from '@/lib/types';

export async function ProductCard({product, category, state, locale}: {product: Product; category?: Category; state?: State; locale: Locale}) {
  const [common, productText] = await Promise.all([getTranslations('Common'), getTranslations('Product')]);
  const tagline = localizedText(locale, product.taglineEn, product.taglineHa);
  const categoryName = category ? localizedText(locale, category.nameEn, category.nameHa) : product.categorySlug;

  return (
    <article className="group relative flex min-h-64 flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
      <div className="flex items-start justify-between gap-4">
        <ProductLogo name={product.name} src={product.logoUrl} />
        <div className="flex flex-wrap justify-end gap-1.5">
          {product.isSeed ? <span className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">{common('seed')}</span> : null}
          {product.status === 'featured' ? <span className="rounded-full bg-[color:color-mix(in_srgb,var(--sand)_28%,transparent)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--ink)]">Featured</span> : null}
        </div>
      </div>
      <div className="mt-6">
        <h2 className="font-display text-2xl font-semibold text-[var(--ink)]"><Link className="focus-ring rounded-sm before:absolute before:inset-0" href={`/${locale}/p/${product.slug}`}>{product.name}</Link></h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{tagline}</p>
      </div>
      <div className="mt-auto pt-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[var(--muted)]">
          {state ? <span className="inline-flex items-center gap-1"><MapPin size={13} aria-hidden />{productText('builtIn', {state: state.name})}</span> : null}
          <span aria-hidden>·</span>
          <span>{categoryName}</span>
        </div>
        {product.alternativeTo[0] ? <p className="mt-3 text-xs text-[var(--muted)]">{productText('alternatives')} <span className="font-semibold text-[var(--ink)]">{product.alternativeTo[0]}</span></p> : null}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--indigo)] transition group-hover:gap-2">{common('viewProduct')} <ArrowUpRight size={15} aria-hidden /></span>
      </div>
    </article>
  );
}
