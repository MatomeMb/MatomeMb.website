
type EntryType = "Work" | "Programme" | "Education";

interface TimelineEntry {
  organisation: string;
  role: string;
  period: string;
  type: EntryType;
  summary: string;
  impact: string[];
  stack?: string[];
}

const timeline: TimelineEntry[] = [
  {
    organisation: "Fairflow",
    role: "Software Engineer",
    period: "Jan 2026 – Apr 2026",
    type: "Work",
    summary:
      "Designed and shipped Fairflow end-to-end: a TypeScript monorepo with a Hono commerce API, React merchant/admin portal, Supabase auth, Paystack payments, Sumsub KYC, and production-minded open-source documentation. It's a real product codebase, not a tutorial demo.",
    impact: [
      "Designed and shipped Fairflow commerce API + merchant portal: Hono onboarding portal — multi-actor auth (merchant JWT, Supabase staff RBAC, admin proxy), Paystack checkout + webhook HMAC verification, Sumsub KYC/payouts, portable .thing artifacts.",
      "Implemented Paystack checkout flow with idempotent webhook processing: raw-body HMAC-SHA512 verification, idempotency keys, exactly-once fulfilment — no double-charges, no missed orders.",
      "Built multi-actor auth model: stateless merchant JWTs (short TTL, JWKS rotation) for external customers; Supabase Auth + RLS for internal staff/admin; admin proxy so ADMIN_SECRET never touches the browser.",
      "Prepared and open-sourced the repository to production OSS standards: ADR log, OpenAPI spec, Vitest/Playwright CI, Docker compose parity, sanitised public fixtures, CONTRIBUTING.md, Rust matter-core with napi-rs bindings.",
      "Architected dual-storage abstraction (local JSON dev / Cloudflare R2 prod) behind a single interface — zero-config local dev, cloud-native prod, zero Docker for contributors.",
    ],
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
  },
  {
    organisation: "Science Learning Centre — University of Cape Town",
    role: "Systems Developer",
    period: "Feb 2025 – Nov 2025",
    type: "Work",
    summary:
      "Tutoring administration systems for the Science Learning Centre: scheduling, booking integrity and administrative automation.",
    impact: [
      "Built the MyAdvisor scheduling system: constraint-anchored relational schema plus an allocation scoring routine — a measured 35% improvement in tutor-allocation efficiency.",
      "Automated administrative imports with per-row validation, removing manual data-entry classes of error.",
    ],
    stack: ["Java", "Spring Boot", "PostgreSQL", "Python", "SQL"],
  },
  {
    organisation: "Google Cloud Career Launchpad",
    role: "Cloud Engineering Track",
    period: "2024",
    type: "Programme",
    summary:
      "Structured Google Cloud programme covering core infrastructure: compute, storage, networking, IAM and managed data services.",
    impact: [
      "Completed hands-on labs across Compute Engine, Cloud Storage, VPC networking and identity management, with an emphasis on least-privilege configuration.",
    ],
    stack: ["Google Cloud", "Compute Engine", "Cloud Storage", "IAM"],
  },
  {
    organisation: "Dell Young Leaders",
    role: "Leadership Development Programme",
    period: "2022 – 2025",
    type: "Programme",
    summary:
      "Multi-year leadership programme for university students, combining professional skills development with a sponsored technology package.",
    impact: [
      "Completed structured modules on communication, project delivery and professional resilience alongside the engineering degree.",
    ],
  },
  {
    organisation: "EY Uncovered",
    role: "Technology Consulting Insight Programme",
    period: "2023",
    type: "Programme",
    summary:
      "Insight programme on how enterprise technology engagements are scoped, delivered and governed.",
    impact: [
      "Exposure to requirement-gathering discipline and the governance structures around large client systems — directly applicable to how I scope engineering work.",
    ],
  },
  {
    organisation: "University of Cape Town",
    role: "BSc Computer Science & Computer Engineering",
    period: "2020 – 2025",
    type: "Education",
    summary:
      "Double major spanning the stack from transistor to distributed system: algorithms, operating systems, computer architecture, embedded systems, networks and machine learning.",
    impact: [
      "Capstone-level work across scheduling algorithms, peer-to-peer networking, STM32 embedded practicals and a reproducible PyTorch classification pipeline (89.33% test accuracy).",
    ],
    stack: ["Python", "Java", "C/C++", "SQL", "STM32", "PyTorch"],
  },
];

const typeStyles: Record<EntryType, string> = {
  Work: "bg-black text-white",
  Programme: "bg-gray-100 text-gray-700 border border-gray-200",
  Education: "bg-gray-100 text-gray-700 border border-gray-200",
};

export default function Experience() {
  return (
    <div className="space-y-10 py-14">
      <header className="max-w-2xl space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Experience</h1>
        <p className="leading-relaxed text-gray-600">
          Roles, programmes and education — with the engineering impact stated as plainly as I can
          verify it.
        </p>
      </header>

      <ol className="relative space-y-12 border-l border-gray-200 pl-8">
        {timeline.map((entry) => (
          <li key={`${entry.organisation}-${entry.period}`} className="relative">
            <span
              aria-hidden="true"
              className={`absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full ${
                entry.type === "Work" ? "bg-black" : "bg-neutral-300"
              }`}
            />
            <article className="space-y-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <span
                  className={`rounded px-2 py-0.5 font-mono text-[11px] font-semibold ${typeStyles[entry.type]}`}
                >
                  {entry.type}
                </span>
                <span className="font-mono text-xs text-gray-400">{entry.period}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-gray-900">
                  {entry.organisation}
                </h2>
                <p className="text-sm font-semibold text-gray-600">{entry.role}</p>
              </div>
              <p className="max-w-2xl leading-relaxed text-gray-600">{entry.summary}</p>
              <ul className="max-w-2xl list-disc space-y-1.5 pl-5 leading-relaxed text-gray-600 marker:text-gray-300">
                {entry.impact.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {entry.stack && (
                <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="Technologies used">
                  {entry.stack.map((item) => (
                    <li
                      key={item}
                      className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-xs text-gray-600"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
