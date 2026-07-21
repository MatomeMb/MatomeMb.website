import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock3 } from "lucide-react";

type Block =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "quote"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "code"; lang: string; code: string };

interface Article {
  id: string;
  title: string;
  date: string;
  readTime: string;
  summary: string;
  tags: string[];
  blocks: Block[];
}

const articles: Article[] = [
  {
    id: "building-an-ocr-pipeline",
    title: "Building an OCR pipeline you can actually trust",
    date: "Oct 2025",
    readTime: "6 min",
    summary:
      "Raw character accuracy is a vanity metric. In production document processing, what matters is whether a wrong value can reach your database — and that is a validation question, not an OCR question.",
    tags: ["OCR", "OpenCV", "Python", "Data integrity"],
    blocks: [
      {
        t: "p",
        text: "A 98% character-accuracy figure sounds like a solved problem until you inspect the remaining 2%. Those errors are not random noise scattered harmlessly across the page: they concentrate in exactly the fields that matter — totals, dates, reference numbers. And they are not obvious failures like blank reads. An 8 misread as a 6 is a plausible value. It passes type checks. It survives downstream joins. It becomes a ledger entry.",
      },
      {
        t: "quote",
        text: "The most expensive OCR error is the one that looks correct.",
      },
      { t: "h2", text: "Treat extraction as untrusted input" },
      {
        t: "p",
        text: "The design principle that changed everything about how I build document pipelines: the OCR engine is an unreliable external dependency, and its output must be validated with the same suspicion you would apply to a user's HTTP request. Validation is not a cleanup step after extraction — it is the primary control, and extraction exists to feed it.",
      },
      {
        t: "p",
        text: "Concretely, four layers run before any value is allowed near storage:",
      },
      {
        t: "ul",
        items: [
          "Format: every field has a type contract. Dates must parse as dates; amounts as numerics; reference numbers against known patterns. This catches illegal values but not plausible wrong ones.",
          "Geometry: a value must originate from the region of the page where its field lives. An amount read from the address block is wrong even if it is a perfectly valid number.",
          "Arithmetic: line items must sum to the stated total within tolerance. This catches character swaps in individual fields that both previous layers accept.",
          "Confidence: engine-reported confidence per field, with a threshold below which extraction routes to a human instead of the database.",
        ],
      },
      { t: "h2", text: "Preprocessing buys more accuracy than tuning" },
      {
        t: "p",
        text: "The highest-leverage work happened before OCR ever ran. Skewed scans produce systematically misaligned coordinate maps, so I estimate skew from the average angle of detected text bounding boxes and correct it with an affine transform. Scanner noise destroys thin strokes under naive thresholding, so bilateral filtering suppresses speckle while preserving edges, ahead of an Otsu binarisation.",
      },
      {
        t: "p",
        text: "The preprocessing stage costs roughly 80 ms per page. That latency is trivially worth it: stabilised coordinates make every downstream validation layer reliable. Fine-tuning Tesseract parameters — dictionaries, page segmentation modes, engine configs — produced marginal gains by comparison. Fix the image first.",
      },
      { t: "h2", text: "Design the rejection path as carefully as the happy path" },
      {
        t: "code",
        lang: "python",
        code: `def validate(extraction: Extraction, page: Page) -> Decision:
    if not passes_format(extraction):
        return Reject(rule="format", detail=extraction.field)
    if not inside_field_region(extraction, page.geometry):
        return Reject(rule="geometry", detail=extraction.bbox)
    if not sums_match(extraction.line_items, extraction.total, tol=0.01):
        return Reject(rule="arithmetic", detail=extraction.total)
    if extraction.confidence < FIELD_THRESHOLDS[extraction.field]:
        return RouteToReview(reason="below-threshold")
    return Accept(audit=AuditTrail.coordinates(extraction))`,
      },
      {
        t: "p",
        text: "Two properties make this trustworthy in operation. First, rejection is immediate and cheap: it happens at the API boundary, so a malformed record never acquires a transaction or a lock on the database. Second, acceptance is provable: every stored value carries its source coordinates and rule outcomes, so any ledger entry can be traced back to a physical region of a physical page.",
      },
      {
        t: "p",
        text: "The uncomfortable conclusion is that the goal was never to read text perfectly. The goal is a system whose failures are visible, attributable and recoverable. That is the difference between a demo and a deployment.",
      },
    ],
  },
  {
    id: "building-a-rag-system",
    title: "Building a RAG system that knows when to shut up",
    date: "Nov 2025",
    readTime: "7 min",
    summary:
      "Most RAG failures are retrieval failures wearing a generation costume. The fix is not a bigger model — it is a conservative gate, a reproducible index and an honest refusal path.",
    tags: ["RAG", "FAISS", "Embeddings", "LLMs"],
    blocks: [
      {
        t: "p",
        text: "The moment I stopped trusting my RAG assistant was instructive. I asked it a question whose answer was genuinely not in the corpus, and it produced a fluent, specific, completely invented answer — with the confidence of a system that had retrieved something. The language model did exactly what language models do: it completed the pattern. The failure belonged to the retrieval layer, which had handed it chunks that were keyword-adjacent but semantically irrelevant.",
      },
      { t: "h2", text: "The gate is the product" },
      {
        t: "p",
        text: "Every component of the pipeline — chunking, embedding, indexing, prompting — is commodity engineering. The one component that determines whether the system is deployable is the decision layer between retrieval and generation: given the top-k chunks and their cosine scores, do we have evidence, or do we have noise?",
      },
      {
        t: "ul",
        items: [
          "Below the similarity threshold: the chunks never reach the prompt. The user gets a plain refusal stating the answer is not in the corpus.",
          "Above it: the prompt is assembled with the retrieved chunks and explicit citation markers the model must preserve, so every claim in the answer points back to a source.",
          "The threshold is tuned deliberately conservative against a probe set. A refusal is a correct answer when the evidence is weak.",
        ],
      },
      {
        t: "p",
        text: "This reframing — knowing when to refuse is a feature — is what separates a RAG demo from a RAG deployment. An assistant that occasionally says 'I don't have that' earns trust; one that never refuses will eventually lie to the wrong person.",
      },
      { t: "h2", text: "Determinism is a maintenance requirement" },
      {
        t: "p",
        text: "The other discipline that matters: the index must be reproducible. The same corpus must always produce the same index, which means pinning the embedding model version with the index itself and fixing chunking parameters in code. And the index must be provably fresh: on startup, the system hashes the corpus (SHA-256) and rebuilds if the hash does not match the stored value. Silent staleness — where the documents changed but the index did not — is a subtle correctness bug that looks like retrieval drift.",
      },
      {
        t: "code",
        lang: "python",
        code: `def query(question: str) -> Answer:
    q = embed(question)                      # pinned MiniLM
    chunks = index.search(q, k=5)            # FAISS top-k
    evidence = [c for c in chunks if c.score >= THRESHOLD]

    if not evidence:
        return Refusal("Not found in this corpus.")

    prompt = assemble(question, evidence)    # citation markers included
    return generate(prompt)                  # grounded, cited answer`,
      },
      { t: "h2", text: "Boring technology choices, on purpose" },
      {
        t: "p",
        text: "Two decisions get questions. Why FAISS in memory instead of a hosted vector database? Because at this corpus size a vector DB buys latency guarantees I don't need and operational overhead I don't want; a persisted FAISS index is a file I can hash, back up and reason about. Why local sentence-transformers instead of a commercial embedding API? Because determinism requires a pinned model version, privacy requires that documents never leave the machine, and the embedding quality difference is irrelevant next to the gate's contribution to correctness.",
      },
      {
        t: "p",
        text: "Verification is a probe suite: in-scope questions must retrieve the correct source chunks; out-of-scope probes must be refused. It runs on every ingestion change. The failure I care about most — a confident answer with no evidence — is now structurally impossible, because generation without evidence has no code path.",
      },
    ],
  },
  {
    id: "rest-api-design-spring-boot",
    title: "REST API design with Spring Boot: contracts before controllers",
    date: "Jan 2026",
    readTime: "6 min",
    summary:
      "The difference between an API that ages well and one that becomes a liability is decided before the first endpoint is written: define the contract, anchor invariants in the schema, and validate at the boundary.",
    tags: ["Spring Boot", "Java", "REST", "PostgreSQL"],
    blocks: [
      {
        t: "p",
        text: "Most Spring Boot tutorials produce the same skeleton: a controller, a service, a repository, three annotations deep. It works — and then it accretes. Six months later the validation rules live in four places, the error responses differ per endpoint, and nobody is sure whether a booking constraint is enforced or merely hoped for. The order of operations that avoids this is: contract, schema, then code.",
      },
      { t: "h2", text: "1. The OpenAPI contract is the design document" },
      {
        t: "p",
        text: "Write the OpenAPI specification first: resources, verbs, request/response shapes, error shapes, status codes. This forces the hard questions up front — is this a 409 or a 422? What does the client do with a partial failure? — while they are still cheap to answer. Generated server stubs keep the implementation honest against the contract.",
      },
      { t: "h2", text: "2. Invariants belong in the database" },
      {
        t: "p",
        text: "If a tutor cannot be in two places at once, that truth belongs in a unique constraint on (tutor_id, slot_id), not in an if-statement in a service class. Application code can have bugs; constraints cannot. The service layer still checks — but for the user experience (readable conflict messages), not for correctness (which the constraint owns):",
      },
      {
        t: "code",
        lang: "java",
        code: `@PostMapping("/bookings")
public ResponseEntity<BookingView> create(@Valid @RequestBody CreateBooking req) {
    try {
        Booking b = bookingService.allocate(req.tutorId(), req.studentId(), req.slotId());
        return ResponseEntity.status(201).body(BookingView.of(b));
    } catch (DuplicateKeyException e) {
        // The unique constraint fired: slot already booked.
        throw new ResponseStatusException(CONFLICT, "Slot unavailable");
    }
}`,
      },
      { t: "h2", text: "3. Boundary validation is non-negotiable" },
      {
        t: "p",
        text: "Jakarta Bean Validation annotations on the request DTO, @Valid on the controller parameter, and a single @ControllerAdvice that maps every failure — validation errors, constraint violations, unexpected exceptions — into one consistent error shape. Clients can then code against the error contract instead of reverse-engineering it:",
      },
      {
        t: "code",
        lang: "java",
        code: `public record CreateBooking(
    @NotNull UUID tutorId,
    @NotNull UUID studentId,
    @NotNull UUID slotId,
    @Size(max = 500) String notes) {}

@RestControllerAdvice
class ApiErrors {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ProblemDetail handle(MethodArgumentNotValidException ex) {
        var pd = ProblemDetail.forStatus(422);
        pd.setProperty("fields", fieldErrors(ex));
        return pd; // RFC 7807: one shape for every client
    }
}`,
      },
      { t: "h2", text: "4. Test the state machine, not the framework" },
      {
        t: "p",
        text: "Integration tests should enumerate invalid transitions and assert they are rejected: double-booking, role violations, past-dated slots, malformed payloads. A green build then means the invariants hold, not merely that the framework wired up. That is the signal worth gating CI on — and it is the same test-first posture I apply to every backend I ship.",
      },
    ],
  },
  {
    id: "optimising-sql-queries",
    title: "Optimising SQL queries: read the plan, not the guess",
    date: "Feb 2026",
    readTime: "6 min",
    summary:
      "Query tuning folklore is mostly wrong because it skips the only evidence that matters: the execution plan. A short field guide to EXPLAIN, indexes and the N+1 that hides in your ORM.",
    tags: ["SQL", "PostgreSQL", "Performance", "Databases"],
    blocks: [
      {
        t: "p",
        text: "When a query is slow, the plausible theories are endless: the table is big, the join is bad, we need a cache. Most are wrong in any given case, and acting on guesses is how systems gain indexes nobody uses and caches nobody can invalidate. The discipline is simple: EXPLAIN ANALYZE first, theory second.",
      },
      { t: "h2", text: "Reading a plan without drowning" },
      {
        t: "p",
        text: "Three things, in order. First, find the node with the biggest actual time share — plans deceive, so optimise the hot node, not the scary-looking one. Second, look for sequential scans over large row counts feeding a highly selective filter: that shape usually wants an index. Third, compare estimated rows against actual rows; when the planner is wrong by orders of magnitude, the statistics are stale and ANALYZE is the fix, not more indexes.",
      },
      {
        t: "code",
        lang: "sql",
        code: `EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT b.id, b.slot_id, t.name
FROM bookings b
JOIN tutors t ON t.id = b.tutor_id
WHERE b.tutor_id = $1
  AND b.status = 'confirmed'
  AND b.created_at > now() - interval '30 days';

-- Hot node was a Seq Scan on bookings (actual 41ms of 43ms),
-- filter discarded ~96% of rows scanned.
CREATE INDEX CONCURRENTLY bookings_tutor_recent
    ON bookings (tutor_id, created_at)
    WHERE status = 'confirmed';   -- partial index: only the hot subset`,
      },
      { t: "h2", text: "Index shapes that matter" },
      {
        t: "ul",
        items: [
          "Column order follows selectivity AND usage: a composite on (tutor_id, created_at) serves tutor-scoped time-range queries; the reverse order serves a different (rarer) shape.",
          "Partial indexes are underrated: if 80% of queries filter status = 'confirmed', index only that subset — smaller, faster, cheaper to maintain.",
          "Covering indexes (INCLUDE) eliminate heap lookups for hot read paths; measure before adding, because every index is a write tax forever.",
          "Indexes are not free: each one is paid on every INSERT and UPDATE. Remove the unused ones — pg_stat_user_indexes tells you which.",
        ],
      },
      { t: "h2", text: "The N+1 hiding in your ORM" },
      {
        t: "p",
        text: "The most common production query problem I see is not a missing index — it is an ORM fetching a list, then issuing one query per row for a related entity. It passes code review because the code shows one query; it only appears under realistic data volumes. Fetches should be explicit: join, batch, or select the related set in one statement. Log query counts per request in staging; a request that issues 300 statements to render one page has an N+1, whatever the code looks like.",
      },
      {
        t: "quote",
        text: "You do not tune a query. You tune the access pattern the data model forces onto the query — and you verify it with the plan.",
      },
      {
        t: "p",
        text: "The recurring lesson from the MyAdvisor scheduling work: the schema and the access patterns are one decision made in two places. Get the invariants into constraints, shape indexes to the queries that actually run hot, and let the planner's own output be the review document.",
      },
    ],
  },
  {
    id: "google-cloud-learning-notes",
    title: "Google Cloud: working notes from the Career Launchpad",
    date: "Dec 2024",
    readTime: "5 min",
    summary:
      "Condensed notes from the Google Cloud Career Launchpad: the mental model that makes the service catalog coherent, and the IAM habit that prevents the common incidents.",
    tags: ["Google Cloud", "IAM", "Networking", "Notes"],
    blocks: [
      {
        t: "p",
        text: "The service catalog feels like a wall of products until you organise it around one question: where does state live? Compute services are interchangeable ways to run code (Compute Engine for control, App Engine for convenience, GKE for orchestration, Cloud Run for stateless containers); the durable decisions are about data — Cloud Storage for objects, Cloud SQL/AlloyDB for relational truth, Firestore for document state, BigQuery for analytics. Choose the state layer first and compute falls out of it.",
      },
      { t: "h2", text: "IAM: the incident-prevention habit" },
      {
        t: "ul",
        items: [
          "Principals get roles, never individuals: humans join groups; groups hold roles. Departures become a group-membership change, not an audit.",
          "Service accounts per workload, not per application: one app's read-only Storage identity and its database identity are different identities, so a compromise is scoped.",
          "Basic roles (Owner/Editor/Viewer) are broad by design — fine for a sandbox, wrong for anything with real data. Predefined roles are the default.",
          "Every permission granted is a sentence you must be able to finish: '...so that this workload can ___'.",
        ],
      },
      { t: "h2", text: "Networking without fear" },
      {
        t: "p",
        text: "VPCs are global; subnets are regional. That one fact resolves most confusion: a VPC is a logical envelope, and the regional subnets inside it carry the actual IP ranges. Firewall rules are stateful and tag-targeted — 'allow tcp:5432 to instances tagged postgres from instances tagged api' expresses intent in a way a CIDR list never will. Private Google Access lets workloads reach Google APIs without public IPs, which closes the exfiltration path most tutorials leave open.",
      },
      { t: "h2", text: "Operations" },
      {
        t: "p",
        text: "Cloud Monitoring and Logging are one decision (an alerting policy is only as good as the log-based metric behind it), budgets with alerting thresholds cost nothing and prevent the classic student-account horror story, and infrastructure as code is the right answer even for labs — a Terraform plan is documentation that cannot drift from reality.",
      },
      {
        t: "p",
        text: "What the programme actually taught, beneath the product surface: cloud design is trust-boundary design. Every architectural drawing on the platform is ultimately a story about who can reach what — and the services are just vocabulary for saying it precisely.",
      },
    ],
  },
  {
    id: "docker-in-production",
    title: "Docker in production: the boring checklist that prevents the exciting failures",
    date: "Mar 2026",
    readTime: "6 min",
    summary:
      "Containers fail in production for a short list of reasons: mutable tags, fat images, root processes, absent health checks and unreproducible builds. The fixes are unglamorous and absolute.",
    tags: ["Docker", "CI/CD", "DevOps", "Reliability"],
    blocks: [
      {
        t: "p",
        text: "Every container incident I have debugged traced back to one of five causes, and none of them required cleverness to prevent — only the discipline to treat 'it runs on my machine' as the beginning of the work, not the end.",
      },
      { t: "h2", text: "1. Reproducibility is the first feature" },
      {
        t: "p",
        text: "A build is reproducible when the same source produces a byte-identical image. That means pinned base image digests (not :latest, not even :3.12 — digests), pinned dependency lockfiles copied before application source so the dependency layer caches, and builds that happen in CI, never on a laptop. The payoff is not theoretical: when staging and production are the same bytes, 'works in staging' is evidence instead of hope.",
      },
      {
        t: "code",
        lang: "dockerfile",
        code: `FROM python:3.12-slim@sha256:4f2d...   # pinned digest, not a tag
WORKDIR /app
COPY requirements.lock .                  # deps layer caches independently
RUN pip install --no-cache-dir -r requirements.lock
COPY src/ ./src/
USER 10001:10001                          # non-root, created in-image
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD python -c "import urllib.request;urllib.request.urlopen('http://localhost:8080/healthz')"
ENTRYPOINT ["python", "-m", "src.server"]`,
      },
      { t: "h2", text: "2. Small images, few layers, no privilege" },
      {
        t: "p",
        text: "Slim or distroless bases cut attack surface and pull time in one move. Everything the runtime does not need — build tools, shells, package managers — belongs in a builder stage of a multi-stage build. And processes run as a created non-root user: containers share the host kernel, so root in the container is one namespace escape from root on the host.",
      },
      { t: "h2", text: "3. Health checks that mean something" },
      {
        t: "p",
        text: "A /healthz endpoint that returns 200 because the process exists is decoration. A useful readiness check verifies the dependencies the service cannot function without — the database connection, the index file it serves from — and returns failure fast when they are absent. Orchestrators route traffic on this signal; a truthful health check is the difference between a rolling deploy and a rolling outage.",
      },
      { t: "h2", text: "4. Logs are a stream, not a file" },
      {
        t: "p",
        text: "Write structured logs to stdout and let the platform collect them. A container that writes log files inside its own filesystem is an unbounded disk growth waiting for a quiet Sunday. Structured (JSON) lines cost nothing at write time and make every future incident queryable.",
      },
      { t: "h2", text: "5. The gate is mandatory" },
      {
        t: "p",
        text: "CI runs lint, typecheck, tests, and image build on every change, and a failing gate cannot be overridden. This is the rule behind the 'zero broken builds' claim on my production work: gates are allowed to be slow; they are not allowed to be optional. Speed comes from small, well-cached builds — not from skipping verification.",
      },
    ],
  },
  {
    id: "distributed-systems-notes",
    title: "Distributed systems notes: the four ideas everything reduces to",
    date: "Apr 2026",
    readTime: "7 min",
    summary:
      "Two generals, exactly-once, CAP, partial failure — the field's famous results are really one warning in four costumes: the network is not honest. A working set of notes from coursework to production.",
    tags: ["Distributed systems", "Consistency", "Networking", "Notes"],
    blocks: [
      {
        t: "p",
        text: "Distributed systems theory has a reputation for abstraction. Studying it alongside building a peer-to-peer file transfer system burned the abstractions down to four ideas I now reach for weekly. Each is a different costume on the same warning: you cannot tell the difference between a slow node and a dead one.",
      },
      { t: "h2", text: "1. Timeouts are decisions, not constants" },
      {
        t: "p",
        text: "The Two Generals problem proves no protocol guarantees agreement over an unreliable channel — every ack can itself be lost. The practical consequence: every timeout is a policy decision. Time out too fast and you retry against a live node (duplicate work); too slow and you stall behind a dead one. There is no correct timeout, only explicit ones — and 'the request timed out' must always have a designed next step.",
      },
      { t: "h2", text: "2. Exactly-once is a property of systems, not messages" },
      {
        t: "p",
        text: "Retried delivery is inevitable, so messages arrive at-least-once; exactly-once processing is something you build on top with idempotency. In the P2P build this was concrete: chunk transfers could be re-sent, so each chunk carried a content hash and receivers verified before acknowledging — a corrupt or duplicated chunk was re-requested, never propagated. Design operations so doing them twice equals doing them once, and retries become safe instead of terrifying.",
      },
      { t: "h2", text: "3. CAP is about partition behaviour, not preference" },
      {
        t: "p",
        text: "The theorem is routinely misquoted as 'pick two of three'. Partitions are not optional — the network will partition; the choice is what happens when it does. A CP system refuses writes it cannot keep consistent (booking systems: a rejected request is recoverable, a double-booking is not). An AP system accepts divergent writes and reconciles later. The interesting engineering question per feature: which failure do your users recover from more easily — unavailability or contradiction?",
      },
      { t: "h2", text: "4. Partial failure is the defining difficulty" },
      {
        t: "p",
        text: "In a single process, things are up or down. In a network, node A is healthy to node B and dead to node C simultaneously, and both are telling the truth. Every consistency protocol — leader election, quorums, leases — is machinery for manufacturing a single story from contradictory observations. This is why 'the server is up' is not a diagnosis, why health signals need quorum, and why I design for resumable units of work: when any participant can vanish mid-operation, the unit of recovery is the idempotent step, not the transaction.",
      },
      {
        t: "quote",
        text: "Define correctness before speed. In distributed systems, the fast wrong answer is always available; the correct one is the engineering.",
      },
    ],
  },
];

function RenderBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.t) {
          case "p":
            return (
              <p key={i} className="leading-relaxed text-gray-600">
                {block.text}
              </p>
            );
          case "h2":
            return (
              <h2 key={i} className="pt-3 text-lg font-bold tracking-tight text-gray-900">
                {block.text}
              </h2>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-2 border-blue-600 pl-4 italic leading-relaxed text-gray-700"
              >
                {block.text}
              </blockquote>
            );
          case "ul":
            return (
              <ul
                key={i}
                className="list-disc space-y-1.5 pl-5 leading-relaxed text-gray-600 marker:text-gray-300"
              >
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "code":
            return (
              <div key={i} className="overflow-hidden rounded-lg border border-gray-200">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-1.5 font-mono text-xs text-gray-500">
                  {block.lang}
                </div>
                <pre className="overflow-x-auto bg-gray-50 p-4">
                  <code className="font-mono text-xs leading-relaxed text-gray-800">
                    {block.code}
                  </code>
                </pre>
              </div>
            );
        }
      })}
    </div>
  );
}

export default function Writing() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeId]);

  const active = articles.find((a) => a.id === activeId);

  if (active) {
    return (
      <div className="mx-auto max-w-2xl py-14">
        <button
          type="button"
          onClick={() => setActiveId(null)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600"
        >
          <ArrowLeft size={14} aria-hidden="true" /> All writing
        </button>

        <header className="space-y-4 border-b border-gray-200 pb-8 pt-6">
          <ul className="flex flex-wrap gap-1.5" aria-label="Topics">
            {active.tags.map((tag) => (
              <li
                key={tag}
                className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-xs text-gray-600"
              >
                {tag}
              </li>
            ))}
          </ul>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            {active.title}
          </h1>
          <p className="flex items-center gap-4 font-mono text-xs text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={12} aria-hidden="true" /> {active.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={12} aria-hidden="true" /> {active.readTime}
            </span>
          </p>
        </header>

        <article className="pt-8">
          <RenderBlocks blocks={active.blocks} />
        </article>

        <footer className="mt-12 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Questions or corrections?{" "}
            <a href="mailto:matomepontso@gmail.com" className="font-medium text-blue-600 hover:underline">
              matomepontso@gmail.com
            </a>
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-14">
      <header className="max-w-2xl space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Writing</h1>
        <p className="leading-relaxed text-gray-600">
          Working notes on the systems I build: document pipelines, retrieval systems, API design,
          databases and the discipline of shipping. Written as engineering documentation, not
          marketing.
        </p>
      </header>

      <ol className="divide-y divide-gray-100 border-y border-gray-100">
        {articles.map((article, i) => (
          <li key={article.id}>
            <button
              type="button"
              onClick={() => setActiveId(article.id)}
              className="group grid w-full gap-2 py-6 text-left sm:grid-cols-12 sm:gap-4"
            >
              <span aria-hidden="true" className="font-mono text-xs text-gray-400 sm:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="sm:col-span-8">
                <span className="block text-[15px] font-semibold text-gray-900 group-hover:text-blue-600">
                  {article.title}
                </span>
                <span className="mt-1 block max-w-xl text-sm leading-relaxed text-gray-600">
                  {article.summary}
                </span>
              </span>
              <span className="flex items-baseline gap-3 font-mono text-xs text-gray-400 sm:col-span-3 sm:justify-end">
                <span>{article.date}</span>
                <span>{article.readTime}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
