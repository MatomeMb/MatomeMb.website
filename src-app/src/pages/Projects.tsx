import { Link } from "react-router-dom";
import { ArrowUpRight, FolderGit2, ExternalLink } from "lucide-react";

interface ProjectEntry {
  id: string;
  name: string;
  tag: string;
  problem: string;
  requirements: string;
  design: string;
  tradeoffs: string;
  stack: string[];
  repository?: string;
  liveUrl?: string;
  featured?: boolean;
}

/*
 * Every project is presented as a condensed product page — problem, requirement
 * summary, design decision and trade-off — rather than as a decorative card.
 * Full case studies (with diagrams) are linked per project.
 */
const projects: ProjectEntry[] = [
  {
    id: "fairflow",
    name: "Fairflow",
    tag: "Open-source commerce infrastructure",
    problem:
      "South African merchants rely on fragmented tools for operations, payments, KYC and product data. There is no unified, merchant-owned infrastructure — platforms own the data, the checkout and the payout rails. Fairflow exists to change that: a self-hostable, open-source commerce stack with a merchant portal, Paystack checkout, Sumsub KYC/payouts, and portable .thing product artifacts.",
    requirements:
      "Multi-actor auth (merchant JWT, Supabase staff RBAC, admin proxy); Paystack webhook verification with HMAC; dual storage (local JSON dev / Cloudflare R2 prod); portable product artifacts (.thing files) with Rust-backed validation; production-minded OSS docs and CI.",
    design:
      "TypeScript monorepo (npm workspaces) with three apps: auth-portal (React merchant/admin UI), shadow-index (Hono API on Node/Vercel), and matter-core (Rust library for .thing schema validation). Supabase Auth + Postgres for staff/admin; merchant JWTs issued by shadow-index. Admin actions route through a server-only proxy so ADMIN_SECRET never touches the browser. Paystack handles SA card/mobile money rails; Sumsub handles KYC. R2 for production artifacts, local JSON for zero-config dev.",
    tradeoffs:
      "Hono on serverless (Vercel) keeps ops near-zero but constrains long-running work — webhooks must be fast and idempotent. Merchant JWTs vs Supabase sessions splits auth models cleanly but doubles the mental model. Dual storage (local/R2) adds abstraction overhead but makes local dev zero-config and prod cloud-native. Open-sourcing a production codebase means sanitising fixtures, documenting ADRs and hardening secrets — slower release cadence, but the codebase stays honest.",
    stack: [
      "TypeScript",
      "React",
      "Vite",
      "Hono",
      "Node.js",
      "Supabase",
      "PostgreSQL",
      "Paystack",
      "Sumsub",
      "Cloudflare R2",
      "Rust",
      "Docker",
      "GitHub Actions",
    ],
    repository: "https://github.com/MatomeMb/.Things-That-Matter",
    liveUrl: "https://fairflow.co.za",
    featured: true,
  },
  {
    id: "fairflow-platforms",
    name: "Fairflow Production Platforms",
    tag: "Enterprise software — NDA",
    problem:
      "A production platform handling high-consequence document workflows required backend services that could not fail silently: every invalid input had to be rejected before it reached storage, and every deployment had to be reproducible.",
    requirements:
      "Validation-first API boundaries, pinned environments, structured telemetry, auditable data writes.",
    design:
      "Defensive service layer where schema validation runs before business logic; CI gates reject any build with failing checks; lockfiles make every environment byte-identical.",
    tradeoffs:
      "Stricter CI gates slow merges by minutes, but eliminate the far more expensive class of failures where a bad deploy or a malformed record reaches production.",
    stack: ["TypeScript", "Python", "PostgreSQL", "Docker", "GitHub Actions"],
  },
  {
    id: "ocr-document-automation",
    name: "OCR Document Automation",
    tag: "Computer vision",
    problem:
      "Scanned financial documents were OCR-processed into backend accounting tables. Raw character accuracy looked high, but the residual errors were plausible-looking wrong values — an 8 read as a 6 — that passed naive validation and corrupted downstream ledgers.",
    requirements:
      "Format constraints per field, geometric field alignment, cross-field arithmetic validation, confidence gating with a manual-review path.",
    design:
      "A staged pipeline: OpenCV normalisation (deskew, Otsu binarisation) → coordinate segmentation → engine OCR → tabular structuring → four-layer validation gate before any database write.",
    tradeoffs:
      "Preprocessing adds ~80 ms per page, but secures coordinates on low-contrast scans that no amount of post-validation could recover.",
    stack: ["Python", "OpenCV", "Tesseract", "Pandas", "PostgreSQL"],
  },
  {
    id: "rag-assistant",
    name: "RAG Knowledge Assistant",
    tag: "Applied AI",
    problem:
      "LLM answers over a private document corpus sounded confident even when the source material did not contain the answer. The failure mode was not the model — it was retrieval returning weakly-related chunks and the model papering over the gap.",
    requirements:
      "Deterministic, reproducible indexing; similarity thresholds tuned to refuse; provenance from every answer back to source chunks; explicit refusal path.",
    design:
      "Document chunking → sentence-transformer embeddings → persistent FAISS index → conservative cosine-threshold gating → grounded prompt assembly with citations, or a plain-text refusal.",
    tradeoffs:
      "A conservative gate answers fewer questions. That is the point: an assistant that sometimes says 'not in this corpus' is deployable; one that never refuses is not.",
    stack: ["Python", "FAISS", "Sentence Transformers", "LLM APIs", "Streamlit"],
    repository: "https://github.com/MatomeMb/personal-codex-agent",
  },
  {
    id: "myadvisor",
    name: "MyAdvisor",
    tag: "Full-stack application",
    problem:
      "Tutor allocation at UCT's Science Learning Centre was coordinated manually — spreadsheets, emails and collisions — costing administrative hours and producing double-bookings.",
    requirements:
      "Multi-role access (admin, tutor, student), conflict-free booking, auditable scheduling decisions, automated imports.",
    design:
      "MVC web application with a relational schema enforcing booking invariants at the database level, and a scheduling routine that scores candidate allocations against tutor load and availability constraints.",
    tradeoffs:
      "Constraint checks in the database add write latency but make invalid states unrepresentable — application code cannot accidentally double-book a tutor.",
    stack: ["Java", "Spring Boot", "PostgreSQL", "Thymeleaf", "Docker"],
  },
  {
    id: "fashionmnist-classifier",
    name: "FashionMNIST Neural Network",
    tag: "Machine learning",
    problem:
      "A coursework classifier that had to be scientifically defensible: reproducible, auditable and honestly evaluated, not just a notebook with a good run.",
    requirements:
      "Locked random seeds, versioned configs, structured metric logging per epoch, clean train/validation/test separation.",
    design:
      "Two-conv-layer CNN in PyTorch with dropout regularisation, Adam + CrossEntropy, StepLR scheduling; every run emits a JSON metrics artefact so results can be re-verified.",
    tradeoffs:
      "Batch size 64 over 32: slightly noisier gradient estimates per step, but stable GPU utilisation and faster convergence to the same test accuracy (89.33%).",
    stack: ["Python", "PyTorch", "NumPy", "Matplotlib"],
    repository: "https://github.com/MatomeMb/FashionMNIST-Classifier",
  },
  {
    id: "p2p-network",
    name: "Peer-to-Peer Network",
    tag: "Distributed systems",
    problem:
      "Coursework brief: transfer files between peers without a central server, which forces the real distributed-systems questions — discovery, partial failure, concurrent access and data integrity.",
    requirements:
      "Peer discovery, chunked transfer with checksums, graceful handling of peers joining/leaving mid-transfer, no central coordination point.",
    design:
      "Socket-based peer protocol: each node is simultaneously client and server; files are split into hashed chunks reassembled and verified by the receiver; a tracker-free gossip-style peer list.",
    tradeoffs:
      "TCP per chunk is slower than a tuned UDP transport, but removes an entire class of ordering and loss bugs — the right call for a correctness-first academic build.",
    stack: ["Java", "TCP Sockets", "Threads", "SHA-256"],
  },
  {
    id: "stm32-embedded",
    name: "STM32 Embedded Systems",
    tag: "Embedded / low-level",
    problem:
      "Computer-engineering practicals on STM32 microcontrollers: hard memory limits, no operating system, and timing requirements that punish sloppy abstractions.",
    requirements:
      "Interrupt-driven I/O (timers, UART, GPIO), deterministic memory usage, no dynamic allocation in hot paths.",
    design:
      "Bare-metal C with register-level peripheral configuration; interrupt service routines kept to flag-setting, with work deferred to a main loop to keep latency bounded and debuggable.",
    tradeoffs:
      "Polling a main loop costs idle cycles versus a fully event-driven design, but keeps control flow linear enough to reason about timing on hardware without a debugger attached.",
    stack: ["C", "STM32", "UART", "Timers", "GPIO"],
    repository: "https://github.com/MatomeMb/Connected-Components-Image-Processor",
  },
];

