import { useState } from "react";
import { Printer, Download } from "lucide-react";

interface Profile {
  label: string;
  title: string;
  summary: string;
  outcomes: string[];
  experience: { heading: string; period: string; bullets: string[] }[];
  skills: string[];
}

const profiles: Record<string, Profile> = {
  software: {
    label: "Software Engineer",
    title: "Software Engineer — Backend & Applied AI",
    summary:
      "Software engineer building production systems that hold up in deployment: validation-first OCR document automation, grounded retrieval (RAG) assistants, and backend platforms anchored in database-enforced correctness. BSc Computer Science & Computer Engineering, University of Cape Town.",
    outcomes: [
      "Eliminated silent OCR character-swap errors in production ledgers via four-layer validation gates at the API boundary.",
      "Measured 35% improvement in tutor-allocation efficiency through constraint-anchored scheduling software (UCT Science Learning Centre).",
      "89.33% reproducible test accuracy on FashionMNIST with a fully seed-locked PyTorch pipeline.",
    ],
    experience: [
      {
        heading: "Fairflow — Software Engineer",
        period: "2025 — Present",
        bullets: [
          "Design validation-first backend services in Python and TypeScript; schema validation runs before business logic at every API boundary.",
          "Built grounded RAG assistant: deterministic FAISS indices, conservative retrieval gating, explicit refusal paths.",
          "Locked environments to pinned lockfiles; instituted structured telemetry for audit-grade operations.",
        ],
      },
      {
        heading: "Science Learning Centre, UCT — Systems Developer",
        period: "Feb 2025 — Nov 2025",
        bullets: [
          "Built MyAdvisor scheduling system: relational invariants plus allocation scoring routine.",
          "Automated administrative imports with per-row validation.",
        ],
      },
    ],
    skills: ["Python", "TypeScript", "Java", "SQL", "C/C++", "Docker", "Git", "CI/CD", "Linux"],
  },
  backend: {
    label: "Backend Engineer",
    title: "Backend Engineer — APIs & Data Integrity",
    summary:
      "Backend specialist focused on contract-first API design, relational schema invariants and reproducible delivery. I put correctness where it cannot be bypassed — in constraints and validation boundaries — and verify with test suites that enumerate invalid transitions.",
    outcomes: [
      "Contract-first REST endpoints with consistent RFC 7807 error shapes and Jakarta Bean Validation at the boundary.",
      "Unique-constraint booking model eliminated double-bookings structurally, not procedurally.",
      "Pinned-lockfile container builds made staging and production byte-identical.",
    ],
    experience: [
      {
        heading: "Fairflow — Software Engineer",
        period: "2025 — Present",
        bullets: [
          "Service-layer defensive design: validation-first boundaries, structured telemetry on every workflow decision.",
          "PostgreSQL schema work: constraints, index shaping to measured access patterns, safe migrations.",
          "CI gates on every merge — lint, typecheck, tests, reproducible container build.",
        ],
      },
      {
        heading: "Science Learning Centre, UCT — Systems Developer",
        period: "Feb 2025 — Nov 2025",
        bullets: [
          "Spring Boot MVC services with RBAC across three roles and database-anchored booking invariants.",
          "Reduced administrative overhead via automated, validated bulk imports.",
        ],
      },
    ],
    skills: ["Java", "Spring Boot", "Python", "TypeScript", "PostgreSQL", "REST design", "Docker", "GitHub Actions"],
  },
  "data-engineer": {
    label: "Data Engineer",
    title: "Data Engineer — Pipelines & ETL",
    summary:
      "Data engineering grounded in one rule: invalid data stopped at ingestion is a non-event; invalid data discovered downstream is an incident. Pipelines are staged, validated and auditable, with every accepted record traceable to its source.",
    outcomes: [
      "Staged OCR ingestion: normalisation → extraction → four-layer validation → storage, with coordinate-level audit trails.",
      "Automated bulk imports with per-row validation reports, removing manual entry error classes.",
      "Schema design enforcing invariants at write time rather than cleanup jobs at read time.",
    ],
    experience: [
      {
        heading: "Fairflow — Software Engineer",
        period: "2025 — Present",
        bullets: [
          "Document ingestion pipelines: OpenCV normalisation, tabular extraction, validation gating before ledger writes.",
          "Deterministic data routines: hash-guarded rebuilds, no silent staleness.",
        ],
      },
      {
        heading: "Science Learning Centre, UCT — Systems Developer",
        period: "Feb 2025 — Nov 2025",
        bullets: [
          "ETL-style CSV import paths with per-row validation and rejection reporting.",
          "PostgreSQL schema and constraint design for scheduling data.",
        ],
      },
    ],
    skills: ["Python", "SQL", "PostgreSQL", "Pandas", "ETL design", "OpenCV", "Docker", "Google Cloud"],
  },
  analytics: {
    label: "Analytics Engineer",
    title: "Analytics Engineer — Metrics & Insight",
    summary:
      "Analytics work that starts from defensible data: validated inputs, reproducible transformations, and metrics that can be traced back to the records that produced them.",
    outcomes: [
      "Model evaluation discipline: 89.33% test accuracy reported from a single held-out evaluation, reproducible from committed config.",
      "Scheduling efficiency quantified (35%) from before/after operational comparison.",
      "Structured telemetry converted into queryable operational insight.",
    ],
    experience: [
      {
        heading: "Fairflow — Software Engineer",
        period: "2025 — Present",
        bullets: [
          "Confidence-score distributions used to tune review thresholds with precision/recall evidence.",
          "Structured logs as the dataset for operational reporting.",
        ],
      },
      {
        heading: "Science Learning Centre, UCT — Systems Developer",
        period: "Feb 2025 — Nov 2025",
        bullets: [
          "Quantified scheduling throughput before and after automation.",
          "Administrative reporting built on clean relational sources.",
        ],
      },
    ],
    skills: ["SQL", "Python", "Pandas", "NumPy", "Metrics design", "PostgreSQL", "Advanced Excel"],
  },
  ai: {
    label: "AI Engineer",
    title: "AI Engineer — RAG & Production ML",
    summary:
      "Applied AI with a reliability bias: grounded retrieval that knows when to refuse, document intelligence with validation as the control plane, and model pipelines built to be reproduced rather than admired.",
    outcomes: [
      "Zero-hallucination retrieval posture: cosine-gated FAISS retrieval with explicit refusal paths and per-answer citations.",
      "OCR document intelligence: OpenCV preprocessing plus layered validation producing ledger-safe extractions.",
      "Reproducible deep learning: seed-locked PyTorch pipeline, 89.33% test accuracy, JSON metrics artefacts per run.",
    ],
    experience: [
      {
        heading: "Fairflow — Software Engineer",
        period: "2025 — Present",
        bullets: [
          "RAG assistant: sentence-transformer embeddings, pinned model versions, deterministic indices, gated generation.",
          "OCR pipeline: skew correction, Otsu binarisation, coordinate segmentation, confidence gating.",
        ],
      },
      {
        heading: "University of Cape Town — BSc CS & Computer Engineering",
        period: "2020 — 2025",
        bullets: [
          "PyTorch CNN classifier with locked seeds and held-out evaluation discipline.",
          "Coursework across ML, computer vision and algorithms.",
        ],
      },
    ],
    skills: ["Python", "PyTorch", "FAISS", "Sentence embeddings", "OpenCV", "LLM APIs", "Streamlit", "Docker"],
  },
};

