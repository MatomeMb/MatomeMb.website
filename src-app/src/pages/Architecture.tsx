import { Link } from "react-router-dom";
import MermaidDiagram from "../components/MermaidDiagram.tsx";

/*
 * Architecture notes: how the systems on this site are actually put together.
 * Diagrams are rendered client-side with Mermaid (lazy-loaded chunk), using
 * the same definitions an engineer could paste into docs or a PR description.
 */
export default function Architecture() {
  return (
    <div className="mx-auto max-w-3xl space-y-14 py-14">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Architecture</h1>
        <p className="leading-relaxed text-gray-600">
          How the systems behind this portfolio are put together — including the site itself.
          Every diagram is defined as text and rendered in your browser; nothing here is a picture
          of a system, it is the system description.
        </p>
      </header>

      {/* This site */}
      <section className="space-y-4" aria-labelledby="a-site">
        <h2 id="a-site" className="text-xl font-bold tracking-tight text-gray-900">
          This website: build and delivery
        </h2>
        <p className="leading-relaxed text-gray-600">
          The site is a React 19 + TypeScript single-page application compiled by Vite. The build
          outputs static assets to the repository root, which GitHub Pages serves directly behind
          the custom domain. There is no server, no backend and no tracking — the delivery model is
          deliberately boring.
        </p>
        <MermaidDiagram
          chart={`flowchart LR
  subgraph Local
    S[src-app source<br/>React 19 + TS + Tailwind v4]
  end
  S --> B[npm run build<br/>Vite compile]
  B --> O[repo root<br/>index.html + assets]
  O --> G[GitHub repo<br/>main branch]
  G --> P[GitHub Pages]
  P --> D[www.matomembowene.co.za]`}
          caption="Fig 1. Source → static build → Pages. No runtime infrastructure to attack or maintain."
        />
        <p className="text-sm leading-relaxed text-gray-500">
          Decisions: hash-based routing so GitHub Pages needs no rewrite rules; route-level code
          splitting so Mermaid never loads on pages without diagrams; Tailwind v4 so the shipped
          CSS contains only the utilities the markup actually uses. Trade-off: deep links carry a
          <code className="rounded bg-gray-100 px-1 font-mono text-xs">#</code> — acceptable for a
          static host with no server-side routing.
        </p>
      </section>

      {/* OCR pipeline */}
      <section className="space-y-4" aria-labelledby="a-ocr">
        <h2 id="a-ocr" className="text-xl font-bold tracking-tight text-gray-900">
          OCR Document Automation: validation gates
        </h2>
        <p className="leading-relaxed text-gray-600">
          The document pipeline treats extraction as untrusted input. Four validation layers —
          format, geometry, cross-field arithmetic, engine confidence — run at the API boundary
          before any write.{" "}
          <Link to="/project/ocr-document-automation" className="text-blue-600 hover:underline">
            Full case study
          </Link>
          .
        </p>
        <MermaidDiagram
          chart={`flowchart TB
  subgraph Extraction
    A[Normalised scan] --> B[OCR fields]
  end
  B --> V1{Format<br/>dates / numerics}
  V1 --> V2{Geometry<br/>field regions}
  V2 --> V3{Arithmetic<br/>lines sum to total}
  V3 --> V4{Confidence<br/>per-field threshold}
  V4 -->|all pass| W[(Ledger write + audit)]
  V1 -.->|any layer fails| R[Reject + manual review]
  V2 -.-> R
  V3 -.-> R
  V4 -.-> R`}
          caption="Fig 2. Layered validation. Each layer catches the class of error the previous one cannot see."
        />
      </section>

      {/* RAG sequence */}
      <section className="space-y-4" aria-labelledby="a-rag">
        <h2 id="a-rag" className="text-xl font-bold tracking-tight text-gray-900">
          RAG Assistant: ingestion and query paths
        </h2>
        <p className="leading-relaxed text-gray-600">
          Two paths share one contract — the FAISS index. Ingestion is deterministic and
          hash-guarded; querying is gated on cosine thresholds with an explicit refusal branch.{" "}
          <Link to="/project/rag-assistant" className="text-blue-600 hover:underline">
            Full case study
          </Link>
          .
        </p>
        <MermaidDiagram
          chart={`flowchart LR
  subgraph Offline ingestion
    C[Corpus files] --> H{SHA-256 changed?}
    H -->|yes| CH[Chunk + embed<br/>pinned MiniLM]
    CH --> IX[(FAISS index<br/>persisted)]
    H -->|no| IX
  end
  subgraph Online query
    Q[User question] --> E[Embed query]
    E --> S[FAISS top-k]
    IX --> S
    S --> G{Cosine threshold}
    G -->|pass| L[Grounded prompt<br/>+ citations]
    G -->|fail| X[Explicit refusal]
  end`}
          caption="Fig 3. Offline ingestion is reproducible; the online path cannot generate without retrieved evidence."
        />
      </section>

      {/* Data model */}
      <section className="space-y-4" aria-labelledby="a-data">
        <h2 id="a-data" className="text-xl font-bold tracking-tight text-gray-900">
          MyAdvisor: data model
        </h2>
        <p className="leading-relaxed text-gray-600">
          Booking correctness is anchored in the schema. The unique constraint on
          (tutor, slot) is the system&rsquo;s last line of defence against double-booking — application
          code can be wrong; the constraint cannot.{" "}
          <Link to="/project/myadvisor" className="text-blue-600 hover:underline">
            Full case study
          </Link>
          .
        </p>
        <MermaidDiagram
          chart={`erDiagram
  STUDENT ||--o{ BOOKING : requests
  TUTOR ||--o{ AVAILABILITY : declares
  TUTOR ||--o{ BOOKING : "is allocated"
  SLOT ||--o{ BOOKING : "occurs in"
  TUTOR ||--o{ SLOT : "unique constraint tutor+slot"
  BOOKING {
    uuid id PK
    uuid tutor_id FK
    uuid student_id FK
    uuid slot_id FK
    string status
    timestamp created_at
  }`}
          caption="Fig 4. Entity relationships. Invariants live in constraints and foreign keys, not in hope."
        />
      </section>

      {/* Delivery of backend work */}
      <section className="space-y-4" aria-labelledby="a-delivery">
        <h2 id="a-delivery" className="text-xl font-bold tracking-tight text-gray-900">
          Production delivery loop (Fairflow, public-safe)
        </h2>
        <p className="leading-relaxed text-gray-600">
          The deployment pattern behind the enterprise work: mandatory gates, reproducible builds,
          staging soak, telemetry back into the next commit.{" "}
          <Link to="/project/fairflow-platforms" className="text-blue-600 hover:underline">
            Full case study
          </Link>
          . For the open-source Fairflow stack itself — sequence diagrams for checkout, artifact
          creation, KYC and admin actions, plus the ADR log — see the{" "}
          <Link to="/architecture/fairflow" className="text-blue-600 hover:underline">
            Fairflow architecture deep dive
          </Link>
          .
        </p>
        <MermaidDiagram
          chart={`flowchart LR
  A[Commit] --> B{CI: lint + typecheck + tests}
  B -->|fail| A
  B -->|pass| C[Reproducible build<br/>pinned lockfiles]
  C --> D[Staging + smoke checks]
  D --> E[Production deploy]
  E --> F[Structured telemetry<br/>+ alert channels]
  F --> A`}
          caption="Fig 5. Delivery loop. Telemetry closes the cycle — production behaviour informs the next change."
        />
      </section>
    </div>
  );
}
