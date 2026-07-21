import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import MermaidDiagram from "../components/MermaidDiagram.tsx";

/*
 * Fairflow architecture deep dive: the system behind fairflow.co.za as it
 * actually runs. Companion to the /project/fairflow case study — same
 * diagrams-as-text approach, rendered client-side by the lazy Mermaid chunk.
 */

function SectionHeading({ n, id, children }: { n: string; id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="flex items-baseline gap-3 text-lg font-bold tracking-tight text-gray-900">
      <span className="font-mono text-xs font-medium text-gray-400">{n}</span>
      {children}
    </h2>
  );
}

const subsystems = [
  {
    name: "Authentication — three models, one boundary",
    summary:
      "Merchants get stateless RS256 JWTs, staff get Supabase sessions, and privileged operations go through a server-only proxy.",
    points: [
      "Merchant access tokens are RS256 JWTs with a 15-minute TTL, verified statelessly against the JWKS document shadow-index publishes at /jwks.json. Key rotation needs no session store — the portal refetches JWKS on a 401 and retries.",
      "Refresh tokens are stored hashed in Supabase. Revocation is deleting the row: the access token dies within 15 minutes and no blacklist is ever consulted on the hot path.",
      "Staff and admin sign in with Supabase Auth, which carries MFA, session management and RLS integration for free. Merchant and staff credentials never mix — a merchant JWT cannot touch a staff route and vice versa.",
      "ADMIN_SECRET is a root credential and exists only inside the admin proxy. The browser never sees it, even as a build-time env var.",
    ],
  },
  {
    name: "Payments — Paystack with exactly-once processing",
    summary:
      "Checkout sessions are created server-side; webhooks are HMAC-verified and deduplicated before any state changes.",
    points: [
      "shadow-index initializes the Paystack transaction and returns an authorization URL — prices and product integrity are enforced server-side, never from browser-supplied totals.",
      "The webhook route uses a custom Hono middleware that captures the raw request body before any parser touches it, then verifies the x-paystack-signature header as HMAC-SHA512. Serverless body parsing was the original failure mode; the middleware is scoped to the webhook route only.",
      "Every event ID is inserted into webhook_events before processing. A duplicate delivery is a unique-constraint violation, so the second attempt is a no-op — exactly-once processing, not just delivery.",
      "Fulfilment is confirmed by polling order status, which keeps the webhook handler well inside the 60-second serverless budget.",
    ],
  },
  {
    name: "Storage — local JSON or R2 behind one interface",
    summary:
      "A single Storage interface with two adapters picked on environment, so a contributor's first run needs zero cloud accounts.",
    points: [
      "The interface covers put, get, delete and list against content-addressed keys. Artifacts are immutable by construction — a changed artifact is a new key.",
      "LocalStorageAdapter writes JSON under ./data during development. R2StorageAdapter speaks the S3 API against Cloudflare R2 in production. The swap is one environment variable.",
      "One parity test suite runs against both adapters, so local behaviour cannot silently drift from production behaviour.",
      ".thing artifacts in storage are only ever written after matter-core validation and signing — the storage layer never sees an unsigned payload.",
    ],
  },
  {
    name: "KYC & payouts — state machine, not spaghetti",
    summary:
      "Sumsub events can arrive out of order, so the handler is a pure function over (current state, event) rather than an ordered script.",
    points: [
      "The applicant flow runs in the portal via the Sumsub SDK; applicant creation and SDK token issuance go through shadow-index so API keys stay server-side.",
      "Webhook handling reduces (current_state, event) to next_state. An out-of-order applicantReviewed before applicantPending folds into the same terminal state instead of corrupting it, and idempotency keys absorb redeliveries.",
      "Payout release is gated on kyc_status = approved, enforced in the admin proxy — there is no client-side path to release a payout.",
      "Every state transition lands in audit_log with actor, timestamp and prior state, so the compliance trail is reconstructable after the fact.",
    ],
  },
  {
    name: "matter-core — Rust at the trust boundary",
    summary:
      "A .thing file can come from anywhere, so the schema and the signature are enforced in memory-safe Rust, not hopeful TypeScript.",
    points: [
      "serde and schemars derive the JSON Schema from the same Rust types that validate it — the schema, the validator and the TypeScript definitions cannot disagree, because they are generated from one source.",
      "Valid artifacts are signed with ed25519-dalek detached signatures. Any Fairflow-compatible surface can verify provenance without trusting the transport.",
      "napi-rs compiles the crate to a Node addon with generated TypeScript definitions; prebuilt binaries for linux-x64, macos-x64, macos-arm64 and win32-x64 mean consumers never install a Rust toolchain.",
      "Public validation vectors in docs/fixtures let third parties test their .thing producers against the same corpus the CI gates use.",
    ],
  },
];

