-- Arewa Is Building — Stage 1 schema
-- Run with Supabase CLI: supabase db reset

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type public.profile_role as enum ('user', 'editor', 'admin');
create type public.product_status as enum ('pending', 'approved', 'rejected', 'featured');
create type public.product_stage as enum ('idea', 'beta', 'live', 'growing');
create type public.funding_type as enum ('bootstrapped', 'funded');
create type public.northern_region as enum ('North-West', 'North-East', 'North-Central');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  handle text unique,
  avatar_url text,
  bio text,
  state text,
  role public.profile_role not null default 'user',
  x_url text,
  linkedin_url text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_handle_format check (handle is null or handle ~ '^[a-z0-9][a-z0-9-]{1,39}$')
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ha text not null,
  icon text not null,
  created_at timestamptz not null default now(),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.states (
  code text primary key,
  slug text not null unique,
  name text not null,
  region public.northern_region not null,
  created_at timestamptz not null default now(),
  constraint states_code_format check (code ~ '^[A-Z]{2}$')
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline_en text not null,
  tagline_ha text,
  description_en text not null,
  description_ha text,
  logo_url text,
  cover_url text,
  screenshots text[] not null default '{}',
  website_url text not null,
  demo_video_url text,
  category_id uuid not null references public.categories(id) on delete restrict,
  state text not null references public.states(code) on delete restrict,
  city text,
  stage public.product_stage not null,
  funding public.funding_type not null,
  alternative_to text[] not null default '{}',
  tags text[] not null default '{}',
  status public.product_status not null default 'pending',
  rejection_reason text,
  submitted_by uuid references public.profiles(id) on delete set null,
  approved_by uuid references public.profiles(id) on delete set null,
  launched_at timestamptz,
  upvote_count integer not null default 0 check (upvote_count >= 0),
  is_seed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint products_name_length check (char_length(name) between 2 and 80),
  constraint products_tagline_length check (char_length(tagline_en) between 12 and 150),
  constraint products_description_length check (char_length(description_en) between 60 and 3000),
  constraint rejected_products_have_reason check (status <> 'rejected' or rejection_reason is not null),
  constraint product_arrays_limited check (cardinality(tags) <= 5 and cardinality(screenshots) <= 4)
);

