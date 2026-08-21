# Yourville.com

A small-town discovery & lifestyle media site. Static Eleventy build, deployed to GitHub Pages via GitHub Actions, custom domain `yourville.com` proxied through Cloudflare. No backend, no database, no build tooling beyond Node/Eleventy.

## Stack

- **Eleventy (11ty)**, Nunjucks templates + Markdown content. Config in `.eleventy.js`.
- Plain CSS in `src/styles/style.css` (no framework). Palette is defined as CSS custom properties at the top of that file — reuse those variables, don't hardcode new colors.
- Vanilla JS for the two interactive tools: `src/js/quiz.js` and `src/js/compare.js`. No frameworks, no bundler.
- `npm run build` → outputs to `_site/`. `npm run serve` for local dev with live reload.
- Push to `main` triggers `.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages automatically. Nothing to run manually.

## Content model — read this before adding content

Everything on this site (guides, the quiz, the compare tool, the homepage) draws from **one shared source of truth**: `src/_data/archetypes.json`. It defines the eight "town vibe" archetypes (slug, name, emoji, tagline, description, qualitative traits 1–5, sample towns, and the guide URL). If you add a ninth archetype, add it here first, then add a matching guide — everything else (homepage grid, compare tool dropdowns) picks it up automatically.

### Adding a new pillar guide

1. Create `src/guides/<slug>.md` with front matter:
   ```yaml
   layout: guide.njk
   title: Best Small Towns for <X>
   description: One sentence, used for meta description and social previews.
   archetypeSlug: <matching slug from archetypes.json, or omit if it's a new angle on an existing archetype>
   ```
2. Structure: an intro (2–3 paragraphs), a "What to look for" list, a `<ul class="town-list">` of towns (see any existing guide for the markup), and a short "Is it actually you?" closing paragraph that links to the quiz and at least one other guide.
3. **Editorial rule: describe character, not statistics.** Don't assert specific population figures, cost-of-living numbers, or rankings unless you can verify them from a real source — the whole site's credibility rests on qualitative claims being defensible ("known for its restaurant scene") rather than fabricated numbers ("2.3 restaurants per capita").

### Adding a journal post

Create `src/journal/<slug>.md` with `layout: journal.njk`, `title`, `description`, and `date` (YYYY-MM-DD) front matter. These are shorter and more frequent than guides — this is the section to update most often for fresh-content SEO signals. The homepage shows the 3 most recent; `/journal/` lists all of them; `/journal/feed.xml` is an auto-generated RSS feed, no manual work needed.

### The quiz

`src/_data/quiz.json` holds the questions; each answer option carries `points` keyed by archetype slug. `src/js/quiz.js` tallies points client-side and matches the highest score to an archetype. To rebalance or extend the quiz, edit the JSON only — the JS doesn't need to change unless you're altering the scoring logic itself.

### The compare tool

Reads `archetypes.json`'s `traits` object directly (`walkability`, `natureAccess`, `nightlife`, `remoteWorkFriendly`, `paceOfLife`, each 1–5). These are editorial judgment calls, labeled as such on the `/compare/` page — don't present them as measured data.

## SEO conventions

- Every page needs a `title` and `description` in front matter (or passed to `base.njk` directly) — these drive `<title>`, meta description, and Open Graph/Twitter tags.
- `sitemap.xml` and `robots.txt` are generated/served automatically — no manual maintenance.
- Internal linking matters: every guide should link to at least the quiz and one sibling guide. This is a deliberate topical-cluster strategy, not just nice-to-have.

## Known gaps / follow-ups

- `hello@yourville.com` on `/advertise/` is a placeholder — set up real email (e.g. Cloudflare Email Routing) before treating it as a live contact channel.
- The Open Graph/social preview image (`src/images/social-card.svg`) is SVG; some platforms (notably Twitter/X) render `og:image` SVGs inconsistently. Consider generating a PNG version if social sharing previews look wrong.
- No monetization is wired up yet (by design — see `/advertise/`). If that changes, keep it to direct sponsorships or a paid product; the site is explicitly positioned as ad-free and affiliate-free.
- Cloudflare DNS/proxy setup is managed outside this repo. The `CNAME` file (`src/static/CNAME`) already declares `yourville.com` for GitHub Pages; Cloudflare needs `A`/`AAAA` records pointing at GitHub Pages' IPs (or a proxied `CNAME` if using a `www` subdomain), with SSL/TLS mode set to Full (or Full Strict) once GitHub issues its certificate.