const adrs = [
  {
    id: "ADR-0001",
    title: "Hono on Vercel serverless for the commerce API",
    body: "Near-zero operations, native Node and auto-scaling beat managing containers for a commerce API at this stage. The conceded costs — cold starts and a 60-second execution limit — shape the design: webhooks stay fast and idempotent, and long-running work moves to the client or scheduled jobs.",
  },
  {
    id: "ADR-0002",
    title: "Merchant JWTs, Supabase sessions for staff",
    body: "Merchants are external customers: stateless JWTs scale and revoke by key rotation without buying Supabase seats. Staff are internal: Supabase Auth supplies RLS, MFA and audit logging out of the box. Two auth models are intentionally maintained rather than one model leaking internal concerns to customers.",
  },
  {
    id: "ADR-0003",
    title: "Admin proxy — ADMIN_SECRET never reaches the browser",
    body: "The admin secret authorises cross-merchant operations, so exposing it to any browser context is a supply-chain risk. A thin Hono route validates the caller's Supabase session and RBAC role, then forwards the request with the secret attached server-side. The extra hop buys a credential boundary and a complete audit_log trail.",
  },
  {
    id: "ADR-0004",
    title: "Dual storage — local JSON for dev, R2 for production",
    body: "Open-source contributors should run the full stack with zero cloud configuration, while production needs durable object storage. One Storage interface with LocalStorageAdapter and R2StorageAdapter, selected on environment, with a parity suite keeping both honest. The abstraction layer is the price; the contributor experience is the payoff.",
  },
  {
    id: "ADR-0005",
    title: "matter-core in Rust via napi-rs",
    body: "Schema validation and artifact signing are the trust boundary of the whole system: a .thing file is untrusted input from any source. Rust gives memory safety and a single source of truth for the schema; napi-rs keeps the TypeScript API ergonomic. The Rust toolchain in CI is accepted complexity in exchange for correctness that travels with the artifact.",
  },
];

