import {ImageResponse} from 'next/og';
import {getProductBySlug} from '@/lib/queries/catalog';

export const runtime = 'edge';
export const alt = 'Arewa Is Building product listing';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default async function OpenGraphImage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const result = await getProductBySlug(slug);
  const title = result?.product.name ?? 'Arewa Is Building';
  const tagline = result?.product.taglineEn ?? 'Discover software built in Northern Nigeria.';
  const state = result?.state?.name ?? 'Northern Nigeria';
  return new ImageResponse(
    <div style={{alignItems: 'stretch', background: '#f7f5f0', color: '#111111', display: 'flex', height: '100%', padding: 56, position: 'relative', width: '100%'}}>
      <div style={{background: '#2b2e83', bottom: 0, display: 'flex', height: 18, left: 0, position: 'absolute', right: 0}} />
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%'}}>
        <div style={{color: '#2b2e83', display: 'flex', fontSize: 22, fontWeight: 700, letterSpacing: 2}}>AREWA IS BUILDING</div>
        <div style={{display: 'flex', flexDirection: 'column', maxWidth: 930}}>
          <div style={{fontFamily: 'serif', fontSize: 86, fontWeight: 700, letterSpacing: -4, lineHeight: 1}}>{title}</div>
          <div style={{color: '#4d4d4d', display: 'flex', fontSize: 30, lineHeight: 1.35, marginTop: 24}}>{tagline}</div>
        </div>
        <div style={{display: 'flex', fontSize: 23, fontWeight: 600}}>Built in {state}</div>
      </div>
    </div>,
    size
  );
}
