'use client';

import {useActionState} from 'react';
import {useTranslations} from 'next-intl';
import {initialPendingEditState, updatePendingProduct} from '@/app/[locale]/me/actions';
import type {Category, Locale, Product, State} from '@/lib/types';

export function PendingProductEditForm({locale, product, categories, states}: {locale: Locale; product: Product; categories: Category[]; states: State[]}) {
  const [state, action, pending] = useActionState(updatePendingProduct.bind(null, locale, product.slug), initialPendingEditState);
  const submit = useTranslations('Submit');
  const productText = useTranslations('Product');
  const directory = useTranslations('Directory');
  const common = useTranslations('Common');
  const account = useTranslations('Account');
  return <form action={action} className="mt-8 grid gap-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:grid-cols-2 sm:p-8">
    <input type="hidden" name="productId" value={product.id} />
    {state.message ? <p role={state.status === 'error' ? 'alert' : 'status'} className={`sm:col-span-2 rounded-xl p-3 text-sm ${state.status === 'error' ? 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-200' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200'}`}>{state.message}</p> : null}
    <EditField label={submit('name')}><input name="name" defaultValue={product.name} required minLength={2} maxLength={80} className="input" /></EditField>
    <EditField label={submit('website')}><input defaultValue={product.websiteUrl} disabled className="input cursor-not-allowed opacity-60" aria-describedby="website-help" /><small id="website-help" className="text-xs font-normal text-[var(--muted)]">{account('websiteNote')}</small></EditField>
    <EditField label={submit('taglineEn')}><input name="taglineEn" defaultValue={product.taglineEn} required minLength={12} maxLength={150} className="input" /></EditField>
    <EditField label={submit('city')}><input name="city" defaultValue={product.city ?? ''} required minLength={2} maxLength={100} className="input" /></EditField>
    <EditField label={submit('descriptionEn')} className="sm:col-span-2"><textarea name="descriptionEn" defaultValue={product.descriptionEn} required minLength={60} maxLength={3000} rows={6} className="input resize-y" /></EditField>
    <EditField label={productText('category')}><select name="category" defaultValue={product.categorySlug} className="input">{categories.map((category) => <option key={category.id} value={category.id}>{locale === 'ha' ? category.nameHa : category.nameEn}</option>)}</select></EditField>
    <EditField label={directory('state')}><select name="state" defaultValue={product.stateCode} className="input">{states.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></EditField>
    <EditField label={productText('stage')}><select name="stage" defaultValue={product.stage} className="input"><option value="idea">Idea</option><option value="beta">Beta</option><option value="live">Live</option><option value="growing">Growing</option></select></EditField>
    <EditField label={productText('funding')}><select name="funding" defaultValue={product.funding} className="input"><option value="bootstrapped">Bootstrapped</option><option value="funded">Funded</option></select></EditField>
    <EditField label={submit('alternatives')} hint={submit('alternativesHint')}><input name="alternatives" defaultValue={product.alternativeTo.join(', ')} className="input" /></EditField>
    <EditField label={submit('tags')} hint={submit('tagsHint')}><input name="tags" defaultValue={product.tags.join(', ')} className="input" /></EditField>
    <div className="sm:col-span-2 flex justify-end border-t border-[var(--line)] pt-5"><button type="submit" disabled={pending} className="focus-ring rounded-full bg-[var(--indigo)] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{pending ? common('loading') : common('save')}</button></div>
  </form>;
}

function EditField({label, children, hint, className = ''}: {label: string; children: React.ReactNode; hint?: string; className?: string}) {
  return <label className={`block space-y-2 text-sm font-bold ${className}`}><span>{label}</span>{children}{hint ? <small className="block text-xs font-normal leading-5 text-[var(--muted)]">{hint}</small> : null}</label>;
}
