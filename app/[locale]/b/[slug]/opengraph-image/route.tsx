import {ImageResponse} from 'next/og';
import {getBuilderBySlug} from '@/lib/queries/community';

export const runtime = 'edge';

export async function GET(_: Request, {params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const result = await getBuilderBySlug(slug);
  const builder = result?.builder;
  return new ImageResponse(
    <div style={{background: '#f7f5f0', color: '#111111', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: 56, position: 'relative', width: '100%'}}>
      <div style={{background: '#2b2e83', bottom: 0, display: 'flex', height: 18, left: 0, position: 'absolute', right: 0}} />
      <div style={{color: '#2b2e83', display: 'flex', fontSize: 22, fontWeight: 700, letterSpacing: 2}}>AREWA IS BUILDING · BUILDER</div>
      <div style={{display: 'flex', flexDirection: 'column', maxWidth: 1000}}><div style={{fontFamily: 'serif', fontSize: 80, fontWeight: 700, letterSpacing: -3, lineHeight: 1}}>{builder?.name ?? 'Arewa builder'}</div><div style={{color: '#4d4d4d', display: 'flex', fontSize: 29, lineHeight: 1.35, marginTop: 24}}>{builder?.headline ?? 'The people behind the work.'}</div></div>
      <div style={{display: 'flex', fontSize: 22, fontWeight: 600}}>Northern Nigeria · Arewa</div>
    </div>,
    {width: 1200, height: 630}
  );
}
