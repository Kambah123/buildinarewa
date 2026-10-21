-- Clearly labelled initial seed data. These records are not user-submitted listings.

insert into public.categories (slug, name_en, name_ha, icon) values
  ('fintech', 'Fintech', 'Fasahar kuɗi', 'WalletCards'),
  ('ai', 'AI', 'Basirar na’ura', 'Sparkles'),
  ('agritech', 'Agritech', 'Fasahar noma', 'Wheat'),
  ('edtech', 'Edtech', 'Fasahar ilimi', 'GraduationCap'),
  ('healthtech', 'Healthtech', 'Fasahar lafiya', 'HeartPulse'),
  ('logistics', 'Logistics', 'Harkokin jigila', 'Route'),
  ('developer-tools', 'Developer Tools', 'Kayan masu haɓakawa', 'Code2'),
  ('design', 'Design', 'Zane', 'Palette'),
  ('e-commerce', 'E-commerce', 'Kasuwanci ta intanet', 'ShoppingBag'),
  ('media', 'Media', 'Kafofin watsa labarai', 'Radio'),
  ('islamic-faith-tech', 'Islamic / Faith tech', 'Fasahar addini', 'MoonStar'),
  ('gov-civic', 'Gov & Civic', 'Gwamnati da jama’a', 'Landmark'),
  ('hosting', 'Hosting', 'Ajiye manhaja', 'Server'),
  ('other', 'Other', 'Sauran', 'Shapes')
on conflict (slug) do update set name_en = excluded.name_en, name_ha = excluded.name_ha, icon = excluded.icon;

insert into public.states (code, slug, name, region) values
  ('AD', 'adamawa', 'Adamawa', 'North-East'),
  ('BA', 'bauchi', 'Bauchi', 'North-East'),
  ('BE', 'benue', 'Benue', 'North-Central'),
  ('BO', 'borno', 'Borno', 'North-East'),
  ('FC', 'fct-abuja', 'FCT Abuja', 'North-Central'),
  ('GO', 'gombe', 'Gombe', 'North-East'),
  ('JI', 'jigawa', 'Jigawa', 'North-West'),
  ('KD', 'kaduna', 'Kaduna', 'North-West'),
  ('KN', 'kano', 'Kano', 'North-West'),
  ('KT', 'katsina', 'Katsina', 'North-West'),
  ('KE', 'kebbi', 'Kebbi', 'North-West'),
  ('KO', 'kogi', 'Kogi', 'North-Central'),
  ('KW', 'kwara', 'Kwara', 'North-Central'),
  ('NA', 'nasarawa', 'Nasarawa', 'North-Central'),
  ('NI', 'niger', 'Niger', 'North-Central'),
  ('PL', 'plateau', 'Plateau', 'North-Central'),
  ('SO', 'sokoto', 'Sokoto', 'North-West'),
  ('TA', 'taraba', 'Taraba', 'North-East'),
  ('YO', 'yobe', 'Yobe', 'North-East'),
  ('ZA', 'zamfara', 'Zamfara', 'North-West')
on conflict (code) do update set slug = excluded.slug, name = excluded.name, region = excluded.region;

insert into public.products (
  slug, name, tagline_en, tagline_ha, description_en, description_ha, website_url,
  category_id, state, city, stage, funding, alternative_to, tags, status, launched_at, is_seed, created_at
) values
  (
    'zipa',
    'Zipa',
    'A seed listing in the first Arewa Is Building collection.',
    'Bayani na farko a tarin farko na Arewa Is Building.',
    'Zipa is included as an initial seed listing for the Arewa Is Building directory. Its public profile will be expanded with maker-approved details as the directory opens to reviewed submissions.',
    'An sanya Zipa a matsayin bayani na farko a kundin Arewa Is Building. Za a ƙara bayanan da masu gina shi suka tabbatar da su yayin da kundin ya buɗe ga abubuwan da aka duba.',
    'https://usezipa.xyz',
    (select id from public.categories where slug = 'other'), 'KN', 'Kano', 'live', 'bootstrapped', '{}', array['seed', 'arewa'], 'featured', '2025-01-01T00:00:00Z', true, '2025-01-01T00:00:00Z'
  ),
  (
    'arewa-life',
    'arewa-life',
    'A seed listing for a product shaped by life in Arewa.',
    'Bayani na farko na wata manhaja da rayuwar Arewa ta tsara.',
    'arewa-life is part of the initial seed collection for Arewa Is Building. It is presented as a clearly labelled early listing while the editorial directory grows.',
    'arewa-life na cikin tarin bayanan farko na Arewa Is Building. An nuna shi a matsayin bayani na farko mai bayyanannen alama yayin da kundin masu gyara ke girma.',
    'https://arewa.life',
    (select id from public.categories where slug = 'media'), 'KD', 'Kaduna', 'beta', 'bootstrapped', '{}', array['seed', 'community'], 'approved', '2025-01-02T00:00:00Z', true, '2025-01-02T00:00:00Z'
  ),
  (
    'kasuwa-kit',
    'Kasuwa Kit',
    'A demonstration listing for independent sellers.',
    'Misalin bayani ga masu sayarwa masu zaman kansu.',
    'Kasuwa Kit is a clearly labelled demonstration listing used to show how an approved product profile can look. It is not a recommendation or a claim about a live service.',
    'Kasuwa Kit misalin bayani ne mai alama da aka yi don nuna yadda bayanin samfurin da aka amince da shi zai iya kasancewa. Ba shawara ba ne ko ikirarin sabis mai aiki.',
    'https://example.com',
    (select id from public.categories where slug = 'e-commerce'), 'FC', 'Abuja', 'idea', 'bootstrapped', array['Shopify'], array['seed', 'demonstration'], 'approved', null, true, '2024-12-28T00:00:00Z'
  )
on conflict (slug) do update set
  tagline_en = excluded.tagline_en,
  tagline_ha = excluded.tagline_ha,
  description_en = excluded.description_en,
  description_ha = excluded.description_ha,
  website_url = excluded.website_url,
  category_id = excluded.category_id,
  state = excluded.state,
  city = excluded.city,
  stage = excluded.stage,
  funding = excluded.funding,
  alternative_to = excluded.alternative_to,
  tags = excluded.tags,
  status = excluded.status,
  is_seed = true;
