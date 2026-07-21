# Migration Report — Editorial Light-Theme Rebuild (July 2026)

This report summarises the rebuild of the portfolio from the previous dark-theme template site
into a restrained, editorial, engineering-first product.

## 1. Placeholders and template remnants removed

| Item | Action |
| --- | --- |
| `blog/` (3 dark HTML articles) | Removed; content superseded by 7 in-app articles (`/writing`) |
| `case-studies/` (2 dark HTML case studies + OG SVGs) | Removed; superseded by structured in-app case studies (`/project/:id`) |
| `chatbot/` (chatbot.js/css + knowledge JSON) | Removed; feature discontinued, including all "local chatbot" copy |
| `js/enhanced.js`, `styles/enhanced.css` | Removed; legacy pre-React assets |
| `icons/skill-icons.svg` | Removed; logo-wall pattern replaced by grouped skill table |
| `images/` (~9.6 MB of hero/banner PNGs) | Removed; hero is now typographic, zero images |
| `profile.jpg`, `profile.webp` | Removed; no photographic imagery in the new design language |
| `service-worker.js`, `site.webmanifest` | Removed; PWA layer discontinued (no longer referenced) |
| `og-resume.svg`, old dark `og-image.svg` | Removed; replaced by a single `og-image.png` card |
| Old dark-theme `docs/` (CHATBOT.md, DEVELOPMENT.md, etc.) | Removed; new README covers topology, dev and deployment |
| `matomembowene.github.io` references | Removed from README, repo filters and site copy |

## 2. Broken / outdated links fixed

- Clone URL and all repo references now point to `github.com/MatomeMb/MatomeMb.website`.
- `404.html` rewritten as a redirect map: every legacy URL (e.g. `/case-studies/rag-assistant.html`,
  `/blog/validation-first-ocr.html`) lands on its hash-routed equivalent; unknown paths fall back
  to the home page.
- `sitemap.xml` rewritten (old URLs pointed at deleted HTML files).
- Previous-session case-study slugs (`scheduling-systems`, `embedded-navigation`,
  `confidential-ai-build`) resolve via an alias table in `ProjectDetails.tsx`.
- Footer links to source repository, sitemap, email verified; social links point to real profiles.

## 3. UI/UX improvements (and why)

- **Dark navy theme → editorial light theme.** Recruiter-facing design goal: reads like engineering
  documentation (Stripe/Linear/GitHub Docs class), not a portfolio template. Palette is strictly
  functional: white surfaces, gray scale for text hierarchy, blue reserved for interactive elements.
- **Giant gradient hero → typographic hero.** Name, role, institution, one positioning line, two
  actions. A recruiter extracts who/what/where in under 5 seconds.
- **Project cards → product-page rows.** Each of the 7 projects states Problem / Requirements /
  Design decision / Trade-off up front — the format a hiring panel actually evaluates.
- **3 articles → 7 complete technical articles** (OCR, RAG, Spring Boot REST, SQL optimisation,
  Google Cloud, Docker in production, distributed systems) in a typographic on-screen reader.
  No "Coming soon" anywhere.
- **2 experience entries → full timeline** (Fairflow, Science Learning Centre UCT, Google Cloud
  Career Launchpad, Dell Young Leaders, EY Uncovered, UCT degree), each labelled by type
  (Work / Programme / Education) so nothing is overstated.
- **New Architecture page** with Mermaid flowcharts, a sequence diagram and an ER diagram covering
  the site's own delivery topology plus the flagship systems.
- **Case studies deepened:** every project has a 10-section study (problem → roadmap) with a
  rendered Mermaid figure and a collapsed text-only ASCII topology fallback.
- **Contact form kept but honest:** validation-first (React Hook Form + Zod), then composes a
  `mailto:` — the UI states plainly that nothing is sent to a server.

## 4. Architectural improvements

- **Mermaid loaded lazily** via dynamic `import()`; Vite emits it as separate chunks (~148 KB gz
  core entry; diagram code fetched only on routes that render diagrams).
- **Route-level code splitting** on `/architecture`; MermaidDiagram component also lazy-imports the
  library — pages without diagrams never pay for it.
- **Strict TypeScript** across the app (`tsc --noEmit` clean; `noUnusedLocals` enforced).
- All 12 Mermaid definitions validated offline against the real parser during the build-out
  (checked in as reproducible pattern, harness removed afterwards).
- **Fixed invalid JSX** from the previous build (`class=` attributes in the Layout footer, which
  emitted runtime warnings and invalid DOM).
- Unused dependency (framer-motion) removed from the tree.
- Backward-compatible case-study routing via slug alias map.

## 5. SEO & accessibility enhancements

- Full metadata set in `index.html`: canonical URL, description, robots, author, `theme-color`.
- Open Graph + Twitter Card with a generated 1200×630 `og-image.png` (SVG cards are not rendered
  by most crawlers).
- JSON-LD structured data: `Person` (job title, address, alumniOf, sameAs) and `WebSite`.
- Semantic landmarks, skip-to-content, ARIA `current` states on nav, labelled forms, `role="alert"`
  validation errors, keyboard-operable reader/tabs.
- WCAG-AA contrast: body copy `#4B5563` (7.5:1), muted `#6B7280` (4.8:1), links `#2563EB` on white.
- `prefers-reduced-motion` media query honoured; no motion-only meaning anywhere.

## 6. Performance optimisations

- ~9.6 MB of raster imagery deleted; the hero is text-only (LCP is now a heading).
- Fonts loaded via `preconnect` + `display=swap`, limited to 2 families / 8 weights.
- Tailwind v4 ships only used utilities: 25.6 KB CSS (~5.7 KB gz).
- Mermaid and all page-adjacent heavy code excluded from the entry chunk.
- No blocking third-party scripts (fonts are the only render-adjacent external resources).
- Cache-busting content-hashed assets; `clean-root-assets.js` prevents stale asset accumulation.

## 7. Remaining recommendations for future iterations

1. **Add Open Graph images per case study** (currently one site-wide card).
2. **Consider `vite-plugin-sitemap`-style generation of route-level metadata** per hash route if
   social previews per article become important (hash URLs share one OG context by design).
3. **Regenerate `resume.pdf`** — handled automatically by the existing GitHub Actions workflow on
   merge (it renders the new light `resume.html`).
4. **Optional:** pre-render the home route to static HTML (e.g. vite-ssg) if sub-second LCP on
   3G becomes a hard requirement; the current SPA target is already fast on desktop/4G.
5. **Lighthouse re-audit post-deploy** on the production domain; local build profiles clean
   (no render-blocking JS beyond the single entry chunk).
