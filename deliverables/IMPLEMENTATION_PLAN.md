## Engineering Implementation Plan (UX + Chatbot)

### Constraints (must keep)
- **GitHub Pages** deployment (static hosting)
- **Fast-loading** (no heavy frameworks)
- **Accessible** (keyboard + screen readers)
- **No sensitive personal info** (no academic/legal disputes; no private identifiers)
- **NDA-safe** (no client/startup naming; no confidential specifics)
- **Do not claim degree completion**

---

## P0 (High impact, low risk) — 0.5 to 1.5 days

### Content + compliance
- [ ] **Sanitize org naming** in Experience/Projects (replace startup/client names with public-safe labels).
- [ ] Replace education line with **“University of Cape Town — Computer Science & Computer Engineering (coursework)”**.
- [ ] Standardize project **Proof** pattern (Outcome, Constraints, Approach, Reliability, Stack).

### Accessibility
- [ ] Make mobile nav toggle fully accessible:
  - [ ] `aria-controls`, `aria-expanded`
  - [ ] Close on Escape
  - [ ] Focus management (return focus to toggle)
  - [ ] Prevent background scroll when menu is open (optional)
- [ ] Add `prefers-reduced-motion` support:
  - [ ] Disable smooth scrolling
  - [ ] Disable KPI counter animation
- [ ] Replace emoji icons with inline SVG or ensure they’re `aria-hidden` and have adjacent text labels.

### Conversion
- [ ] Update hero CTA to **Email Matome** (primary), keep Projects + Resume as secondary.
- [ ] Add “Ask about my work” (Chat) CTA near hero CTAs.

### Chatbot (Option 1: no backend) — MVP
- [ ] Add accessible chat launcher + dialog UI (keyboard-friendly).
- [ ] Load `chatbot/knowledge.json` on first open.
- [ ] Implement intent matching:
  - availability, projects, OCR, RAG, skills, NDA, education, journey, contact
- [ ] Add disclaimer and “no logs” statement in the UI.
- [ ] Add safe fallback response: “I can share projects, skills, and links—email for anything sensitive.”

---

## P1 (Quality + maintainability) — 1 to 2 days

### Design system cleanup
- [ ] Reduce inline styles by introducing reusable CSS classes (buttons, cards, tags, grids).
- [ ] Normalize typography and spacing scale across sections.
- [ ] Improve muted text contrast to meet WCAG targets.
- [ ] Add consistent hover/focus/active states for buttons and links.

### Content scanability
- [ ] Add “How I work” mini-block (reliability + production mindset).
- [ ] Add explicit “Links” row in Projects (GitHub/Write-up where public).
- [ ] Add a small “Last updated” line (optional).

### SEO / metadata (safe)
- [ ] Ensure OG image dimensions and correct absolute URL.
- [ ] Add `aria-label` for nav and consistent landmarks (`<main>`, `<header>`).

---

## P2 (Optional enhancements) — 1 to 3 days

### Chatbot Option 2 (LLM-backed serverless)
- [ ] Choose provider: Cloudflare Worker or Netlify Function.
- [ ] Implement retrieval over `chatbot/knowledge.json`:
  - [ ] Start keyword retrieval; optional embeddings later.
- [ ] Add strong system prompt:
  - grounded answers only
  - refuse disallowed topics
  - no private/confidential details
- [ ] Add rate limiting + abuse prevention.
- [ ] Add redaction before sending to model (IDs, addresses, legal/medical).
- [ ] Explicit privacy notice (no logs by default).

### Performance extras
- [ ] Convert images to WebP/AVIF + `srcset`.
- [ ] Add lazy loading for non-hero images (if introduced later).

---

## Effort estimate summary
- **P0**: 4–12 hours (depends on how much CSS refactor is included)
- **P1**: 8–16 hours
- **P2**: 8–24 hours (LLM option varies by provider + retrieval approach)

