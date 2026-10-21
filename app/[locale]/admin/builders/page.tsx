import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {redirect} from 'next/navigation';
import {AdminBuilderForm} from '@/components/admin-builder-form';
import {getViewer} from '@/lib/queries/account';
import {getStates} from '@/lib/queries/catalog';
import {getBuilders} from '@/lib/queries/community';
import type {Locale} from '@/lib/types';

export default async function AdminBuildersPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const viewer = await getViewer();
  if (!viewer) redirect(`/${locale}/sign-in?next=/${locale}/admin/builders`);
  const t = await getTranslations('Admin');
  if (viewer.role !== 'admin' && viewer.role !== 'editor') redirect(`/${locale}/admin`);
  const [states, builders] = await Promise.all([getStates(), getBuilders()]);
  return <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12"><Link href={`/${locale}/admin`} className="focus-ring inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]"><ArrowLeft size={16} />{t('title')}</Link><h1 className="mt-8 font-display text-5xl font-semibold">{t('manageBuilders')}</h1><div className="mt-8"><AdminBuilderForm locale={locale} states={states} /></div><div className="mt-12 grid gap-3 sm:grid-cols-2">{builders.map((builder) => <Link key={builder.id} href={`/${locale}/b/${builder.slug}`} className="focus-ring rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"><p className="font-display text-xl font-semibold">{builder.name}</p><p className="mt-1 text-sm text-[var(--muted)]">{builder.headline}</p></Link>)}</div></div>;
}
