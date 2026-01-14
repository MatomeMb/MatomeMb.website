## UX Audit Report — Matome Mbowene Portfolio (Single Page)

### Current strengths
- **Fast, simple delivery**: single `index.html`, no build step, minimal JS. Great fit for GitHub Pages.
- **Clear positioning above the fold**: role + focus areas (CV/OCR + RAG) and immediate CTAs (Contact / Projects / Resume).
- **Quantified proof is front-loaded**: KPIs are visible early, increasing recruiter confidence quickly.
- **Basic accessibility foundations exist**: `lang`, skip link, visible focus outlines, labeled form fields.

### Current weaknesses (and fixes)
- **Information architecture order is not recruiter-optimal**
  - **Issue**: Recruiters typically scan “What you built” and “Where you’ve delivered impact” before biography/programs.
  - **Fix**: Reorder nav + page: Hero → Projects → Experience → Skills → About/Credentials → Contact.
- **NDA/discretion risk in naming**
  - **Issue**: “Beetroot” and “RoadMind AI” are named; “UCT Geomatics” + a named collaborator can imply academic details. Requirement says NDA work must remain discreet and avoid naming startups/clients.
  - **Fix**: Replace with **sanitized labels**: “Early-stage startup (NDA)”, “Edge-AI mobility startup (NDA)”, “Research collaboration (Geomatics)”.
- **Projects are close to case studies, but not consistently scannable**
  - **Issue**: Mixed formats; proof is present but not standardized.
  - **Fix**: Add a consistent **Proof** pattern per project: Outcome → Constraints → Approach → Reliability → Stack (2–6 bullets total).
- **Mobile nav is functional but not robust**
  - **Issue**: Menu toggle is injected via JS only on load; no `aria-expanded`, no escape-to-close, and layout relies on inline styles.
  - **Fix**: Implement a small, accessible menu button with `aria-controls`, `aria-expanded`, Escape/Outside click, and no layout shift.
- **Contact conversion can be higher**
  - **Issue**: Multiple contact pathways exist, but they’re not staged or “low friction” (e.g., a one-click “Email Matome” CTA).
  - **Fix**: Add a primary CTA that opens email immediately, keep form as optional, and add “Response time” microcopy (no promises, just intent).

### Usability issues & recommended fixes
- **Scanning density**
  - **Issue**: Cards use similar weight; recruiters can’t instantly spot outcomes vs context.
  - **Fix**: Make outcomes visually distinct (e.g., “Outcome” line in bold + accent border), and move stacks to a consistent location (bottom of cards).
- **Terminology**
  - **Issue**: “AI/ML Engineer” is fine, but “Production-ready AI systems” is generic without a 1–2 line specifics summary.
  - **Fix**: Add a single sentence like: “I ship OCR/CV pipelines and retrieval systems with validation, observability, and clear failure modes.”
- **Resume link should be explicit**
  - **Issue**: “Resume (PDF)” works, but does not set expectation (download vs open).
  - **Fix**: Use: “Resume (PDF, 1 page)” if accurate; otherwise “Resume (PDF)”.

### Accessibility issues & fixes (WCAG-oriented)
- **Navigation toggle accessibility (WCAG 4.1.2, 2.1.1)**
  - Add `aria-expanded`, `aria-controls`, keyboard activation, Escape to close, focus trapping (or at minimum focus return).
- **Color contrast (WCAG 1.4.3)**
  - Current `--text-muted` on dark surfaces risks falling below 4.5:1 in smaller text.
  - Adjust muted color (lighter) or increase font size/weight for muted text.
- **Emoji icons (WCAG 1.1.1)**
  - Replace emojis with inline SVG marked `aria-hidden="true"` and provide a text label nearby, or ensure the icon has an accessible name.
- **Motion preferences (WCAG 2.3.3 / best practice)**
  - Respect `prefers-reduced-motion`: disable smooth scrolling and KPI counter animation when enabled.
- **Landmarks and headings (WCAG 1.3.1)**
  - Use semantic landmarks (`<main>`, `<header>`, `<footer>`) and ensure a consistent heading structure (H1 once, section H2s, card H3s).

### Content clarity + recruiter scanability improvements
- **Lead with outcomes, then responsibilities**
  - Each experience entry should start with 1 outcome line, then 2–3 bullets of responsibilities/approach.
- **Discreet education line**
  - Requirement: do not claim degree completion.
  - Use: “University of Cape Town — Computer Science & Computer Engineering (coursework)” and avoid dates/status claims.
- **Remove low-signal claims**
  - Replace broad statements (“enterprise-grade”) with concrete behaviors (“validation layers, logging, fallbacks, CI/CD”).

### Conversion improvements (CTA, contact pathways)
- **Primary CTA**: “Email Matome” (mailto) or “Schedule a call” (Calendly link if you add one later).
- **Secondary CTAs**: “View projects” and “Download resume”.
- **Low-friction contact strip**: Email + LinkedIn in hero, with “Usually responds within X” only if you can keep it true; otherwise “Fastest response via email.”
- **Chatbot CTA**: “Ask about my work” button that opens the chat (useful for recruiters who don’t want to scroll).

### Mobile-first adjustments
- **Reduce inline layout styles**: migrate repeated inline styles into reusable CSS classes.
- **Tap targets**: ensure nav links and buttons meet ~44px target height.
- **Section spacing**: reduce vertical padding slightly on mobile (e.g., 3rem instead of 4rem) but keep readability.
- **Sticky nav**: ensure menu doesn’t obscure headings (anchor offset already helps; keep consistent).

### Performance improvements (what to change)
- **Images**
  - Convert `profile.jpg` and large photos to **WebP/AVIF** and add `srcset` sizes. Keep a JPEG fallback if needed.
  - Ensure all images have explicit `width`/`height` (hero already does) to avoid layout shift.
- **CSS**
  - Keep “critical CSS” inline, but reduce duplication by using classes instead of inline styles.
  - Add a `prefers-reduced-motion` block to disable animations.
- **JavaScript**
  - Remove brittle DOM selection based on inline style matching (current KPI counter targets `[style*="font-size: 1.8rem"]`).
  - Prefer explicit classes/data attributes (e.g., `.js-kpi` with `data-target="100"`).
- **Chatbot**
  - For a no-backend chatbot, keep the knowledge file small (<30KB) and cacheable; load on first open, not on initial page load.

