import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Terminal, Cpu, Database, Cloud, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons.tsx';

interface Repo {
  name: string;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
}

export default function Home() {
  // Fetch real-time GitHub repos using TanStack Query
  const { data: repos, isError } = useQuery<Repo[]>({
    queryKey: ['github-repos'],
    queryFn: async () => {
      const res = await fetch('https://api.github.com/users/MatomeMb/repos?sort=updated&per_page=10');
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      return data.filter((r: any) => !r.fork && r.name !== 'MatomeMb.website' && r.name !== 'matomembowene.github.io').slice(0, 4);
    },
    retry: 1,
  });

  const focusAreas = [
    { title: 'AI Engineering', desc: 'Retrieval systems, guardrails, and model pipelines.', icon: <Cpu className="text-[#2563EB]" size={18} /> },
    { title: 'Backend Systems', desc: 'API architectures, schema design, and validations.', icon: <Terminal className="text-[#2563EB]" size={18} /> },
    { title: 'Data Platforms', desc: 'Secure data extraction, ETL, and DB integrations.', icon: <Database className="text-[#2563EB]" size={18} /> },
    { title: 'Cloud Technologies', desc: 'Isolated staging, container configurations, and CI/CD.', icon: <Cloud className="text-[#2563EB]" size={18} /> },
  ];

  const toolbox = [
    { cat: 'Languages', items: ['Python', 'Java', 'TypeScript', 'SQL', 'C/C++', 'Rust (Intro)'] },
    { cat: 'Backend', items: ['Spring Boot', 'Node.js', 'Express', 'FastAPI', 'REST APIs', 'WebSockets'] },
    { cat: 'Artificial Intelligence', items: ['PyTorch', 'FAISS', 'RAG Pipelines', 'OpenCV', 'LLM APIs'] },
    { cat: 'Cloud & DevOps', items: ['Docker', 'Google Cloud', 'Linux / Bash', 'GitHub Actions', 'CI/CD'] },
    { cat: 'Databases & Data Eng', items: ['PostgreSQL', 'MySQL', 'ETL Pipelines', 'Pandas', 'Schema Design'] },
    { cat: 'Productivity Platforms', items: ['Advanced Excel', 'Word & PowerPoint', 'Outlook', 'Agile / Jira'] },
  ];

  const fallbackRepos = [
    {
      name: 'personal-codex-agent',
      html_url: 'https://github.com/MatomeMb/personal-codex-agent',
      description: 'Grounded, private RAG assistant utilizing FAISS, sentence embeddings, and conservative retrieval gating.',
      language: 'Python',
      stargazers_count: 5,
    },
    {
      name: 'FashionMNIST-Classifier',
      html_url: 'https://github.com/MatomeMb/FashionMNIST-Classifier',
      description: 'Full machine learning pipeline in PyTorch to train, validate, and test classification metrics.',
      language: 'Python',
      stargazers_count: 2,
    },
    {
      name: 'Operating-Systems-Scheduling_Algos',
      html_url: 'https://github.com/MatomeMb/Operating-Systems-Scheduling_Algos',
      description: 'Operating system CPU scheduling algorithm benchmarks for CPU allocation (FIFO, SJF, RR) written in Python.',
      language: 'Python',
      stargazers_count: 3,
    },
    {
      name: 'Connected-Components-Image-Processor',
      html_url: 'https://github.com/MatomeMb/Connected-Components-Image-Processor',
      description: 'Image processing component labeling algorithm optimized for execution speed in standard C++.',
      language: 'C++',
      stargazers_count: 1,
    },
  ];

  const displayRepos = isError || !repos ? fallbackRepos : repos;

  return (
    <div className="space-y-20 py-8 font-sans">
      {/* Hero Section - Minimalist & Impactful */}
      <section className="space-y-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1E293B] bg-[#0F172A] text-xs font-semibold text-[#2563EB]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span> Available for Software Engineering Roles
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#F8FAFC] tracking-tight">
            Matome Mbowene
          </h1>
          <p className="text-lg sm:text-xl font-mono text-[#CBD5E1] tracking-tight uppercase">
            Software Engineer
          </p>
        </div>

        <p className="text-xl sm:text-2xl text-[#CBD5E1] leading-relaxed font-light max-w-2xl">
          Building intelligent software, AI-powered backend systems, automation platforms, and scalable data solutions.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded hover-lift focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            View Projects
          </Link>
          <Link
            to="/resume"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#CBD5E1] bg-[#111827] border border-[#1E293B] hover:bg-[#0F172A] rounded hover-lift focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            Download CV
          </Link>
          <a
            href="https://github.com/MatomeMb"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded bg-[#111827] border border-[#1E293B] text-[#CBD5E1] hover:text-[#2563EB] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            aria-label="GitHub Profile"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href="https://linkedin.com/in/matomembowene"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded bg-[#111827] border border-[#1E293B] text-[#CBD5E1] hover:text-[#2563EB] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            aria-label="LinkedIn Profile"
          >
            <LinkedinIcon size={18} />
          </a>
        </div>
      </section>

      {/* Current Focus Grid */}
      <section className="space-y-6">
        <h2 className="text-xs uppercase tracking-wider font-bold text-slate-500 font-mono">Current Focus</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {focusAreas.map((focus) => (
            <div key={focus.title} className="p-5 rounded-xl border border-[#1E293B] bg-[#111827]/10 flex flex-col gap-3">
              <div className="w-8 h-8 rounded bg-[#0F172A] border border-[#1E293B] flex items-center justify-center">
                {focus.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#F8FAFC]">{focus.title}</h3>
                <p className="text-xs text-[#CBD5E1] mt-1 font-light">{focus.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section - Strictly max 120 words focusing on engineering, software, and systems */}
      <section className="flex flex-col md:flex-row gap-8 border-t border-[#1E293B]/40 pt-12">
        <div className="md:w-1/3">
          <h2 className="text-xs uppercase tracking-wider font-bold text-slate-500 font-mono">Profile &amp; Philosophy</h2>
        </div>
        <div className="md:w-2/3 space-y-4">
          <p className="text-[#CBD5E1] text-base leading-relaxed font-light">
            I am a Software Engineer with a Computer Science and Computer Engineering background from the University of Cape Town. I engineer backend systems, AI-powered applications, automation platforms, and scalable data solutions using Python, Java, TypeScript, and cloud technologies. My focus is correctness, reliability, and measurable outcomes.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-[#1E293B] pl-3 font-mono">
            "I design software defensively, securing pipelines with multi-layered schema constraints and auditability."
          </p>
        </div>
      </section>

      {/* Engineering Toolbox Matrix */}
      <section className="space-y-6 border-t border-[#1E293B]/40 pt-12">
        <h2 className="text-xs uppercase tracking-wider font-bold text-slate-500 font-mono">Engineering Toolbox</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolbox.map((box) => (
            <div key={box.cat} className="p-5 rounded-xl border border-[#1E293B] bg-[#0F172A]/20 space-y-3 hover:border-slate-800 transition-colors">
              <h3 className="text-xs font-bold text-[#F8FAFC] tracking-wider uppercase font-mono">{box.cat}</h3>
              <div className="flex flex-wrap gap-1.5">
                {box.items.map((item) => (
                  <span key={item} className="px-2 py-0.5 bg-[#111827] border border-[#1E293B] text-[#CBD5E1] text-xs font-mono rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic GitHub Repos Pinned List */}
      <section className="space-y-6 border-t border-[#1E293B]/40 pt-12">
        <div className="flex justify-between items-baseline flex-wrap gap-2">
          <h2 className="text-xs uppercase tracking-wider font-bold text-slate-500 font-mono">Featured Repositories</h2>
          <a
            href="https://github.com/MatomeMb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#2563EB] hover:underline flex items-center gap-1 font-semibold"
          >
            Explore all on GitHub <ExternalLink size={12} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayRepos.map((repo) => (
            <div
              key={repo.name}
              className="flex flex-col justify-between border border-[#1E293B] bg-[#111827]/10 p-5 rounded-xl hover:border-[#2563EB]/20 hover:bg-[#111827]/30 transition-all font-mono"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#F8FAFC]">
                  <FileText className="text-[#2563EB]" size={16} />
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold hover:text-[#2563EB] transition-colors"
                  >
                    {repo.name}
                  </a>
                </div>
                <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed font-light line-clamp-2">
                  {repo.description || 'No description provided.'}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 mt-2 border-t border-[#1E293B]/50">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span> {repo.language || 'Code'}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-0.5">
                  <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  {repo.stargazers_count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Preview Router Links */}
      <section className="space-y-6 border-t border-[#1E293B]/40 pt-12">
        <div className="flex justify-between items-baseline flex-wrap gap-2">
          <h2 className="text-xs uppercase tracking-wider font-bold text-slate-500 font-mono">Strongest Projects</h2>
          <Link to="/projects" className="text-xs text-[#2563EB] hover:underline flex items-center gap-1 font-semibold">
            All Projects &amp; Case Studies &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 border border-[#1E293B] bg-[#111827]/10 rounded-xl space-y-3 hover:border-slate-800 transition-colors">
            <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase">Computer Vision / AI</span>
            <h3 className="text-lg font-bold text-[#F8FAFC]">OCR Document Automation</h3>
            <p className="text-xs text-[#CBD5E1] font-light leading-relaxed">
              Validation-first parsing pipeline utilizing OpenCV binarisations and custom coordinate summing rules to block malformed accounting imports.
            </p>
            <Link to="/project/ocr-document-automation" className="text-xs text-[#2563EB] font-bold hover:underline inline-flex items-center gap-1 pt-1">
              Read In-depth Case Study <ArrowRight size={12} />
            </Link>
          </div>

          <div className="p-6 border border-[#1E293B] bg-[#111827]/10 rounded-xl space-y-3 hover:border-slate-800 transition-colors">
            <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase">Retrieval Augmented Gen</span>
            <h3 className="text-lg font-bold text-[#F8FAFC]">RAG AI Assistant</h3>
            <p className="text-xs text-[#CBD5E1] font-light leading-relaxed">
              Grounded search assistant utilizing FAISS semantic chunking indexes and strict cosine distance similarity threshold barriers.
            </p>
            <Link to="/project/rag-assistant" className="text-xs text-[#2563EB] font-bold hover:underline inline-flex items-center gap-1 pt-1">
              Read In-depth Case Study <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
