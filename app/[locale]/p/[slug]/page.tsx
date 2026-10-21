import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowLeft, ArrowUpRight, ExternalLink, MapPin, Share2} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {ProductGrid} from '@/components/product-grid';
import {ProductLogo} from '@/components/product-logo';
import {UpvoteButton} from '@/components/upvote-button';
import {getProductBySlug, getRelatedProducts} from '@/lib/queries/catalog';
import {getUpvotedProductIds} from '@/lib/queries/community';
import type {Locale} from '@/lib/types';
import {localizedText} from '@/lib/utils';

export async function generateMetadata({params}: {params: Promise<{locale: Locale; slug: string}>}): Promise<Metadata> {
  const {locale, slug} = await params;
  const result = await getProductBySlug(slug);
  if (!result) return {};
  const description = localizedText(locale, result.product.taglineEn, result.product.taglineHa);
  return {
    title: result.product.name,
    description,
    alternates: {
      canonical: `/${locale}/p/${slug}`,
      languages: {en: `/en/p/${slug}`, ha: `/ha/p/${slug}`}
    },
    openGraph: {
      title: `${result.product.name} · Built in ${result.state?.name ?? 'Arewa'}`,
      description,
      images: [{url: `/${locale}/p/${slug}/opengraph-image`, width: 1200, height: 630, alt: `${result.product.name} · Arewa Is Building`}]
    }
  };
}

