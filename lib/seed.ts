import type {Category, Product, State} from './types';

export const seedCategories: Category[] = [
  {id: 'cat-fintech', slug: 'fintech', nameEn: 'Fintech', nameHa: 'Fasahar kuɗi', icon: 'WalletCards'},
  {id: 'cat-ai', slug: 'ai', nameEn: 'AI', nameHa: 'Basirar na’ura', icon: 'Sparkles'},
  {id: 'cat-agritech', slug: 'agritech', nameEn: 'Agritech', nameHa: 'Fasahar noma', icon: 'Wheat'},
  {id: 'cat-edtech', slug: 'edtech', nameEn: 'Edtech', nameHa: 'Fasahar ilimi', icon: 'GraduationCap'},
  {id: 'cat-healthtech', slug: 'healthtech', nameEn: 'Healthtech', nameHa: 'Fasahar lafiya', icon: 'HeartPulse'},
  {id: 'cat-logistics', slug: 'logistics', nameEn: 'Logistics', nameHa: 'Harkokin jigila', icon: 'Route'},
  {id: 'cat-developer-tools', slug: 'developer-tools', nameEn: 'Developer Tools', nameHa: 'Kayan masu haɓakawa', icon: 'Code2'},
  {id: 'cat-design', slug: 'design', nameEn: 'Design', nameHa: 'Zane', icon: 'Palette'},
  {id: 'cat-ecommerce', slug: 'e-commerce', nameEn: 'E-commerce', nameHa: 'Kasuwanci ta intanet', icon: 'ShoppingBag'},
  {id: 'cat-media', slug: 'media', nameEn: 'Media', nameHa: 'Kafofin watsa labarai', icon: 'Radio'},
  {id: 'cat-islamic-faith', slug: 'islamic-faith-tech', nameEn: 'Islamic / Faith tech', nameHa: 'Fasahar addini', icon: 'MoonStar'},
  {id: 'cat-gov-civic', slug: 'gov-civic', nameEn: 'Gov & Civic', nameHa: 'Gwamnati da jama’a', icon: 'Landmark'},
  {id: 'cat-hosting', slug: 'hosting', nameEn: 'Hosting', nameHa: 'Ajiye manhaja', icon: 'Server'},
  {id: 'cat-other', slug: 'other', nameEn: 'Other', nameHa: 'Sauran', icon: 'Shapes'}
];

export const seedStates: State[] = [
  {code: 'AD', slug: 'adamawa', name: 'Adamawa', region: 'North-East'},
  {code: 'BA', slug: 'bauchi', name: 'Bauchi', region: 'North-East'},
  {code: 'BE', slug: 'benue', name: 'Benue', region: 'North-Central'},
  {code: 'BO', slug: 'borno', name: 'Borno', region: 'North-East'},
  {code: 'FC', slug: 'fct-abuja', name: 'FCT Abuja', region: 'North-Central'},
  {code: 'GO', slug: 'gombe', name: 'Gombe', region: 'North-East'},
  {code: 'JI', slug: 'jigawa', name: 'Jigawa', region: 'North-West'},
  {code: 'KD', slug: 'kaduna', name: 'Kaduna', region: 'North-West'},
  {code: 'KN', slug: 'kano', name: 'Kano', region: 'North-West'},
  {code: 'KT', slug: 'katsina', name: 'Katsina', region: 'North-West'},
  {code: 'KE', slug: 'kebbi', name: 'Kebbi', region: 'North-West'},
  {code: 'KO', slug: 'kogi', name: 'Kogi', region: 'North-Central'},
  {code: 'KW', slug: 'kwara', name: 'Kwara', region: 'North-Central'},
  {code: 'NA', slug: 'nasarawa', name: 'Nasarawa', region: 'North-Central'},
  {code: 'NI', slug: 'niger', name: 'Niger', region: 'North-Central'},
  {code: 'PL', slug: 'plateau', name: 'Plateau', region: 'North-Central'},
  {code: 'SO', slug: 'sokoto', name: 'Sokoto', region: 'North-West'},
  {code: 'TA', slug: 'taraba', name: 'Taraba', region: 'North-East'},
  {code: 'YO', slug: 'yobe', name: 'Yobe', region: 'North-East'},
  {code: 'ZA', slug: 'zamfara', name: 'Zamfara', region: 'North-West'}
];

