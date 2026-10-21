import {getServerSupabase} from '@/lib/supabase/server';
import type {Product, Viewer} from '@/lib/types';
import {getCategories} from './catalog';

function mapOwnedProduct(row: Record<string, unknown>, categoryById: Map<string, string>): Product {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    taglineEn: String(row.tagline_en),
    taglineHa: typeof row.tagline_ha === 'string' ? row.tagline_ha : null,
    descriptionEn: String(row.description_en),
    descriptionHa: typeof row.description_ha === 'string' ? row.description_ha : null,
    logoUrl: typeof row.logo_url === 'string' ? row.logo_url : null,
    coverUrl: typeof row.cover_url === 'string' ? row.cover_url : null,
    screenshots: Array.isArray(row.screenshots) ? row.screenshots.map(String) : [],
    websiteUrl: String(row.website_url),
    demoVideoUrl: typeof row.demo_video_url === 'string' ? row.demo_video_url : null,
    categorySlug: categoryById.get(String(row.category_id)) ?? 'other',
    stateCode: String(row.state),
    city: typeof row.city === 'string' ? row.city : null,
    stage: row.stage as Product['stage'],
    funding: row.funding as Product['funding'],
    alternativeTo: Array.isArray(row.alternative_to) ? row.alternative_to.map(String) : [],
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    status: row.status as Product['status'],
    rejectionReason: typeof row.rejection_reason === 'string' ? row.rejection_reason : null,
    launchedAt: typeof row.launched_at === 'string' ? row.launched_at : null,
    createdAt: String(row.created_at),
    upvoteCount: Number(row.upvote_count ?? 0),
    isSeed: Boolean(row.is_seed),
    makers: []
  };
}

export async function getViewer(): Promise<Viewer | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;

  const {data: {user}} = await supabase.auth.getUser();
  if (!user) return null;
  const {data: profile} = await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email,
    name: profile?.name ?? user.user_metadata?.full_name ?? null,
    role: profile?.role === 'admin' || profile?.role === 'editor' ? profile.role : 'user'
  };
}

export async function getMyProducts(userId: string) {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const [categories, {data, error}] = await Promise.all([
    getCategories(),
    supabase.from('products').select('*').eq('submitted_by', userId).order('created_at', {ascending: false})
  ]);
  if (error || !data) return [];
  const map = new Map(categories.map((category) => [category.id, category.slug]));
  return (data as unknown as Record<string, unknown>[]).map((row) => mapOwnedProduct(row, map));
}

export async function getReviewProducts() {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const [categories, {data, error}] = await Promise.all([
    getCategories(),
    supabase
      .from('products')
      .select('*, profiles:submitted_by(name)')
      .eq('status', 'pending')
      .order('created_at', {ascending: true})
  ]);
  if (error || !data) return [];
  const map = new Map(categories.map((category) => [category.id, category.slug]));
  return (data as unknown as Record<string, unknown>[]).map((row) => ({
    product: mapOwnedProduct(row, map),
    submitter: (row.profiles as {name?: string | null; email?: string | null} | null) ?? null
  }));
}
