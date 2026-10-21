import type {Metadata} from 'next';
import {legalContent, contentFor} from '@/lib/content';
import type {Locale} from '@/lib/types';

export const metadata: Metadata = {title: 'Terms of use'};

export default async function TermsPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const content = legalContent[contentFor(locale)].terms;
  return <LegalPage eyebrow="Arewa Is Building" title={content.title} intro={content.intro} sections={content.sections} />;
}

function LegalPage({eyebrow, title, intro, sections}: {eyebrow: string; title: string; intro: string; sections: readonly (readonly [string, string])[]}) {
  return <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--indigo)]">{eyebrow}</p><h1 className="mt-4 font-display text-5xl font-semibold sm:text-6xl">{title}</h1><p className="mt-5 text-lg leading-8 text-[var(--muted)]">{intro}</p><div className="mt-12 space-y-9">{sections.map(([heading, body]) => <section key={heading}><h2 className="font-display text-3xl font-semibold">{heading}</h2><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{body}</p></section>)}</div></div>;
}
