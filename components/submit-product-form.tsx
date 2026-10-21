'use client';

import {useActionState, useCallback, useRef, useState} from 'react';
import {CheckCircle2, ChevronLeft, ChevronRight, UploadCloud} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Turnstile} from './turnstile';
import {initialSubmissionState, submitProduct} from '@/app/[locale]/submit/actions';
import type {Category, Locale, State} from '@/lib/types';

export function SubmitProductForm({locale, categories, states}: {locale: Locale; categories: Category[]; states: State[]}) {
  const [state, action, pending] = useActionState(submitProduct.bind(null, locale), initialSubmissionState);
  const [step, setStep] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);
  const [token, setToken] = useState('');
  const setTurnstileToken = useCallback((value: string) => setToken(value), []);
  const t = useTranslations('Submit');
  const common = useTranslations('Common');
  const productText = useTranslations('Product');
  const directory = useTranslations('Directory');
  const labels = locale === 'ha'
    ? {idea: 'Ra’ayi', beta: 'Gwaji', live: 'Yana aiki', growing: 'Yana girma', bootstrapped: 'Da kai', funded: 'An tallafa'}
    : {idea: 'Idea', beta: 'Beta', live: 'Live', growing: 'Growing', bootstrapped: 'Bootstrapped', funded: 'Funded'};

  function continueToNextStep() {
    const activeStep = formRef.current?.querySelector<HTMLElement>(`fieldset[data-step="${step}"]`);
    const fields = activeStep ? Array.from(activeStep.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')) : [];
    if (!fields.every((field) => field.reportValidity())) return;
    setStep(step + 1);
  }

  if (state.status === 'success') {
    return <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7 sm:p-10"><CheckCircle2 size={32} className="text-[var(--indigo)]" /><h2 className="mt-5 font-display text-4xl font-semibold">{t('successTitle')}</h2><p className="mt-4 max-w-lg text-sm leading-7 text-[var(--muted)]">{t('successText', {name: state.productName ?? ''})}</p><a href={`/${locale}/me`} className="focus-ring mt-7 inline-block rounded-full bg-[var(--indigo)] px-5 py-3 text-sm font-bold text-white">{t('goToSubmissions')}</a></div>;
  }

  return <form ref={formRef} action={action} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-8" encType="multipart/form-data">
    <input name="turnstileToken" type="hidden" value={token} readOnly />
    <ol className="grid grid-cols-3 gap-2 border-b border-[var(--line)] pb-5" aria-label="Submission steps">
      {[t('stepOne'), t('stepTwo'), t('stepThree')].map((label, index) => <li key={label} className={`flex items-center gap-2 text-xs font-bold ${step === index + 1 ? 'text-[var(--indigo)]' : 'text-[var(--muted)]'}`}><span className={`grid size-5 place-items-center rounded-full border ${step === index + 1 ? 'border-[var(--indigo)] bg-[var(--indigo)] text-white' : 'border-[var(--line)]'}`}>{index + 1}</span><span className="hidden sm:inline">{label}</span></li>)}
    </ol>
    {state.status === 'error' ? <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">{state.message}</p> : null}

    <fieldset data-step="1" hidden={step !== 1} className="mt-7 space-y-5">
      <Field label={t('name')} error={state.fields?.name}><input name="name" required minLength={2} maxLength={80} className="input" /></Field>
      <Field label={t('website')} error={state.fields?.website}><input name="website" required type="url" placeholder="https://" className="input" /></Field>
      <Field label={t('taglineEn')} error={state.fields?.taglineEn}><input name="taglineEn" required minLength={12} maxLength={150} className="input" /></Field>
      <Field label={t('taglineHa')} optional><input name="taglineHa" maxLength={150} className="input" /></Field>
      <Field label={t('descriptionEn')} error={state.fields?.descriptionEn}><textarea name="descriptionEn" required minLength={60} maxLength={3000} rows={5} className="input resize-y" /></Field>
      <Field label={t('descriptionHa')} optional><textarea name="descriptionHa" maxLength={3000} rows={4} className="input resize-y" /></Field>
    </fieldset>

    <fieldset data-step="2" hidden={step !== 2} className="mt-7 grid gap-5 sm:grid-cols-2">
      <Field label={productText('category')} error={state.fields?.category}><select name="category" required defaultValue="" className="input"><option value="" disabled>{common('required')}</option>{categories.map((category) => <option key={category.id} value={category.slug}>{locale === 'ha' ? category.nameHa : category.nameEn}</option>)}</select></Field>
      <Field label={directory('state')} error={state.fields?.state}><select name="state" required defaultValue="" className="input"><option value="" disabled>{common('required')}</option>{states.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}</select></Field>
      <Field label={t('city')} error={state.fields?.city}><input name="city" required minLength={2} maxLength={100} className="input" /></Field>
      <Field label={productText('stage')} error={state.fields?.stage}><select name="stage" defaultValue="live" className="input"><option value="idea">{labels.idea}</option><option value="beta">{labels.beta}</option><option value="live">{labels.live}</option><option value="growing">{labels.growing}</option></select></Field>
      <Field label={productText('funding')} error={state.fields?.funding}><select name="funding" defaultValue="bootstrapped" className="input"><option value="bootstrapped">{labels.bootstrapped}</option><option value="funded">{labels.funded}</option></select></Field>
      <Field label={t('makerRole')} error={state.fields?.makerRole}><input name="makerRole" required minLength={2} maxLength={100} placeholder={locale === 'ha' ? 'Misali: Mai ginawa' : 'e.g. Founder'} className="input" /></Field>
      <Field label={t('alternatives')} optional hint={t('alternativesHint')}><input name="alternatives" maxLength={500} className="input" /></Field>
      <Field label={t('tags')} optional hint={t('tagsHint')}><input name="tags" maxLength={250} className="input" /></Field>
    </fieldset>

    <fieldset data-step="3" hidden={step !== 3} className="mt-7 space-y-5">
      <FileField label={t('logo')} name="logo" required error={state.fields?.logo} hint={t('uploadHint')} />
      <FileField label={t('cover')} name="cover" required error={state.fields?.cover} hint={t('uploadHint')} />
      <FileField label={t('screenshots')} name="screenshots" multiple hint={t('uploadHint')} />
      <div className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-4"><Turnstile onToken={setTurnstileToken} /><p className="mt-2 text-xs leading-5 text-[var(--muted)]">{t('turnstile')}</p></div>
    </fieldset>

    <div className="mt-8 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
      {step > 1 ? <button type="button" onClick={() => setStep(step - 1)} className="focus-ring inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold hover:bg-[var(--paper)]"><ChevronLeft size={16} />{t('previous')}</button> : <span />}
      {step < 3 ? <button type="button" onClick={continueToNextStep} className="focus-ring inline-flex items-center gap-1 rounded-full bg-[var(--ink)] px-4 py-2.5 text-sm font-bold text-[var(--paper)]">{t('next')}<ChevronRight size={16} /></button> : <button type="submit" disabled={pending} className="focus-ring rounded-full bg-[var(--indigo)] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{pending ? common('loading') : t('submit')}</button>}
    </div>
  </form>;
}

function Field({label, children, error, optional, hint}: {label: string; children: React.ReactNode; error?: string; optional?: boolean; hint?: string}) {
  const common = useTranslations('Common');
  return <label className="block space-y-2 text-sm font-bold text-[var(--ink)]"><span>{label} {optional ? <em className="ml-1 text-xs font-medium not-italic text-[var(--muted)]">({common('optional')})</em> : null}</span>{children}{hint ? <small className="block text-xs font-normal leading-5 text-[var(--muted)]">{hint}</small> : null}{error ? <small className="block text-xs font-semibold text-red-700 dark:text-red-300">{error}</small> : null}</label>;
}

function FileField({label, name, required, multiple, hint, error}: {label: string; name: string; required?: boolean; multiple?: boolean; hint: string; error?: string}) {
  return <Field label={label} hint={hint} error={error}><span className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[var(--line)] bg-[var(--paper)] px-4 py-4 text-sm font-medium text-[var(--muted)] transition hover:border-[var(--indigo)]"><UploadCloud size={20} className="text-[var(--indigo)]" /><span><span className="font-bold text-[var(--ink)]">{label}</span><br />{hint}</span><input className="sr-only" name={name} type="file" accept="image/png,image/jpeg,image/webp" required={required} multiple={multiple} /></span></Field>;
}
