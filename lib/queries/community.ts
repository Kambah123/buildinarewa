import {seedBuilders, seedNeeds, seedStories} from '@/lib/seed-community';
import {getDirectory, getProductBySlug, getStates} from '@/lib/queries/catalog';
import {getServerSupabase} from '@/lib/supabase/server';
import type {Builder, BuilderLinks, Product, ProductNeed, Story} from '@/lib/types';

type Row = Record<string, unknown>;

function mapLinks(value: unknown): BuilderLinks {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const links = value as Record<string, unknown>;
  return {
    website: typeof links.website === 'string' ? links.website : null,
    x: typeof links.x === 'string' ? links.x : null,
    linkedin: typeof links.linkedin === 'string' ? links.linkedin : null
  };
}

function mapBuilder(row: Row): Builder {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    photoUrl: typeof row.photo_url === 'string' ? row.photo_url : null,
    headline: String(row.headline),
    bioEn: String(row.bio_en),
    bioHa: typeof row.bio_ha === 'string' ? row.bio_ha : null,
    stateCode: typeof row.state === 'string' ? row.state : null,
    links: mapLinks(row.links),
    storyId: typeof row.story_id === 'string' ? row.story_id : null,
    isSeed: Boolean(row.is_seed),
    createdAt: String(row.created_at)
  };
}

function relationship(value: unknown) {
  if (Array.isArray(value)) return value[0] as Row | undefined;
  return value as Row | null | undefined;
}

function mapStory(row: Row): Story {
  const builderRow = relationship(row.builders);
  return {
    id: String(row.id),
    slug: String(row.slug),
    builderId: typeof row.builder_id === 'string' ? row.builder_id : null,
    titleEn: String(row.title_en),
    titleHa: typeof row.title_ha === 'string' ? row.title_ha : null,
    excerptEn: String(row.excerpt_en),
    excerptHa: typeof row.excerpt_ha === 'string' ? row.excerpt_ha : null,
    bodyEn: String(row.body_en),
    bodyHa: typeof row.body_ha === 'string' ? row.body_ha : null,
    coverUrl: typeof row.cover_url === 'string' ? row.cover_url : null,
    videoUrl: typeof row.video_url === 'string' ? row.video_url : null,
    status: row.status as Story['status'],
    publishedAt: typeof row.published_at === 'string' ? row.published_at : null,
    isSeed: Boolean(row.is_seed),
    createdAt: String(row.created_at),
    builder: builderRow ? mapBuilder(builderRow) : null
  };
}

export async function getBuilders(): Promise<Builder[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return seedBuilders;
  const {data, error} = await supabase.from('builders').select('*').order('created_at', {ascending: false});
  if (error || !data) return [];
  return (data as unknown as Row[]).map(mapBuilder);
}

export async function getBuilderBySlug(slug: string) {
  const supabase = await getServerSupabase();
  let builder: Builder | undefined;
  let productIds: string[] = [];

  if (!supabase) {
    builder = seedBuilders.find((item) => item.slug === slug);
    productIds = builder?.id === 'seed-builder-zipa' ? ['seed-zipa'] : [];
  } else {
    const {data} = await supabase.from('builders').select('*').eq('slug', slug).maybeSingle();
    if (data) builder = mapBuilder(data as unknown as Row);
    if (builder) {
      const {data: makerRows} = await supabase.from('product_makers').select('product_id').eq('builder_id', builder.id);
      productIds = (makerRows ?? []).map((row) => row.product_id);
    }
  }
  if (!builder) return null;

  const [directory, stories, states] = await Promise.all([getDirectory({sort: 'featured'}), getStories(), getStates()]);
  return {
    builder,
    products: directory.products.filter((product) => productIds.includes(product.id)),
    story: stories.find((item) => item.builderId === builder!.id || item.id === builder!.storyId) ?? null,
    states
  };
}

