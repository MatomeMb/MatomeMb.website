## Information Architecture (Final)

### Final nav order (and why)
1. **Home** — immediate positioning + proof + CTA
2. **Projects** — fastest credibility signal (“What has he built?”)
3. **Experience** — validates production delivery and scope
4. **Skills** — supports matching to job requirements
5. **About** — short narrative + credentials (kept discreet)
6. **Contact** — conversion endpoint

Rationale: Recruiter-first scanning prioritizes **proof → delivery → fit → context → contact**.

---

## Section-by-section content outline

### 1) Hero (Home)
- **Headline**: Name + role (human, calm)
- **Subhead**: “I ship OCR/CV and retrieval systems with validation and measurable outcomes.”
- **Proof bar** (2–3 items): e.g., OCR mapping accuracy, reliability features, shipped pipelines
- **Primary CTA**: Email / Contact
- **Secondary CTAs**: Projects, Resume (PDF)
- **Quick links**: LinkedIn, GitHub

### 2) Projects (Featured)
For each project card:
- **Title** (no emojis)
- **One-line problem statement**
- **Proof block** (standardized):
  - **Outcome**
  - **Constraints**
  - **Approach**
  - **Reliability**
  - **Stack**
- **Links (optional)**: demo / write-up / repo (omit if NDA)

Projects to include (public-safe):
- **OCR Document Automation** (outcome-driven, reliability-first)
- **RAG Assistant** (pipeline, determinism, safeguards)
- **Embedded / Edge AI Foundations** (constraints + reliability)
- **Confidential Product Build (NDA)** (high-level only: delivery, production readiness)

### 3) Experience
Experience card template (scannable):
- **Role** + **time/location** (compact)
- **Org label**: sanitized if needed (“Early-stage startup (NDA)”)
- **Top outcome line** (bold)
- **2–4 bullets** focused on ownership + production behaviors
- **Stack tags**

### 4) Skills
Grouped for ATS/recruiter matching:
- **AI/ML**: CV, OCR, RAG, embeddings, evaluation basics
- **Backend/Data**: APIs, data pipelines, SQL
- **Systems/Shipping**: CI/CD, Docker, testing, observability, Linux
- Optional: **Cloud**: GCP fundamentals / badge

### 5) About (Credibility + Journey, public-safe)
- **What I do**: 2–3 sentences, specific
- **How I work**: reliability mindset (validation, tests, logs, failure modes)
- **Credentials**:
  - University line **without claiming completion**
  - Dell Young Leaders
  - Google Cloud Career Launchpad
  - Credly badge link
- **Journey (1 paragraph)**: professional, grounded, non-graphic; “multi‑year path, resilience, readiness now”

### 6) Contact
- **Primary**: email (one-click)
- **Secondary**: LinkedIn
- **Optional**: lightweight form (mailto prefill is acceptable on GitHub Pages)
- **Chat disclaimer**: “This chat is informational; email for anything sensitive.”

---

## What to remove, rewrite, or add

### Remove / avoid
- **Named startups/clients** when work is NDA or privacy-sensitive. Replace with sanitized descriptors.
- Any mention of academic/legal disputes, exclusion processes, or sensitive identifiers.
- Over-claiming: “enterprise-grade” unless supported with concrete behaviors.

### Rewrite
- Education line to “University of Cape Town — Computer Science & Computer Engineering (coursework)”.
- Experience org labels to public-safe, non-identifying text.
- Project descriptions into a consistent Proof pattern.

### Add
- “How I work” micro-section (reliability + production mindset)
- `prefers-reduced-motion` support
- Accessible mobile menu behavior
- Chat entry point (“Ask about my work”)

---

## UI System (Tokens, Type, Spacing)

### Typography scale (base 16px)
- **Display**: 40 / 48 (Hero headline)
- **H1**: 36–40
- **H2**: 28–32
- **H3**: 18–20
- **Body**: 16
- **Small**: 14
- **Caption**: 12
Rules:
- Body line-height **1.6–1.75**
- Keep paragraph width ~**65–75ch** max for readability

### Spacing scale (4px grid)
- 4, 8, 12, 16, 24, 32, 48, 64
Rules:
- Section padding: **48–64** desktop, **40–48** mobile
- Card padding: **16–24**
- Button height: **44px** min (touch target)

### Color tokens (dark mode first)
- **--bg**: primary background
- **--surface**: section / card background
- **--surface-2**: elevated surface (nav)
- **--border**: subtle borders
- **--text**: primary text
- **--text-muted**: secondary text (ensure contrast)
- **--accent**: primary accent (CTA/focus)
- **--success**: status
- **--danger**: errors
Contrast targets:
- Normal text: **≥ 4.5:1**
- Large text (≥ 24px regular / 18.66px bold): **≥ 3:1**
- Focus indicator: visible on all surfaces (don’t rely on color alone)

---

## Component specs (behavior + a11y)

### Navbar
- **Structure**: logo (Home), links, mobile menu button
- **A11y**: `aria-label="Primary"`, menu button `aria-expanded`, `aria-controls`
- **Behavior**: sticky, blurred background; highlight active section (optional)
- **States**: hover underline, focus ring, active link accent

### Hero
- **Content**: headline, subhead, proof chips/KPIs, CTAs, quick links
- **A11y**: image alt, link names, no icon-only buttons

### CTA Buttons
- **Primary**: filled accent gradient (or solid accent), white text
- **Secondary**: outline accent
- **Tertiary**: subtle outline / ghost
- **States**:
  - Hover: increase contrast + slight lift
  - Focus: 2px outline + offset
  - Active: press-down transform
  - Disabled: reduced opacity + `cursor: not-allowed`

### Experience cards
- **Hierarchy**: role/title → outcome → bullets → tags
- **Tags**: consistent size, wrap, not interactive
- **A11y**: no color-only meaning; use bold labels (“Outcome:”)

### Project case study cards
- **Proof pattern** block as a list with bold labels
- Optional `details/summary` for expanded content (keyboard accessible)

### Skill chips
- Non-interactive tags with consistent padding and contrast
- Avoid too-low-contrast muted text in chips

### Contact form
- Labels always visible
- Error states: inline message + `aria-live="polite"`
- Submit button uses standard button component styling

### Footer
- Minimal: short line + copyright
- Avoid vague tagline; use a calm, professional line

---

## Interaction states (global)
- **Hover**: only where it improves clarity; avoid “flashy” effects
- **Focus**: consistent focus ring across links/buttons/inputs
- **Reduced motion**: disable smooth scroll + counter animation + large transitions

