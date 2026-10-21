import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {redirect} from 'next/navigation';
import {AdminStoryForm} from '@/components/admin-story-form';
import {getViewer} from '@/lib/queries/account';
import {getAdminStories, getBuilders} from '@/lib/queries/community';
import type {Locale} from '@/lib/types';

export default async function AdminStoriesPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const viewer = await getViewer();
  if (!viewer) redirect(`/${locale}/sign-in?next=/${locale}/admin/stories`);
  const t = await getTranslations('Admin');
  if (viewer.role !== 'admin' && viewer.role !== 'editor') redirect(`/${locale}/admin`);
  const [builders, stories] = await Promise.all([getBuilders(), getAdminStories()]);
  return <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12"><Link href={`/${locale}/admin`} className="focus-ring inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]"><ArrowLeft size={16} />{t('title')}</Link><h1 className="mt-8 font-display text-5xl font-semibold">{t('manageStories')}</h1><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{t('trustedMdx')}</p><div className="mt-8"><AdminStoryForm locale={locale} builders={builders} /></div><div className="mt-12 grid gap-3 sm:grid-cols-2">{stories.map((story) => <Link key={story.id} href={`/${locale}/stories/${story.slug}`} className="focus-ring rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"><p className="font-display text-xl font-semibold">{story.titleEn}</p><p className="mt-1 text-sm text-[var(--muted)]">{story.status}</p></Link>)}</div></div>;
}
