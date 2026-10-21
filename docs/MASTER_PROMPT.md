# MASTER PROMPT: Arewa Is Building

## Discover software built in Northern Nigeria (Arewa)

Paste this whole file into Cursor (Agent mode) at the start of the project and save it in the repo as `/docs/MASTER_PROMPT.md`. Work one stage at a time: “Do Stage 1”, review, then “Do Stage 2”, and so on. Inspiration: africaisbuilding.com. Build our own design and code; do not copy their content, text, logos or assets.

## 0. Rules for the AI agent

- Build the full version of each stage. No placeholder “TODO” features in shipped pages, no lorem ipsum. Seed data must be clearly marked as seed data.
- TypeScript strict, Next.js App Router, server components by default, client components only where needed.
- Every form input and API payload is validated with Zod, on the server.
- Row Level Security on every Supabase table. Public can read approved content only.
- Design must feel premium and editorial (Section 7), never like a generic template.
- Fast and light: the homepage must score 90+ on Lighthouse for mobile performance, since most visitors use phones on mobile data.
- Never commit secrets; keep `.env.example` up to date. Work on feature branches; never push to main unless asked. Git author: sulaimanmusa399@gmail.com.
- At the end of each stage, add a `CHANGELOG.md` entry and a short “how to test” list.

## 1. Product

Arewa Is Building is a curated discovery platform for software, products and builders from Northern Nigeria (the 19 northern states + FCT), and from Arewa people building anywhere.

### Goals

- Make Northern builders visible to users, press, investors and employers.
- Help people find a locally built tool for a real need.
- Tell the stories of the founders behind them.
- Be bilingual: English and Hausa.

**Who it’s for:** tech-curious users, founders, students, journalists, investors, recruiters and the diaspora.

## 2. Stack

| Layer | Choice |
| --- | --- |
| App | Next.js 15 (App Router) + TypeScript, deployed on Vercel |
| UI | Tailwind CSS v4 + shadcn/ui, lucide-react icons, Framer Motion (subtle) |
| Data and auth | Supabase (Postgres, Auth with Google + email magic link, Storage for logos and images, RLS) |
| i18n | next-intl with `/en` and `/ha` routes; all UI strings in message files |
| Search | Postgres full-text search (`tsvector`) + `pg_trgm` for typo tolerance |
| Images | `next/image`, logos and covers in Supabase Storage, OG images with `@vercel/og` |
| Email | Resend + React Email (submission updates, weekly digest) |
| Anti-spam | Cloudflare Turnstile on forms, rate limits on votes and submissions |
| Analytics | PostHog (or Vercel Analytics) |
| Errors | Sentry |
| Tests | Vitest (utils, validation), Playwright (key flows) |
| CI | GitHub Actions: typecheck, lint, test, build |

## 3. Data model (Supabase)

- `profiles`: id (auth uid), name, handle, avatar_url, bio, state, role (user | editor | admin), x_url, linkedin_url, website
- `products`:
  - id, slug, name, tagline_en, tagline_ha, description_en, description_ha
  - logo_url, cover_url, screenshots (text[]), website_url, demo_video_url
  - category_id, state, city, stage (idea | beta | live | growing), funding (bootstrapped | funded)
  - alternative_to (text[], e.g. “ElevenLabs”), tags (text[])
  - status (pending | approved | rejected | featured), rejection_reason
  - submitted_by, approved_by, launched_at, created_at, upvote_count (cached)
- `product_makers` (product_id, profile_id or builder_id, role)
- `builders` (founder profiles shown publicly, can exist before they sign up): id, slug, name, photo_url, headline, bio_en, bio_ha, state, links, story_id
- `stories` (editorial founder snapshots): id, slug, builder_id, title_en, title_ha, body_en (MDX), body_ha, cover_url, video_url, published_at, status
- `categories`: id, slug, name_en, name_ha, icon. Seed with: Fintech, AI, Agritech, Edtech, Healthtech, Logistics, Developer Tools, Design, E-commerce, Media, Islamic/Faith tech, Gov & Civic, Hosting, Other
- `states`: the 19 northern states + FCT, with code, name and region (North-West, North-East, North-Central)
- `hubs` (Stage 3): id, name, state, city, type (hub | bootcamp | university | community), website, logo
- `upvotes` (user_id, product_id, created_at), unique per user and product
- `comments` (Stage 3): product_id, user_id, body, created_at, hidden
- `needs` (“Want to do X? Use Y”): id, need_en, need_ha, product_id, sort
- `newsletter_subscribers`: email, lang, confirmed, created_at
- `reports` (flag a listing): product_id, reason, reporter_id

### Policies

Anyone can read approved/featured products, published stories and builders; logged-in users can submit (status pending) and upvote; only editor/admin can approve, feature, edit anything or publish stories.

## 4. Pages

### Public

**`/` Home**

- Hero: “Discover software built in Arewa”, a big search bar (“Try a product, category, state or alternative…”), a row of builder face chips.
- Featured product of the week (large card + maker spotlight, “Why we featured it”).
- Explore grid: product cards (logo, name, one-line tagline, state, category, “Alternative to X”, upvote button). Filter chips for category and state; sort by trending, newest, most upvoted.
- “Meet the people building it”: founder story cards.
- “Match the need to an Arewa-built product”: short need → product links.
- Builders by state: a simple clickable map of Northern Nigeria (SVG) with counts per state.
- “Guess the builder” mini game teaser.
- Why this exists (4 short points) + newsletter signup.

