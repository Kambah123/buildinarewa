import {Resend} from 'resend';
import {SubmissionUpdateEmail} from '@/emails/submission-update';
import {NewsletterConfirmationEmail} from '@/emails/newsletter-confirmation';
import {WeeklyDigestEmail} from '@/emails/weekly-digest';

export async function sendSubmissionEmail({
  to,
  productName,
  status,
  reason
}: {
  to: string;
  productName: string;
  status: 'received' | 'approved' | 'rejected';
  reason?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return {sent: false, skipped: true};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const resend = new Resend(apiKey);
  const subject = {
    received: `We received ${productName}`,
    approved: `${productName} is live on Arewa Is Building`,
    rejected: `An update on ${productName}`
  }[status];

  const {error} = await resend.emails.send({
    from,
    to,
    subject,
    react: SubmissionUpdateEmail({productName, status, reason, siteUrl})
  });

  if (error) {
    console.error('Submission email failed', error);
    return {sent: false, skipped: false};
  }
  return {sent: true, skipped: false};
}

export async function sendNewsletterConfirmation({to, lang, token}: {to: string; lang: 'en' | 'ha'; token: string}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return {sent: false, skipped: true};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const confirmUrl = `${siteUrl}/${lang}/newsletter/confirm?token=${encodeURIComponent(token)}`;
  const resend = new Resend(apiKey);
  const {error} = await resend.emails.send({
    from,
    to,
    subject: lang === 'ha' ? 'Tabbatar da rajistarka zuwa Arewa Is Building' : 'Confirm your Arewa Is Building subscription',
    react: NewsletterConfirmationEmail({confirmUrl, lang})
  });
  if (error) {
    console.error('Newsletter confirmation email failed', error);
    return {sent: false, skipped: false};
  }
  return {sent: true, skipped: false};
}

export async function sendWeeklyDigest({
  to,
  lang,
  products,
  story
}: {
  to: string;
  lang: 'en' | 'ha';
  products: Array<{name: string; tagline: string; url: string}>;
  story?: {name: string; tagline: string; url: string} | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return {sent: false, skipped: true};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const resend = new Resend(apiKey);
  const {error} = await resend.emails.send({
    from,
    to,
    subject: lang === 'ha' ? 'Saƙon mako-mako daga Arewa Is Building' : 'The weekly signal from Arewa Is Building',
    react: WeeklyDigestEmail({lang, products, story, siteUrl})
  });
  if (error) {
    console.error('Weekly digest email failed', error);
    return {sent: false, skipped: false};
  }
  return {sent: true, skipped: false};
}
