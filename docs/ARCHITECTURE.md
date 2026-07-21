# System Architecture - Personal Portfolio & Engineering Platform

This document describes the production-grade system architecture and design principles of Matome Mbowene's personal portfolio engineering platform.

---

## 1. Dual-Architecture Pattern

To reconcile the need for a modern **React 19 / TypeScript / Vite / Tailwind v4** development environment with **instant, zero-overhead, zero-downtime hosting on GitHub Pages**, we implement a **Dual-Architecture compilation loop**.

```
+--------------------------------------------------------+
| DEVELOPMENT WORKSPACE (src-app/)                       |
| - React 19, TS, Vite, Tailwind v4, TanStack Query      |
+---------------------------+----------------------------+
                            |
                            | npm run build
                            v
+---------------------------+----------------------------+
| COMPILED STATIC DELIVERABLES (/)                       |
| - index.html, assets/ (JS/CSS assets)                  |
| - Directly served via GitHub Pages CDN (edge)          |
+--------------------------------------------------------+
```

### Architectural Key Points:
1. **Source Isolation**: The entire React application resides in the `src-app/` subdirectory.
2. **Relative Bundling**: Vite compiles files using a relative `./` base path, making the site asset paths resilient.
3. **OutDir Redirection**: The `build.outDir` in `vite.config.ts` compiles the production bundle directly to the root of the repository (`../`), overwriting previous builds automatically.
4. **Preserved Entities**: Root metadata assets like `robots.txt`, `sitemap.xml`, and `resume.html` are fully preserved in the root, preventing file contamination.

---

## 2. Technical Stack & State Topology

The platform leverages bleeding-edge components configured to secure performance, correctness, and accessibility:

### Ingestion & Form Pipeline (Contact)
- **React Hook Form**: Handles form states cleanly, preventing unnecessary re-renders.
- **Zod Schema Validation**: Enforces type safety on contact inputs (name, email, subject, message) clientside before the system triggers the link compiler.

### State Topology & Caching
- **TanStack Query (React Query)**: Orchestrates real-time API transactions (e.g., retrieving live repository parameters from `api.github.com`). It stores fetched parameters in memory, preventing API limit exhaustions on multiple page navigations.

### Interface & Layout
- **Tailwind CSS v4**: Utilizes direct CSS theme configurations via `@theme`, eliminating slow, heavy JS configs and compiling compact, highly optimized stylesheets.
- **Lucide React**: Provides standard accessible UI icons (Briefcase, Clock, Calendar, Database, Cpu).
- **Reusable Brand Icons**: Brand elements (like GitHub and LinkedIn) are extracted into customized inline SVG components (`src/components/SocialIcons.tsx`) due to lucide-react brand omissions, ensuring zero runtime fetch overhead.

---

## 3. Interactive Resume & PDF Compile Pipeline

The resume framework satisfies two contradicting goals: **high screen interactivity** and **pristine printing/PDF export**.

1. **Recruiter Profiles Selector**: Choose from 5 tailored profiles (Software Engineer, Backend Engineer, Data Engineer, Data Analyst, AI Engineer). Clicking on tabs updates the active DOM text nodes instantly.
2. **Standalone `resume.html` Compatibility**: To feed the automated Puppeteer PDF converter, we maintain a standalone, styled `resume.html` in the root.
3. **Media Print Optimization**: `@media print` rules hide interactive components and print the active CV beautifully in black-on-white.

---

## 4. Grounded Chatbot Architecture

The assistant runs **100% locally in the browser**, complying with maximum privacy standards.

1. **Embedded Grounding Payload**: The complete profile, FAQ, and project summaries dataset is embedded in the compiled `index.html` as an application JSON script block.
2. **Local Tokenization & Overlap Scoring**: The chatbot tokenizes queries, applies a basic suffix stemmer and synonym expansion maps, and compares them with the JSON payload to generate fully grounded responses.
3. **Traceability Logging**: Bot outputs include sources metadata (`Source: FAQ` or `Source: Case Studies`) to support clear, honest audit trails.
