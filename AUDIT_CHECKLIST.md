# Production Engineering Audit & Quality Checklist
Matome Mbowene — Engineering Portfolio

This audit focuses on consistency, Polish, accessibility, correctness, and recruiter experience, in accordance with the standards of engineering sites like Stripe, Vercel, Linear, and Anthropic.

---

## 1. Critical Fixes (Content & Role Consistency)
- [x] **Fairflow Timeline Standardization**: Enforce the exact timeline `Jan 2026 – Apr 2026` globally across all components (`Experience.tsx`, `Resume.tsx`, root `resume.html`).
- [x] **Fairflow Role Title Standardization**: Standardize the Fairflow job title to exactly "Software Engineer" (removing "/ CTO" from `Experience.tsx`) to match the five resume profiles and homepage references.

## 2. High Priority (UI, Color, & Date Range Systems)
- [x] **Date Range Separators**: Convert all date ranges across the entire repository (React views and static root HTMLs) to use en-dashes (`–` / `\u2013`) instead of em-dashes (`—`) or hyphens:
  - UCT Systems Developer: `Feb 2025 – Nov 2025`
  - Dell Young Leaders: `2022 – 2025`
  - UCT Education: `2020 – 2025`
- [x] **Color System & Pure Black Branding**: Replace dark gray elements (`bg-gray-900`, `hover:bg-gray-800`, `border-gray-900`) with pure black (`bg-black`, `hover:bg-neutral-900`, `border-black`), aligning with Stripe/Linear brand postures.
- [x] **"Blue Only on Hover" Link System**: Eliminate dominant inline blue text on static links. Standardize links to be primary/secondary colors (`text-gray-900` or `text-gray-600`) and transition to blue-600 (`hover:text-blue-600 hover:underline`) only on hover or focus states.
- [x] **Case Study Technology & Tag Consistency**: Standardize the tags on the detail views of all 8 projects in `ProjectDetails.tsx` to explicitly call out their technology stack, giving recruiters immediate technical context.

## 3. Medium Priority (Performance, Accessibility, & Metadata)
- [ ] **Accessibility & Keyboard Focus Audit**: Ensure skip links, ARIA labels, focus rings, and screen-reader accessibility are perfectly consistent on all pages.
- [ ] **Form Validation Polish**: Ensure error messages and status alerts in `Contact.tsx` are fully accessible, high-contrast, and keyboard friendly.
- [ ] **SEO & Metadata Integrity**: Ensure that meta descriptions, title hierarchies, canonical links, sitemaps, and structured JSON-LD are perfectly synchronized and have zero duplicate metadata.

## 4. Low Priority (Code Quality & Cleanup)
- [ ] **Unused Code & Asset Review**: Verify that the production build outputs are clean of dead references and unused imports.
