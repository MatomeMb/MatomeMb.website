# MatomeMb.website

Source code for **[www.matomembowene.co.za](https://www.matomembowene.co.za)** — the personal
engineering website of Matome Mbowene, Software Engineer.

The site serves as both a professional portfolio and a technical knowledge base: production-oriented
software engineering projects, backend architecture, AI systems, technical writing and engineering
case studies with verifiable outcomes.

- **Live site:** https://www.matomembowene.co.za
- **Repository:** https://github.com/MatomeMb/MatomeMb.website
- **Contact:** matomepontso@gmail.com · [linkedin.com/in/matomembowene](https://linkedin.com/in/matomembowene)

---

## System topology

Static-first by design. There is no server, database or runtime infrastructure: the React
application is compiled to plain HTML/CSS/JS and served by GitHub Pages behind a custom domain.

```
+----------------+     +------------------+     +---------------------+
| src-app/       | --> | npm run build    | --> | repo root           |
| React 19 + TS  |     | Vite production  |     | index.html + assets |
| Tailwind CSS v4|     | compile          |     | (committed)         |
+----------------+     +------------------+     +----------+----------+
                                                           |
+----------------------------+     +------------------+      v
| www.matomembowene.co.za    | <-- | GitHub Pages     | <--+ git push
| custom domain (CNAME)      |     | (main branch)    |
+----------------------------+     +------------------+
```

### Key engineering decisions

| Decision | Rationale | Trade-off accepted |
| --- | --- | --- |
| Static SPA on GitHub Pages | Zero runtime infrastructure to attack, patch or pay for | No server-side routes; hash-based routing is used |
| TypeScript strict mode | Correctness evidence at compile time (`tsc --noEmit` is clean) | Slower iteration on trivial changes |
| Tailwind CSS v4 | Shipped CSS contains only the utilities the markup uses (~6 KB gz) | Utility-class verbosity in markup |
| Mermaid diagrams-as-text | Diagrams are reviewable in git diffs and render client-side | Mermaid is heavy → loaded only via dynamic import on routes that need it |
| Route-level code splitting | Initial bundle excludes every diagram library | One network round-trip on first visit to diagram routes |
| No analytics / no cookies | Privacy by architecture, not by policy banner | No usage telemetry |

## Technology

- **React 19** + **TypeScript** (strict) + **Vite 8** — application and build tooling
- **Tailwind CSS v4** — design system (light, editorial palette defined in `src/index.css`)
- **TanStack Query** — GitHub API data fetching with caching and offline fallback
- **Mermaid 11** — client-rendered architecture/sequence/ER diagrams
- **React Hook Form + Zod** — schema-validated contact form (composes a `mailto:`; nothing is posted anywhere)

## Repository layout

```
MatomeMb.website/
├── src-app/                 # Application source (the only editable code)
│   ├── src/
│   │   ├── app/             # Router + providers
│   │   ├── components/      # SocialIcons, MermaidDiagram (lazy mermaid loader)
│   │   ├── layouts/         # Site chrome (header/footer)
│   │   ├── pages/           # Home, Projects, ProjectDetails, Experience,
│   │   │                    # Architecture, Writing, Resume, Contact, Privacy
│   │   └── index.css        # Tailwind v4 theme tokens
│   ├── vite.config.ts       # Builds to the repository root (base: './')
│   └── clean-root-assets.js # Wipes ../assets before each compile
├── index.html               # Build output (do not edit; edit src-app/index.html)
├── assets/                  # Build output, committed for GitHub Pages
├── resume.html              # Standalone print-optimised CV (feeds resume.pdf)
├── privacy.html             # Standalone privacy page
├── 404.html                 # Legacy-URL redirect map → hash routes
├── sitemap.xml / robots.txt / CNAME / .well-known/security.txt
└── .github/workflows/       # resume.pdf regeneration on resume.html changes
```

## Development

```bash
git clone https://github.com/MatomeMb/MatomeMb.website.git
cd MatomeMb.website/src-app

npm install              # install dependencies
npm run dev              # local dev server with HMR
npm run typecheck        # strict TypeScript verification (noEmit)
npm run build            # compile → writes index.html + assets/ to repo root
```

## Deployment

Deployment is a push: the compiled `index.html` and `assets/` at the repository root are committed,
and GitHub Pages serves the `main` branch directly. The custom domain is configured via `CNAME`.

```bash
cd src-app && npm run build     # produces updated root index.html + assets/
git add -A && git commit -m "build: <change summary>"
git push origin main            # GitHub Pages republishes within ~1 minute
```

## Accessibility & quality posture

- Semantic HTML landmarks, skip-to-content link, visible `:focus-visible` rings, ARIA states on all
  interactive controls
- Colour palette chosen for WCAG AA contrast on white (`#4B5563` body copy, `#2563EB` links)
- `prefers-reduced-motion` respected globally
- Print stylesheet (the Resume page renders a clean A4 CV)
- SEO: canonical URLs, Open Graph/Twitter cards, JSON-LD `Person` + `WebSite`, sitemap, robots.txt

## License

Content © 2026 Matome Mbowene. Code in this repository may be used as reference.
