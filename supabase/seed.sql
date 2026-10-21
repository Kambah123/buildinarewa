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


-- Stage 2 seed data. These editorial previews are deliberately marked as seed records.
-- This block runs after all migrations when `supabase db reset` loads this seed file.

insert into public.builders (slug, name, headline, bio_en, bio_ha, state, links, is_seed) values
  (
    'arewa-is-building-desk',
    'Arewa Is Building editorial desk',
    'The team curating an early view of Northern Nigeria’s product ecosystem.',
    'This seed profile is an editorial placeholder for the people maintaining the directory. It intentionally makes no claim about an individual founder while the platform begins collecting maker-approved profiles.',
    'Wannan bayanin farko na ƙungiyar masu gyara ne da ke kula da kundin. Ba ya yin ikirari game da wani mutum yayin da dandali ke fara tattara bayanan da masu gina kaya suka tabbatar.',
    'FC',
    '{"website": "https://arewaisbuilding.com"}'::jsonb,
    true
  ),
  (
    'zipa-team',
    'Zipa team',
    'A seed team profile attached to Zipa’s opening directory listing.',
    'This seed profile keeps the directory’s opening listing connected to a team without inventing personal founder details. It will be replaced with maker-approved information when the team claims the listing.',
    'Wannan bayanin farko yana haɗa jerin farko da ƙungiya ba tare da ƙirƙirar bayanan mutum ba. Za a maye gurbinsa da bayanin da masu gina shi suka tabbatar idan ƙungiyar ta karɓi jerin.',
    'KN',
    '{}'::jsonb,
    true
  )
on conflict (slug) do update set
  name = excluded.name,
  headline = excluded.headline,
  bio_en = excluded.bio_en,
  bio_ha = excluded.bio_ha,
  state = excluded.state,
  links = excluded.links,
  is_seed = true;

insert into public.stories (builder_id, slug, title_en, title_ha, excerpt_en, excerpt_ha, body_en, body_ha, status, published_at, is_seed) values
  (
    (select id from public.builders where slug = 'arewa-is-building-desk'),
    'a-directory-starts-by-making-room',
    'A directory starts by making room',
    'Kundi yana farawa ne da samar da wuri',
    'An editorial seed story about why Arewa Is Building chooses verified details over assumptions.',
    'Labarin farko na masu gyara game da dalilin da ya sa Arewa Is Building ke zaɓar bayanan da aka tabbatar fiye da zato.',
    E'# A directory starts by making room\n\nA good directory does more than collect links. It makes it easier for a useful piece of work to be found by the next person who needs it.\n\nFor an ecosystem as broad as Arewa, that also means being careful with the stories we tell. A founder name, a city and a product claim are not decoration. They are details that should come from the people who made the work.\n\n## Verified before amplified\n\nThis seed editorial is intentionally clear about what it is: an early example of the story format. As makers submit and claim their listings, this space will carry their own words, short videos and the practical lessons behind their work.\n\nThe aim is simple: make room for Northern Nigerian builders to be discovered without filling that room with assumptions.',
    E'# Kundi yana farawa ne da samar da wuri\n\nKundi mai kyau bai tattara hanyoyin shiga kawai ba. Yana sauƙaƙa gano aiki mai amfani ga mutum na gaba da yake buƙatarsa.\n\nGa al’umma mai faɗi kamar Arewa, wannan yana nufin yin taka-tsantsan da labaran da muke bayarwa. Sunan mai ginawa, birni da bayanin samfur ba kayan ado ba ne. Bayanai ne da ya kamata su fito daga waɗanda suka yi aikin.\n\n## Tabbatarwa kafin yaɗawa\n\nWannan labarin farko ya bayyana kansa: misali ne na farko na tsarin labari. Yayin da masu ginawa ke tura da karɓar jerinsu, wannan wuri zai ɗauki kalmominsu, gajerun bidiyoyi da darussan aikinsu.\n\nManufar mai sauƙi ce: samar da wuri ga masu gina kaya na Arewacin Najeriya ba tare da cika wannan wuri da zato ba.',
    'published',
    '2026-10-21T08:00:00Z',
    true
  )
on conflict (slug) do update set
  title_en = excluded.title_en,
  title_ha = excluded.title_ha,
  excerpt_en = excluded.excerpt_en,
  excerpt_ha = excluded.excerpt_ha,
  body_en = excluded.body_en,
  body_ha = excluded.body_ha,
  status = excluded.status,
  published_at = excluded.published_at,
  is_seed = true;

update public.builders
set story_id = (select id from public.stories where slug = 'a-directory-starts-by-making-room')
where slug = 'arewa-is-building-desk';

insert into public.product_makers (product_id, builder_id, role)
select p.id, b.id, 'Product team'
from public.products p
join public.builders b on b.slug = 'zipa-team'
where p.slug = 'zipa'
on conflict (product_id, builder_id) do update set role = excluded.role;

insert into public.needs (need_en, need_ha, product_id, sort) values
  (
    'I want to explore an early Arewa product listing',
    'Ina son bincika bayanin farko na wata manhaja ta Arewa',
    (select id from public.products where slug = 'zipa'),
    1
  ),
  (
    'I want to find a product shaped by life in Arewa',
    'Ina son samun samfurin da rayuwar Arewa ta tsara',
    (select id from public.products where slug = 'arewa-life'),
    2
  )
on conflict do nothing;
