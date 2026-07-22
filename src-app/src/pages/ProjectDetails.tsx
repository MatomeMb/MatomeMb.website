import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import MermaidDiagram from "../components/MermaidDiagram.tsx";

interface CaseStudy {
  name: string;
  tag: string;
  repository?: string;
  liveUrl?: string;
  deepDiveUrl?: string;
  problem: string;
  requirements: string[];
  architecture: string;
  ascii: string;
  mermaid: string;
  mermaidCaption: string;
  tradeoffs: { decision: string; cost: string; why: string }[];
  implementation: string[];
  challenges: { issue: string; resolution: string }[];
  verification: string;
  outcome: string;
  lessons: string[];
  roadmap: string[];
}

const studies: Record<string, CaseStudy> = {
  "fairflow": {
    name: "Fairflow",
    tag: "Open-source commerce platform &mdash; TypeScript, Hono, React, Supabase, Paystack, Rust",
    repository: "https://github.com/MatomeMb/.Things-That-Matter",
    liveUrl: "https://fairflow.co.za",
    deepDiveUrl: "/architecture/fairflow",
    problem:
      "South African merchants rely on fragmented tools for operations, payments, KYC and product data. There is no unified, merchant-owned infrastructure — platforms own the data, the checkout and the payout rails. Fairflow exists to change that: a self-hostable, open-source commerce stack with a merchant portal, Paystack checkout, Sumsub KYC/payouts, and portable .thing product artifacts.",
    requirements: [
      "Multi-actor authentication: merchant JWTs (stateless), Supabase sessions (staff), admin proxy (server-only ADMIN_SECRET).",
      "Paystack integration: checkout sessions, HMAC-verified webhooks, idempotent event processing.",
      "Sumsub integration: applicant flow, webhook handling, payout orchestration via admin proxy.",
      "Dual storage abstraction: local JSON files for zero-config development, Cloudflare R2 for production — same interface, zero config switch.",
      "Portable product artifacts (.thing files): Rust-backed schema validation (matter-core), signed payloads, portable across any Fairflow-compatible surface.",
      "Production-minded open source: Docker dev/prod parity, Vitest + Playwright CI, OpenAPI specs, ADRs, sanitised fixtures, public architecture docs.",
    ],
    architecture:
      "A TypeScript monorepo (npm workspaces) with three primary apps. auth-portal is a React + Vite SPA for merchant onboarding, dashboard, product management and admin operations. shadow-index is a Hono API (Node on Vercel serverless) handling checkout, webhooks, webhook verification, product CRUD, and admin endpoints. matter-core is a Rust library compiled to a Node addon (via napi-rs) that validates and signs .thing product artifacts. Supabase provides Auth (staff/admin) and Postgres (merchant records, products, webhook events, audit logs). Paystack handles South African card and mobile-money rails. Sumsub handles KYC. Cloudflare R2 stores production artifacts; local JSON files mirror the same schema for development. Admin actions route through a server-only proxy so ADMIN_SECRET never reaches the browser.",
    ascii: `+------------------+     +-------------------+     +-------------------+
|  auth-portal     |<--->|  shadow-index     |<--->|  Supabase         |
|  (React/Vite)    |     |  (Hono/Node)      |     |  Auth + Postgres  |
+--------+---------+     +--------+----------+     +--------+----------+
         |                          |                        |
         |                          |                        |
         |                   +-------v-------+     +---------v----------+
         |                   |  matter-core  |     |  Cloudflare R2 /   |
         |                   |  (Rust/napi)   |     |  Local JSON        |
         |                   +-------+-------+     +--------------------+
         |                          |
         |                   +-------v-------+     +--------------------+
         |                   |  Paystack     |     |  Sumsub            |
         +------------------>|  Checkout +   |     |  KYC / Payouts     |
                           |  Webhooks      |     +--------------------+
                           +----------------+`,

    mermaid: `flowchart LR
  subgraph Portal[auth-portal — React + Vite]
    direction TB
    M[Merchant Dashboard]
    A[Admin Console]
    S[Staff Views]
  end

  subgraph API[shadow-index — Hono on Node]
    direction TB
    CH[Checkout Sessions]
    WH[Webhook Handler]
    PR[Product CRUD]
    AD[Admin Endpoints]
    AP[Admin Proxy]
  end

  subgraph Core[matter-core — Rust/napi-rs]
    MV[.thing Validation]
    SN[Signing]
  end

  subgraph Data[Data Layer]
    SB[(Supabase Auth + Postgres)]
    R2[(Cloudflare R2 / Local JSON)]
  end

  subgraph Ext[External]
    PS[Paystack]
    SS[Sumsub]
  end

  M --> API
  A --> API
  S --> API
  API --> Core
  API --> Data
  API --> PS
  AP --> SS
  Core --> Data`,

    mermaidCaption: "Fig 1. Fairflow architecture. Three apps (portal, API, core) with Supabase, R2, Paystack, Sumsub. Admin proxy keeps secrets server-side.",

    tradeoffs: [
      {
        decision: "Hono on Vercel serverless for the commerce API",
        cost: "Cold starts, 60s execution limit, no long-running workers",
        why: "Near-zero ops, native Node, great DX, auto-scaling. Webhooks are fast and idempotent by design; long tasks (KYC polling) are pushed to client or scheduled via cron — acceptable trade-off for a commerce API.",
      },
      {
        decision: "Merchant JWTs vs Supabase sessions for staff/admin",
        cost: "Two auth models to maintain, document and reason about",
        why: "Merchants are external customers — stateless JWTs scale, revoke via key rotation, no Supabase seat cost. Staff/admin are internal — Supabase Auth gives RLS, MFA, session management, audit logs out of the box. Mixing them would leak internal auth concerns to merchants.",
      },
      {
        decision: "Admin proxy so ADMIN_SECRET never hits the browser",
        cost: "Extra hop for every admin action; proxy must be kept minimal and audited",
        why: "The admin secret is a root credential. Exposing it to the browser — even in an env var — is a supply-chain risk. A thin serverless proxy (Hono route) validates the caller's Supabase session, checks RBAC, then forwards with the secret. The browser never sees it.",
      },
      {
        decision: "Paystack for South African payment rails",
        cost: "Single-provider dependency; webhook HMAC verification is mandatory",
        why: "Paystack is the de-facto standard for SA card/mobile-money. The API is well-documented, webhooks are reliable, and the fee structure is transparent. We verify every webhook with HMAC-SHA512 and process events idempotently — no double-charges, no missed fulfilments.",
      },
      {
        decision: "Dual storage: local JSON dev / R2 prod",
        cost: "Abstraction layer to maintain; parity tests needed",
        why: "Zero-config local dev is a DX multiplier — clone, npm install, npm run dev, it works. R2 gives S3-compatible, globally distributed object storage for production. The storage interface is identical; the adapter swaps on NODE_ENV. No Docker, no Supabase local, no MinIO required for a contributor's first run.",
      },
      {
        decision: "matter-core in Rust (napi-rs) for .thing validation",
        cost: "Rust toolchain in CI; native build complexity; smaller contributor pool",
        why: "Schema validation is a trust boundary. A .thing file can come from any source — merchant upload, API import, extension. Rust gives memory safety, zero-cost abstractions, and a single source of truth for the schema (JSON Schema + serde). The napi-rs binding keeps the API ergonomic from TypeScript. The correctness payoff justifies the build complexity.",
      },
      {
        decision: "Open-source the production codebase with sanitised fixtures",
        cost: "Slower releases — every secret, fixture and internal ref must be scrubbed",
        why: "A production codebase released as OSS is a stronger portfolio signal than a tutorial repo. It forces ADRs, OpenAPI specs, structured logging, CI gates and documentation that survive scrutiny. The sanitisation discipline (env-only secrets, public fixtures, no PII) is itself a transferable engineering skill.",
      },
    ],

    implementation: [
      "auth-portal: React 19 + Vite + TypeScript; React Router v7; TanStack Query for server state; Tailwind CSS v4; component library with Radix primitives; JWT auth context with auto-refresh; role-based route guards (merchant, staff, admin).",
      "shadow-index: Hono + Node on Vercel; Zod validation at every route; structured JSON logging (pino); OpenAPI 3.1 spec generated from routes; Paystack checkout session creation + webhook verification (HMAC-SHA512); Sumsub applicant SDK + webhook handling; Supabase admin client for staff/admin operations.",
      "matter-core: Rust workspace with serde, schemars, json-schema; napi-rs bindings; validates .thing JSON against generated JSON Schema; produces detached Ed25519 signatures; publishes npm package with native binaries for linux/mac/win.",
      "Supabase: Row-level security policies on all tables; merchant isolation via JWT claims; staff/admin via Supabase Auth with custom roles; webhook_events table for idempotency keys; audit_log table with immutable inserts.",
      "CI/CD: GitHub Actions — lint, typecheck, unit tests (Vitest), e2e (Playwright), Docker build, native Rust build, OpenAPI spec validation, dependency audit. Deploy on merge to main (Vercel for portal + API, npm for matter-core).",
      "Documentation: ARCHITECTURE.md with Mermaid diagrams; ADR log (001-hono-serverless, 002-merchant-jwt, 003-admin-proxy, 004-dual-storage, 005-rust-core); CONTRIBUTING.md with dev setup, testing, release process; public fixtures in docs/fixtures/.",
    ],

    challenges: [
      {
        issue: "Paystack webhook HMAC verification failing in serverless due to raw body parsing.",
        resolution:
          "Hono's default body parser consumes the stream. Configured a custom middleware to capture the raw text body before parsing, then verify HMAC-SHA512 against the x-paystack-signature header. Added idempotency keys (event ID) to webhook_events table to guarantee exactly-once processing.",
      },
      {
        issue: "Supabase RLS policies conflicting with admin operations that need cross-merchant access.",
        resolution:
          "Created a service-role Supabase client used only in the admin proxy (server-side). The proxy validates the caller's staff session and RBAC role, then executes the operation with the service role — bypassing RLS intentionally and audibly. All admin actions are logged to audit_log.",
      },
      {
        issue: "Rust napi-rs native builds failing on GitHub Actions macOS runners due to linker flags.",
        resolution:
          "Pinned Rust toolchain; added cargo-xcode for macOS; used maturin-style build script with explicit linker args; published prebuilt binaries for linux-x64, macos-x64, macos-arm64, win32-x64 via GitHub Actions matrix. npm package now installs without Rust on the consumer machine.",
      },
      {
        issue: "Merchant JWT revocation without a central token store.",
        resolution:
          "Short-lived access tokens (15 min) + refresh tokens stored hashed in Supabase. Revocation = delete refresh token. Key rotation via JWKS endpoint on shadow-index; portal fetches JWKS on 401. No central blacklist needed — stateless verification with short TTL.",
      },
    ],

    verification:
      "Vitest unit tests for Zod schemas, JWT issuance/verification, storage adapters (local + R2 parity), .thing validation vectors. Playwright e2e: merchant signup → product create → checkout session → webhook simulation → order fulfilment. CI runs on every PR; Docker compose stack spins Supabase, R2 (minio), API, portal for integration tests. OpenAPI spec validated against actual routes. Dependency audit (npm audit, cargo audit) gates merges.",

    outcome:
      "Fairflow is a live, open-source commerce stack at fairflow.co.za. The monorepo integrates TypeScript, Rust, React, Hono, Supabase, Paystack and Sumsub — with Docker parity, CI gates, OpenAPI docs, ADRs and sanitised public fixtures. It serves as both a usable merchant product and a reference architecture for commerce infrastructure in emerging markets.",

    lessons: [
      "Serverless (Vercel/Hono) is a genuine ops simplification for commerce APIs — if you design for idempotent, fast webhooks from day one.",
      "Auth model separation (customer JWTs vs staff sessions) pays off in clarity and cost. Don't force one model to serve both.",
      "Admin secrets belong in a proxy, not env vars the browser can see. The proxy pattern is reusable across any privileged operation.",
      "Dual storage (local/dev, cloud/prod) behind a single interface is a DX force-multiplier for OSS projects. Contributors run the full stack locally with zero cloud config.",
      "Rust for trust boundaries (schema validation, signing) is worth the build complexity. The correctness guarantee travels with the artifact.",
      "Open-sourcing a production codebase forces documentation, ADR and fixture hygiene that private repos defer indefinitely. The discipline is the asset.",
    ],

    roadmap: [
      "Multi-currency support (ZAR, USD, EUR) with Paystack + Stripe fallback.",
      "Chrome extension for one-click product capture → .thing artifact.",
      "Merchant-facing analytics dashboard (revenue, conversion, payout timeline).",
      "Plugin system for custom checkout fields, webhook extensions, storage backends.",
      "Formal security audit of matter-core and webhook verification paths.",
    ],
  },

  "ocr-document-automation": {
    name: "OCR Document Automation",
    tag: "Computer vision — Python, OpenCV, Tesseract, Pandas, PostgreSQL",
    problem:
      "Financial documents arrive as scans — skewed, low-contrast, noisy. Raw OCR reads most characters correctly, but the residual errors are the dangerous kind: an 8 read as a 6, an O read as a 0. They are plausible values that pass naive checks and silently corrupt accounting tables downstream. The system requirement was therefore not 'read text well' but 'never let an unverifiable value reach the database'.",
    requirements: [
      "Per-field format constraints: dates parse as dates, amounts as numerics, references against known patterns.",
      "Geometric validation: a value must come from the region of the page where that field lives.",
      "Cross-field arithmetic: line items must sum to the document total within a defined tolerance.",
      "Confidence gating: any field below its threshold is routed to manual review, never guessed.",
      "Full audit trail: every accepted value traceable to a page coordinate and a confidence score.",
    ],
    architecture:
      "A staged pipeline where each stage narrows the failure space of the next. Image-level normalisation stabilises coordinates before any character is read; validation runs in the API boundary, before storage, so rejection is immediate and cheap.",
    ascii: `+---------------+   +------------------+   +-------------------+
| Ingest scan   |-->| OpenCV normalise |-->| Coordinate        |
| (PDF / image) |   | deskew + binarise|   | segmentation      |
+---------------+   +------------------+   +---------+---------+
                                                     |
+----------------+   +------------------+   +--------v---------+
| Backend ledger |<--| Validation gate  |<--| Tabular          |
| (PostgreSQL)   |   | format+geo+sum   |   | extraction (OCR) |
+----------------+   +--------+---------+   +------------------+
                              |
                              v below threshold
                     +------------------+
                     | Manual review    |
                     +------------------+`,
    mermaid: `flowchart LR
  A[Ingest scan] --> B[OpenCV normalise<br/>deskew + Otsu binarise]
  B --> C[Coordinate segmentation]
  C --> D[OCR extraction]
  D --> E{Validation gate<br/>format / geometry / sums}
  E -->|pass| F[(Ledger write<br/>with audit coordinates)]
  E -->|below threshold| G[Manual review queue]`,
    mermaidCaption: "Fig 1. Pipeline stages. The validation gate is the control point — nothing reaches storage unverified.",
    tradeoffs: [
      {
        decision: "Image preprocessing (deskew, Otsu binarisation) before OCR",
        cost: "~80 ms additional latency per page",
        why: "It secures coordinates on low-contrast scans. No amount of post-OCR validation can recover a field that was read from the wrong location.",
      },
      {
        decision: "Validation in the API boundary rather than in the database",
        cost: "Business rules live in application code and must be versioned with it",
        why: "Rejections are instant and cheap — a malformed record never acquires a transaction, a lock, or a write on the database.",
      },
      {
        decision: "Conservative confidence thresholds",
        cost: "A fraction of valid documents is sent to manual review",
        why: "The cost of human review is predictable; the cost of a silent ledger error is not.",
      },
    ],
    implementation: [
      "OpenCV preprocessing: skew angle estimated from bounding-box geometry, corrected with an affine transform; Otsu thresholding isolates text from noisy backgrounds.",
      "Tesseract OCR constrained to segmented coordinate regions rather than whole-page reads, narrowing each field's search space.",
      "Four-layer validation: format regexes, region-of-origin checks, cross-field summation rules, engine confidence thresholds.",
      "Structured audit logging: every accepted field stores source coordinates, confidence and rule outcomes for later traceability.",
    ],
    challenges: [
      {
        issue: "Skewed scans producing systematically misaligned coordinate maps.",
        resolution:
          "Skew detection from the average angle of text bounding boxes, then an affine geometric correction before segmentation.",
      },
      {
        issue: "Scanner noise destroying thin character strokes under naive thresholding.",
        resolution:
          "Bilateral filtering that suppresses speckle noise while preserving stroke edges, ahead of binarisation.",
      },
    ],
    verification:
      "Regression fixtures over a fixed set of high-noise invoices: every run asserts field-level format compliance, summation rules and correct routing of low-confidence extractions.",
    outcome:
      "Silent character-swap errors in the downstream ledger are eliminated by construction: any value that cannot be verified against format, geometry and arithmetic rules is rejected before storage and routed to a human.",
    lessons: [
      "In document AI, validation is the product. Extraction quality matters only insofar as the validation layer can trust it.",
      "Preprocessing buys more accuracy than tuning the OCR engine itself.",
    ],
    roadmap: [
      "Drift detection on input image statistics to flag scanner degradation before accuracy drops.",
      "Specialised layout models for the highest-volume document families.",
    ],
  },

  "rag-assistant": {
    name: "RAG Knowledge Assistant",
    tag: "Applied AI — Python, FAISS, Sentence Transformers, LLM APIs",
    repository: "https://github.com/MatomeMb/personal-codex-agent",
    problem:
      "Question-answering over a private document corpus failed in the classic RAG way: retrieval returned chunks that matched keywords but answered a different question, and the language model — doing what language models do — confidently filled the gap. The system did not just need better retrieval; it needed to know when not to answer.",
    requirements: [
      "Deterministic indexing: the same corpus always produces the same index (pinned models, fixed chunking).",
      "Similarity gating: chunks below a cosine threshold never reach the prompt.",
      "Explicit refusal: sub-threshold queries get a plain 'not in this corpus' response.",
      "Provenance: every answer cites the chunks it was grounded in.",
      "Index integrity: re-embedding only happens when source files actually changed.",
    ],
    architecture:
      "An offline ingestion path (chunk, embed, persist a FAISS index, hash the corpus) and an online query path (embed query, retrieve, gate, assemble grounded prompt, generate with citations). The gate sits between retrieval and generation — it is the single most important component in the system.",
    ascii: `+---------------+   +------------------+   +-------------------+
| Corpus files  |-->| Chunking         |-->| Embeddings        |
| (docs/markdown)|  | (recursive split)|   | (MiniLM, pinned)  |
+---------------+   +------------------+   +---------+---------+
                                                     |
+----------------+   +------------------+   +--------v---------+
| Grounded       |<--| Prompt assembly  |<--| FAISS index      |
| answer + cites |   | + citations      |   | (persistent)     |
+----------------+   +--------+---------+   +------------------+
                              |
                              v below threshold
                     +------------------+
                     | Explicit refusal |
                     +------------------+`,
    mermaid: `sequenceDiagram
  participant U as User
  participant Q as Query path
  participant F as FAISS index
  participant L as LLM
  U->>Q: question
  Q->>Q: embed query (MiniLM)
  Q->>F: top-k similarity search
  F-->>Q: chunks + cosine scores
  alt above threshold
    Q->>L: grounded prompt + cited chunks
    L-->>U: answer with source citations
  else below threshold
    Q-->>U: explicit refusal - not in corpus
  end`,
    mermaidCaption: "Fig 1. Query-path sequence. The similarity gate decides between grounded generation and refusal.",
    tradeoffs: [
      {
        decision: "In-memory FAISS instead of a hosted vector database",
        cost: "Corpus size is bounded by local memory; no managed scaling story",
        why: "For this corpus the operational overhead of a vector DB buys nothing. Simplicity and auditability win.",
      },
      {
        decision: "Local sentence-transformers instead of a commercial embedding API",
        cost: "Slightly weaker embeddings than frontier models",
        why: "Deterministic local execution: no per-call cost, no data leaving the machine, and a pinned model version is what makes the index reproducible.",
      },
      {
        decision: "Conservative similarity threshold",
        cost: "The assistant declines questions a looser system would attempt",
        why: "Precision is the product. A refusal is a correct answer when the evidence is weak.",
      },
    ],
    implementation: [
      "Recursive character chunking with fixed overlap — parameters versioned with the code.",
      "Pinned sentence-transformer (MiniLM family) for embeddings; model version stored alongside the index.",
      "FAISS index persisted to disk with corpus SHA-256 hash; ingestion re-runs only when the hash changes.",
      "Cosine-similarity threshold tuned against a probe set of in-scope and out-of-scope questions.",
      "Prompt assembly that injects retrieved chunks with explicit citation markers the model must preserve.",
    ],
    challenges: [
      {
        issue: "Keyword-similar but semantically wrong chunks passing early thresholds.",
        resolution:
          "Tuned the threshold against cosine-score distributions of known-good versus known-irrelevant retrievals, and kept the bias toward refusal.",
      },
      {
        issue: "Silent staleness when source documents changed but the index did not.",
        resolution:
          "SHA-256 integrity check over the corpus on startup; a mismatch forces a rebuild before serving.",
      },
    ],
    verification:
      "Probe suite of questions with known ground truth — in-scope questions must retrieve the correct source chunks; out-of-scope probes must be refused. Re-run on every ingestion change.",
    outcome:
      "Zero fabricated answers on out-of-scope probes: the assistant either answers with citations from the corpus or states that the evidence is not there.",
    lessons: [
      "The quality of a RAG system is determined at the retrieval gate, not at the model.",
      "Reproducibility of the index is a maintenance requirement, not a nicety.",
    ],
    roadmap: [
      "Hybrid lexical + semantic retrieval to improve short, exact-keyword queries.",
      "Cross-encoder re-ranking of retrieved chunks before prompt assembly.",
    ],
  },

  "fairflow-platforms": {
    name: "Fairflow Production Platforms",
    tag: "Enterprise software (NDA) — TypeScript, Python, PostgreSQL, Docker, GitHub Actions",
    problem:
      "Production document workflows where invalid data and irregular deploys carry real cost. The engineering mandate: validation-first services, reproducible environments, and deployments that cannot drift between machines.",
    requirements: [
      "Every API boundary validates its input before business logic executes.",
      "Environments are byte-reproducible: pinned lockfiles, no floating dependencies.",
      "Every change passes automated gates before merge and before deploy.",
      "Structured telemetry on every workflow decision for auditability.",
    ],
    architecture:
      "Contract-first services behind a defensive validation boundary, shipped through a CI pipeline whose gates are allowed to be slow but never optional. Details are public-safe generalisations; client specifics remain under NDA.",
    ascii: `+----------------+   +------------------+   +-------------------+
| Developer      |-->| CI gates         |-->| Container build   |
| commit         |   | lint+types+tests |   | (pinned deps)     |
+----------------+   +------------------+   +---------+---------+
                                                     |
+----------------+   +------------------+   +--------v---------+
| Telemetry +    |<--| Staging soak     |<--| Deploy pipeline   |
| alerting       |   | + smoke checks   |   |                   |
+----------------+   +------------------+   +-------------------+`,
    mermaid: `flowchart LR
  A[Commit] --> B{CI gates<br/>lint / typecheck / tests}
  B -->|fail| A
  B -->|pass| C[Reproducible container build]
  C --> D[Staging + smoke checks]
  D --> E[Production]
  E --> F[Structured telemetry<br/>+ alerting]
  F --> A`,
    mermaidCaption: "Fig 1. Delivery loop. Gates are mandatory by construction — a failing check cannot reach staging.",
    tradeoffs: [
      {
        decision: "Mandatory CI gates on every merge",
        cost: "Merge latency measured in minutes",
        why: "The alternative — debugging a broken production deploy — is measured in hours and trust.",
      },
      {
        decision: "Validation-first API boundaries",
        cost: "Duplicate-feeling schemas at the edge",
        why: "Invalid input is rejected before it can touch business logic or storage; every acceptance is provable.",
      },
    ],
    implementation: [
      "Contract-first endpoint definitions with runtime schema validation at the boundary.",
      "Lockfile-pinned builds (npm / Poetry) making CI, staging and production bytecode-identical.",
      "Containerised services with health probes wired to alerting channels.",
      "Structured, queryable logs on every validation decision for downstream audit.",
    ],
    challenges: [
      {
        issue: "Deployment drift between developer machines and production.",
        resolution:
          "Removed the variable entirely: only container images built by CI from pinned lockfiles are deployable.",
      },
    ],
    verification:
      "Regression suites at the service boundary, smoke checks after every staging deploy, and staged rollouts with alerting on validation failure rates.",
    outcome:
      "Production releases with reproducible builds and zero unresolved build discrepancies between environments.",
    lessons: [
      "Reproducibility is a feature you build once and benefit from on every deploy.",
      "Telemetry you can query is worth more than logs you can read.",
    ],
    roadmap: [
      "Tighter autoscaling policies driven by validation-queue depth.",
      "Progressive delivery with automated rollback triggers.",
    ],
  },

  myadvisor: {
    name: "MyAdvisor",
    tag: "Full-stack application — Java, Spring Boot, PostgreSQL, Thymeleaf, Docker",
    problem:
      "Tutor allocation at UCT's Science Learning Centre ran on spreadsheets and email. Double-bookings and administrative overhead were structural, not incidental — the process itself could not enforce that a tutor exists in one place at one time.",
    requirements: [
      "Three roles with distinct capabilities: administrator, tutor, student.",
      "A booking exists only if it violates no constraint — enforced by the system, not the users.",
      "Bulk administrative imports without manual data entry.",
      "Every scheduling decision auditable after the fact.",
    ],
    architecture:
      "Classic MVC over a relational schema where the invariants live in the database. The scheduling routine scores candidate allocations against tutor load and availability; the schema makes invalid bookings unrepresentable regardless of what application code does.",
    ascii: `+----------------+   +------------------+   +-------------------+
| Web client     |-->| Spring MVC       |-->| Service layer     |
| (Thymeleaf)    |   | controllers      |   | booking rules     |
+----------------+   +------------------+   +---------+---------+
                                                     |
+----------------+   +------------------+   +--------v---------+
| Admin reports  |<--| Scheduling       |<--| PostgreSQL        |
| + audit views  |   | scoring routine  |   | constraints+FKs   |
+----------------+   +------------------+   +-------------------+`,
    mermaid: `flowchart TB
  subgraph Client
    A[Student booking view]
    B[Tutor schedule view]
    C[Admin console]
  end
  A --> D[Spring MVC controllers]
  B --> D
  C --> D
  D --> E[Booking service<br/>conflict + load rules]
  E --> F[(PostgreSQL<br/>unique constraints, FKs, checks)]
  E --> G[Audit log]`,
    mermaidCaption: "Fig 1. Layered design. Correctness is anchored in the schema; the service layer scores and allocates.",
    tradeoffs: [
      {
        decision: "Constraint enforcement in the database, duplicated in the service layer",
        cost: "Two places to maintain each invariant",
        why: "Database constraints are the last line of defence; service-layer checks give users immediate, readable errors.",
      },
      {
        decision: "Server-rendered views (Thymeleaf) instead of a SPA",
        cost: "Less interactive UI",
        why: "An administrative tool changes slowly and must be maintainable by whoever owns it next; server rendering removes an entire build toolchain.",
      },
    ],
    implementation: [
      "Relational schema with unique constraints over (tutor, slot) and foreign keys from bookings to both parties.",
      "Scheduling routine scoring candidate allocations on tutor load balance and declared availability.",
      "RBAC at the controller layer with three capability profiles.",
      "CSV import path for bulk administrative data with per-row validation reports.",
    ],
    challenges: [
      {
        issue: "Race between concurrent bookings for the same tutor slot.",
        resolution:
          "The unique constraint owns correctness; the service layer catches the violation and returns a readable conflict error instead of a 500.",
      },
    ],
    verification:
      "Integration tests over the booking state machine: every invalid transition (double-book, role violation, past-dated slot) is asserted to be rejected. The scheduling efficiency metric was audited by comparing administrator logs of manual scheduling cycles from the preceding semester against MyAdvisor's automated throughput logs.",
    outcome:
      "Reduced the average time required to resolve tutor scheduling conflicts by approximately 35% compared with the previous manual allocation process, with double-bookings eliminated structurally by relational constraints.",
    lessons: [
      "Put invariants where they cannot be bypassed — in the schema.",
      "Scheduling is a constraint problem before it is a UI problem.",
    ],
    roadmap: [
      "Automated notification paths for booking confirmations and changes.",
      "Optimisation pass on the scoring routine for multi-constraint terms.",
    ],
  },

  "fashionmnist-classifier": {
    name: "FashionMNIST Neural Network",
    tag: "Machine learning — Python, PyTorch, NumPy, Matplotlib",
    repository: "https://github.com/MatomeMb/FashionMNIST-Classifier",
    problem:
      "Train a clothing-image classifier whose results are defensible: reproducible by anyone who reruns the pipeline, honestly evaluated on data the model never saw, and auditable at the level of individual training decisions.",
    requirements: [
      "Locked random seeds and deterministic configuration.",
      "Strict train / validation / test separation — the test set is touched once.",
      "Structured metric logging per epoch, exportable as JSON.",
      "Regularisation tuned against validation accuracy, not test accuracy.",
    ],
    architecture:
      "A compact CNN — two convolutional blocks with dropout, then a fully-connected head — trained with Adam and CrossEntropyLoss under a StepLR schedule. The pipeline around the model (seed control, metric emission, config versioning) is the part that makes its 89.33% test accuracy meaningful.",
    ascii: `+----------------+   +------------------+   +-------------------+
| FashionMNIST   |-->| Conv block x2    |-->| FC head +         |
| 28x28 tensors  |   | + dropout 0.25   |   | softmax (10 way)  |
+----------------+   +------------------+   +---------+---------+
                                                     |
+----------------+   +------------------+   +--------v---------+
| JSON metrics   |<--| Eval harness     |<--| Adam + StepLR     |
| artefact       |   | (held-out test)  |   | training loop     |
+----------------+   +------------------+   +-------------------+`,
    mermaid: `flowchart LR
  A[FashionMNIST tensors] --> B[Conv block ×2<br/>dropout 0.25]
  B --> C[FC head + softmax]
  C --> D[Adam + StepLR<br/>training loop]
  D --> E[Held-out evaluation]
  E --> F[JSON metrics artefact]`,
    mermaidCaption: "Fig 1. The model is small on purpose; the evaluation discipline around it is the deliverable.",
    tradeoffs: [
      {
        decision: "Batch size 64 rather than 32",
        cost: "Noisier gradient estimates per step",
        why: "Stable GPU utilisation and faster convergence to an equivalent validation accuracy.",
      },
      {
        decision: "StepLR decay (×0.1 every 5 epochs) instead of a flat rate",
        cost: "One more hyperparameter to justify",
        why: "Early epochs make coarse progress at a high rate; decay secures convergence without overshooting minima late in training.",
      },
    ],
    implementation: [
      "Custom nn.Module: Conv2d → ReLU → MaxPool, twice, with 0.25 dropout before the head.",
      "Adam optimiser, CrossEntropyLoss, StepLR schedule.",
      "Global seed initialisation across Python, NumPy and PyTorch.",
      "Per-epoch loss and accuracy written to a versioned JSON metrics file.",
    ],
    challenges: [
      {
        issue: "Validation accuracy plateauing below training accuracy (overfitting).",
        resolution:
          "0.25 dropout and L2 weight decay; the gap closed enough to trust the generalisation estimate.",
      },
    ],
    verification:
      "Single, final evaluation on the untouched test set after all tuning decisions were frozen. 89.33% test accuracy, reproducible from the committed config.",
    outcome: "89.33% test-set accuracy under a fully reproducible pipeline.",
    lessons: [
      "A number you cannot reproduce is not a result.",
      "Regularisation decisions belong to the validation set; the test set is read-only.",
    ],
    roadmap: [
      "Transfer-learning baseline (MobileNet) to quantify the headroom over the compact CNN.",
      "ONNX export for portable inference.",
    ],
  },

  "p2p-network": {
    name: "Peer-to-Peer Network",
    tag: "Distributed systems",
    problem:
      "Build file transfer between peers with no central server. The interesting part was never moving bytes — it was the distributed-systems reality that any peer can vanish mid-transfer and the data must still arrive intact.",
    requirements: [
      "Peer discovery without a central coordinator.",
      "Chunked transfer with integrity verification per chunk.",
      "Tolerant of peers joining and leaving mid-transfer.",
      "Concurrent transfers without corrupting shared state.",
    ],
    architecture:
      "Every node is simultaneously client and server over TCP sockets. Files are split into fixed-size chunks, each SHA-256 hashed; receivers reassemble and verify before acknowledging. Peer membership spreads gossip-style rather than through any authoritative registry.",
    ascii: `+----------------+        +------------------+
| Peer A         |<------>| Peer B           |
| client+server  |  TCP   | client+server    |
+-------+--------+        +---------+--------+
        | chunked SHA-256 transfer |
        v                          v
+-------+--------------------------+--------+
| Reassembly + per-chunk verification      |
+------------------------------------------+`,
    mermaid: `sequenceDiagram
  participant A as Peer A
  participant B as Peer B
  A->>B: Gossip - peer list exchange
  A->>B: File manifest (name, chunks, hashes)
  loop per chunk
    A->>B: chunk payload
    B->>B: SHA-256 verify
    B-->>A: ack / reject
  end
  B->>B: reassemble + final verify`,
    mermaidCaption: "Fig 1. Transfer sequence with per-chunk integrity checks — a corrupt chunk is re-requested, not propagated.",
    tradeoffs: [
      {
        decision: "TCP per chunk instead of a custom UDP transport",
        cost: "Throughput below what a tuned UDP design could reach",
        why: "TCP removes ordering and loss handling from the correctness surface — the right trade for a correctness-first academic build.",
      },
      {
        decision: "Per-chunk hashing at transfer granularity",
        cost: "Hash computation on every chunk",
        why: "Corruption is isolated to a single re-request instead of invalidating the whole file.",
      },
    ],
    implementation: [
      "Dual-role node: a listening server thread per peer plus client connections on demand.",
      "File manifests exchanged before transfer, listing chunk hashes out of band.",
      "SHA-256 verification per chunk with re-request on mismatch.",
      "Guarded shared state for concurrent inbound transfers.",
    ],
    challenges: [
      {
        issue: "A peer departing mid-transfer leaving partial state.",
        resolution:
          "Manifest-first design: the receiver knows exactly what is missing and can resume against any peer holding the remaining chunks.",
      },
    ],
    verification:
      "Injected-failure tests: corrupted chunks, dropped connections and concurrent transfers, asserting integrity of every reassembled file.",
    outcome:
      "Correct, verifiable multi-peer file transfer with graceful degradation under peer churn.",
    lessons: [
      "In distributed systems, define correctness first — speed optimisations are cheap compared to consistency bugs.",
      "Idempotent, resumable units of work make partial failure boring.",
    ],
    roadmap: [
      "Parallel chunk retrieval across multiple peers (swarm behaviour).",
      "NAT traversal design notes for non-LAN deployment.",
    ],
  },

  "stm32-embedded": {
    name: "STM32 Embedded Systems",
    tag: "Embedded / low-level",
    repository: "https://github.com/MatomeMb/Connected-Components-Image-Processor",
    problem:
      "Computer-engineering practicals on STM32 boards: kilobytes of RAM, no operating system, and peripherals that do exactly what the registers say — nothing more. Bugs are not exceptions; they are silent wrong voltages and missed timing windows.",
    requirements: [
      "Interrupt-driven I/O across timers, UART and GPIO.",
      "Deterministic memory usage — no dynamic allocation in hot paths.",
      "Timing behaviour that can be reasoned about without a debugger.",
    ],
    architecture:
      "Bare-metal C with register-level peripheral setup. Interrupt service routines do the minimum — capture the event, set a flag — and the main loop performs the work. Control flow stays linear enough that timing can be verified by reading the code.",
    ascii: `+----------------+   +------------------+   +-------------------+
| Peripherals    |-->| ISRs: capture    |-->| Flag queue        |
| timer/UART/GPIO|   | event, set flag  |   | (volatile state)  |
+----------------+   +------------------+   +---------+---------+
                                                     |
+----------------+   +------------------+   +--------v---------+
| Sensor/serial  |<--| Main loop:       |<--| Static buffers    |
| output         |   | do the work      |   | (fixed allocation)|
+----------------+   +------------------+   +-------------------+`,
    mermaid: `flowchart LR
  P[Peripherals<br/>timer / UART / GPIO] --> I[ISRs<br/>capture + flag]
  I --> Q[Volatile flag state]
  Q --> M[Main loop<br/>deferred work]
  S[Static buffers] --> M
  M --> O[Serial + GPIO output]`,
    mermaidCaption: "Fig 1. ISR-to-mainloop hand-off. Interrupts stay short; work is deferred to linear control flow.",
    tradeoffs: [
      {
        decision: "Deferred work in a main loop instead of fully event-driven ISRs",
        cost: "Idle cycles polling flags",
        why: "Long ISRs make timing unanalysable and debugging painful. A linear main loop can be timed by inspection.",
      },
      {
        decision: "Static buffers instead of heap allocation",
        cost: "Compile-time capacity limits",
        why: "No fragmentation, no allocation failure at runtime, and memory usage auditable from the map file.",
      },
    ],
    implementation: [
      "Register-level configuration of timers, UART and GPIO (no HAL magic in the timing-critical paths).",
      "Volatile-qualified shared state between ISRs and the main loop.",
      "Fixed-size ring buffers for UART traffic.",
      "Related low-level work: connected-component image labelling optimised for memory footprint in standard C++ (linked repository).",
    ],
    challenges: [
      {
        issue: "Race conditions between ISR flag updates and main-loop reads.",
        resolution:
          "Single-writer discipline: ISRs write flags, the main loop consumes and clears them; nothing writes from both sides.",
      },
    ],
    verification:
      "Timing checks against peripherals measured on-board; UART loopback tests verifying buffer behaviour under sustained load.",
    outcome:
      "Deterministic interrupt-driven firmware across the practical briefs, with timing behaviour verifiable by code inspection.",
    lessons: [
      "On bare metal, the code you can reason about beats the code that is clever.",
      "Volatile and single-writer rules are a complete concurrency strategy at this scale.",
    ],
    roadmap: [
      "Move hot paths from polling to DMA where the peripheral supports it.",
      "Power-profiling pass for sleep-state design.",
    ],
  },
};

