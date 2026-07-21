import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, ShieldCheck } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  category: 'ai-ml' | 'backend' | 'systems' | 'nda';
  categoryLabel: string;
  summary: string;
  problem: string;
  solution: string;
  outcome: string;
  tech: string[];
  github?: string;
  hasCaseStudy: boolean;
}

export default function Projects() {
  const [searchTerm, setSearchInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'ai-ml' | 'backend' | 'systems' | 'nda'>('all');

  const projectsList: Project[] = [
    {
      id: 'ocr-document-automation',
      name: 'OCR Document Automation',
      category: 'ai-ml',
      categoryLabel: 'Computer Vision / AI',
      summary: 'A validation-first document processing pipeline designed to eliminate manual data entry. Built with layered validation rules, confidence-based gating, and trace-logging.',
      problem: 'Silent OCR errors polluting downstream services.',
      solution: 'Multi-layer constraints & confidence review gating.',
      outcome: 'High coordinate field-mapping accuracy on defined sets.',
      tech: ['Python', 'OpenCV', 'OCR Tooling', 'Data Validation'],
      github: 'https://github.com/MatomeMb',
      hasCaseStudy: true,
    },
    {
      id: 'rag-assistant',
      name: 'RAG AI Assistant',
      category: 'ai-ml',
      categoryLabel: 'Retrieval Augmented Gen',
      summary: 'A private, grounded information retrieval system designed to eliminate model hallucinations. Employs deterministic FAISS indexing, embedding persistence, and strict confidence gating.',
      problem: 'AI models hallucinating facts absent from the corpus.',
      solution: 'Deterministic index & strict retrieval gating constraints.',
      outcome: 'Zero-hallucination queries with high retrieval precision.',
      tech: ['Python', 'FAISS', 'Embeddings', 'Streamlit'],
      github: 'https://github.com/MatomeMb/personal-codex-agent',
      hasCaseStudy: true,
    },
    {
      id: 'fashionmnist-classifier',
      name: 'FashionMNIST Classifier',
      category: 'ai-ml',
      categoryLabel: 'Machine Learning',
      summary: 'An end-to-end PyTorch training and evaluation pipeline for clothing image classification, featuring strict parameter tracking and automated metric logging.',
      problem: 'Need for a reproducible, auditable deep learning training config.',
      solution: 'Repeatable neural pipeline with strict seed lock.',
      outcome: '89.33% verification test accuracy under clean runs.',
      tech: ['Python', 'PyTorch', 'Neural Networks', 'Metrics Evaluation'],
      github: 'https://github.com/MatomeMb/FashionMNIST-Classifier',
      hasCaseStudy: true,
    },
    {
      id: 'myadvisor',
      name: 'MyAdvisor Full-Stack App',
      category: 'backend',
      categoryLabel: 'Full-Stack Application',
      summary: 'A robust full-stack web application designed for student advisory and academic guidance services. Employs modern backend services and databases.',
      problem: 'Inefficient manual academic advisor scheduling and tracking.',
      solution: 'Automated MVC student booking pipeline and notifications.',
      outcome: 'Streamlined tutoring administration with robust logs.',
      tech: ['TypeScript', 'Node.js', 'PostgreSQL', 'APIs'],
      github: 'https://github.com/MatomeMb',
      hasCaseStudy: true,
    },
    {
      id: 'scheduling-systems',
      name: 'Scheduling & OS Systems',
      category: 'systems',
      categoryLabel: 'Systems Programming',
      summary: 'Operating system CPU scheduling algorithm simulations (FIFO, SJF, RR) and number range summarization benchmarks in Python and Java.',
      problem: 'CPU bottlenecking due to non-optimized task schedulers.',
      solution: 'Measurement-driven algorithmic simulations to benchmark FIFO/SJF.',
      outcome: '35% tutoring scheduler booking throughput improvement.',
      tech: ['Python', 'Java', 'Algorithms', 'Benchmarking'],
      github: 'https://github.com/MatomeMb/Operating-Systems-Scheduling_Algos',
      hasCaseStudy: true,
    },
    {
      id: 'embedded-navigation',
      name: 'Embedded & Edge Navigation',
      category: 'systems',
      categoryLabel: 'Systems & Embedded',
      summary: 'Connected components image labeling and slide puzzle simulations optimized for memory footprint and execution speed in standard C++.',
      problem: 'Compute boundaries on resource-constrained micro-controllers.',
      solution: 'Memory-safe component allocation & deterministic state trees.',
      outcome: 'Extremely fast coordinate image processing cycles.',
      tech: ['C++', 'Algorithms', 'Memory Optimization'],
      github: 'https://github.com/MatomeMb/Connected-Components-Image-Processor',
      hasCaseStudy: true,
    },
    {
      id: 'confidential-ai-build',
      name: 'Confidential AI Product Build',
      category: 'nda',
      categoryLabel: 'Enterprise Software',
      summary: 'Designed enterprise AI features, scalable data flows, and CI/CD foundations on a production pipeline under strict NDA guidelines.',
      problem: 'Undisclosed private pipeline constraints.',
      solution: 'High-availability microservice architecture & defensive logic.',
      outcome: 'Successful production release (architecture public-safe).',
      tech: ['Proprietary Tech', 'Microservices', 'CI Pipelines'],
      hasCaseStudy: true,
    },
  ];

  const filteredProjects = projectsList.filter((proj) => {
    const text = (proj.name + ' ' + proj.summary + ' ' + proj.tech.join(' ')).toLowerCase();
    const matchesSearch = text.includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || proj.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">Engineering Projects</h1>
          <p className="text-[#CBD5E1] text-sm">Real products and repositories built for production stability and high correctness.</p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-500" size={16} />
            <input
              type="search"
              placeholder="Search tech/projects..."
              value={searchTerm}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-[#0F172A] border border-[#1E293B] rounded-lg text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-[#2563EB] w-full sm:w-48"
            />
          </div>

          <div className="flex flex-wrap gap-1 border border-[#1E293B] bg-[#0F172A]/50 p-1 rounded-lg">
            {(['all', 'ai-ml', 'backend', 'systems', 'nda'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md border border-transparent transition-all ${
                  activeFilter === filter
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* NDA Disclosures Banner */}
      <div className="p-5 rounded-xl border border-[#1E293B] bg-[#111827]/40 space-y-3 text-sm">
        <h3 className="text-[#F8FAFC] font-bold flex items-center gap-2">
          <ShieldCheck className="text-[#2563EB]" size={18} />
          NDA Disclosures Framework
        </h3>
        <p className="text-[#CBD5E1] leading-relaxed text-xs">
          Client listings, private endpoints, and proprietary schemas are restricted.
          I discuss problem framings, architectural trade-offs, testing models, and high-level validation boundaries openly during professional interview cycles.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="flex flex-col justify-between border border-[#1E293B] bg-[#111827]/10 p-6 rounded-2xl hover-lift"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#2563EB] tracking-wider uppercase">
                  {proj.categoryLabel}
                </span>
                <span className="text-[10px] text-slate-500 font-mono uppercase bg-[#0F172A] px-2 py-0.5 border border-[#1E293B] rounded">
                  {proj.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#F8FAFC] tracking-tight">{proj.name}</h3>
              <p className="text-[#CBD5E1] text-xs leading-relaxed font-light">{proj.summary}</p>
              
              <div className="grid grid-cols-3 gap-2 text-xs bg-[#020617]/50 p-3 rounded-lg border border-[#1E293B]/60 font-mono text-[10px]">
                <div>
                  <span className="block text-slate-500 uppercase text-[9px]">Problem</span>
                  <span className="text-[#CBD5E1] font-medium block truncate">{proj.problem}</span>
                </div>
                <div>
                  <span className="block text-slate-500 uppercase text-[9px]">Solution</span>
                  <span className="text-[#CBD5E1] font-medium block truncate">{proj.solution}</span>
                </div>
                <div>
                  <span className="block text-slate-500 uppercase text-[9px]">Outcome</span>
                  <span className="text-[#2563EB] font-bold block truncate">{proj.outcome}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {proj.tech.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 bg-[#0F172A] border border-[#1E293B] text-[#CBD5E1] text-xs font-mono rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-[#1E293B]/60 mt-6 text-sm font-medium">
              {proj.hasCaseStudy ? (
                <Link to={`/project/${proj.id}`} className="inline-flex items-center gap-1.5 text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                  Read Case Study &rarr;
                </Link>
              ) : (
                <span className="text-xs text-slate-500 italic">No case study required</span>
              )}
              {proj.github && (
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors ml-auto"
                >
                  GitHub <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
