import Link from 'next/link';
import {ArrowRight, ExternalLink, Pencil} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {redirect} from 'next/navigation';
import {getMyProducts, getViewer} from '@/lib/queries/account';
import type {Locale, ProductStatus} from '@/lib/types';
import {formatDate} from '@/lib/utils';

export default async function MySubmissionsPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const viewer = await getViewer();
  if (!viewer) redirect(`/${locale}/sign-in?next=/${locale}/me`);
  const [products, t] = await Promise.all([getMyProducts(viewer.id), getTranslations('Account')]);
  return <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">{viewer.name ?? viewer.email}</p>
    <h1 className="mt-3 font-display text-5xl font-semibold">{t('title')}</h1>
    <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">{t('intro')}</p>
    {products.length ? <div className="mt-10 space-y-4">{products.map((product) => <article key={product.id} className="flex flex-col gap-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-2xl font-semibold">{product.name}</h2><Status status={product.status} label={t(product.status)} /></div><p className="mt-1 text-sm text-[var(--muted)]">{formatDate(product.createdAt, locale)}</p>{product.status === 'rejected' && product.rejectionReason ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/30 dark:text-red-200"><strong>{t('rejectionReason')}:</strong> {product.rejectionReason}</p> : null}</div><div className="flex gap-2">{product.status === 'pending' ? <Link className="focus-ring inline-flex items-center gap-1 rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-bold hover:bg-[var(--paper)]" href={`/${locale}/me/${product.slug}/edit`}><Pencil size={15} />{t('edit')}</Link> : null}{product.status === 'approved' || product.status === 'featured' ? <Link className="focus-ring inline-flex items-center gap-1 rounded-lg bg-[var(--indigo)] px-3 py-2 text-sm font-bold text-white" href={`/${locale}/p/${product.slug}`}><ExternalLink size={15} />{t('view')}</Link> : null}</div></article>)}</div> : <div className="mt-10 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-8"><h2 className="font-display text-3xl font-semibold">{t('empty')}</h2><p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t('emptyText')}</p><Link href={`/${locale}/submit`} className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--indigo)] px-4 py-2.5 text-sm font-bold text-white">{t('submit')} <ArrowRight size={16} /></Link></div>}
  </div>;
}

function Status({status, label}: {status: ProductStatus; label: string}) {
  const styles: Record<ProductStatus, string> = {pending: 'bg-[#c9a66b]/15 text-[#745a2d]', approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200', rejected: 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-200', featured: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200'};
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${styles[status]}`}>{label}</span>;
}