export default function FairflowArchitecture() {
  return (
    <div className="mx-auto max-w-3xl space-y-14 py-14">
      <Link
        to="/architecture"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600"
      >
        <ArrowLeft size={14} aria-hidden="true" /> Architecture
      </Link>

      <header className="space-y-3 border-b border-gray-200 pb-8">
        <p className="font-mono text-xs text-gray-400">
          System deep dive — fairflow.co.za &middot; companion to the{" "}
          <Link to="/project/fairflow" className="text-blue-600 hover:underline">
            case study
          </Link>
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Fairflow architecture
        </h1>
        <p className="leading-relaxed text-gray-600">
          How the open-source commerce stack actually fits together: one npm-workspaces monorepo,
          three deployables (portal, API, Rust core), two data stores and two external providers.
          Every diagram below is text rendered in your browser — the same definitions that live in
          the repository&rsquo;s <code className="rounded bg-gray-100 px-1 font-mono text-xs">architecture/</code>{" "}
          docs and ADR log.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-1">
          <a
            href="https://fairflow.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-sm text-gray-500 hover:text-blue-600"
          >
            fairflow.co.za
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <a
            href="https://github.com/MatomeMb/.Things-That-Matter"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-sm text-gray-500 hover:text-blue-600"
          >
            MatomeMb/.Things-That-Matter
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </header>

      {/* 01 — System context */}
      <section aria-labelledby="ffd-context" className="space-y-4">
        <SectionHeading n="01" id="ffd-context">System context</SectionHeading>
        <p className="leading-relaxed text-gray-600">
          auth-portal is the only component a browser ever talks to. shadow-index is the single API
          surface — checkout, product CRUD, webhooks and the admin proxy — and it alone holds
          credentials for Supabase, R2, Paystack and Sumsub. matter-core is invoked in-process by
          the API through its napi-rs binding, so untrusted artifacts are validated and signed
          without a network hop.
        </p>
        <MermaidDiagram
          chart={`flowchart LR
  M[Merchant]
  AD[Admin]

  subgraph Portal["auth-portal — React 19 + Vite"]
    MD[Merchant dashboard]
    AC[Admin console]
  end

  subgraph API["shadow-index — Hono on Vercel"]
    CO["/checkout/sessions"]
    WH["/webhooks/*"]
    PR["/products CRUD"]
    AP["/admin/* — proxy"]
    JW["/jwks.json · /openapi.json"]
  end

  subgraph Core["matter-core — Rust via napi-rs"]
    VAL[".thing validation"]
    SIG["Ed25519 signing"]
  end

  subgraph Data["Data layer"]
    SB[("Supabase Auth + Postgres<br/>RLS · webhook_events · audit_log")]
    R2[("Cloudflare R2 / local JSON<br/>artifact storage")]
  end

  subgraph Ext["External services"]
    PS[Paystack]
    SS[Sumsub]
  end

  M --> Portal
  AD --> Portal
  Portal -->|"HTTPS + merchant JWT / staff session"| API
  API --> Core
  AP -->|"service role — bypasses RLS, writes audit_log"| SB
  API --> SB
  API --> R2
  CO -->|"initialize transaction"| PS
  PS -->|"charge.success + HMAC"| WH
  SS -->|"applicant events"| WH`}
          caption="Fig 1. System context. The portal is the browser's only entry point; shadow-index owns every credential; the admin proxy is the sole path that elevates privilege."
        />
      </section>

      {/* 02 — Request paths */}
      <section aria-labelledby="ffd-paths" className="space-y-6">
        <SectionHeading n="02" id="ffd-paths">Request paths</SectionHeading>
        <p className="leading-relaxed text-gray-600">
          Four sequences carry almost all of the system&rsquo;s risk: money in, artifacts through,
          identity verified, and privilege elevated. Each is shown exactly as implemented —
          including the failure branches.
        </p>

        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Checkout and webhook — exactly-once money movement</h3>
          <p className="text-sm leading-relaxed text-gray-600">
            The order exists before the customer pays, so the webhook only ever transitions state —
            it never creates it. Raw-body capture and HMAC verification run before any JSON parsing,
            and the event ID is claimed in webhook_events before processing, which turns Paystack&rsquo;s
            at-least-once delivery into exactly-once processing.
          </p>
          <MermaidDiagram
            chart={`sequenceDiagram
  autonumber
  actor M as Merchant
  participant P as auth-portal
  participant API as shadow-index
  participant DB as Supabase
  participant PS as Paystack

  M->>P: Start checkout
  P->>API: POST /checkout/sessions
  API->>API: Zod-validate payload
  API->>DB: INSERT order status pending
  API->>PS: Initialize transaction
  PS-->>API: authorization_url + reference
  API-->>P: 201 checkout_url
  P-->>M: Redirect to Paystack
  M->>PS: Pay with card or EFT
  PS->>API: POST /webhooks/paystack
  Note over API: Raw body captured before parsing,<br/>HMAC-SHA512 verified against signature header
  API->>DB: INSERT webhook_events event_id
  alt Duplicate delivery
    DB-->>API: unique-constraint violation
    API-->>PS: 200 OK — no-op
  else First delivery
    API->>DB: UPDATE order status paid
    API-->>PS: 200 OK
    P->>API: Poll order status
    API-->>P: paid — fulfilment confirmed
  end`}
            caption="Fig 2. Checkout. The idempotency claim is about processing, not delivery — duplicates arrive and are harmlessly absorbed."
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Artifact creation — validate, sign, then store</h3>
          <p className="text-sm leading-relaxed text-gray-600">
            A .thing artifact only exists once matter-core has approved it. Validation failure
            returns the full error vector to the form; success returns a signed payload that is
            stored under a content-addressed key, making production artifacts immutable.
          </p>
          <MermaidDiagram
            chart={`sequenceDiagram
  autonumber
  actor M as Merchant
  participant P as auth-portal
  participant API as shadow-index
  participant R as matter-core — Rust
  participant S as R2 / local storage
  participant DB as Supabase

  M->>P: Create product
  P->>API: POST /products
  API->>API: Zod-validate request
  API->>R: Validate .thing JSON
  R->>R: Schema check via serde + generated JSON Schema
  alt Invalid artifact
    R-->>API: Err field errors
    API-->>P: 422 + error vector
    P-->>M: Inline field errors
  else Valid
    R->>R: Sign payload with ed25519-dalek
    R-->>API: Ok signed .thing
    API->>S: PUT artifact at content-addressed key
    S-->>API: stored
    API->>DB: INSERT product with artifact_url + signature
    API-->>P: 201 Created
    P-->>M: Product appears in dashboard
  end`}
            caption="Fig 3. Artifact creation. Storage never sees an unsigned payload — validate and sign are upstream of every write."
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">KYC orchestration — order-independent by design</h3>
          <p className="text-sm leading-relaxed text-gray-600">
            Sumsub makes no ordering guarantees, so the webhook handler is a pure state machine:
            (current_state, event) folds to next_state, and out-of-order delivery converges on the
            same result as in-order delivery. Payout release is gated on the terminal approved
            state and can only happen through the admin proxy.
          </p>
          <MermaidDiagram
            chart={`sequenceDiagram
  autonumber
  actor AD as Admin
  participant P as auth-portal
  participant API as shadow-index
  participant SS as Sumsub
  participant DB as Supabase

  AD->>P: Open merchant KYC review
  P->>API: POST /kyc/applicants
  API->>SS: Create applicant + SDK token
  SS-->>P: Verification flow runs in portal
  Note over SS,API: Events may arrive out of order
  SS->>API: webhook applicantReviewed
  SS->>API: webhook applicantPending (delayed)
  API->>API: Fold events through state machine + idempotency keys
  API->>DB: UPDATE merchant kyc_status approved
  AD->>P: Approve payout release
  P->>API: POST /admin/payouts/release
  API->>DB: Verify RBAC + kyc_status, INSERT audit_log
  API-->>P: 200 OK — payout released
  API->>DB: audit_log entry — actor, action, timestamp`}
            caption="Fig 4. KYC. Order-independence is a correctness property: the state machine must not know which event arrived first."
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900">Admin action — privilege without exposure</h3>
          <p className="text-sm leading-relaxed text-gray-600">
            Cross-merchant operations need the service role, which bypasses RLS by definition. That
            power lives in exactly one place: the admin proxy route, which re-verifies identity and
            role on every call and records everything it does.
          </p>
          <MermaidDiagram
            chart={`sequenceDiagram
  autonumber
  actor AD as Admin
  participant P as auth-portal
  participant AP as admin proxy — Hono route
  participant DB as Supabase

  AD->>P: Admin console action
  P->>AP: Request + Supabase session
  AP->>AP: Verify session + RBAC role
  Note over AP: ADMIN_SECRET exists here only —<br/>never in browser or build output
  alt Session invalid or role missing
    AP-->>P: 403 Forbidden
  else Authorised
    AP->>DB: Execute with service role — RLS bypassed intentionally
    AP->>DB: INSERT audit_log — actor, action, payload, timestamp
    AP-->>P: 200 OK + result
  end`}
            caption="Fig 5. Admin proxy. RLS is bypassed deliberately and audibly — the audit trail is part of the design, not an afterthought."
          />
        </div>
      </section>

      {/* 03 — Deployment view */}
      <section aria-labelledby="ffd-deploy" className="space-y-4">
        <SectionHeading n="03" id="ffd-deploy">Deployment view</SectionHeading>
        <p className="leading-relaxed text-gray-600">
          Merge to main is the only deployment trigger. GitHub Actions runs the full gate — lint,
          typecheck, Vitest, Playwright, Docker build, native Rust builds and dependency audits —
          then publishes the portal and API to Vercel and matter-core binaries to npm. Rollback is a
          git revert followed by the same pipeline; database migrations are checked into the repo and
          applied through Supabase, so schema and code move together.
        </p>
        <MermaidDiagram
          chart={`flowchart TB
  subgraph GH["GitHub"]
    REPO["Monorepo — main branch"]
    CI["Actions — lint · typecheck · Vitest · Playwright · Docker · cargo · audits"]
  end

  subgraph VC["Vercel"]
    PORT["auth-portal — static SPA"]
    FN["shadow-index — serverless functions"]
  end

  subgraph CL["Managed services"]
    PG[("Supabase — Postgres + Auth")]
    R2[("Cloudflare R2 — artifact bucket")]
  end

  NPM["npm registry — matter-core prebuilt binaries"]

  REPO --> CI
  CI -->|"deploy portal"| PORT
  CI -->|"deploy API"| FN
  CI -->|"publish on release"| NPM
  PORT -->|"HTTPS"| FN
  FN --> PG
  FN --> R2`}
          caption="Fig 6. Deployment. One pipeline, three publish targets: Vercel for the apps, npm for the Rust addon, Supabase for the schema."
        />
      </section>

      {/* 04 — Sub-system notes */}
      <section aria-labelledby="ffd-subsystems" className="space-y-3">
        <SectionHeading n="04" id="ffd-subsystems">Sub-system notes</SectionHeading>
        <p className="text-sm leading-relaxed text-gray-500">
          The guarantees each sub-system is actually responsible for — expandable.
        </p>
        <div className="space-y-3 pt-1">
          {subsystems.map((s) => (
            <details
              key={s.name}
              className="group rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                  <span className="mt-0.5 block text-sm text-gray-500">{s.summary}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 font-mono text-xs text-gray-400 transition-transform group-open:rotate-90"
                >
                  &rarr;
                </span>
              </summary>
              <ul className="mt-3 list-disc space-y-1.5 border-t border-gray-200 pt-3 pl-5 text-sm leading-relaxed text-gray-600 marker:text-gray-300">
                {s.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      {/* 05 — Decision log */}
      <section aria-labelledby="ffd-adrs" className="space-y-4">
        <SectionHeading n="05" id="ffd-adrs">Decision log</SectionHeading>
        <p className="leading-relaxed text-gray-600">
          Five ADRs carry the architecture. They are reproduced here in the order they were
          accepted — each one constrains everything written after it.
        </p>
        <ol className="relative space-y-8 border-l border-gray-200 pl-6">
          {adrs.map((a) => (
            <li key={a.id} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[30px] h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-white"
              />
              <p className="font-mono text-xs text-gray-400">{a.id} &middot; Accepted</p>
              <h3 className="mt-0.5 text-sm font-semibold text-gray-900">{a.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{a.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Footer nav */}
      <section className="space-y-3 border-t border-gray-200 pt-8">
        <p className="text-sm leading-relaxed text-gray-500">
          Read the business case and trade-offs in the{" "}
          <Link to="/project/fairflow" className="text-blue-600 hover:underline">
            Fairflow case study
          </Link>
          , browse the other system notes on the{" "}
          <Link to="/architecture" className="text-blue-600 hover:underline">
            architecture index
          </Link>
          , or inspect the source — ADRs, OpenAPI spec and public fixtures included — on{" "}
          <a
            href="https://github.com/MatomeMb/.Things-That-Matter"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </section>
    </div>
  );
}
