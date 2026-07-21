import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowLeft } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  date: string;
  readTime: string;
  summary: string;
  tags: string[];
  content: React.ReactNode;
}

export default function Writing() {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  const articles: Article[] = [
    {
      id: 'validation-first-ocr',
      title: 'Validation-first OCR: why "accuracy" isn\'t enough',
      date: 'Oct 15, 2025',
      readTime: '5 min read',
      summary: 'In production OCR, errors often look plausible and silently poison downstream systems. Learn how validation-first extraction and confidence gating neutralizes semantic risks.',
      tags: ['OCR', 'Production AI', 'Reliability'],
      content: (
        <div className="space-y-6 text-sm text-[#CBD5E1] leading-relaxed">
          <p>
            When people talk about OCR accuracy, they usually mean character-level recognition rates.
            A system that reads 98% of characters correctly sounds impressive—until you realise that
            the remaining 2% can silently produce <em>plausible-looking</em> wrong answers that
            propagate through downstream systems unchecked.
          </p>

          <blockquote className="border-l-4 border-[#2563EB] bg-[#0F172A] px-4 py-3 rounded-r-lg my-4">
            <p className="text-[#F8FAFC] font-medium italic">
              "The most dangerous OCR error isn't the one that fails visibly. It's the one that looks correct but isn't."
            </p>
          </blockquote>

          <h3 className="text-base font-bold text-[#F8FAFC] pt-2">The problem with "accuracy" as a metric</h3>
          <p>
            Raw character accuracy is a useful benchmark, but it hides the errors that actually matter in production.
            Consider a document extraction pipeline for invoices:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>An "8" misread as "6" in a total field changes a financial amount by 25%.</li>
            <li>A transposed digit in a date field creates a valid but wrong date that passes basic validation.</li>
            <li>"O" (letter) and "0" (zero) are indistinguishable in many fonts—both produce valid outputs in most contexts.</li>
          </ul>

          <h3 className="text-base font-bold text-[#F8FAFC] pt-2">Validation-first design</h3>
          <p>
            Our core approach in document parsing pipelines is to treat extraction as inherently unreliable and build validation as the primary control, not an afterthought.
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-[#0F172A] border border-[#1E293B]">
              <strong className="text-[#F8FAFC] block mb-1">Layer 1: Format constraints</strong>
              <span>Before accepting any extracted value, check whether it conforms to the expected format. Dates should parse as dates. Amounts should be numeric.</span>
            </div>
            <div className="p-4 rounded-lg bg-[#0F172A] border border-[#1E293B]">
              <strong className="text-[#F8FAFC] block mb-1">Layer 2: Geometric validation</strong>
              <span>Where did the text come from on the page? Spatial coordinate checking prevents misaligned field mappings that formats alone would miss.</span>
            </div>
            <div className="p-4 rounded-lg bg-[#0F172A] border border-[#1E293B]">
              <strong className="text-[#F8FAFC] block mb-1">Layer 3: Cross-field rules</strong>
              <span>Fields don't exist in isolation. Line item amounts should sum to the total. A "ship date" shouldn't precede an "order date."</span>
            </div>
            <div className="p-4 rounded-lg bg-[#0F172A] border border-[#1E293B]">
              <strong className="text-[#F8FAFC] block mb-1">Layer 4: Confidence thresholds</strong>
              <span>Every extraction gets a confidence score. Below a threshold, the field is flagged for manual review rather than silently accepted.</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-[#F8FAFC] pt-2">Conclusion</h3>
          <p>
            In production OCR, the goal isn't to extract text perfectly—it's to produce outputs you can trust and audit. Validation-first design makes the difference between a demo that looks impressive and a system you'd actually deploy.
          </p>
        </div>
      ),
    },
    {
      id: 'rag-guardrails',
      title: 'RAG guardrails: being useful without hallucinating',
      date: 'Nov 12, 2025',
      readTime: '6 min read',
      summary: 'A good RAG system is as much about knowing when to refuse as it is about retrieval. Notes on deterministic indexing, conservative thresholds, and provenance.',
      tags: ['RAG', 'LLMs', 'AI Safety'],
      content: (
        <div className="space-y-6 text-sm text-[#CBD5E1] leading-relaxed">
          <p>
            Retrieval-augmented generation sounds straightforward in concept: retrieve relevant documents,
            feed them to a language model, get a grounded answer. In practice, the gap between "demo-ready"
            and "production-ready" is where most RAG systems fall apart.
          </p>

          <blockquote className="border-l-4 border-[#2563EB] bg-[#0F172A] px-4 py-3 rounded-r-lg my-4">
            <p className="text-[#F8FAFC] font-medium italic">
              "A good RAG system is as much about 'when to refuse' as it is about retrieval."
            </p>
          </blockquote>

          <h3 className="text-base font-bold text-[#F8FAFC] pt-2">The retrieval step is the true weak link</h3>
          <p>
            It's tempting to blame hallucinations on the language model alone, but in a RAG pipeline,
            the retrieval step introduces its own failure modes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>False relevance:</strong> A document that matches keywords but answers a different question.</li>
            <li><strong>Partial context:</strong> Chunks that contain related information but miss critical qualifiers.</li>
            <li><strong>Stale data:</strong> Documents that were accurate when indexed but are now outdated.</li>
            <li><strong>Missing evidence:</strong> The answer genuinely isn't in the corpus, but the model generates one anyway.</li>
          </ul>

          <h3 className="text-base font-bold text-[#F8FAFC] pt-2">The production principles</h3>
          <div className="space-y-4 font-sans text-sm">
            <p><strong>1. Deterministic indexing:</strong> Ingestion pipelines must be reproducible. Same files in, same index out. This means pinning embedding model versions and deterministic chunking parameters.</p>
            <p><strong>2. Conservative thresholds:</strong> Not every chunk is worth feeding the LLM. Set similarity thresholds that err on returning "not enough evidence" rather than weakly related content.</p>
            <p><strong>3. Provenance:</strong> Every answer should strictly link back to its coordinate source chunk or doc reference, enabling manual traceability.</p>
            <p><strong>4. Explicit refusal:</strong> If confidence falls below the similarity threshold, force an immediate safe "I don't have that detail" escape.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'shipping-discipline',
      title: 'Shipping discipline: small checks prevent big failures',
      date: 'Dec 05, 2025',
      readTime: '4 min read',
      summary: 'What helps me move fast safely: reproducible environments, dependency hygiene, automated checks, and clear definitions of done.',
      tags: ['CI/CD', 'Engineering Process', 'Best Practices'],
      content: (
        <div className="space-y-6 text-sm text-[#CBD5E1] leading-relaxed">
          <p>
            Speed without discipline produces technical debt, not velocity.
            The practices that help me move fast safely aren't complex—they're consistent.
            Most of them take minutes to set up and save hours of debugging in production later.
          </p>

          <blockquote className="border-l-4 border-[#2563EB] bg-[#0F172A] px-4 py-3 rounded-r-lg my-4">
            <p className="text-[#F8FAFC] font-medium italic">
              "The best debugging session is the one you never have to do."
            </p>
          </blockquote>

          <h3 className="text-base font-bold text-[#F8FAFC] pt-2">Core pillars of shipping discipline</h3>
          
          <div className="space-y-3 font-sans text-sm">
            <p><strong>1. Reproducible environments:</strong> "It works on my machine" is an expensive bottleneck. Use explicit lock files (poetry.lock,package-lock.json) and avoid floating packages in production pipelines.</p>
            <p><strong>2. Dependency hygiene:</strong> Every library added is a liability. Audit dependencies regularly, prefer thin, single-responsibility helpers, and keep the tree shallow.</p>
            <p><strong>3. Automated checks (The bare minimum):</strong> Configure lightweight GitHub actions that run linting, static typechecking, and basic unit test passes on every push.</p>
            <p><strong>4. Strict definition of done:</strong> A feature isn't done when it compiles. It's done when it's fully tested, edge cases are covered, log telemetry is clear, and the code is cleanly documented.</p>
          </div>
        </div>
      ),
    },
  ];

  const activeArticle = articles.find((a) => a.id === activeArticleId);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {activeArticle ? (
        /* Reader View */
        <div className="space-y-6">
          <button
            onClick={() => setActiveArticleId(null)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] hover:underline focus:outline-none mb-4"
          >
            <ArrowLeft size={16} /> Back to Publications
          </button>

          <div className="space-y-3 border-b border-[#1E293B] pb-6">
            <div className="flex flex-wrap gap-2">
              {activeArticle.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-0.5 bg-[#0F172A] border border-[#1E293B] text-[#CBD5E1] text-xs font-mono rounded">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
              {activeArticle.title}
            </h1>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1"><Calendar size={12} /> {activeArticle.date}</span>
              <span>&bull;</span>
              <span class="flex items-center gap-1"><Clock size={12} /> {activeArticle.readTime}</span>
            </div>
          </div>

          <div className="prose max-w-none pt-4">
            {activeArticle.content}
          </div>
        </div>
      ) : (
        /* Index List View */
        <div className="space-y-8">
          <div className="flex flex-col gap-2 border-b border-[#1E293B] pb-4">
            <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">Technical Writing</h1>
            <p className="text-[#CBD5E1] text-sm">Deep-dive structural analyses of system architecture, RAG, and production AI engineering.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art) => (
              <article
                key={art.id}
                onClick={() => setActiveArticleId(art.id)}
                className="p-6 border border-[#1E293B] bg-[#111827]/40 rounded-2xl flex flex-col justify-between hover-lift cursor-pointer focus-within:ring-2 focus-within:ring-[#2563EB]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>{art.date}</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#F8FAFC] leading-snug hover:text-[#2563EB] transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-[#CBD5E1] text-xs leading-relaxed font-light">
                    {art.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {art.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-[#0F172A] border border-[#1E293B] text-slate-400 text-[10px] font-mono rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-6 mt-4 border-t border-[#1E293B]/60 text-xs text-[#2563EB] font-bold hover:underline inline-flex items-center gap-1">
                  Read Article &rarr;
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
