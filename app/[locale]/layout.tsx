import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import '@/app/globals.css';
import {locales, type AppLocale} from '@/i18n/routing';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-footer';
import {getViewer} from '@/lib/queries/account';

// The layout reads the authenticated viewer from Supabase cookies for every request.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {default: 'Arewa Is Building', template: '%s · Arewa Is Building'},
  description: 'Discover software built in Northern Nigeria and by Arewa people everywhere.',
  applicationName: 'Arewa Is Building',
  keywords: ['Arewa', 'Northern Nigeria', 'software', 'startup directory', 'Kano', 'Kaduna', 'Abuja'],
  openGraph: {
    type: 'website',
    siteName: 'Arewa Is Building',
    title: 'Arewa Is Building',
    description: 'Discover software built in Northern Nigeria and by Arewa people everywhere.'
  },
  twitter: {card: 'summary_large_image'}
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Readonly<{children: React.ReactNode; params: Promise<{locale: string}>;}>) {
  const {locale} = await params;
  if (!locales.includes(locale as AppLocale)) notFound();
  const appLocale = locale as AppLocale;
  const [messages, viewer] = await Promise.all([getMessages(), getViewer()]);

  return (
    <html lang={appLocale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
            <SiteHeader locale={appLocale} viewer={viewer} />
            <main>{children}</main>
            <SiteFooter locale={appLocale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
