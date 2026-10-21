import {Button, Container, Head, Heading, Html, Preview, Section, Text} from '@react-email/components';

type SubmissionUpdateEmailProps = {
  productName: string;
  status: 'received' | 'approved' | 'rejected';
  reason?: string;
  siteUrl: string;
};

const copy = {
  received: {
    preview: 'Your Arewa Is Building submission is in review.',
    heading: 'Your submission is with our editors.',
    body: 'Thanks for putting your work forward. We review every listing before it appears in the directory.'
  },
  approved: {
    preview: 'Your product is now live on Arewa Is Building.',
    heading: 'Your product is now live.',
    body: 'It has been reviewed and is ready for people to discover in the directory.'
  },
  rejected: {
    preview: 'There is an update on your Arewa Is Building submission.',
    heading: 'Your listing needs a little more work.',
    body: 'Our editors have left a note below. You are welcome to improve the details and submit again.'
  }
};

export function SubmissionUpdateEmail({productName, status, reason, siteUrl}: SubmissionUpdateEmailProps) {
  const message = copy[status];
  return (
    <Html>
      <Head />
      <Preview>{message.preview}</Preview>
      <Section style={body}>
        <Container style={container}>
          <Text style={eyebrow}>AREWA IS BUILDING</Text>
          <Heading style={heading}>{message.heading}</Heading>
          <Text style={paragraph}>“{productName}”</Text>
          <Text style={paragraph}>{message.body}</Text>
          {reason ? <Text style={note}><strong>Editorial note:</strong> {reason}</Text> : null}
          <Button href={`${siteUrl}/en/me`} style={button}>View my submissions</Button>
        </Container>
      </Section>
    </Html>
  );
}

const body = {backgroundColor: '#f7f5f0', fontFamily: 'Arial, sans-serif', padding: '32px 12px'};
const container = {backgroundColor: '#ffffff', border: '1px solid #e7e4dd', borderRadius: '16px', margin: '0 auto', maxWidth: '560px', padding: '36px'};
const eyebrow = {color: '#2b2e83', fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', margin: '0 0 18px'};
const heading = {color: '#111111', fontFamily: 'Georgia, serif', fontSize: '28px', lineHeight: '1.15', margin: '0 0 18px'};
const paragraph = {color: '#3f3f3f', fontSize: '16px', lineHeight: '1.6'};
const note = {backgroundColor: '#f7f5f0', borderRadius: '8px', color: '#3f3f3f', fontSize: '14px', lineHeight: '1.5', padding: '14px'};
const button = {backgroundColor: '#2b2e83', borderRadius: '8px', color: '#ffffff', display: 'inline-block', fontSize: '14px', fontWeight: '700', marginTop: '16px', padding: '12px 18px', textDecoration: 'none'};
