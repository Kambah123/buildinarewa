import {Button, Container, Head, Heading, Html, Preview, Section, Text} from '@react-email/components';

type NewsletterConfirmationProps = {confirmUrl: string; lang: 'en' | 'ha'};

const copy = {
  en: {preview: 'Confirm your Arewa Is Building weekly email.', eyebrow: 'THE WEEKLY SIGNAL', heading: 'One small step, then we’re in your inbox.', text: 'Confirm your email to receive newly approved products and one story worth reading every Monday.', action: 'Confirm my subscription'},
  ha: {preview: 'Tabbatar da imel ɗinka na mako-mako daga Arewa Is Building.', eyebrow: 'SAƘON MAKO-MAKO', heading: 'Mataki guda, sannan za mu shiga akwatin saƙonka.', text: 'Tabbatar da imel ɗinka domin samun sababbin manhajoji da aka amince da su da labari guda mai kyau kowace Litinin.', action: 'Tabbatar da rajistata'}
};

export function NewsletterConfirmationEmail({confirmUrl, lang}: NewsletterConfirmationProps) {
  const t = copy[lang];
  return <Html><Head /><Preview>{t.preview}</Preview><Section style={body}><Container style={container}><Text style={eyebrow}>{t.eyebrow}</Text><Heading style={heading}>{t.heading}</Heading><Text style={paragraph}>{t.text}</Text><Button href={confirmUrl} style={button}>{t.action}</Button></Container></Section></Html>;
}

const body = {backgroundColor: '#f7f5f0', fontFamily: 'Arial, sans-serif', padding: '32px 12px'};
const container = {backgroundColor: '#ffffff', border: '1px solid #e7e4dd', borderRadius: '16px', margin: '0 auto', maxWidth: '560px', padding: '36px'};
const eyebrow = {color: '#2b2e83', fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', margin: '0 0 18px'};
const heading = {color: '#111111', fontFamily: 'Georgia, serif', fontSize: '28px', lineHeight: '1.15', margin: '0 0 18px'};
const paragraph = {color: '#3f3f3f', fontSize: '16px', lineHeight: '1.6'};
const button = {backgroundColor: '#2b2e83', borderRadius: '8px', color: '#ffffff', display: 'inline-block', fontSize: '14px', fontWeight: '700', marginTop: '16px', padding: '12px 18px', textDecoration: 'none'};
