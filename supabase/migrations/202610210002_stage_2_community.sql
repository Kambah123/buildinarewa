-- Arewa Is Building — Stage 2 builders, stories, votes and newsletter

create type public.story_status as enum ('draft', 'published');

create table public.builders (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  photo_url text,
  headline text not null,
  bio_en text not null,
  bio_ha text,
  state text references public.states(code) on delete set null,
  links jsonb not null default '{}'::jsonb,
  story_id uuid,
  is_seed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint builders_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint builders_name_length check (char_length(name) between 2 and 120),
  constraint builders_headline_length check (char_length(headline) between 4 and 180),
  constraint builders_bio_length check (char_length(bio_en) between 40 and 3000),
  constraint builders_links_object check (jsonb_typeof(links) = 'object')
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  builder_id uuid references public.builders(id) on delete set null,
  title_en text not null,
  title_ha text,
  excerpt_en text not null,
  excerpt_ha text,
  body_en text not null,
  body_ha text,
  cover_url text,
  video_url text,
  status public.story_status not null default 'draft',
  published_at timestamptz,
  is_seed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint stories_title_length check (char_length(title_en) between 8 and 180),
  constraint stories_excerpt_length check (char_length(excerpt_en) between 30 and 500),
  constraint published_stories_have_date check (status <> 'published' or published_at is not null)
);

alter table public.builders
  add constraint builders_story_id_fkey foreign key (story_id) references public.stories(id) on delete set null;

alter table public.product_makers add column builder_id uuid references public.builders(id) on delete cascade;
alter table public.product_makers alter column profile_id drop not null;
alter table public.product_makers drop constraint product_makers_pkey;
alter table public.product_makers add column id uuid not null default gen_random_uuid();
alter table public.product_makers add primary key (id);
alter table public.product_makers add constraint product_makers_exactly_one_identity check (num_nonnulls(profile_id, builder_id) = 1);
alter table public.product_makers add constraint product_makers_product_profile_unique unique nulls not distinct (product_id, profile_id);
alter table public.product_makers add constraint product_makers_product_builder_unique unique nulls not distinct (product_id, builder_id);
create index product_makers_builder_idx on public.product_makers(builder_id);

create table public.needs (
  id uuid primary key default gen_random_uuid(),
  need_en text not null,
  need_ha text,
  product_id uuid not null references public.products(id) on delete cascade,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  constraint needs_english_length check (char_length(need_en) between 8 and 200)
);
create index needs_sort_idx on public.needs(sort asc, created_at asc);

create table public.upvotes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);
create index upvotes_product_created_idx on public.upvotes(product_id, created_at desc);
create index upvotes_user_created_idx on public.upvotes(user_id, created_at desc);

-- A short event history is kept solely for server-enforced vote rate limiting.
create table public.upvote_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index upvote_events_user_created_idx on public.upvote_events(user_id, created_at desc);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  lang text not null default 'en' check (lang in ('en', 'ha')),
  confirmed boolean not null default false,
  confirmation_token uuid not null default gen_random_uuid(),
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index newsletter_confirmed_lang_idx on public.newsletter_subscribers(confirmed, lang);

create trigger builders_set_updated_at before update on public.builders
for each row execute procedure public.set_updated_at();
create trigger stories_set_updated_at before update on public.stories
for each row execute procedure public.set_updated_at();
create trigger newsletter_subscribers_set_updated_at before update on public.newsletter_subscribers
for each row execute procedure public.set_updated_at();

create or replace function public.toggle_product_upvote(target_product_id uuid)
returns table (upvoted boolean, upvote_count integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  next_count integer;
begin
  if auth.uid() is null then
    raise exception 'Sign in to upvote a product';
  end if;

  if not exists (
    select 1 from public.products
    where id = target_product_id and status in ('approved', 'featured')
  ) then
    raise exception 'This product is not available for upvotes';
  end if;

  if (select count(*) from public.upvote_events where user_id = auth.uid() and created_at > now() - interval '1 minute') >= 30 then
    raise exception 'Too many vote changes. Please wait a minute and try again.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(target_product_id::text, 0));
  insert into public.upvote_events (user_id, product_id) values (auth.uid(), target_product_id);

  if exists (select 1 from public.upvotes where user_id = auth.uid() and product_id = target_product_id) then
    delete from public.upvotes where user_id = auth.uid() and product_id = target_product_id;
    update public.products
      set upvote_count = greatest(0, upvote_count - 1)
      where id = target_product_id
      returning upvote_count into next_count;
    return query select false, next_count;
  else
    insert into public.upvotes (user_id, product_id) values (auth.uid(), target_product_id);
    update public.products
      set upvote_count = upvote_count + 1
      where id = target_product_id
      returning upvote_count into next_count;
    return query select true, next_count;
  end if;
end;
$$;

create or replace function public.subscribe_to_newsletter(input_email text, input_lang text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_token uuid;
  normalized_email text := lower(trim(input_email));
begin
  if normalized_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Enter a valid email address';
  end if;
  if input_lang not in ('en', 'ha') then
    raise exception 'Unsupported newsletter language';
  end if;

  insert into public.newsletter_subscribers (email, lang, confirmed, confirmation_token)
  values (normalized_email, input_lang, false, gen_random_uuid())
  on conflict (email) do update
    set lang = excluded.lang,
        confirmation_token = case when public.newsletter_subscribers.confirmed then public.newsletter_subscribers.confirmation_token else gen_random_uuid() end
  returning confirmation_token into new_token;

  if exists (select 1 from public.newsletter_subscribers where email = normalized_email and confirmed) then
    return null;
  end if;
  return new_token;
end;
$$;

create or replace function public.confirm_newsletter(token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  did_confirm boolean;
begin
  update public.newsletter_subscribers
    set confirmed = true,
        confirmed_at = now()
    where confirmation_token = token and not confirmed
    returning true into did_confirm;
  return coalesce(did_confirm, false);
end;
$$;

alter table public.builders enable row level security;
alter table public.stories enable row level security;
alter table public.needs enable row level security;
alter table public.upvotes enable row level security;
alter table public.upvote_events enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "Builders are publicly readable" on public.builders for select using (true);
create policy "Editors can manage builders" on public.builders for all using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

create policy "Published stories are public" on public.stories for select using (status = 'published');
create policy "Editors can read all stories" on public.stories for select using (public.is_editor_or_admin());
create policy "Editors can manage stories" on public.stories for all using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

create policy "Needs for public products are readable" on public.needs for select using (
  exists (select 1 from public.products p where p.id = product_id and p.status in ('approved', 'featured'))
);
create policy "Editors can manage needs" on public.needs for all using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

create policy "Users can read their own upvotes" on public.upvotes for select using (auth.uid() = user_id);
create policy "Editors can read all upvotes" on public.upvotes for select using (public.is_editor_or_admin());
create policy "Editors can read upvote rate-limit events" on public.upvote_events for select using (public.is_editor_or_admin());

-- Newsletter rows are never directly readable or writable by anonymous/authenticated clients.
-- Subscription and confirmation happen through the narrowly scoped functions above.
grant execute on function public.toggle_product_upvote(uuid) to authenticated;
grant execute on function public.subscribe_to_newsletter(text, text) to anon, authenticated;
grant execute on function public.confirm_newsletter(uuid) to anon, authenticated;