// These clearly marked seed listings make the directory useful before its first public submissions.
export const seedProducts: Product[] = [
  {
    id: 'seed-zipa',
    slug: 'zipa',
    name: 'Zipa',
    taglineEn: 'A seed listing in the first Arewa Is Building collection.',
    taglineHa: 'Bayani na farko a tarin farko na Arewa Is Building.',
    descriptionEn: 'Zipa is included as an initial seed listing for the Arewa Is Building directory. Its public profile will be expanded with maker-approved details as the directory opens to reviewed submissions.',
    descriptionHa: 'An sanya Zipa a matsayin bayani na farko a kundin Arewa Is Building. Za a ƙara bayanan da masu gina shi suka tabbatar da su yayin da kundin ya buɗe ga abubuwan da aka duba.',
    websiteUrl: 'https://usezipa.xyz',
    categorySlug: 'other',
    stateCode: 'KN',
    city: 'Kano',
    stage: 'live',
    funding: 'bootstrapped',
    alternativeTo: [],
    tags: ['seed', 'arewa'],
    status: 'featured',
    launchedAt: '2025-01-01T00:00:00.000Z',
    createdAt: '2025-01-01T00:00:00.000Z',
    upvoteCount: 0,
    isSeed: true,
    screenshots: [],
    makers: [{id: 'seed-builder-zipa', name: 'Zipa team', slug: 'zipa-team', role: 'Product team'}]
  },
  {
    id: 'seed-arewa-life',
    slug: 'arewa-life',
    name: 'arewa-life',
    taglineEn: 'A seed listing for a product shaped by life in Arewa.',
    taglineHa: 'Bayani na farko na wata manhaja da rayuwar Arewa ta tsara.',
    descriptionEn: 'arewa-life is part of the initial seed collection for Arewa Is Building. It is presented as a clearly labelled early listing while the editorial directory grows.',
    descriptionHa: 'arewa-life na cikin tarin bayanan farko na Arewa Is Building. An nuna shi a matsayin bayani na farko mai bayyanannen alama yayin da kundin masu gyara ke girma.',
    websiteUrl: 'https://arewa.life',
    categorySlug: 'media',
    stateCode: 'KD',
    city: 'Kaduna',
    stage: 'beta',
    funding: 'bootstrapped',
    alternativeTo: [],
    tags: ['seed', 'community'],
    status: 'approved',
    launchedAt: '2025-01-02T00:00:00.000Z',
    createdAt: '2025-01-02T00:00:00.000Z',
    upvoteCount: 0,
    isSeed: true,
    screenshots: [],
    makers: []
  },
  {
    id: 'seed-kasuwa-kit',
    slug: 'kasuwa-kit',
    name: 'Kasuwa Kit',
    taglineEn: 'A demonstration listing for independent sellers.',
    taglineHa: 'Misalin bayani ga masu sayarwa masu zaman kansu.',
    descriptionEn: 'Kasuwa Kit is a clearly labelled demonstration listing used to show how an approved product profile can look. It is not a recommendation or a claim about a live service.',
    descriptionHa: 'Kasuwa Kit misalin bayani ne mai alama da aka yi don nuna yadda bayanin samfurin da aka amince da shi zai iya kasancewa. Ba shawara ba ne ko ikirarin sabis mai aiki.',
    websiteUrl: 'https://example.com',
    categorySlug: 'e-commerce',
    stateCode: 'FC',
    city: 'Abuja',
    stage: 'idea',
    funding: 'bootstrapped',
    alternativeTo: ['Shopify'],
    tags: ['seed', 'demonstration'],
    status: 'approved',
    createdAt: '2024-12-28T00:00:00.000Z',
    upvoteCount: 0,
    isSeed: true,
    screenshots: [],
    makers: []
  }
];

export function getCategory(slug: string) {
  return seedCategories.find((category) => category.slug === slug);
}

export function getStateByCode(code: string) {
  return seedStates.find((state) => state.code === code);
}

export function getStateBySlug(slug: string) {
  return seedStates.find((state) => state.slug === slug);
}
