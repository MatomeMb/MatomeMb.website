import React, { useState } from 'react';
import { Mail, Linkedin, Github, FileText, Printer, Award } from 'lucide-react';

interface KPI {
  val: string;
  lbl: string;
}

interface Exp {
  title: string;
  period: string;
  bullets: string[];
}

interface ResumeData {
  role: string;
  summary: string;
  kpis: KPI[];
  outcomes: string[];
  experience: Exp[];
  skills: string[];
}

export default function Resume() {
  const [activeRole, setActiveRole] = useState<string>('software');

  const resumeFocusData: Record<string, ResumeData> = {
    software: {
      role: "Software Engineer (Backend & AI Focus)",
      summary: "I build production-grade software and intelligent systems that hold up in real deployments: validation-first OCR document automation, grounded retrieval systems (RAG), and high-performance backend platforms. Deeply committed to engineering discipline, automated quality checks, and clean architectures.",
      kpis: [
        { val: "High", lbl: "OCR FIELD-MAPPING ACCURACY" },
        { val: "89.33%", lbl: "FASHIONMNIST TEST ACCURACY" },
        { val: "35%", lbl: "SCHEDULING EFFICIENCY GAIN" }
      ],
      outcomes: [
        "High OCR field-mapping accuracy on defined document sets using validation-first pre-processing.",
        "89.33% FashionMNIST image classifier validation test accuracy in PyTorch.",
        "35% scheduling and tutor allocation efficiency improvement using Java algorithms."
      ],
      experience: [
        {
          title: "Fairflow — Software Engineer",
          period: "2025",
          bullets: [
            "Designed and optimized high-integrity backend systems, API endpoints, and database models in Python and TypeScript.",
            "Built a validation-first OCR pipeline with OpenCV scan normalization, multi-layer checks, and confidence scoring.",
            "Developed a grounded RAG AI Assistant with FAISS and sentence embeddings, using strict retrieval gating."
          ]
        },
        {
          title: "University of Cape Town — Systems Developer",
          period: "2025",
          bullets: [
            "Engineered tutoring scheduler algorithms in Python/Java, yielding a 35% scheduling efficiency gain.",
            "Created full-stack student advisory interfaces and streamlined database relations."
          ]
        }
      ],
      skills: ["Python", "Java", "TypeScript", "SQL", "C/C++", "Spring Boot", "Express", "PyTorch", "FAISS", "Docker", "CI/CD", "Linux"]
    },
    backend: {
      role: "Backend Engineer (Distributed Systems & APIs)",
      summary: "Specializing in high-performance API design, relational/non-relational database optimization, and scalable backend architectures. I apply rigorous testing, automated CI/CD checks, and strict dependency management to build extremely stable, resilient enterprise platforms.",
      kpis: [
        { val: "35%", lbl: "SCHEDULING TELEMETRY GAIN" },
        { val: "Validation", lbl: "FIRST API SCHEMA DESIGN" },
        { val: "Active", lbl: "CI/CD BUILD HYGIENE" }
      ],
      outcomes: [
        "Attained a 35% operational scheduling efficiency gain through custom API pipeline architectures.",
        "Designed robust relational schema optimizations and automated database migrations.",
        "Implemented contract-first REST API boundaries to isolate and secure backend data integrity."
      ],
      experience: [
        {
          title: "Fairflow — Software Engineer",
          period: "2025",
          bullets: [
            "Architected robust, thread-safe API endpoints and backend validation layers in Python and TypeScript.",
            "Integrated PostgreSQL schema migrations, ensuring complete backward compatibility and data safety.",
            "Managed dependency hygiene and locked production runs using strict lock-files and type checking."
          ]
        },
        {
          title: "University of Cape Town — Systems Developer",
          period: "2025",
          bullets: [
            "Developed multi-threaded Java scheduling engines and automated transactional student advisor APIs.",
            "Decreased operational database latency by optimizing database relations and building clean MVC patterns."
          ]
        }
      ],
      skills: ["Python", "Java", "TypeScript", "SQL", "Spring Boot", "Node.js", "Express", "REST APIs", "PostgreSQL", "MySQL", "Docker", "Linux", "CI/CD"]
    },
    'data-eng': {
      role: "Data Engineer (Scalable Pipelines & ETL)",
      summary: "Focuses on designing, building, and automating robust data pipelines, ETL workflows, and high-integrity data systems. Experienced in structuring raw scans, optimizing queries, and applying multi-layer validation checks to prevent invalid data from polluting downstream data lakes.",
      kpis: [
        { val: "Structured", lbl: "OCR DATA PARSING SCHEMA" },
        { val: "35%", lbl: "ETL SCHEDULING SAVINGS" },
        { val: "Postgres", lbl: "DATABASE OPTIMIZATION" }
      ],
      outcomes: [
        "Developed high-accuracy validation-first tabular data extraction routines in Python and Pandas.",
        "Automated file ingestion tasks, reducing execution delay and tutor scheduling gaps by 35%.",
        "Engineered custom relational database schemas and vectorized data translation scripts."
      ],
      experience: [
        {
          title: "Fairflow — Software Engineer",
          period: "2025",
          bullets: [
            "Built validation-first data pipelines to normalize and ingest documents into relational storage.",
            "Programmed automated image preprocessing routines using OpenCV to stabilize text coordinates.",
            "Authored deterministic dataset compilation tasks wrapped in Docker containers."
          ]
        },
        {
          title: "University of Cape Town — Systems Developer",
          period: "2025",
          bullets: [
            "Optimized batch-scheduling data routines in Java/Python, producing a 35% tutor allocation throughput gain.",
            "Configured relational Postgres data repositories and designed clean ETL interfaces."
          ]
        }
      ],
      skills: ["Python", "SQL", "PostgreSQL", "MySQL", "ETL Pipelines", "Pandas", "NumPy", "Data Validation", "Docker", "Google Cloud", "Linux", "Git"]
    },
    'data-analyst': {
      role: "Data Analyst (Data Science & Business Intelligence)",
      summary: "Turning complex datasets into actionable business intelligence and high-fidelity metrics. I combine statistical validation, reproducible data exploration, and advanced database querying to deliver clear visual dashboards, predictive modeling, and verified proof-points.",
      kpis: [
        { val: "89.33%", lbl: "IMAGE DISTRIB CLASSIF ACC" },
        { val: "35%", lbl: "WORKFLOW AUTOMATION GAIN" },
        { val: "Advanced", lbl: "MICROSOFT EXCEL RECOGNITION" }
      ],
      outcomes: [
        "Analyzed neural network metrics, achieving 89.33% categorization accuracy on visual FashionMNIST datasets.",
        "Constructed SQL data audit reports and Excel formulas to enhance tutor-student scheduling by 35%.",
        "Generated document coordinate confidence scores to trace and validate financial numbers."
      ],
      experience: [
        {
          title: "Fairflow — Software Engineer",
          period: "2025",
          bullets: [
            "Validated document coordinate text data distributions and structured confidence matrices.",
            "Formulated reproducible Python testing configurations to compile classification validation runs."
          ]
        },
        {
          title: "University of Cape Town — Systems Developer",
          period: "2025",
          bullets: [
            "Built analytical metrics tables and automated scheduling databases, decreasing tutor booking overheads by 35%.",
            "Synthesized administrative data summaries utilizing Advanced Microsoft Excel, Word, and PowerPoint charts."
          ]
        }
      ],
      skills: ["Python", "SQL", "Pandas", "NumPy", "Data Analysis", "PostgreSQL", "MySQL", "Advanced Excel", "Word & PowerPoint", "Outlook"]
    },
    ai: {
      role: "AI Engineer (RAG & Production ML)",
      summary: "I bridge the gap between machine learning models and production deployments. Focuses on grounded retrieval-augmented generation (RAG) assistant pipelines with deterministic indexing, conservative retrieval gating, OpenCV computer vision pipelines, and deep neural network training.",
      kpis: [
        { val: "89.33%", lbl: "FASHIONMNIST TEST ACC" },
        { val: "Grounded", lbl: "RAG SEMANTIC SEARCH" },
        { val: "OpenCV", lbl: "COMPUTER VISION PIPELINES" }
      ],
      outcomes: [
        "Created repeatable training pipelines in PyTorch, establishing 89.33% test classification accuracy.",
        "Designed grounded retrieval logic using FAISS, completely avoiding hallucinatory answers.",
        "Developed OpenCV image normalizers to stabilize coordinate mappings in scanning workflows."
      ],
      experience: [
        {
          title: "Fairflow — Software Engineer",
          period: "2025",
          bullets: [
            "Programmed RAG pipelines using sentence-transformers, FAISS, and LLM APIs with retrieval gating.",
            "Architected OpenCV preprocessing filters to normalize scanning files for robust field-mapping.",
            "Tuned confidence validation boundaries to secure AI-generated outputs against drift."
          ]
        },
        {
          title: "University of Cape Town — Systems Developer",
          period: "2025",
          bullets: [
            "Researched and integrated algorithmic pattern-matching to schedule tutoring bookings with 35% higher efficiency.",
            "Shipped full-stack advisor assistant software with defensive verification."
          ]
        }
      ],
      skills: ["Python", "PyTorch", "FAISS", "RAG Pipelines", "OpenCV", "LLM APIs", "Embeddings", "Streamlit", "Docker", "Git"]
    }
  };

  const currentData = resumeFocusData[activeRole] || resumeFocusData.software;

  const tabList = [
    { id: 'software', label: 'Software Engineer' },
    { id: 'backend', label: 'Backend Engineer' },
    { id: 'data-eng', label: 'Data Engineer' },
    { id: 'data-analyst', label: 'Data Analyst' },
    { id: 'ai', label: 'AI Engineer' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Action Header - Hides on Print */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E293B] pb-4 print:hidden">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">Interactive Resume Selector</h1>
          <p className="text-[#CBD5E1] text-sm">Choose a target job profile below to dynamically tailor the CV focus.</p>
        </div>
        <div className="flex gap-2">
          <a
            href="resume.pdf"
            download
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#CBD5E1] bg-[#111827] hover:bg-[#0F172A] border border-[#1E293B] rounded transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            Download resume.pdf
          </a>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Role Picker Navigation Tabs - Hides on Print */}
      <div className="flex flex-wrap gap-2 border-b border-[#1E293B] pb-2 print:hidden" role="tablist" aria-label="Resume Profiles">
        {tabList.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeRole === tab.id}
            onClick={() => setActiveRole(tab.id)}
            className={`text-sm font-semibold px-4 py-2 border-b-2 transition-all focus:outline-none ${
              activeRole === tab.id
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-400 hover:text-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Resume Sheet - Stylable for screen or direct printing */}
      <div className="border border-[#1E293B] bg-[#111827]/10 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl print:border-0 print:bg-white print:text-black print:p-0 print:shadow-none">
        
        {/* Contact/Bio Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 border-b border-[#1E293B]/60 pb-6 print:border-slate-300">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight print:text-black">{activeRole === 'software' ? 'Matome Mbowene' : 'Matome Mbowene'}</h2>
            <p className="text-sm font-semibold text-[#2563EB] font-mono mt-1 print:text-blue-700">{currentData.role}</p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#CBD5E1] font-medium mt-3 print:text-slate-800">
              <span>Cape Town, South Africa</span>
              <span>&bull;</span>
              <a href="mailto:matomepontso@gmail.com" className="print:text-black">matomepontso@gmail.com</a>
              <span>&bull;</span>
              <a href="https://github.com/MatomeMb" target="_blank" rel="noopener noreferrer" className="print:text-black">github.com/MatomeMb</a>
              <span>&bull;</span>
              <a href="https://linkedin.com/in/matomembowene" target="_blank" rel="noopener noreferrer" className="print:text-black">linkedin.com/in/matomembowene</a>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-mono bg-[#0F172A] px-3 py-1.5 rounded border border-[#1E293B] print:hidden">
            Verifiable Portfolio Profile
          </span>
        </div>

        {/* Quantified Outcome KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentData.kpis.map((kpi) => (
            <div key={kpi.lbl} className="border border-[#1E293B] bg-[#0F172A]/20 p-4 rounded-xl text-center print:border-slate-300 print:bg-slate-50">
              <strong className="text-[#2563EB] text-xl font-bold font-mono block print:text-blue-700">{kpi.val}</strong>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-1">{kpi.lbl}</span>
            </div>
          ))}
        </div>

        {/* Brief Professional Profile */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500 font-mono">Professional Summary</h4>
          <p className="text-[#CBD5E1] text-sm leading-relaxed font-light print:text-slate-800">
            {currentData.summary}
          </p>
        </div>

        <hr className="border-[#1E293B]/60 print:border-slate-300" />

        {/* Key outcomes list */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500 font-mono">Quantified Outcomes</h4>
          <ul className="list-disc pl-5 text-sm text-[#CBD5E1] space-y-2 print:text-slate-800">
            {currentData.outcomes.map((out) => (
              <li key={out}>{out}</li>
            ))}
          </ul>
        </div>

        <hr className="border-[#1E293B]/60 print:border-slate-300" />

        {/* Experience sections */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500 font-mono">Recent Achievements &amp; Impact</h4>
          <div className="space-y-6">
            {currentData.experience.map((exp) => (
              <div key={exp.title} className="space-y-2">
                <div className="flex justify-between items-baseline flex-wrap gap-2">
                  <strong className="text-sm font-bold text-[#F8FAFC] print:text-black">{exp.title}</strong>
                  <span className="text-xs font-mono text-slate-500">{exp.period}</span>
                </div>
                <ul className="list-disc pl-5 text-sm text-[#CBD5E1] space-y-1.5 print:text-slate-800">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-[#1E293B]/60 print:border-slate-300" />

        {/* Footer info: Education, Certs, Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500 font-mono mb-2">Education</h4>
              <p className="text-sm text-[#F8FAFC] font-semibold print:text-black">University of Cape Town</p>
              <p className="text-xs text-[#CBD5E1] print:text-slate-800">Computer Science &amp; Computer Engineering</p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500 font-mono mb-2">Certifications &amp; Programs</h4>
              <ul className="list-disc pl-5 text-xs text-[#CBD5E1] space-y-1 print:text-slate-800">
                <li>Google Cloud skill badge(s) (Credly)</li>
                <li>Dell Young Leaders (Leadership Program)</li>
                <li>Google Cloud Innovators (Legacy Member)</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2 border-l border-[#1E293B]/40 pl-0 md:pl-6 print:border-slate-300">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500 font-mono">Profile Targeted Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {currentData.skills.map((skill) => (
                <span key={skill} className="px-2 py-0.5 bg-[#0F172A] border border-[#1E293B] text-[#CBD5E1] text-xs font-mono rounded print:border-slate-400 print:bg-slate-100 print:text-slate-900">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