create table public.product_makers (
  product_id uuid not null references public.products(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  primary key (product_id, profile_id),
  constraint product_makers_role_length check (char_length(role) between 2 and 100)
);

create index products_status_created_at_idx on public.products(status, created_at desc);
create index products_category_status_idx on public.products(category_id, status);
create index products_state_status_idx on public.products(state, status);
create index products_alternative_to_gin_idx on public.products using gin(alternative_to);
create index products_tags_gin_idx on public.products using gin(tags);
create index products_search_trgm_idx on public.products using gin ((lower(name || ' ' || tagline_en || ' ' || coalesce(tagline_ha, '') || ' ' || description_en || ' ' || coalesce(description_ha, '') || ' ' || coalesce(city, '') || ' ' || array_to_string(alternative_to, ' ') || ' ' || array_to_string(tags, ' '))) gin_trgm_ops);
create index product_makers_profile_idx on public.product_makers(profile_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute procedure public.set_updated_at();
create trigger products_set_updated_at before update on public.products
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() = old.id and new.role is distinct from old.role then
    raise exception 'Only an administrator can change a profile role';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_change
before update on public.profiles
for each row execute procedure public.prevent_profile_role_change();

create or replace function public.is_editor_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('editor', 'admin')
  );
$$;

create or replace function public.search_approved_products(search_query text, result_limit integer default 50)
returns setof public.products
language sql
stable
security invoker
set search_path = public
as $$
  select p.*
  from public.products p
  where p.status in ('approved', 'featured')
    and (
      to_tsvector('simple', coalesce(p.name, '') || ' ' || coalesce(p.tagline_en, '') || ' ' || coalesce(p.tagline_ha, '') || ' ' || coalesce(p.description_en, '') || ' ' || coalesce(p.description_ha, '') || ' ' || coalesce(p.city, '') || ' ' || array_to_string(p.alternative_to, ' ') || ' ' || array_to_string(p.tags, ' ')) @@ websearch_to_tsquery('simple', search_query)
      or lower(p.name || ' ' || p.tagline_en || ' ' || coalesce(p.tagline_ha, '') || ' ' || p.description_en || ' ' || coalesce(p.description_ha, '') || ' ' || coalesce(p.city, '') || ' ' || array_to_string(p.alternative_to, ' ') || ' ' || array_to_string(p.tags, ' ')) % lower(search_query)
      or lower(p.name || ' ' || p.tagline_en || ' ' || coalesce(p.tagline_ha, '') || ' ' || p.description_en || ' ' || coalesce(p.description_ha, '') || ' ' || coalesce(p.city, '') || ' ' || array_to_string(p.alternative_to, ' ') || ' ' || array_to_string(p.tags, ' ')) like '%' || lower(search_query) || '%'
      or exists (select 1 from public.categories c where c.id = p.category_id and lower(c.name_en || ' ' || c.name_ha) like '%' || lower(search_query) || '%')
      or exists (select 1 from public.states s where s.code = p.state and lower(s.name) like '%' || lower(search_query) || '%')
    )
  order by
    case when p.status = 'featured' then 0 else 1 end,
    similarity(lower(p.name || ' ' || p.tagline_en), lower(search_query)) desc,
    p.created_at desc
  limit greatest(1, least(result_limit, 200));
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.states enable row level security;
alter table public.products enable row level security;
alter table public.product_makers enable row level security;

create policy "Categories are readable by everyone" on public.categories for select using (true);
create policy "States are readable by everyone" on public.states for select using (true);

create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Public makers are readable" on public.profiles for select using (
  exists (
    select 1 from public.product_makers pm
    join public.products p on p.id = pm.product_id
    where pm.profile_id = profiles.id and p.status in ('approved', 'featured')
  )
);
create policy "Editors can read all profiles" on public.profiles for select using (public.is_editor_or_admin());
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Approved products are public" on public.products for select using (status in ('approved', 'featured'));
create policy "Submitters can view own products" on public.products for select using (auth.uid() = submitted_by);
create policy "Editors can read every product" on public.products for select using (public.is_editor_or_admin());
create policy "Authenticated users can submit pending products" on public.products for insert to authenticated with check (
  auth.uid() = submitted_by and status = 'pending' and approved_by is null and is_seed = false
);
create policy "Submitters can edit pending products" on public.products for update to authenticated using (
  auth.uid() = submitted_by and status = 'pending'
) with check (
  auth.uid() = submitted_by and status = 'pending' and is_seed = false
);
create policy "Editors can manage products" on public.products for all using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

create policy "Public product makers are readable" on public.product_makers for select using (
  exists (select 1 from public.products p where p.id = product_id and p.status in ('approved', 'featured'))
);
create policy "Submitters can read makers on own products" on public.product_makers for select using (
  exists (select 1 from public.products p where p.id = product_id and p.submitted_by = auth.uid())
);
create policy "Users can add themselves as a maker" on public.product_makers for insert to authenticated with check (
  profile_id = auth.uid()
  and exists (select 1 from public.products p where p.id = product_id and p.submitted_by = auth.uid())
);
create policy "Editors can manage product makers" on public.product_makers for all using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-assets', 'product-assets', false, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Product assets can be read by owner or for public listings" on storage.objects for select using (
  bucket_id = 'product-assets'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or exists (
      select 1 from public.products p
      where p.id::text = (storage.foldername(name))[2]
        and p.status in ('approved', 'featured')
    )
  )
);
create policy "Authenticated users can upload own product assets" on storage.objects for insert to authenticated with check (
  bucket_id = 'product-assets' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "Owners can remove own pending assets" on storage.objects for delete to authenticated using (
  bucket_id = 'product-assets' and auth.uid()::text = (storage.foldername(name))[1]
);
