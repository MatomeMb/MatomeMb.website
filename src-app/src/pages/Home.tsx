import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight, Star, FolderGit2 } from "lucide-react";

interface Repo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
}

const fallbackRepos: Repo[] = [
  {
    name: "personal-codex-agent",
    html_url: "https://github.com/MatomeMb/personal-codex-agent",
    description:
      "Grounded, private RAG assistant using FAISS vector indices, sentence embeddings and conservative retrieval gating.",
    language: "Python",
    stargazers_count: 0,
  },
  {
    name: "FashionMNIST-Classifier",
    html_url: "https://github.com/MatomeMb/FashionMNIST-Classifier",
    description:
      "Reproducible PyTorch training and evaluation pipeline with locked seeds and structured metric logging.",
    language: "Python",
    stargazers_count: 0,
  },
  {
    name: "Operating-Systems-Scheduling_Algos",
    html_url: "https://github.com/MatomeMb/Operating-Systems-Scheduling_Algos",
    description:
      "CPU scheduling algorithm benchmarks (FIFO, SJF, Round Robin) implemented and measured in Python.",
    language: "Python",
    stargazers_count: 0,
  },
  {
    name: "Connected-Components-Image-Processor",
    html_url: "https://github.com/MatomeMb/Connected-Components-Image-Processor",
    description:
      "Connected-component labelling for binary images, optimised for memory footprint in standard C++.",
    language: "C++",
    stargazers_count: 0,
  },
];

const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "Java", "TypeScript", "SQL", "C/C++"] },
  { group: "Backend", items: ["Spring Boot", "Node.js", "Express", "FastAPI", "REST API design", "WebSockets"] },
  { group: "AI", items: ["PyTorch", "FAISS", "Sentence embeddings", "RAG pipelines", "OpenCV", "LLM APIs"] },
  { group: "Cloud", items: ["Google Cloud", "Compute Engine", "Cloud Storage", "IAM", "Managed databases"] },
  { group: "Data", items: ["PostgreSQL", "MySQL", "ETL pipelines", "Pandas", "Schema design"] },
  { group: "DevOps", items: ["Docker", "GitHub Actions", "CI/CD", "Linux / Bash", "Nginx"] },
  { group: "Tools", items: ["Git", "Jira", "Postman", "VS Code", "Advanced Excel"] },
];

const featuredProjects = [
  {
    id: "fairflow",
    name: "Fairflow",
    tag: "Open-source commerce infrastructure",
    line: "Open-source commerce platform for South African merchants focused on payments, merchant onboarding, digital products, and developer tooling.",
    liveUrl: "https://fairflow.co.za",
    repoUrl: "https://github.com/MatomeMb/.Things-That-Matter",
  },
  {
    id: "ocr-document-automation",
    name: "OCR Document Automation",
    tag: "Computer Vision",
    line: "Validation-first extraction pipeline with coordinate audits and confidence gating.",
  },
  {
    id: "rag-assistant",
    name: "RAG Knowledge Assistant",
    tag: "Applied AI",
    line: "Grounded retrieval over a private corpus with deterministic indices and explicit refusals.",
  },
  {
    id: "fairflow-platforms",
    name: "Fairflow Production Platforms",
    tag: "Enterprise / NDA",
    line: "Backend services and CI/CD foundations for a production pipeline, discussed public-safe.",
  },
];

