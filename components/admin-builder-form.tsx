'use client';

import {useActionState} from 'react';
import {useTranslations} from 'next-intl';
import {createBuilder, initialReviewState} from '@/app/[locale]/admin/actions';
import type {Locale, State} from '@/lib/types';

export function AdminBuilderForm({locale, states}: {locale: Locale; states: State[]}) {
  const [state, action, pending] = useActionState(createBuilder.bind(null, locale), initialReviewState);
  const t = useTranslations('Admin');
  const common = useTranslations('Common');
  return <form action={action} className="grid gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:grid-cols-2"><FormMessage state={state} /><AdminField label={t('builderName')}><input name="name" required className="input" /></AdminField><AdminField label={t('builderHeadline')}><input name="headline" required className="input" /></AdminField><AdminField label={t('bioEn')} className="sm:col-span-2"><textarea name="bioEn" required minLength={40} rows={5} className="input resize-y" /></AdminField><AdminField label={t('bioHa')} className="sm:col-span-2"><textarea name="bioHa" rows={4} className="input resize-y" /></AdminField><AdminField label={t('state')}><select name="state" defaultValue="" className="input"><option value="">—</option>{states.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></AdminField><AdminField label={t('photoUrl')}><input name="photoUrl" type="url" placeholder="https://" className="input" /></AdminField><AdminField label={t('website')}><input name="website" type="url" placeholder="https://" className="input" /></AdminField><AdminField label={t('xUrl')}><input name="x" type="url" placeholder="https://" className="input" /></AdminField><AdminField label={t('linkedinUrl')} className="sm:col-span-2"><input name="linkedin" type="url" placeholder="https://" className="input" /></AdminField><div className="sm:col-span-2 flex justify-end"><button type="submit" disabled={pending} className="focus-ring rounded-full bg-[var(--indigo)] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{pending ? common('loading') : t('create')}</button></div></form>;
}

export function AdminField({label, children, className = ''}: {label: string; children: React.ReactNode; className?: string}) { return <label className={`block space-y-1.5 text-sm font-bold ${className}`}><span>{label}</span>{children}</label>; }
function FormMessage({state}: {state: {status: string; message?: string}}) { return state.message ? <p role={state.status === 'error' ? 'alert' : 'status'} className={`sm:col-span-2 rounded-xl p-3 text-sm ${state.status === 'error' ? 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-200' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200'}`}>{state.message}</p> : null; }
