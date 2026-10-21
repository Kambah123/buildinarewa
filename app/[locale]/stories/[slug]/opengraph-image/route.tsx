import {ImageResponse} from 'next/og';
import {getStoryBySlug} from '@/lib/queries/community';

export const runtime = 'edge';

export async function GET(_: Request, {params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const story = await getStoryBySlug(slug);
  return new ImageResponse(
    <div style={{alignItems: 'stretch', background: '#f7f5f0', color: '#111111', display: 'flex', height: '100%', padding: 56, position: 'relative', width: '100%'}}>
      <div style={{background: '#c9a66b', bottom: 0, display: 'flex', height: 18, left: 0, position: 'absolute', right: 0}} />
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%'}}>
        <div style={{color: '#2b2e83', display: 'flex', fontSize: 22, fontWeight: 700, letterSpacing: 2}}>AREWA IS BUILDING · STORIES</div>
        <div style={{display: 'flex', flexDirection: 'column', maxWidth: 1000}}><div style={{fontFamily: 'serif', fontSize: 74, fontWeight: 700, letterSpacing: -3, lineHeight: 1}}>{story?.titleEn ?? 'Stories from Arewa'}</div><div style={{color: '#4d4d4d', display: 'flex', fontSize: 27, lineHeight: 1.35, marginTop: 24}}>{story?.excerptEn ?? 'The work behind the work.'}</div></div>
        <div style={{display: 'flex', fontSize: 22, fontWeight: 600}}>{story?.builder?.name ?? 'Arewa Is Building'}</div>
      </div>
    </div>,
    {width: 1200, height: 630}
  );
}
