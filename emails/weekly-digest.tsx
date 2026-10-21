import {Container, Head, Heading, Html, Link, Preview, Section, Text} from '@react-email/components';

type DigestItem = {name: string; tagline: string; url: string};
type WeeklyDigestProps = {lang: 'en' | 'ha'; products: DigestItem[]; story?: DigestItem | null; siteUrl: string};

const copy = {
  en: {preview: 'New work from Arewa this week.', eyebrow: 'THE WEEKLY SIGNAL', heading: 'What Arewa built this week.', products: 'New in the directory', story: 'One story worth reading', empty: 'No new approved products this week. The directory is still open for discovery.', explore: 'Explore the directory', read: 'Read story'},
  ha: {preview: 'Sabbin ayyuka daga Arewa wannan mako.', eyebrow: 'SAƘON MAKO-MAKO', heading: 'Abin da Arewa ta gina wannan mako.', products: 'Sabbi a kundin', story: 'Labari guda mai kyau', empty: 'Babu sabbin manhajoji da aka amince da su wannan mako. Kundin yana nan a buɗe domin bincike.', explore: 'Duba kundin manhajoji', read: 'Karanta labari'}
};

export function WeeklyDigestEmail({lang, products, story, siteUrl}: WeeklyDigestProps) {
  const t = copy[lang];
  return <Html><Head /><Preview>{t.preview}</Preview><Section style={body}><Container style={container}><Text style={eyebrow}>{t.eyebrow}</Text><Heading style={heading}>{t.heading}</Heading><Heading as="h2" style={subheading}>{t.products}</Heading>{products.length ? products.map((product) => <Section key={product.url} style={item}><Link href={product.url} style={itemTitle}>{product.name}</Link><Text style={itemText}>{product.tagline}</Text></Section>) : <Text style={paragraph}>{t.empty}</Text>}{story ? <><Heading as="h2" style={subheading}>{t.story}</Heading><Section style={item}><Link href={story.url} style={itemTitle}>{story.name}</Link><Text style={itemText}>{story.tagline}</Text><Link href={story.url} style={link}>{t.read} →</Link></Section></> : null}<Link href={`${siteUrl}/${lang}/products`} style={link}>{t.explore} →</Link></Container></Section></Html>;
}

const body = {backgroundColor: '#f7f5f0', fontFamily: 'Arial, sans-serif', padding: '32px 12px'};
const container = {backgroundColor: '#ffffff', border: '1px solid #e7e4dd', borderRadius: '16px', margin: '0 auto', maxWidth: '560px', padding: '36px'};
const eyebrow = {color: '#2b2e83', fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', margin: '0 0 18px'};
const heading = {color: '#111111', fontFamily: 'Georgia, serif', fontSize: '28px', lineHeight: '1.15', margin: '0 0 24px'};
const subheading = {color: '#111111', fontSize: '16px', lineHeight: '1.3', margin: '24px 0 10px'};
const paragraph = {color: '#3f3f3f', fontSize: '15px', lineHeight: '1.6'};
const item = {borderTop: '1px solid #e7e4dd', padding: '14px 0'};
const itemTitle = {color: '#2b2e83', fontSize: '16px', fontWeight: '700', textDecoration: 'none'};
const itemText = {color: '#3f3f3f', fontSize: '14px', lineHeight: '1.5', margin: '6px 0'};
const link = {color: '#2b2e83', fontSize: '14px', fontWeight: '700', textDecoration: 'none'};
