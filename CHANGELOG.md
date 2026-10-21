# Changelog

## Stage 1 — MVP directory (2026-10-21)

### Added

- Next.js App Router foundation with strict TypeScript, Tailwind CSS v4, responsive editorial design tokens, dark mode, and a subtle zane-inspired pattern.
- English and Hausa routes under `/en` and `/ha`, with translated interface copy and English-content fallback for products without Hausa content.
- Supabase migration with categories, Northern states + FCT, products, profiles, product makers, full-text/trigram search, private media storage, and RLS policies.
- Clearly labelled seed listings for Zipa, arewa-life, and a demonstration record to make the unconfigured local directory useful.
- Public home, product directory, search/filter/sort interface, product pages, category pages, state pages, about, terms, and privacy pages.
- Supabase email magic-link and Google sign-in flows, an authenticated multi-step product submission form, Cloudflare Turnstile verification hook, and Resend review emails.
- Personal submission dashboard with pending-submission editing and role-protected editorial review queue with approval, rejection, feature, and edit-before-approval actions.
- Product metadata, hreflang, JSON-LD, social share links, tests, health endpoint, and GitHub Actions CI.

### How to test Stage 1

1. Copy `.env.example` to `.env.local` and provide Supabase credentials. Run `supabase db reset` to apply the migration and seed records.
2. Run `npm run dev`, then open `http://localhost:3000/en`.
3. Browse `/en/products`, search for `Zipa` or `Shopify`, and filter by category/state.
4. Open a product card, verify Hausa at `/ha`, and test the WhatsApp/X/LinkedIn links.
5. Configure Supabase Google and magic-link redirect URLs for `/auth/callback`, then sign in and submit a product with valid image files.
6. In Supabase, promote a profile role to `editor` or `admin`, then test `/en/admin` approval and rejection emails with Resend configured.
7. Run `npm run lint && npm run typecheck && npm test && npm run build`. Run `npm run test:e2e` after installing Playwright’s Chromium browser.