export default function Projects() {
  return (
    <div className="space-y-10 py-14">
      <header className="max-w-2xl space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Projects</h1>
        <p className="leading-relaxed text-gray-600">
          Seven systems, presented the way I would write them up for a design review: the problem,
          the requirement that mattered most, the decision I made, and what it cost. Public-safe
          case studies are linked for each.
        </p>
      </header>

      <ol className="space-y-14">
        {projects.map((project, i) => (
          <li key={project.id} className="border-t border-gray-200 pt-10">
            <article aria-labelledby={`project-${project.id}`} className="grid gap-8 lg:grid-cols-12">
              {/* Identity column */}
              <div className="space-y-4 lg:col-span-4">
                <div className="space-y-1.5">
                  <p className="font-mono text-xs text-gray-400">
                    {String(i + 1).padStart(2, "0")} — {project.tag}
                  </p>
                  <h2
                    id={`project-${project.id}`}
                    className="text-xl font-bold tracking-tight text-gray-900"
                  >
                    {project.name}
                  </h2>
                </div>
                <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
                  {project.stack.map((item) => (
                    <li
                      key={item}
                      className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-xs text-gray-600"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
<div className="flex flex-col gap-2 pt-1 text-sm">
                <Link
                  to={`/project/${project.id}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:underline"
                >
                  Read the case study <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-gray-500 hover:text-blue-600"
                  >
                    <ExternalLink size={14} aria-hidden="true" />
                    Live
                  </a>
                )}
                {project.repository && (
                  <a
                    href={project.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-gray-500 hover:text-blue-600"
                  >
                    <FolderGit2 size={14} aria-hidden="true" />
                    {project.repository.replace("https://github.com/", "")}
                  </a>
                )}
              </div>
              </div>

              {/* Engineering substance */}
              <dl className="space-y-5 lg:col-span-8">
                <div>
                  <dt className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Problem
                  </dt>
                  <dd className="mt-1.5 leading-relaxed text-gray-600">{project.problem}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Requirements
                  </dt>
                  <dd className="mt-1.5 leading-relaxed text-gray-600">{project.requirements}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Design decision
                  </dt>
                  <dd className="mt-1.5 leading-relaxed text-gray-600">{project.design}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Trade-off
                  </dt>
                  <dd className="mt-1.5 border-l-2 border-gray-200 pl-4 leading-relaxed text-gray-600">
                    {project.tradeoffs}
                  </dd>
                </div>
              </dl>
            </article>
          </li>
        ))}
      </ol>

      <p className="border-t border-gray-200 pt-8 text-sm text-gray-500">
        Fairflow Production Platforms (the NDA entry above) describes engineering patterns only;
        client data, endpoints and metrics are omitted by design. Fairflow (the open-source project
        above) is public — code, architecture and docs are at
        <a href="https://github.com/MatomeMb/.Things-That-Matter" className="text-blue-600 hover:underline">github.com/MatomeMb/.Things-That-Matter</a>.
      </p>
    </div>
  );
}