/* Backwards-compatible slugs from the previous version of the site. */
const aliases: Record<string, string> = {
  "scheduling-systems": "myadvisor",
  "embedded-navigation": "stm32-embedded",
  "confidential-ai-build": "fairflow-platforms",
  "fairflow": "fairflow",
};

function SectionHeading({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h2 className="flex items-baseline gap-3 text-lg font-bold tracking-tight text-gray-900">
      <span className="font-mono text-xs font-medium text-gray-400">{n}</span>
      {children}
    </h2>
  );
}

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const resolvedId = aliases[id ?? ""] ?? id ?? "";
  const study = studies[resolvedId];

  if (!study) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Case study not found</h1>
        <Link to="/projects" className="text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600 hover:underline">
          &larr; All projects
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-12 py-14">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft size={14} aria-hidden="true" /> All projects
      </Link>

      <header className="space-y-3 border-b border-gray-200 pb-8">
        <p className="font-mono text-xs text-gray-400">{study.tag}</p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{study.name}</h1>
        {study.repository && (
          <a
            href={study.repository}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-sm text-gray-500 hover:text-blue-600"
          >
            {study.repository.replace("https://github.com/", "")}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        )}
      </header>

      <section aria-labelledby="s-problem" className="space-y-3">
        <SectionHeading n="01">Problem</SectionHeading>
        <p className="leading-relaxed text-gray-600">{study.problem}</p>
      </section>

      <section aria-labelledby="s-requirements" className="space-y-3">
        <SectionHeading n="02">Requirements</SectionHeading>
        <ul className="list-disc space-y-1.5 pl-5 leading-relaxed text-gray-600 marker:text-gray-300">
          {study.requirements.map((req) => (
            <li key={req}>{req}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="s-architecture" className="space-y-4">
        <SectionHeading n="03">Architecture</SectionHeading>
        <p className="leading-relaxed text-gray-600">{study.architecture}</p>
        <MermaidDiagram chart={study.mermaid} caption={study.mermaidCaption} />
        <details className="group">
          <summary className="cursor-pointer font-mono text-xs text-gray-500 hover:text-blue-600">
            ASCII topology (text-only)
          </summary>
          <pre className="ascii-diagram mt-2">{study.ascii}</pre>
        </details>
        {study.deepDiveUrl && (
          <p className="text-sm leading-relaxed text-gray-500">
            Sequence diagrams, sub-system notes and the decision log:{" "}
            <Link to={study.deepDiveUrl} className="font-semibold text-gray-900 transition-colors hover:text-blue-600 hover:underline">
              Architecture deep dive &rarr;
            </Link>
          </p>
        )}
      </section>

      <section aria-labelledby="s-tradeoffs" className="space-y-3">
        <SectionHeading n="04">Trade-offs</SectionHeading>
        <div className="space-y-3">
          {study.tradeoffs.map((t) => (
            <div key={t.decision} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-900">{t.decision}</p>
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Cost:</span> {t.cost}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Why it wins:</span> {t.why}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="s-implementation" className="space-y-3">
        <SectionHeading n="05">Implementation</SectionHeading>
        <ol className="list-decimal space-y-1.5 pl-5 leading-relaxed text-gray-600 marker:text-gray-300">
          {study.implementation.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="s-challenges" className="space-y-3">
        <SectionHeading n="06">Challenges &amp; mitigations</SectionHeading>
        <div className="space-y-3">
          {study.challenges.map((c) => (
            <div key={c.issue} className="border-l-2 border-gray-200 pl-4">
              <p className="text-sm font-semibold text-gray-900">{c.issue}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{c.resolution}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="s-verification" className="space-y-3">
        <SectionHeading n="07">Verification</SectionHeading>
        <p className="leading-relaxed text-gray-600">{study.verification}</p>
      </section>

      <section aria-labelledby="s-outcome" className="space-y-3">
        <SectionHeading n="08">Outcome</SectionHeading>
        <p className="rounded-lg border border-gray-200 bg-gray-50 p-4 font-medium leading-relaxed text-gray-900">
          {study.outcome}
        </p>
      </section>

      <section aria-labelledby="s-lessons" className="space-y-3">
        <SectionHeading n="09">Lessons</SectionHeading>
        <ul className="list-disc space-y-1.5 pl-5 leading-relaxed text-gray-600 marker:text-gray-300">
          {study.lessons.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="s-roadmap" className="space-y-3">
        <SectionHeading n="10">Roadmap</SectionHeading>
        <ul className="list-disc space-y-1.5 pl-5 leading-relaxed text-gray-600 marker:text-gray-300">
          {study.roadmap.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      {resolvedId === "fairflow-platforms" && (
        <p className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-500">
          Confidentiality: this write-up describes engineering patterns only. Client data, endpoints,
          schemas and metrics are omitted by design and discussed privately in interview settings.
        </p>
      )}

      <nav className="border-t border-gray-200 pt-8" aria-label="Case study navigation">
        <Link to="/projects" className="text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600 hover:underline">
          &larr; Back to all projects
        </Link>
      </nav>
    </div>
  );
}