export default function Home() {
  const { data: repos, isError } = useQuery<Repo[]>({
    queryKey: ["github-repos"],
    queryFn: async () => {
      const res = await fetch("https://api.github.com/users/MatomeMb/repos?sort=updated&per_page=12");
      if (!res.ok) throw new Error("GitHub API request failed");
      const data: Repo[] = await res.json();
      return data
        .filter((r) => r.name !== "MatomeMb.website" && r.name !== "MatomeMb")
        .slice(0, 4);
    },
  });

  const displayRepos = isError || !repos || repos.length === 0 ? fallbackRepos : repos;

  return (
    <div className="space-y-20 py-14">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section aria-labelledby="hero-heading" className="max-w-3xl space-y-6">
        <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
          <span className="h-1.5 w-1.5 rounded-full bg-green-600" aria-hidden="true" />
          Open to software engineering roles — Johannesburg / relocation
        </p>

        <div className="space-y-4">
          <h1
            id="hero-heading"
            className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl leading-none space-y-1"
          >
            <span className="block">Backend Systems.</span>
            <span className="block">AI Applications.</span>
            <span className="block">Data Platforms.</span>
          </h1>
          <div className="space-y-1.5">
            <p className="text-lg font-semibold text-gray-900">Matome Mbowene &mdash; Software Engineer</p>
            <p className="max-w-xl text-base text-gray-600 leading-relaxed">
              Software Engineer building reliable software focused on backend engineering, artificial intelligence, distributed systems, and cloud infrastructure.
            </p>
            <p className="text-xs text-gray-500">
              BSc Computer Science &amp; Computer Engineering, University of Cape Town
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-900 focus:outline-none"
          >
            View Projects <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link
            to="/resume"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-400 hover:bg-gray-50 focus:outline-none"
          >
            View Resume
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-400 hover:bg-gray-50 focus:outline-none"
          >
            Contact
          </Link>
        </div>
      </section>

      {/* ── Profile ──────────────────────────────────────────────── */}
      <section aria-labelledby="profile-heading" className="grid gap-6 border-t border-gray-200 pt-12 md:grid-cols-3">
        <h2 id="profile-heading" className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
          Profile
        </h2>
        <div className="space-y-4 md:col-span-2">
          <p className="max-w-2xl leading-relaxed text-gray-600">
            I am a software engineer working across backend services, applied AI and data systems.
            At Fairflow I build validation-first document automation and grounded retrieval systems
            that run in production. My degree in Computer Science and Computer Engineering from the
            University of Cape Town covered everything from embedded C to distributed systems, and I
            still work comfortably at both ends of that stack. I care about correctness, auditability
            and systems that fail safely — and I document what I build so other engineers can verify
            it. I write about the systems I ship and the trade-offs behind them.
          </p>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────── */}
      <section aria-labelledby="timeline-heading" className="grid gap-6 border-t border-gray-200 pt-12 md:grid-cols-3">
        <h2 id="timeline-heading" className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
          Timeline
        </h2>
        <div className="md:col-span-2">
          <ol className="relative border-l border-gray-200 pl-6 space-y-6">
            <li className="relative">
              <span className="absolute -left-[29px] top-1 h-2 w-2 rounded-full bg-black" aria-hidden="true" />
              <div className="space-y-0.5">
                <span className="font-mono text-xs font-semibold text-gray-500">2020</span>
                <p className="text-sm font-semibold text-gray-900">Started BSc Computer Science &amp; Computer Engineering</p>
                <p className="text-xs text-gray-500">University of Cape Town</p>
              </div>
            </li>
            <li className="relative">
              <span className="absolute -left-[29px] top-1 h-2 w-2 rounded-full bg-neutral-300" aria-hidden="true" />
              <div className="space-y-0.5">
                <span className="font-mono text-xs font-semibold text-gray-500">2021</span>
                <p className="text-sm font-semibold text-gray-900">Selected as a Dell Young Leader</p>
                <p className="text-xs text-gray-500">Multi-year leadership and professional development programme</p>
              </div>
            </li>
            <li className="relative">
              <span className="absolute -left-[29px] top-1 h-2 w-2 rounded-full bg-neutral-300" aria-hidden="true" />
              <div className="space-y-0.5">
                <span className="font-mono text-xs font-semibold text-gray-500">2025</span>
                <p className="text-sm font-semibold text-gray-900">Systems Developer, Science Learning Centre, UCT &amp; EY Uncovered</p>
                <p className="text-xs text-gray-500">Built scheduling systems and completed consulting insights</p>
              </div>
            </li>
            <li className="relative">
              <span className="absolute -left-[29px] top-1 h-2 w-2 rounded-full bg-black" aria-hidden="true" />
              <div className="space-y-0.5">
                <span className="font-mono text-xs font-semibold text-gray-500">Jan 2026 – Apr 2026</span>
                <p className="text-sm font-semibold text-gray-900">Co-Founder &amp; Software Engineer, Fairflow</p>
                <p className="text-xs text-gray-500">Open-source commerce platform for South African merchants</p>
              </div>
            </li>
            <li className="relative">
              <span className="absolute -left-[29px] top-1 h-2 w-2 rounded-full bg-green-600" aria-hidden="true" />
              <div className="space-y-0.5">
                <span className="font-mono text-xs font-semibold text-green-600">Today</span>
                <p className="text-sm font-semibold text-gray-900">Building Backend Systems, AI Applications &amp; Data Platforms</p>
                <p className="text-xs text-gray-500">Open to new engineering challenges</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* ── Skills ───────────────────────────────────────────────── */}
      <section aria-labelledby="skills-heading" className="space-y-6 border-t border-gray-200 pt-12">
        <h2 id="skills-heading" className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
          Skills
        </h2>
        <dl className="divide-y divide-gray-100 border-y border-gray-100">
          {skills.map((row) => (
            <div key={row.group} className="grid gap-1 py-3.5 sm:grid-cols-4 sm:gap-4">
              <dt className="text-sm font-semibold text-gray-900">{row.group}</dt>
              <dd className="text-sm text-gray-600 sm:col-span-3">{row.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Fairflow feature block ────────────────────────────────────── */}
      <section aria-labelledby="fairflow-heading" className="space-y-6 border-t border-gray-200 pt-12">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
              Featured Project
            </p>
            <h2 id="fairflow-heading" className="text-3xl font-extrabold tracking-tight text-gray-900">
              Fairflow
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
              Open-source commerce platform for South African merchants focused on payments, merchant onboarding, digital products, and developer tooling.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to="/project/fairflow"
              className="inline-flex items-center gap-1.5 rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-900 focus:outline-none"
            >
              View Case Study <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <a
              href="https://github.com/MatomeMb/.Things-That-Matter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-400 hover:bg-gray-50 focus:outline-none"
            >
              <FolderGit2 size={15} aria-hidden="true" />
              GitHub
            </a>
            <a
              href="https://fairflow.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-400 hover:bg-gray-50 focus:outline-none"
            >
              Live Demo <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-900">Monorepo architecture</h3>
            <p className="mt-1 text-sm text-gray-600">
              Three apps (auth-portal, shadow-index, matter-core) in npm workspaces — shared config,
              type-safe contracts, independent deploys.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-900">Paystack + Sumsub integration</h3>
            <p className="mt-1 text-sm text-gray-600">
              SA card/mobile-money checkout with HMAC-verified webhooks; KYC and payout orchestration
              via Sumsub, admin-proxied so secrets never hit the browser.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-900">Multi-actor auth model</h3>
            <p className="mt-1 text-sm text-gray-600">
              Merchant JWTs (stateless), Supabase sessions (staff), admin proxy (server-only
              ADMIN_SECRET) — clean separation, zero secret leakage.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:col-span-3">
            <h3 className="font-semibold text-gray-900">Portable product artifacts (.thing)</h3>
            <p className="mt-1 text-sm text-gray-600">
              Rust-backed schema validation (matter-core) produces signed, portable product files
              that work across any Fairflow-compatible surface — checkout, portal, extension.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:col-span-3">
            <h3 className="font-semibold text-gray-900">Production-minded open source</h3>
            <p className="mt-1 text-sm text-gray-600">
              Dockerised dev/prod parity, Vitest + Playwright CI, OpenAPI specs, ADRs, sanitised
              fixtures, public architecture docs — OSS at the standard of a shipped product.
            </p>
          </div>
        </div>
      </section>

      {/* ── Featured work ────────────────────────────────────────── */}
      <section aria-labelledby="featured-heading" className="space-y-6 border-t border-gray-200 pt-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="featured-heading" className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
            Featured engineering work
          </h2>
          <Link to="/projects" className="text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600 hover:underline">
            All projects
          </Link>
        </div>
        <ol className="divide-y divide-gray-100 border-y border-gray-100">
          {featuredProjects.map((project, i) => (
            <li key={project.id}>
              <Link
                to={`/project/${project.id}`}
                className="group grid gap-1 py-5 transition-colors sm:grid-cols-12 sm:items-baseline sm:gap-4"
              >
                <span aria-hidden="true" className="font-mono text-xs text-gray-400 sm:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] font-semibold text-gray-900 group-hover:text-blue-600 sm:col-span-4">
                  {project.name}
                </span>
                <span className="text-sm text-gray-600 sm:col-span-6">{project.line}</span>
                <span className="flex items-center gap-1 font-mono text-xs text-gray-400 sm:col-span-1 sm:justify-end">
                  <ArrowUpRight
                    size={14}
                    className="text-gray-300 transition-colors group-hover:text-blue-600"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ── GitHub repositories ──────────────────────────────────── */}
      <section aria-labelledby="github-heading" className="space-y-6 border-t border-gray-200 pt-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="github-heading" className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
            Recent repositories
          </h2>
          <a
            href="https://github.com/MatomeMb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600 hover:underline"
          >
            github.com/MatomeMb
          </a>
        </div>
        <ul className="divide-y divide-gray-100 border-y border-gray-100">
          {displayRepos.map((repo) => (
            <li key={repo.name} className="py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-sm font-semibold text-gray-900 hover:text-blue-600"
                >
                  <FolderGit2 size={15} className="text-gray-400" aria-hidden="true" />
                  {repo.name}
                </a>
                <span className="flex items-center gap-3 text-xs text-gray-500">
                  {repo.language && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-gray-300" aria-hidden="true" />
                      {repo.language}
                    </span>
                  )}
                  {repo.stargazers_count > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Star size={12} aria-hidden="true" />
                      {repo.stargazers_count}
                    </span>
                  )}
                </span>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-gray-600">
                {repo.description ?? "No description provided."}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-400">
          Live data from the GitHub API, with a pinned fallback set when the API is unreachable.
        </p>
      </section>
    </div>
  );
}
