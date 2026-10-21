export type Locale = 'en' | 'ha';

export type ProductStatus = 'pending' | 'approved' | 'rejected' | 'featured';
export type ProductStage = 'idea' | 'beta' | 'live' | 'growing';
export type FundingType = 'bootstrapped' | 'funded';
export type ProfileRole = 'user' | 'editor' | 'admin';

export type Category = {
  id: string;
  slug: string;
  nameEn: string;
  nameHa: string;
  icon: string;
};

export type State = {
  code: string;
  slug: string;
  name: string;
  region: 'North-West' | 'North-East' | 'North-Central';
};

export type Maker = {
  id: string;
  name: string;
  role: string;
  handle?: string | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  taglineEn: string;
  taglineHa?: string | null;
  descriptionEn: string;
  descriptionHa?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  screenshots: string[];
  websiteUrl: string;
  demoVideoUrl?: string | null;
  categorySlug: string;
  stateCode: string;
  city?: string | null;
  stage: ProductStage;
  funding: FundingType;
  alternativeTo: string[];
  tags: string[];
  status: ProductStatus;
  rejectionReason?: string | null;
  launchedAt?: string | null;
  createdAt: string;
  upvoteCount: number;
  isSeed: boolean;
  makers: Maker[];
};

export type ProductFilters = {
  query?: string;
  category?: string;
  state?: string;
  stage?: ProductStage;
  funding?: FundingType;
  alternative?: string;
  sort?: 'featured' | 'newest';
  page?: number;
};

export type PaginatedProducts = {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export type Viewer = {
  id: string;
  email?: string;
  role: ProfileRole;
  name?: string | null;
};