export async function getStories(limit = 30): Promise<Story[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return seedStories.slice(0, limit);
  const {data, error} = await supabase
    .from('stories')
    .select('*, builders(*)')
    .eq('status', 'published')
    .order('published_at', {ascending: false})
    .limit(limit);
  if (error || !data) return [];
  return (data as unknown as Row[]).map(mapStory);
}

export async function getAdminStories() {
  const supabase = await getServerSupabase();
  if (!supabase) return seedStories;
  const {data, error} = await supabase.from('stories').select('*, builders(*)').order('created_at', {ascending: false});
  if (error || !data) return [];
  return (data as unknown as Row[]).map(mapStory);
}

export async function getStoryBySlug(slug: string) {
  const supabase = await getServerSupabase();
  if (!supabase) return seedStories.find((story) => story.slug === slug) ?? null;
  const {data} = await supabase
    .from('stories')
    .select('*, builders(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data ? mapStory(data as unknown as Row) : null;
}

export async function getNeeds(): Promise<ProductNeed[]> {
  const supabase = await getServerSupabase();
  const [directory] = await Promise.all([getDirectory({sort: 'featured'})]);
  if (!supabase) {
    return seedNeeds.map((need) => ({...need, product: directory.products.find((product) => product.id === need.productId) ?? null}));
  }
  const {data, error} = await supabase.from('needs').select('*').order('sort', {ascending: true});
  if (error || !data) return [];
  return (data as unknown as Row[]).map((row) => ({
    id: String(row.id),
    needEn: String(row.need_en),
    needHa: typeof row.need_ha === 'string' ? row.need_ha : null,
    productId: String(row.product_id),
    sort: Number(row.sort),
    product: directory.products.find((product) => product.id === String(row.product_id)) ?? null
  }));
}

export async function getFeaturedProduct(): Promise<Product | null> {
  const directory = await getDirectory({sort: 'featured'});
  return directory.products.find((product) => product.status === 'featured') ?? directory.products[0] ?? null;
}

export async function getAlternative(name: string) {
  const directory = await getDirectory({alternative: name, sort: 'featured'});
  return directory.products;
}

export async function getUpvotedProductIds(productIds?: string[]) {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const {data: {user}} = await supabase.auth.getUser();
  if (!user) return [];
  let query = supabase.from('upvotes').select('product_id').eq('user_id', user.id);
  if (productIds?.length) query = query.in('product_id', productIds);
  const {data} = await query;
  return (data ?? []).map((item) => item.product_id);
}

export async function getMyUpvotedProducts(userId: string) {
  const supabase = await getServerSupabase();
  if (!supabase) return [];
  const {data, error} = await supabase.from('upvotes').select('product_id').eq('user_id', userId);
  if (error || !data?.length) return [];
  const ids = data.map((row) => row.product_id);
  const firstPage = await getDirectory({sort: 'featured'});
  const remainingPages = await Promise.all(Array.from({length: Math.max(0, firstPage.pageCount - 1)}, (_, index) => getDirectory({sort: 'featured', page: index + 2})));
  return [firstPage, ...remainingPages].flatMap((page) => page.products).filter((product) => ids.includes(product.id));
}

export async function getStageTwoHomeData() {
  const [featuredCandidate, builders, stories, needs] = await Promise.all([
    getFeaturedProduct(),
    getBuilders(),
    getStories(3),
    getNeeds()
  ]);
  const featuredDetail = featuredCandidate ? await getProductBySlug(featuredCandidate.slug) : null;
  return {featuredProduct: featuredDetail?.product ?? featuredCandidate, builders: builders.slice(0, 6), stories, needs};
}

export async function getProductStory(product: Product) {
  const result = await getProductBySlug(product.slug);
  if (!result?.product.makers.length) return null;
  const stories = await getStories();
  const makerNames = result.product.makers.map((maker) => maker.name);
  return stories.find((story) => story.builder && makerNames.includes(story.builder.name)) ?? null;
}