export default async function ProductPage({params}: {params: Promise<{locale: Locale; slug: string}>}) {
  const {locale, slug} = await params;
  const result = await getProductBySlug(slug);
  if (!result) notFound();
  const {product, category, state, categories, states} = result;
  const [t, common, related, upvotedProductIds] = await Promise.all([getTranslations('Product'), getTranslations('Common'), getRelatedProducts(product), getUpvotedProductIds([product.id])]);
  const description = localizedText(locale, product.descriptionEn, product.descriptionHa);
  const tagline = localizedText(locale, product.taglineEn, product.taglineHa);
  const categoryName = category ? localizedText(locale, category.nameEn, category.nameHa) : product.categorySlug;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const pageUrl = `${siteUrl}/${locale}/p/${product.slug}`;
  const shareText = `${product.name} — ${tagline}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    applicationCategory: category?.nameEn ?? 'Software',
    description: product.descriptionEn,
    url: product.websiteUrl,
    image: product.coverUrl ?? undefined,
    operatingSystem: 'WebApplication',
    areaServed: state?.name ?? 'Northern Nigeria'
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
      <Link href={`/${locale}/products`} className="focus-ring inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]"><ArrowLeft size={16} />{common('backToDirectory')}</Link>
      <article className="mt-8 overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)]">
        <div className="grid lg:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)]">
          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <ProductLogo name={product.name} src={product.logoUrl} className="size-16 rounded-2xl" />
              <div className="flex flex-wrap justify-end gap-2">
                {product.isSeed ? <span className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">{common('seed')}</span> : null}
                <span className="rounded-full bg-[color:color-mix(in_srgb,var(--sand)_28%,transparent)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--ink)]">{product.stage}</span>
              </div>
            </div>
            <h1 className="mt-10 font-display text-5xl font-semibold leading-[0.98] text-[var(--ink)] sm:text-6xl">{product.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">{tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="focus-ring inline-flex items-center gap-2 rounded-full bg-[var(--indigo)] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90" href={product.websiteUrl} target="_blank" rel="noreferrer">{common('visitWebsite')} <ExternalLink size={16} /></a>
              <UpvoteButton productId={product.id} initialCount={product.upvoteCount} initiallyUpvoted={upvotedProductIds.includes(product.id)} locale={locale} />
              {product.demoVideoUrl ? <a className="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-3 text-sm font-bold transition hover:bg-[var(--paper)]" href={product.demoVideoUrl} target="_blank" rel="noreferrer">Demo <ArrowUpRight size={16} /></a> : null}
            </div>
          </div>
          <aside className="border-t border-[var(--line)] bg-[var(--paper)] p-6 lg:border-l lg:border-t-0 sm:p-10">
            <dl className="space-y-6">
              <Fact label={t('category')} value={categoryName} href={category ? `/${locale}/categories/${category.slug}` : undefined} />
              <Fact label={t('builtIn', {state: ''}).replace(/\s*$/, '')} value={state?.name ?? product.stateCode} icon={<MapPin size={15} />} href={state ? `/${locale}/states/${state.slug}` : undefined} />
              <Fact label={t('stage')} value={product.stage} />
              <Fact label={t('funding')} value={product.funding} />
              {product.alternativeTo.length ? <div><dt className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">{t('alternatives')}</dt><dd className="mt-2 flex flex-wrap gap-2">{product.alternativeTo.map((alternative) => <Link key={alternative} className="focus-ring rounded-full border border-[var(--line)] px-2.5 py-1 text-xs font-semibold text-[var(--indigo)] hover:bg-[var(--surface)]" href={`/${locale}/alternatives/${encodeURIComponent(alternative.toLocaleLowerCase().replace(/\s+/g, '-'))}`}>{alternative}</Link>)}</dd></div> : null}
            </dl>
          </aside>
        </div>
      </article>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <section>
          <h2 className="font-display text-3xl font-semibold">{t('about')}</h2>
          {product.isSeed ? <p className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--muted)]">{t('seedNote')}</p> : null}
          <div className="prose-copy mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">
            {description.split(/\n{2,}/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          {product.tags.length ? <div className="mt-8"><h3 className="text-sm font-bold">{t('tags')}</h3><div className="mt-3 flex flex-wrap gap-2">{product.tags.map((tag) => <span key={tag} className="rounded-full border border-[var(--line)] px-3 py-1.5 text-xs font-medium text-[var(--muted)]">{tag}</span>)}</div></div> : null}
          {product.screenshots.length ? <div className="mt-12"><h2 className="font-display text-3xl font-semibold">{t('screenshots')}</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{product.screenshots.map((src, index) => <Image key={src} src={src} alt={`${product.name} screenshot ${index + 1}`} width={1000} height={700} className="rounded-2xl border border-[var(--line)] object-cover" />)}</div></div> : null}
          {product.makers.length ? <div className="mt-12"><h2 className="font-display text-3xl font-semibold">{t('makers')}</h2><div className="mt-4 flex flex-wrap gap-3">{product.makers.map((maker) => maker.slug ? <Link href={`/${locale}/b/${maker.slug}`} className="focus-ring rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 transition hover:border-[var(--indigo)]" key={maker.id}><p className="font-semibold">{maker.name}</p><p className="text-xs text-[var(--muted)]">{maker.role}</p></Link> : <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3" key={maker.id}><p className="font-semibold">{maker.name}</p><p className="text-xs text-[var(--muted)]">{maker.role}</p></div>)}</div></div> : null}
        </section>
        <aside className="lg:border-l lg:border-[var(--line)] lg:pl-8">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
            <p className="flex items-center gap-2 text-sm font-bold"><Share2 size={16} />{t('share')}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a className="focus-ring rounded-full border border-[var(--line)] px-3 py-2 text-xs font-bold hover:bg-[var(--paper)]" target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`}>{t('shareWhatsApp')}</a>
              <a className="focus-ring rounded-full border border-[var(--line)] px-3 py-2 text-xs font-bold hover:bg-[var(--paper)]" target="_blank" rel="noreferrer" href={`https://x.com/intent/post?text=${encodeURIComponent(`${shareText} ${pageUrl}`)}`}>{t('shareX')}</a>
              <a className="focus-ring rounded-full border border-[var(--line)] px-3 py-2 text-xs font-bold hover:bg-[var(--paper)]" target="_blank" rel="noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}>{t('shareLinkedIn')}</a>
            </div>
          </div>
        </aside>
      </div>

      {related.length ? <section className="mt-16 border-t border-[var(--line)] pt-12"><h2 className="font-display text-3xl font-semibold">{t('related')}</h2><div className="mt-6"><ProductGrid products={related} categories={categories} states={states} locale={locale} /></div></section> : null}
    </div>
  );
}

function Fact({label, value, href, icon}: {label: string; value: string; href?: string; icon?: React.ReactNode}) {
  return <div><dt className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">{label}</dt><dd className="mt-1.5 text-sm font-semibold capitalize text-[var(--ink)]">{href ? <Link className="focus-ring inline-flex items-center gap-1 rounded-sm text-[var(--indigo)] hover:underline" href={href}>{icon}{value}</Link> : <span className="inline-flex items-center gap-1">{icon}{value}</span>}</dd></div>;
}
