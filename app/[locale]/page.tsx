import Link from 'next/link';
import {ArrowRight, ArrowUpRight, MapPin} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {HeroSearch} from '@/components/hero-search';
import {CategoryIcon} from '@/components/category-icon';
import {ProductGrid} from '@/components/product-grid';
import {getHomeData} from '@/lib/queries/catalog';
import type {Locale} from '@/lib/types';
import {localizedText} from '@/lib/utils';

export default async function HomePage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const [t, data] = await Promise.all([getTranslations('Home'), getHomeData()]);
  const reasons = [
    [t('whyOneTitle'), t('whyOneText'), '01'],
    [t('whyTwoTitle'), t('whyTwoText'), '02'],
    [t('whyThreeTitle'), t('whyThreeText'), '03'],
    [t('whyFourTitle'), t('whyFourText'), '04']
  ];

  return (
    <>
      <section className="arewa-pattern overflow-hidden border-b border-[var(--line)]">
        <div className="mx-auto max-w-7xl px-5 pb-18 pt-18 sm:px-8 sm:pb-24 sm:pt-24">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--indigo)]">{t('eyebrow')}</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.94] text-[var(--ink)] sm:text-7xl lg:text-8xl">
            {t('titleA')} <span className="text-[var(--indigo)]">{t('titleB')}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">{t('intro')}</p>
          <HeroSearch locale={locale} />
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-semibold text-[var(--muted)]">
            <Link className="focus-ring rounded-sm hover:text-[var(--ink)]" href={`/${locale}/products`}>{t('browseDirectory')} <ArrowRight className="inline" size={15} /></Link>
            <Link className="focus-ring rounded-sm hover:text-[var(--ink)]" href={`/${locale}/submit`}>{t('submitProduct')} <ArrowUpRight className="inline" size={15} /></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-22">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">Directory</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-[var(--ink)]">{t('latest')}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">{t('latestIntro')}</p>
          </div>
          <Link className="focus-ring inline-flex items-center gap-1 self-start rounded-sm text-sm font-bold text-[var(--indigo)] hover:underline sm:self-auto" href={`/${locale}/products`}>{t('browseDirectory')} <ArrowRight size={16} /></Link>
        </div>
        <div className="mt-9">
          <ProductGrid products={data.products} categories={data.categories} states={data.states} locale={locale} />
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-22">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">Explore</p>
            <h2 className="mt-3 font-display text-4xl font-semibold">{t('browseBy')}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{t('browseByIntro')}</p>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.categories.map((category) => (
              <Link key={category.id} href={`/${locale}/categories/${category.slug}`} className="focus-ring group rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--ink)]">
                <span className="grid size-10 place-items-center rounded-xl bg-[color:color-mix(in_srgb,var(--indigo)_10%,transparent)] text-[var(--indigo)]"><CategoryIcon name={category.icon} /></span>
                <p className="mt-7 font-display text-xl font-semibold">{localizedText(locale, category.nameEn, category.nameHa)}</p>
                <ArrowRight className="mt-3 text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--ink)]" size={17} />
              </Link>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-2">
            {data.states.map((state) => <Link key={state.code} className="focus-ring inline-flex items-center gap-1 rounded-full border border-[var(--line)] px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--paper)] hover:text-[var(--ink)]" href={`/${locale}/states/${state.slug}`}><MapPin size={14} />{state.name}</Link>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-22">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">Our purpose</p>
          <h2 className="mt-3 font-display text-4xl font-semibold">{t('why')}</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{t('whyIntro')}</p>
        </div>
        <div className="mt-10 grid border-t border-[var(--line)] sm:grid-cols-2">
          {reasons.map(([title, text, number]) => <div key={number} className="border-b border-[var(--line)] py-7 sm:pr-10 [&:nth-child(odd)]:sm:border-r [&:nth-child(odd)]:sm:pr-10 [&:nth-child(even)]:sm:pl-10">
            <span className="tabular-nums text-xs font-bold text-[var(--sand)]">{number}</span>
            <h3 className="mt-3 font-display text-2xl font-semibold">{title}</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">{text}</p>
          </div>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-18 sm:px-8 sm:pb-24">
        <div className="overflow-hidden rounded-3xl bg-[var(--indigo)] px-7 py-12 text-white sm:px-12 sm:py-15">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/65">For builders</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl font-semibold leading-tight">{t('ctaTitle')}</h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/75">{t('ctaText')}</p>
          <Link className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[var(--indigo)] transition hover:bg-[#f7f5f0]" href={`/${locale}/submit`}>{t('cta')} <ArrowUpRight size={16} /></Link>
        </div>
      </section>
    </>
  );
}
