import {NextResponse} from 'next/server';
import {getAdminSupabase} from '@/lib/supabase/server';
import {sendWeeklyDigest} from '@/lib/email';

function stringOrEmpty(value: unknown) {
  return typeof value === 'string' ? value : '';
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401});
  }
  const supabase = getAdminSupabase();
  if (!supabase) return NextResponse.json({error: 'Supabase service role is not configured.'}, {status: 503});

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [{data: subscribers, error: subscribersError}, {data: products, error: productsError}, {data: stories, error: storiesError}] = await Promise.all([
    supabase.from('newsletter_subscribers').select('email, lang').eq('confirmed', true),
    supabase.from('products').select('slug, name, tagline_en, tagline_ha').in('status', ['approved', 'featured']).gte('launched_at', since).order('launched_at', {ascending: false}).limit(12),
    supabase.from('stories').select('slug, title_en, title_ha, excerpt_en, excerpt_ha').eq('status', 'published').order('published_at', {ascending: false}).limit(1)
  ]);
  if (subscribersError || productsError || storiesError) return NextResponse.json({error: subscribersError?.message ?? productsError?.message ?? storiesError?.message ?? 'Could not build the digest.'}, {status: 500});

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const latestStory = stories?.[0];
  const results = await Promise.all((subscribers ?? []).map(async (subscriber) => {
    const lang = subscriber.lang === 'ha' ? 'ha' : 'en';
    const digestProducts = (products ?? []).map((product) => ({
      name: product.name,
      tagline: lang === 'ha' && product.tagline_ha ? product.tagline_ha : product.tagline_en,
      url: `${siteUrl}/${lang}/p/${product.slug}`
    }));
    const story = latestStory ? {
      name: lang === 'ha' && latestStory.title_ha ? latestStory.title_ha : latestStory.title_en,
      tagline: lang === 'ha' && latestStory.excerpt_ha ? latestStory.excerpt_ha : latestStory.excerpt_en,
      url: `${siteUrl}/${lang}/stories/${latestStory.slug}`
    } : null;
    return sendWeeklyDigest({to: stringOrEmpty(subscriber.email), lang, products: digestProducts, story});
  }));

  return NextResponse.json({sent: results.filter((result) => result.sent).length, skipped: results.filter((result) => result.skipped).length, subscribers: subscribers?.length ?? 0});
}
