import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {notFound, redirect} from 'next/navigation';
import {PendingProductEditForm} from '@/components/pending-product-edit-form';
import {getMyProducts, getViewer} from '@/lib/queries/account';
import {getCategories, getStates} from '@/lib/queries/catalog';
import type {Locale} from '@/lib/types';

export default async function EditPendingSubmissionPage({params}: {params: Promise<{locale: Locale; slug: string}>}) {
  const {locale, slug} = await params;
  const viewer = await getViewer();
  if (!viewer) redirect(`/${locale}/sign-in?next=/${locale}/me/${slug}/edit`);
  const [products, categories, states, account] = await Promise.all([getMyProducts(viewer.id), getCategories(), getStates(), getTranslations('Account')]);
  const product = products.find((item) => item.slug === slug && item.status === 'pending');
  if (!product) notFound();
  return <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12"><Link href={`/${locale}/me`} className="focus-ring inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]"><ArrowLeft size={16} />{account('title')}</Link><h1 className="mt-9 font-display text-5xl font-semibold">{account('edit')} {product.name}</h1><p className="mt-4 max-w-xl text-sm leading-6 text-[var(--muted)]">{account('editIntro')}</p><PendingProductEditForm locale={locale} product={product} categories={categories} states={states} /></div>;
}