**Other public pages**

- `/products` full directory with filters (category, state, stage, funding, alternative to) and search.
- `/p/[slug]` product page: logo, cover, screenshots, description, links, makers, state, category, alternative to, upvotes, related products, share buttons, OG image.
- `/builders` and `/b/[slug]` builder profile with their products and story.
- `/stories` and `/stories/[slug]` editorial founder stories (MDX, optional video).
- `/states/[state]` everything built in one state.
- `/categories/[slug]`.
- `/alternatives/[name]` (“Arewa-built alternatives to X”).
- `/game` “Guess the builder”: show a face or logo, 4 options, score, share result to X.
- `/hubs` (Stage 3) tech hubs, bootcamps and campus communities.
- `/submit` submit a product (multi-step form, auth required).
- `/about`, `/newsletter`, `/terms`, `/privacy`.

### Signed-in

- `/me` my submissions with status, edit pending ones, my upvotes.

### Admin (editor/admin only)

- `/admin` review queue: approve, reject with a reason, feature, edit; manage builders, stories, categories, needs, hubs; see reports; export subscribers.

## 5. Key flows

- **Submit:** sign in → form (name, website, tagline EN, optional Hausa, description, category, state/city, logo, cover, screenshots, alternative to, makers, stage) → Turnstile → saved as pending → confirmation email → admin reviews → approval or rejection email with reason → goes live.
- **Upvote:** one per user per product; optimistic UI; anonymous click opens sign-in.
- **Search:** instant results as you type (debounced), across products, builders, categories, states and alternatives; works in Hausa and English.
- **Weekly digest:** every Monday 9:00 Africa/Lagos, a Vercel Cron job sends new approved products and the latest story to confirmed subscribers via Resend, in their chosen language.
- **Language switch:** one tap EN/HA, remembered in a cookie; content falls back to English when no Hausa version exists.

## 6. SEO and sharing

- Server-rendered pages, clean slugs, sitemap.xml, robots.txt, JSON-LD (SoftwareApplication, Person, Article).
- Dynamic OG images per product, builder and story (name, logo, state, “Built in Arewa”).
- `hreflang` for en/ha.
- Share buttons for X, WhatsApp and LinkedIn (WhatsApp matters most in the North).

## 7. Design: premium and editorial

- **Feel:** a calm editorial magazine meets a modern product directory. Think Linear, Read.cv, Are.na.
- **Palette:** warm off-white `#F7F5F0`, ink `#111111`, grays `#6B6B6B` → `#E7E4DD`, one accent, deep indigo `#2B2E83` (indigo dye is traditional in Kano’s Kofar Mata dye pits), plus a subtle earthy sand tone `#C9A66B` for highlights. Full dark mode.
- **Type:** a refined serif for headlines (e.g. Instrument Serif or Fraunces), Inter or Geist for UI, tabular numbers for counts.
- **Subtle cultural touch:** a very light Arewa geometric pattern (inspired by Hausa wall decoration and embroidery, zane) used only as a faint texture in the hero and footer, never loud.
- **Cards:** white, 1px hairline borders, generous padding, rounded 16px, soft shadow on hover only.
- **Builder photos:** consistent rounded crops, grayscale-to-colour on hover.
- **Motion:** 150–200 ms ease-out. No flashy gradients or emoji overload.
- **Mobile-first:** design for a 375px phone first, then scale up.
- **Accessibility:** WCAG AA, full keyboard use, alt text on all images.

## 8. Build stages

### Stage 1: MVP directory (weekend 1)

- Project setup, design tokens, layout, EN/HA i18n, Supabase schema + RLS + seed (categories, states, a few clearly marked seed products including Zipa (`usezipa.xyz`) and arewa-life).
- Home, products directory with filters and search, product page, category and state pages.
- Auth, submit form, admin review queue, approval/rejection emails.

### Stage 2: Builders and stories (weekend 2)

- Builder profiles, stories (MDX), “Meet the people” section, “Match the need” section, featured product of the week, alternatives pages, OG images, SEO.
- Upvotes with rate limits, newsletter signup + weekly digest cron.

### Stage 3: Community (later)

- State map, Guess the builder game, hubs directory, comments with moderation, reports, maker claims (“This is my product”), basic jobs/gigs board.

## 9. Environment variables (`.env.example`)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
EMAIL_FROM=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
SENTRY_DSN=
CRON_SECRET=
NEXT_PUBLIC_SITE_URL=
```

## 10. Definition of done

- A visitor on a phone can search, filter by state and category, and open a product page in under 2 seconds on 4G.
- A founder can submit a product in under 3 minutes, and gets an email when it’s approved.
- An admin can review the queue, approve, feature and publish a story without touching the database.
- Every page works in English and Hausa.
- Sharing a product link on WhatsApp or X shows a clean preview card.
- It looks premium and distinctly Arewa, not like a template.

## 11. First message to send the agent

> Read `/docs/MASTER_PROMPT.md` fully. Then plan Stage 1 only as a checklist (files, tables, pages, components, tests). Wait for my OK, then build it. Don’t push to main.
