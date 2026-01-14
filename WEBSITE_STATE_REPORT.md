# Website State & Experiences Report (Jan 14, 2026)

This report analyzes the current state of the portfolio website in this repository and summarizes your recent professional experiences (sourced from `Matome_Mbowene_Resume_2025_Dec.pdf`).

---

## Current State (What the site is today)

- **Architecture**: Single-page static site (`index.html`) with inline CSS + inline JavaScript and local assets (e.g., `profile.jpg`, resume PDF).
- **Primary sections**: Hero → Experience → Projects → Contact → Footer.
- **Positioning**: “AI/ML Engineer • Computer Vision • RAG Systems” with quantified impact highlights (100% OCR field-mapping, 89.33% model accuracy, 35% efficiency gain).

### Content Coverage

- **Strengths**
  - Clear technical niche (OCR/CV + RAG + embedded/edge AI).
  - Quantified outcomes are present and front-loaded.
  - Resume is available as a direct download link.
  - Experience section now aligns with your recent roles and is easy to scan.

- **Gaps / Risks**
  - **Project proofs**: Projects are described but do not link to demos, write-ups, or case studies (understandable for NDA work, but the site still needs “evidence substitutes”).
  - **About / credibility**: Education, awards (Dell Young Leader), and scholarship items exist in the resume but are not yet showcased as a dedicated section.
  - **Contact form**: The form is currently a **placeholder**; it shows a success message but does not actually send anywhere.

---

## UX / Visual Design Review

- **Strengths**
  - Simple, modern dark theme with a consistent accent color.
  - Strong above-the-fold CTA layout (Contact, Projects, Resume).
  - Mobile navigation is supported with a menu toggle on small screens.

- **Improvements**
  - Add a small “Proof” area per project (1–3 bullets: scope, constraints, what shipped, what you owned).
  - Consider adding a short “What I’m looking for” line (roles, location/remote, start date) near the CTA.

---

## Accessibility Review

- **Fixed / improved**
  - Added visible focus states for keyboard users.
  - Replaced the hero placeholder avatar with an `img` and meaningful `alt` text.
  - Added labels for form inputs (better for screen readers).

- **Remaining opportunities**
  - Replace emoji icons with accessible SVGs or ensure they have accessible names where needed.
  - Ensure color contrast stays strong in all states (hover/focus).

---

## SEO / Shareability Review

- **Fixed / improved**
  - Added meta description, OpenGraph, and Twitter card tags.

- **Remaining opportunities**
  - Add a favicon (`favicon.ico` or `favicon.png`) and reference it in `<head>`.
  - Add canonical URL meta tag once the final GitHub Pages URL is confirmed.
  - Consider adding structured data (JSON-LD) for Person/Resume if you want stronger search presence.

---

## Performance / Maintainability Review

- **Strengths**
  - Minimal dependencies; inline “critical CSS” approach yields fast initial render.
  - No build pipeline required (easy GitHub Pages deployment).

- **Risks**
  - Inline styles make iterative changes harder and increase duplication over time.
  - JavaScript currently contains “demo” behaviors (contact form) that can mislead visitors.

---

## Security / Privacy Review

- **Notes**
  - Publishing phone number and email is fine for a portfolio but increases spam risk; consider an email alias or a contact provider.
  - Avoid adding sensitive NDA details (client names, confidential datasets, exact documents) — current descriptions remain high-level.

---

## Recent Experiences (Summary)

### Computer Vision & Document Automation Developer — Collaboration with Aaron Kisten (UCT Geomatics)
**Present • Cape Town, South Africa**
- Built production OCR + LLM system achieving **100% field-mapping accuracy** on scanned surveying diagrams.
- Implemented **6-layer validation**, confidence scoring, and context-aware mapping with color-coded debug highlighting.
- Created editable PDF form fields (AcroFields), robust fallbacks, and enterprise-grade logging.

### AI Developer (Equity-based) — Beetroot
**Nov 2025 – Present • Cape Town, South Africa**
- Built a RAG conversational agent using **FAISS + sentence-transformers + GPT-4o / Claude** to connect African entrepreneurs.
- Delivered full pipeline: ingestion → embeddings → persistent index → retrieval → Streamlit demo.
- Improved CI/CD, dependency management, and production safeguards.

### Junior ML & Embedded Systems Engineer — RoadMind AI
**Dec 2025 – Present • Cape Town, South Africa**
- Developing sensor fusion pipelines and edge-AI models for real-time hazard detection on motorcycles.
- Contributing to firmware and data pipeline architecture for LiDAR, IMU, and camera integration.

---

## Recommended Next Actions (Prioritized)

1. **Make the contact form real** (Formspree or similar) or remove it and keep direct email/LinkedIn CTAs.
2. **Add an “About” section**: UCT degree (Dec 2025), Dell Young Leader, Google Cloud Career Launchpad (EMEA), languages.
3. **Add “Case study” style project pages** (even simple anchors expanding content) for non-NDA academic work.
4. **Align README with current implementation** (right now it references a different Tailwind/AOS version of the site).

