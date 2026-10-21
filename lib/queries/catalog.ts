import {seedCategories, seedProducts, seedStates} from '@/lib/seed';
import type {Category, PaginatedProducts, Product, ProductFilters, State} from '@/lib/types';
import {filterProducts} from '@/lib/utils';
import {getServerSupabase} from '@/lib/supabase/server';

const PAGE_SIZE = 12;

type DatabaseRow = Record<string, unknown>;

function mapCategory(row: DatabaseRow): Category {
  return {
    id: String(row.id),
    slug: String(row.slug),
    nameEn: String(row.name_en),
    nameHa: String(row.name_ha),
    icon: String(row.icon)
  };
}

function mapState(row: DatabaseRow): State {
  return {
    code: String(row.code),
    slug: String(row.slug),
    name: String(row.name),
    region: row.region as State['region']
  };
}

function arrayFrom(value: unknown) {
  return Array.isArray(value) ? value.map(String) : [];
}

async function signAssetUrl(
  supabase: NonNullable<Awaited<ReturnType<typeof getServerSupabase>>>,
  value: string | null | undefined
) {
  if (!value || /^https?:\/\//i.test(value)) return value ?? null;
  const {data} = await supabase.storage.from('product-assets').createSignedUrl(value, 60 * 60);
  return data?.signedUrl ?? null;
}

async function hydrateProductAssets(
  product: Product,
  supabase: NonNullable<Awaited<ReturnType<typeof getServerSupabase>>>
) {
  const [logoUrl, coverUrl, ...screenshots] = await Promise.all([
    signAssetUrl(supabase, product.logoUrl),
    signAssetUrl(supabase, product.coverUrl),
    ...product.screenshots.map((asset) => signAssetUrl(supabase, asset))
  ]);
  return {...product, logoUrl, coverUrl, screenshots: screenshots.filter((asset): asset is string => Boolean(asset))};
}

function mapProduct(row: DatabaseRow, categories: Category[]): Product {
  const categoryId = String(row.category_id ?? row.category_slug ?? 'other');
  const categorySlug = categories.find((category) => category.id === categoryId)?.slug ?? categoryId;
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
    screenshots: arrayFrom(row.screenshots),
    websiteUrl: String(row.website_url),
    demoVideoUrl: typeof row.demo_video_url === 'string' ? row.demo_video_url : null,
    categorySlug,
    stateCode: String(row.state),
    city: typeof row.city === 'string' ? row.city : null,
    stage: row.stage as Product['stage'],
    funding: row.funding as Product['funding'],
    alternativeTo: arrayFrom(row.alternative_to),
    tags: arrayFrom(row.tags),
    status: row.status as Product['status'],
    rejectionReason: typeof row.rejection_reason === 'string' ? row.rejection_reason : null,
    launchedAt: typeof row.launched_at === 'string' ? row.launched_at : null,
    createdAt: String(row.created_at),
    upvoteCount: Number(row.upvote_count ?? 0),
    isSeed: Boolean(row.is_seed),
    makers: []
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return seedCategories;
  const {data, error} = await supabase.from('categories').select('*').order('name_en');
  if (error || !data) return [];
  return (data as DatabaseRow[]).map(mapCategory);
}

export async function getStates(): Promise<State[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return seedStates;
  const {data, error} = await supabase.from('states').select('*').order('name');
  if (error || !data) return [];
  return (data as DatabaseRow[]).map(mapState);
}

async function getVisibleProducts(categories: Category[], filters: ProductFilters): Promise<Product[]> {
  const supabase = await getServerSupabase();
  if (!supabase) return seedProducts.filter((product) => product.status === 'approved' || product.status === 'featured');

  if (filters.query) {
    const {data, error} = await supabase.rpc('search_approved_products', {
      search_query: filters.query,
      result_limit: 200
    });
    if (!error && data) return Promise.all((data as DatabaseRow[]).map((row) => hydrateProductAssets(mapProduct(row, categories), supabase)));
  }

  const {data, error} = await supabase
    .from('products')
    .select('*')
    .in('status', ['approved', 'featured'])
    .order('created_at', {ascending: false})
    .limit(300);

  if (error || !data) return [];
  return Promise.all((data as DatabaseRow[]).map((row) => hydrateProductAssets(mapProduct(row, categories), supabase)));
}

export async function getDirectory(filters: ProductFilters = {}): Promise<PaginatedProducts> {
  const [categories, states] = await Promise.all([getCategories(), getStates()]);
  const visibleProducts = await getVisibleProducts(categories, filters);
  const filtered = filterProducts(visibleProducts, filters, categories, states);
  const page = Math.max(1, filters.page ?? 1);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  return {
    products: filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    total: filtered.length,
    page: currentPage,
    pageSize: PAGE_SIZE,
    pageCount
  };
}

export async function getProductBySlug(slug: string) {
  const [categories, states] = await Promise.all([getCategories(), getStates()]);
  const supabase = await getServerSupabase();

  let product: Product | undefined;
  if (!supabase) {
    product = seedProducts.find((item) => item.slug === slug && (item.status === 'approved' || item.status === 'featured'));
  } else {
    const {data} = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .in('status', ['approved', 'featured'])
      .maybeSingle();
    if (data) product = await hydrateProductAssets(mapProduct(data as DatabaseRow, categories), supabase);
  }

  if (!product) return null;

  if (supabase) {
    const {data: makerRows} = await supabase
      .from('product_makers')
      .select('role, profiles(id, name, handle)')
      .eq('product_id', product.id);
    if (makerRows) {
      product.makers = (makerRows as unknown as Array<{role: string; profiles: {id: string; name: string; handle?: string | null} | null}>)
        .filter((row) => row.profiles)
        .map((row) => ({id: row.profiles!.id, name: row.profiles!.name, handle: row.profiles!.handle, role: row.role}));
    }
  }

  return {
    product,
    category: categories.find((item) => item.slug === product.categorySlug),
    state: states.find((item) => item.code === product.stateCode),
    categories,
    states
  };
}

export async function getRelatedProducts(product: Product, limit = 3) {
  const directory = await getDirectory({category: product.categorySlug, sort: 'featured'});
  return directory.products.filter((item) => item.id !== product.id).slice(0, limit);
}

export async function getHomeData() {
  const [{products}, categories, states] = await Promise.all([
    getDirectory({sort: 'featured', page: 1}),
    getCategories(),
    getStates()
  ]);
  return {products: products.slice(0, 6), categories: categories.slice(0, 8), states: states.slice(0, 8)};
}

export async function getCategoryBySlug(slug: string) {
  return (await getCategories()).find((category) => category.slug === slug) ?? null;
}

export async function getStateBySlug(slug: string) {
  return (await getStates()).find((state) => state.slug === slug) ?? null;
}
