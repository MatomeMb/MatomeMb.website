import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowUpRight, Star, FolderGit2 } from "lucide-react";
import MermaidDiagram from "../components/MermaidDiagram.tsx";

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

const skills = [
  { group: "Backend", items: ["Python", "Java", "TypeScript", "Rust"] },
  { group: "AI & Machine Learning", items: ["PyTorch", "FAISS", "OpenCV", "LLMs"] },
  { group: "Data", items: ["PostgreSQL", "SQL", "ETL", "OCR"] },
  { group: "Cloud", items: ["Google Cloud", "Supabase", "Cloudflare"] },
  { group: "Infrastructure", items: ["Docker", "GitHub Actions", "Linux"] },
];

const featuredProjects = [
  {
    id: "fairflow",
    name: "Fairflow",
    tag: "Open-source commerce",
    line: "Open-source commerce platform for South African merchants focused on payments, merchant onboarding, digital products, and developer tooling.",
  },
  {
    id: "ocr-document-automation",
    name: "OCR Document Automation",
    tag: "Computer Vision",
    line: "Validation-first document extraction pipeline with coordinate audits, cross-field arithmetic checks, and confidence-gated manual reviews.",
  },
  {
    id: "myadvisor",
    name: "MyAdvisor",
    tag: "Scheduling System",
    line: "Constraint-anchored scheduling system for tutoring allocation that structurally eliminated double-bookings.",
  },
  {
    id: "rag-assistant",
    name: "RAG Knowledge Assistant",
    tag: "Applied AI",
    line: "Grounded semantic retrieval system with persistent FAISS index gating and explicit refusal boundaries.",
  },
  {
    id: "fashionmnist-classifier",
    name: "FashionMNIST Classifier",
    tag: "Machine Learning",
    line: "Fully reproducible PyTorch CNN classifier with seed locking and epoch-level metric outputs.",
  },
  {
    id: "stm32-embedded",
    name: "STM32 Embedded Systems",
    tag: "Embedded / Low-level",
    line: "Bare-metal C microcontroller firmware featuring register-level peripheral configurations and UART timing windows.",
  },
];

const fairflowChart = `flowchart LR
  Portal["auth-portal (React/Vite)"] <--> API["shadow-index (Hono/Vercel)"]
  API <--> Supabase["Supabase (Auth + Postgres)"]
  API <--> R2["Cloudflare R2 (Artifacts)"]
  API <--> Paystack["Paystack (Payments)"]
  API <--> Sumsub["Sumsub (KYC)"]`;

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
            className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl leading-tight"
          >
            Building reliable backend systems, AI applications, and developer platforms.
          </h1>
          <div className="space-y-1">
            <p className="text-xl font-bold tracking-tight text-gray-900">Matome Mbowene</p>
            <p className="text-sm font-semibold text-gray-500">Software Engineer</p>
            <p className="text-xs text-gray-400">
              BSc Computer Science &amp; Computer Engineering, University of Cape Town
            </p>
            <p className="text-xs text-gray-400 font-semibold">
              Johannesburg, South Africa
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
            Resume
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-400 hover:bg-gray-50 focus:outline-none"
          >
            Contact
          </Link>
        </div>
      </section>

      {/* ── Fairflow Centerpiece ────────────────────────────────────── */}
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
              Case Study <ArrowRight size={15} aria-hidden="true" />
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

        {/* Live Architecture Diagram of the centerpiece */}
        <div className="pt-2">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            System Topology
          </p>
          <MermaidDiagram chart={fairflowChart} caption="Fig 1. Fairflow context topology. Custom monorepo architecture integrated with Paystack, Sumsub, Supabase and Cloudflare R2." />
        </div>

        {/* Small technology chips */}
        <div className="pt-2 space-y-2">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-400">
            Key Technologies
          </p>
          <ul className="flex flex-wrap gap-1.5" aria-label="Key technologies">
            {["TypeScript", "Rust", "React", "Supabase", "Hono", "Docker", "Paystack", "Cloudflare R2"].map((tech) => (
              <li
                key={tech}
                className="rounded border border-gray-200 bg-gray-50 px-2.5 py-0.5 font-mono text-xs text-gray-600"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Selected Engineering Work ────────────────────────────── */}
      <section aria-labelledby="featured-heading" className="space-y-6 border-t border-gray-200 pt-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="featured-heading" className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
            Selected Engineering Work
          </h2>
          <Link to="/projects" className="text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600 hover:underline">
            All projects
          </Link>
        </div>
        <ol className="divide-y divide-gray-100 border-y divide-solid">
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

      {/* ── Skills & Tech Stack ──────────────────────────────────── */}
      <section aria-labelledby="skills-heading" className="space-y-6 border-t border-gray-200 pt-12">
        <h2 id="skills-heading" className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
          Tech Stack
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

      {/* ── Engineering Journey (Chronological Experience) ────────── */}
      <section aria-labelledby="timeline-heading" className="grid gap-6 border-t border-gray-200 pt-12 md:grid-cols-3">
        <h2 id="timeline-heading" className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
          Engineering Journey
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
                <p className="text-sm font-semibold text-gray-900">Dell Young Leaders</p>
                <p className="text-xs text-gray-500">Multi-year leadership and professional development programme</p>
              </div>
            </li>
            <li className="relative">
              <span className="absolute -left-[29px] top-1 h-2 w-2 rounded-full bg-neutral-300" aria-hidden="true" />
              <div className="space-y-0.5">
                <span className="font-mono text-xs font-semibold text-gray-500">2025</span>
                <p className="text-sm font-semibold text-gray-900">Systems Developer, Science Learning Centre, UCT</p>
                <p className="text-xs text-gray-500">Built scheduling systems and database invariants</p>
              </div>
            </li>
            <li className="relative">
              <span className="absolute -left-[29px] top-1 h-2 w-2 rounded-full bg-neutral-300" aria-hidden="true" />
              <div className="space-y-0.5">
                <span className="font-mono text-xs font-semibold text-gray-500">2025</span>
                <p className="text-sm font-semibold text-gray-900">EY Uncovered</p>
                <p className="text-xs text-gray-500">Enterprise technology consulting insight programme</p>
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
                <p className="text-sm font-semibold text-gray-900">Backend Engineering &middot; AI Systems &middot; Open Source</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* ── Recent GitHub repositories ────────────────────────────── */}
      <section aria-labelledby="github-heading" className="space-y-6 border-t border-gray-200 pt-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="github-heading" className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
            Recent Repositories
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
