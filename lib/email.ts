import {Resend} from 'resend';
import {SubmissionUpdateEmail} from '@/emails/submission-update';

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