const order = ["software", "backend", "data-engineer", "analytics", "ai"];

export default function Resume() {
  const [activeId, setActiveId] = useState("software");
  const profile = profiles[activeId];

  return (
    <div className="space-y-8 py-14">
      {/* Controls — screen only */}
      <div className="print-hidden flex flex-wrap items-end justify-between gap-4">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Resume</h1>
          <p className="max-w-xl leading-relaxed text-gray-600">
            One engineer, five professional emphasis profiles. Select the profile that matches the
            role you are hiring for, then print or save as PDF.
          </p>
        </header>
        <div className="flex gap-2">
          <a
            href="resume.pdf"
            download
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none"
          >
            <Download size={14} aria-hidden="true" /> resume.pdf
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none"
          >
            <Printer size={14} aria-hidden="true" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Profile tabs — screen only */}
      <div className="print-hidden flex flex-wrap gap-2" role="tablist" aria-label="Resume profiles">
        {order.map((id) => (
          <button
            key={id}
            role="tab"
            aria-selected={activeId === id}
            onClick={() => setActiveId(id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none ${
              activeId === id
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
            }`}
          >
            {profiles[id].label}
          </button>
        ))}
      </div>

      {/* Resume sheet — prints cleanly */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 sm:p-10 print:rounded-none print:border-0 print:p-0">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Matome Mbowene</h2>
            <p className="mt-0.5 text-sm font-semibold text-blue-600">{profile.title}</p>
            <p className="mt-2 text-sm text-gray-600">
              Johannesburg, South Africa (open to relocation) ·{" "}
              <a href="mailto:matomepontso@gmail.com" className="text-blue-600">
                matomepontso@gmail.com
              </a>
            </p>
            <p className="text-sm text-gray-600">
              <a href="https://github.com/MatomeMb" className="text-blue-600">
                github.com/MatomeMb
              </a>{" "}
              ·{" "}
              <a href="https://linkedin.com/in/matomembowene" className="text-blue-600">
                linkedin.com/in/matomembowene
              </a>{" "}
              ·{" "}
              <a href="https://www.matomembowene.co.za" className="text-blue-600">
                matomembowene.co.za
              </a>
            </p>
          </div>
        </header>

        <section className="space-y-2 border-b border-gray-100 py-5">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
            Profile
          </h3>
          <p className="leading-relaxed text-gray-700">{profile.summary}</p>
        </section>

        <section className="space-y-2 border-b border-gray-100 py-5">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
            Verified outcomes
          </h3>
          <ul className="list-disc space-y-1 pl-5 leading-relaxed text-gray-700 marker:text-gray-300">
            {profile.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 border-b border-gray-100 py-5">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
            Experience
          </h3>
          {profile.experience.map((exp) => (
            <div key={exp.heading} className="space-y-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-semibold text-gray-900">{exp.heading}</h4>
                <span className="font-mono text-xs text-gray-500">{exp.period}</span>
              </div>
              <ul className="list-disc space-y-1 pl-5 leading-relaxed text-gray-700 marker:text-gray-300">
                {exp.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="grid gap-6 py-5 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
              Education
            </h3>
            <p className="font-semibold text-gray-900">University of Cape Town</p>
            <p className="text-sm text-gray-700">
              BSc Computer Science &amp; Computer Engineering, 2020 – 2025
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
              Programmes
            </h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>Google Cloud Career Launchpad — Cloud Engineering track</li>
              <li>Dell Young Leaders — leadership development programme</li>
              <li>EY Uncovered — technology consulting insight programme</li>
            </ul>
          </div>
        </section>

        <section className="space-y-2 border-t border-gray-100 pt-5">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-500">
            Skills for this profile
          </h3>
          <p className="leading-relaxed text-gray-700">{profile.skills.join(" · ")}</p>
        </section>
      </div>
    </div>
  );
}
