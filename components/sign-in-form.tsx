'use client';

import {useActionState} from 'react';
import {Mail} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {initialAuthState, sendMagicLink, signInWithGoogle} from '@/app/[locale]/sign-in/actions';
import type {Locale} from '@/lib/types';

export function SignInForm({locale, next, configError}: {locale: Locale; next: string; configError?: boolean}) {
  const [state, action, pending] = useActionState(sendMagicLink.bind(null, locale), initialAuthState);
  const t = useTranslations('Auth');
  const common = useTranslations('Common');

  if (state.status === 'sent') {
    return <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7"><Mail className="text-[var(--indigo)]" size={25} /><h2 className="mt-4 font-display text-3xl font-semibold">{t('sentTitle')}</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{t('sentText', {email: state.email ?? ''})}</p></div>;
  }

  return <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
    {configError ? <p className="mb-5 rounded-xl border border-[#c9a66b]/50 bg-[#c9a66b]/10 p-3 text-sm leading-6 text-[var(--ink)]">{t('configError')}</p> : null}
    {state.status === 'error' ? <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200" role="alert">{state.message}</p> : null}
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block space-y-2 text-sm font-semibold"><span>{t('email')}</span><input className="focus-ring w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3.5 py-3 font-normal" name="email" type="email" autoComplete="email" required /></label>
      <button className="focus-ring w-full rounded-xl bg-[var(--indigo)] px-4 py-3 text-sm font-bold text-white disabled:opacity-60" disabled={pending} type="submit">{pending ? common('loading') : t('emailAction')}</button>
    </form>
    <div className="my-6 flex items-center gap-3 text-xs text-[var(--muted)]"><span className="h-px flex-1 bg-[var(--line)]" />{t('or')}<span className="h-px flex-1 bg-[var(--line)]" /></div>
    <form action={signInWithGoogle.bind(null, locale)}><input type="hidden" name="next" value={next} /><button className="focus-ring w-full rounded-xl border border-[var(--line)] px-4 py-3 text-sm font-bold hover:bg-[var(--paper)]" type="submit">{t('google')}</button></form>
  </div>;
}
