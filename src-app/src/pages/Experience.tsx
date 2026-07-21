import React from 'react';
import { Calendar, Briefcase } from 'lucide-react';

export default function Experience() {
  const experiences = [
    {
      company: 'Fairflow',
      role: 'Software Engineer',
      dates: 'Jan 2025 - Present',
      summary: 'Architecting high-consequence backend services and robust AI features.',
      responsibilities: [
        {
          title: 'Validation-First OCR Pipeline',
          detail: 'Spearheaded OpenCV normalizations and multi-layer validation checks, preventing silent OCR typos and ensuring high coordinate extraction accuracy.',
        },
        {
          title: 'Retrieval systems (RAG)',
          detail: 'Built persistent FAISS vector indices with conservative similarity constraints, securing fully grounded, hallucination-free generation pipelines.',
        },
        {
          title: 'System telemetry & hygiene',
          detail: 'Locked software environments via pinned lock-files (npm/Poetry) and designed structured telemetry logging to establish highly audit-grade operations.',
        },
      ],
      technologies: ['Python', 'TypeScript', 'OpenCV', 'FAISS', 'Docker', 'PostgreSQL', 'REST APIs', 'CI/CD'],
      achievements: [
        'Delivered production document workflows with traceable coordinate audit logs.',
        'Established full reproducible environment builds, reducing deployment discrepancies to absolute zero.',
      ],
    },
    {
      company: 'University of Cape Town',
      role: 'Science Learning Centre – Systems Developer',
      dates: 'Feb 2025 - Nov 2025',
      summary: 'Designing tutoring system schedulers and academic advisor platforms.',
      responsibilities: [
        {
          title: 'Scheduling optimization',
          detail: 'Formulated custom multi-criteria scheduling algorithms in Java and Python, securing tutoring booking efficiencies and administrative speedups.',
        },
        {
          title: 'Full stack databases',
          detail: 'Optimized PostgreSQL relations, compiled robust MVC patterns, and secured multi-role user schemas.',
        },
      ],
      technologies: ['Java', 'Python', 'SQL', 'PostgreSQL', 'Spring Boot', 'REST APIs', 'MVC'],
      achievements: [
        'Obtained a verified 35% scheduling efficiency and throughput improvement for tutor allocation bookings.',
        'Successfully automated administrative imports, maintaining near-perfect system availability.',
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-[#1E293B] pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">Work Experience</h1>
        <p className="text-[#CBD5E1] text-sm">Professional software engineering and platform development milestones.</p>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l border-[#1E293B] space-y-12">
        {experiences.map((exp, idx) => (
          <div key={exp.company} className="relative space-y-4">
            {/* Timeline node */}
            <span className="absolute -left-[31px] sm:-left-[35px] top-1.5 w-4 h-4 rounded-full bg-[#111827] border border-[#1E293B] ring-4 ring-[#020617] flex items-center justify-center">
              <span className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-[#2563EB]' : 'bg-slate-500'}`}></span>
            </span>

            {/* Header info */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#F8FAFC] tracking-tight">{exp.company}</h3>
                <p className="text-sm font-semibold font-mono text-[#2563EB]">{exp.role}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 bg-[#0F172A] border border-[#1E293B] px-3 py-1 rounded-full">
                <Calendar size={12} />
                <span>{exp.dates}</span>
              </div>
            </div>

            <p className="text-sm text-[#CBD5E1] font-light italic">{exp.summary}</p>

            {/* Responsibilities list */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500 font-mono">Responsibilities &amp; Impact</h4>
              <ul className="space-y-3">
                {exp.responsibilities.map((resp) => (
                  <li key={resp.title} className="text-sm leading-relaxed text-[#CBD5E1] pl-4 border-l-2 border-[#1E293B] hover:border-[#2563EB] transition-colors">
                    <strong className="text-[#F8FAFC]">{resp.title}:</strong> {resp.detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Achievements */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500 font-mono">Key Achievements</h4>
              <ul className="list-disc pl-5 text-sm text-[#CBD5E1] space-y-1">
                {exp.achievements.map((ach) => (
                  <li key={ach}>{ach}</li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div className="pt-2">
              <div className="flex flex-wrap gap-1.5">
                {exp.technologies.map((tech) => (
                  <span key={tech} className="px-2.5 py-0.5 bg-[#0F172A] border border-[#1E293B] text-[#CBD5E1] text-xs font-mono rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
