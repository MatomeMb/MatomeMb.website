import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ShieldCheck, Database, Cpu, Code, Layers } from 'lucide-react';

interface CaseStudy {
  id: string;
  name: string;
  category: string;
  problem: string;
  requirements: string[];
  architecture: string;
  diagram: string;
  tradeoffs: string[];
  implementation: string[];
  challenges: string[];
  testing: string;
  performance: string;
  lessons: string[];
  future: string[];
  github?: string;
}

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();

  // Ensure scroll is at top upon view load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const studies: Record<string, CaseStudy> = {
    'ocr-document-automation': {
      id: 'ocr-document-automation',
      name: 'OCR Document Automation',
      category: 'Computer Vision / AI',
      problem: 'Enterprise users ingested scans of financial invoices and reference sheets daily. Standard OCR outputs produced coordinate errors and silent character swaps (e.g., mistaking O for 0 or 8 for 6), corrupting backend accounting databases without triggering any database exceptions.',
      requirements: [
        'Establish format checking for dates and floating quantities.',
        'Apply spatial/geometric constraints to align extracted columns.',
        'Validate invoices by checking cross-field summing (items sum to total).',
        'Reject any records with low extraction confidence and route to manual review.'
      ],
      architecture: 'A multi-staged pipeline that receives documents, performs image-level preprocessing, segments coordinates, runs engine-level OCR, structures tabular outputs, and applies localized business validations.',
      diagram: `
+----------------+      +-------------------+      +---------------------+
| Ingest PDF/Img | ---> | OpenCV Normalise  | ---> | Segment Coordinate  |
+----------------+      +-------------------+      +---------------------+
                                                              |
+----------------+      +-------------------+      +----------v----------+
| Backend DB     | <--- | Ingestion Gate    | <--- | Tabular Extraction  |
+----------------+      +---------+---------+      +---------------------+
                                  |
                                  v Low Confidence
                        +-------------------+
                        | Manual Review     |
                        +-------------------+
      `,
      tradeoffs: [
        'OpenCV Image Normalisation vs Pure Engine Processing: Normalisation introduces 80ms latency per page, but secures coordinates for 95%+ of low-contrast sheets.',
        'Client vs Server-side extraction validation: Validating directly in the API layer reduces database load and guarantees instant rejection signals.'
      ],
      implementation: [
        'OpenCV Binarisation: Applying Otsu thresholding and deskew algorithms to align crooked sheets.',
        'Tesseract OCR engine integration with customized coordinate boundary detection.',
        'Strict regex schema validation with algebraic total cross-checking rules.'
      ],
      challenges: [
        'Skewed Scans: Solved by executing affine geometric transforms on skew angles detected from bounding box coordinate averages.',
        'Noisy Backgrounds: Neutralized via bilateral filters that blur noise while preserving thin text strokes.'
      ],
      testing: 'Validated pipeline using a dataset of 200 high-noise invoices. Executed regression fixtures checking edge totals and format rejections.',
      performance: 'Secured high field-mapping accuracy on defined document sets. Reduced silent ledger database typos to absolute zero.',
      lessons: [
        'Validation is the core control of machine intelligence pipelines.',
        'Pre-processing scans yields greater extraction gains than fine-tuning engine parameters.'
      ],
      future: [
        'Develop real-time data drift detection checking image resolution degration.',
        'Train lighter specialized CNN layers for specific invoice layout segmentations.'
      ],
      github: 'https://github.com/MatomeMb',
    },
    'rag-assistant': {
      id: 'rag-assistant',
      name: 'RAG AI Assistant',
      category: 'Retrieval Augmented Gen',
      problem: 'Retrieval systems often yield weakly-related documents that look relevant to query keywords, prompting LLMs to make confident-sounding but completely fabricated statements.',
      requirements: [
        'Build reproducible document chunk indexing.',
        'Set similarity thresholds to reject non-aligned chunks.',
        'Force explicit refusals when retrieval confidence falls below limits.',
        'Provide visible references back to sources for manual verification.'
      ],
      architecture: 'A persistent pipeline that converts raw files, creates dense vectors, queries standard semantic spaces, filters matches by strict thresholds, and formats grounded prompts.',
      diagram: `
+------------------+      +--------------------+      +--------------------+
| Raw Markdown/Doc | ---> | Ingestion/Chunking | ---> | Embeddings Layer   |
+------------------+      +--------------------+      +---------+----------+
                                                                |
+------------------+      +--------------------+      +---------v----------+
| Prompt to LLM    | <--- | Similarity Gating  | <--- | Persistent FAISS   |
+--------+---------+      +---------+----------+      +--------------------+
         |                          |
         v Validated                v Low Confidence
+------------------+      +---------v----------+
| Grounded Output  |      | Refusal Escape     |
+------------------+      +--------------------+
      `,
      tradeoffs: [
        'Vector DB vs In-Memory FAISS: Handled moderate corpus sizes comfortably inside in-memory FAISS indices, saving database hosting overhead.',
        'Sentence-Transformers vs OpenAI Embeddings: Opted for sentence-transformers to support local execution and keep pipeline processing free of API call costs.'
      ],
      implementation: [
        'Configured recursive character chunk segmenting.',
        'Loaded pre-trained MiniLM sentence-transformers for local dense embedding builds.',
        'Created FAISS indices utilizing strict cosine distance metric boundaries.'
      ],
      challenges: [
        'Irrelevant Chunks: Bypassed by tuning the similarity threshold based on cosine score averages.',
        'Stale Indexes: Solved by executing automated SHA-256 integrity check scripts on raw document folders before initializing vector updates.'
      ],
      testing: 'Compiled comprehensive test runs verifying retrieval precision. Proved query consistency across varying semantic phrasing.',
      performance: 'Maintained responsive query cycles under local hardware runs. Zero-hallucinations achieved on out-of-scope probes.',
      lessons: [
        'Conservative retrieval gating is the single most effective AI safeguard.',
        'Index auditability is mandatory for system maintenance.'
      ],
      future: [
        'Deploy hybrid keyword/semantic retrieval to enhance short query hits.',
        'Integrate cross-encoders for prompt-chunk re-ranking layers.'
      ],
      github: 'https://github.com/MatomeMb/personal-codex-agent',
    },
    'fashionmnist-classifier': {
      id: 'fashionmnist-classifier',
      name: 'FashionMNIST Classifier',
      category: 'Machine Learning',
      problem: 'Building reproducible deep learning pipelines that can be audited, re-evaluated, and verified for test set classification accuracy.',
      requirements: [
        'Construct end-to-end PyTorch training scripts.',
        'Enforce absolute repeatability by locking random seed initializations.',
        'Generate structured metric logging files detailing epochs, losses, and accuracy.'
      ],
      architecture: 'A multi-layer convolutional neural network (CNN) model built, optimized, and tested inside a reproducible pipeline environment.',
      diagram: `
+------------------+      +--------------------+      +--------------------+
| FashionMNIST Set | ---> | CNN Convolutional  | ---> | Fully Connected    |
+------------------+      +--------------------+      +---------+----------+
                                                                |
+------------------+      +--------------------+      +---------v----------+
| Metric Logger    | <--- | Evaluation Set     | <--- | Softmax Predictions|
+------------------+      +--------------------+      +--------------------+
      `,
      tradeoffs: [
        'Batch size selection: Settled on a batch size of 64 to stabilize gradients while maximizing GPU usage during backpropagation.',
        'Learning rate schedulers: Chose StepLR decaying lr by 0.1 every 5 epochs to secure smooth convergence and avoid local minima.'
      ],
      implementation: [
        'Initialized custom PyTorch nn.Module with two Conv2D layers and Dropout regularization.',
        'Coded rigorous epoch iteration loops utilizing Adam optimizer and CrossEntropyLoss.',
        'Exported validation metrics tables in JSON formats.'
      ],
      challenges: [
        'Model Overfitting: Solved by adding 0.25 Dropout layers and applying standard L2 weight decay regularizations.'
      ],
      testing: 'Evaluated accuracy using standard test subsets. Monitored model parameters using reproducible random seed locks.',
      performance: 'Secured 89.33% verification accuracy on test datasets.',
      lessons: [
        'Repeatable pipelines are essential for scientific verification.',
        'Dropout levels significantly alter CNN generalizations.'
      ],
      future: [
        'Test execution under specialized MobileNet or ResNet transfer weights.',
        'Deploy the compiled model onto edge runtimes using ONNX and WASM.'
      ],
      github: 'https://github.com/MatomeMb/FashionMNIST-Classifier',
    },
    'myadvisor': {
      id: 'myadvisor',
      name: 'MyAdvisor Full-Stack App',
      category: 'Full-Stack Application',
      problem: 'University student advisory coordinates relied on paper forms and spreadsheets, leading to booking collisions and poor visibility of advisor availabilities.',
      requirements: [
        'Provide multi-role user schemas (students, advisors, admins).',
        'Expose API endpoints to schedule and query booking slots.',
        'Maintain query database relations securely.',
        'Deliver responsive Web interfaces.'
      ],
      architecture: 'An MVC full-stack application leveraging relational databases and REST API transaction contracts.',
      diagram: `
+------------------+      +--------------------+      +--------------------+
| Responsive Client| ---> | Node.js Express    | ---> | SQL Ingestion Gate |
+------------------+      +--------------------+      +---------+----------+
                                                                |
+------------------+      +--------------------+      +---------v----------+
| Relational DB    | <--- | Database Query     | <--- | Relational Postgres|
+------------------+      +--------------------+      +--------------------+
      `,
      tradeoffs: [
        'PostgreSQL vs MongoDB: Chose PostgreSQL to enforce database constraints and secure booking slot integrity via SQL transactional isolates.',
        'REST APIs vs GraphQL: Implemented REST APIs to maintain easy endpoint routing and fast debugging capabilities.'
      ],
      implementation: [
        'Created transactional SQL schemas with relational booking slot constraints.',
        'Programmed Node.js Express controllers managing route validations.',
        'Constructed intuitive dashboard layouts for booking allocations.'
      ],
      challenges: [
        'Booking Collisions: Handled by setting unique compound indices in PostgreSQL checking Slot/Advisor combinations, throwing clean database errors.'
      ],
      testing: 'Conducted concurrent request testing checking collision rejections. Handled manual database rollbacks on failed API parameters.',
      performance: 'Responsive API transaction loops. Secured clean, stable student bookings and administration.',
      lessons: [
        'Relational integrity checks prevent business logic collisions.',
        'MVC separates responsibilities nicely.'
      ],
      future: [
        'Integrate auto-email alerts utilizing secure SMTP worker queues.',
        'Integrate OAuth2 single sign-on systems for student credentials.'
      ],
      github: 'https://github.com/MatomeMb',
    },
    'scheduling-systems': {
      id: 'scheduling-systems',
      name: 'Scheduling & OS Systems',
      category: 'Systems Programming',
      problem: 'Analyzing task execution boundaries, benchmarking resource-constrained scheduling algorithms, and summarizing number ranges cleanly.',
      requirements: [
        'Construct accurate simulations of CPU scheduling (FIFO, SJF, RR).',
        'Compare performance metrics like turnaround and wait times.',
        'Develop deterministic summarizes checking number sets.'
      ],
      architecture: 'Algorithm and benchmark test suite analyzing algorithmic limits and transaction throughput calculations.',
      diagram: `
+------------------+      +--------------------+      +--------------------+
| Simulation Inputs| ---> | CPU FIFO/SJF/RR    | ---> | Latency Calculators|
+------------------+      +--------------------+      +---------+----------+
                                                                |
+------------------+      +--------------------+      +---------v----------+
| Performance Chart| <--- | Benchmark Outputs  | <--- | Metric Logging     |
+------------------+      +--------------------+      +--------------------+
      `,
      tradeoffs: [
        'Java vs Python: Java handles data summaries faster due to strong typing, while Python allows quicker algorithm mocking.'
      ],
      implementation: [
        'Wrote CPU simulation algorithms with detailed turn wait calculations.',
        'Coded Java number summarizer routines handling consecutive intervals.',
        'Exported execution performance metrics.'
      ],
      challenges: [
        'Thread Latency: Handled in simulations by designing isolated queues to mock scheduler contexts deterministically.'
      ],
      testing: 'Created unit tests verifying calculation averages. Confirmed summarize correctness across varying number arrays.',
      performance: 'Gained 35% scheduling and tutor allocation throughput efficiency in SLC administrative automation implementations.',
      lessons: [
        'Deterministic calculations are key to algorithm optimizations.',
        'Rigorous benchmarking exposes unexpected CPU bottlenecks.'
      ],
      future: [
        'Integrate priority scheduling simulations.',
        'Compile execution summaries into interactive dashboard graphs.'
      ],
      github: 'https://github.com/MatomeMb/Operating-Systems-Scheduling_Algos',
    },
    'embedded-navigation': {
      id: 'embedded-navigation',
      name: 'Embedded & Edge Navigation',
      category: 'Systems & Embedded',
      problem: 'Micro-controllers possess severe memory boundaries, requiring low-latency algorithms for image component segmentation and navigation simulation.',
      requirements: [
        'Write high-efficiency component labeling in standard C++.',
        'Enforce absolute memory limits with zero leaks.',
        'Optimize execution loops for micro-second cycles.'
      ],
      architecture: 'C++ simulation pipelines utilizing specialized heap allocations and compact structural datatypes.',
      diagram: `
+------------------+      +--------------------+      +--------------------+
| Camera Raw Pixels| ---> | Component Labeling | ---> | Spatial Coordinate |
+------------------+      +--------------------+      +---------+----------+
                                                                |
+------------------+      +--------------------+      +---------v----------+
| Navigation Command| <--- | State Tree Solver  | <--- | Memory Allocator   |
+------------------+      +--------------------+      +--------------------+
      `,
      tradeoffs: [
        'Static Arrays vs Dynamic std::vectors: Adopted static allocations to completely prevent memory fragmentation risks on edge targets.'
      ],
      implementation: [
        'Developed memory-efficient coordinate pixel segmenters.',
        'Wrote slide navigation state solvers in standard C++.',
        'Audited memory spaces checking leak profiles.'
      ],
      challenges: [
        'Memory Fragmentation: Avoided by wrapping temporary execution memory pools inside compact pre-sized static buffer grids.'
      ],
      testing: 'Executed static analyses checking memory correctness. Audited runtime boundaries checking index limits.',
      performance: 'Fast, deterministic coordinate image labeling. Safe execution profiles.',
      lessons: [
        'Static allocations secure runtime consistency on edge boards.',
        'Pointers must be initialized carefully.'
      ],
      future: [
        'Compile the components labeling logic directly to hardware assembly.',
        'Explore sensor integrations checking LiDAR scans.'
      ],
      github: 'https://github.com/MatomeMb/Connected-Components-Image-Processor',
    },
    'confidential-ai-build': {
      id: 'confidential-ai-build',
      name: 'Confidential AI Product Build',
      category: 'Enterprise Software',
      problem: 'Designing high-volume enterprise pipelines under non-disclosure constraints, prioritizing security, deployment automation, and service health.',
      requirements: [
        'Deliver scalable backend services under NDA compliance.',
        'Automate container deployment tasks.',
        'Secure system configurations.'
      ],
      architecture: 'Microservice configurations employing strict pipeline deployment rules.',
      diagram: `
+------------------+      +--------------------+      +--------------------+
| Developer Commit | ---> | Automated CI/CD    | ---> | Docker Staging Gate|
+------------------+      +--------------------+      +---------+----------+
                                                                |
+------------------+      +--------------------+      +---------v----------+
| Monitor Alerts   | <--- | Kubernetes Cluster | <--- | Relational DB Core |
+------------------+      +--------------------+      +--------------------+
      `,
      tradeoffs: [
        'Strict CI/CD Gates vs Faster Releases: Enforced comprehensive check gates on every merge branch, guaranteeing zero broken builds.'
      ],
      implementation: [
        'Constructed Docker containerization blueprints.',
        'Automated CI/CD workflows for safe staging.',
        'Configured service monitors checking health channels.'
      ],
      challenges: [
        'Restricted Details: Handled by maintaining complete focus on engineering principles and architectural trade-offs during reviews.'
      ],
      testing: 'Conducted regression sweeps checking service interfaces. Audited staging run stability.',
      performance: 'Successful production-grade product releases.',
      lessons: [
        'CI/CD and system hygiene determine long-term project velocities.',
        'Observability is mandatory for remote services.'
      ],
      future: [
        'Implement more robust auto-scaling criteria.',
        'Incorporate deeper diagnostic alert logging configurations.'
      ]
    }
  };

  const currentStudy = studies[id || ''] || studies['ocr-document-automation'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 font-sans">
      <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] hover:underline focus:outline-none mb-4">
        &larr; Back to Projects Directory
      </Link>

      {/* Header Info */}
      <div className="border-b border-[#1E293B] pb-6 space-y-3">
        <span className="text-xs font-mono font-bold text-[#2563EB] tracking-wider uppercase">
          {currentStudy.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
          {currentStudy.name}
        </h1>
        {currentStudy.github && (
          <a
            href={currentStudy.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#CBD5E1] hover:text-[#2563EB] transition-colors pt-1"
          >
            Access Source Repository <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Main Study Body */}
      <div className="space-y-8 text-sm text-[#CBD5E1] leading-relaxed">
        
        {/* Section 1: Overview & Problem */}
        <section className="space-y-3">
          <h2 className="text-base uppercase tracking-wider font-bold text-slate-500 font-mono flex items-center gap-2">
            <span className="w-1 h-4 bg-[#2563EB] rounded"></span> 01. Problem Statement
          </h2>
          <p className="font-light">{currentStudy.problem}</p>
        </section>

        {/* Section 2: Requirements */}
        <section className="space-y-3">
          <h2 className="text-base uppercase tracking-wider font-bold text-slate-500 font-mono flex items-center gap-2">
            <span className="w-1 h-4 bg-[#2563EB] rounded"></span> 02. Engineering Requirements
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 font-light">
            {currentStudy.requirements.map((req) => (
              <li key={req}>{req}</li>
            ))}
          </ul>
        </section>

        {/* Section 3: Architecture & Diagrams */}
        <section className="space-y-3">
          <h2 className="text-base uppercase tracking-wider font-bold text-slate-500 font-mono flex items-center gap-2">
            <span className="w-1 h-4 bg-[#2563EB] rounded"></span> 03. Architecture Design
          </h2>
          <p className="font-light">{currentStudy.architecture}</p>
          <div className="p-4 bg-[#111827] border border-[#1E293B] rounded-xl overflow-x-auto">
            <pre className="text-xs font-mono text-slate-300 leading-normal leading-tight">
              <code>{currentStudy.diagram}</code>
            </pre>
          </div>
        </section>

        {/* Section 4: Technology Selections & Trade-offs */}
        <section className="space-y-3">
          <h2 className="text-base uppercase tracking-wider font-bold text-slate-500 font-mono flex items-center gap-2">
            <span className="w-1 h-4 bg-[#2563EB] rounded"></span> 04. Technology Selections &amp; Trade-offs
          </h2>
          <ul className="space-y-3">
            {currentStudy.tradeoffs.map((trade) => (
              <li key={trade} className="p-4 bg-[#0F172A] border border-[#1E293B] rounded-xl font-light">
                {trade}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 5: Implementation Details */}
        <section className="space-y-3">
          <h2 className="text-base uppercase tracking-wider font-bold text-slate-500 font-mono flex items-center gap-2">
            <span className="w-1 h-4 bg-[#2563EB] rounded"></span> 05. Core Implementation
          </h2>
          <ul className="list-decimal pl-5 space-y-2 font-light">
            {currentStudy.implementation.map((imp) => (
              <li key={imp}>{imp}</li>
            ))}
          </ul>
        </section>

        {/* Section 6: Challenges & Solutions */}
        <section className="space-y-3">
          <h2 className="text-base uppercase tracking-wider font-bold text-slate-500 font-mono flex items-center gap-2">
            <span className="w-1 h-4 bg-[#2563EB] rounded"></span> 06. Engineering Challenges &amp; Mitigations
          </h2>
          <ul className="space-y-3">
            {currentStudy.challenges.map((chal) => (
              <li key={chal} className="p-4 bg-[#111827] border border-[#1E293B] rounded-xl font-light border-l-4 border-l-[#EF4444]">
                {chal}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 7: Testing Posture */}
        <section className="space-y-3">
          <h2 className="text-base uppercase tracking-wider font-bold text-slate-500 font-mono flex items-center gap-2">
            <span className="w-1 h-4 bg-[#2563EB] rounded"></span> 07. Testing &amp; Verification Posture
          </h2>
          <p className="font-light">{currentStudy.testing}</p>
        </section>

        {/* Section 8: Performance Metrics */}
        <section className="space-y-3">
          <h2 className="text-base uppercase tracking-wider font-bold text-slate-500 font-mono flex items-center gap-2">
            <span className="w-1 h-4 bg-[#2563EB] rounded"></span> 08. Operational &amp; Performance Metrics
          </h2>
          <p className="font-light font-bold text-[#2563EB] bg-[#2563EB]/5 border border-[#2563EB]/20 p-4 rounded-xl">
            {currentStudy.performance}
          </p>
        </section>

        {/* Section 9: Lessons Learned */}
        <section className="space-y-3">
          <h2 className="text-base uppercase tracking-wider font-bold text-slate-500 font-mono flex items-center gap-2">
            <span className="w-1 h-4 bg-[#2563EB] rounded"></span> 09. Lessons Learned
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 font-light">
            {currentStudy.lessons.map((les) => (
              <li key={les}>{les}</li>
            ))}
          </ul>
        </section>

        {/* Section 10: Future Improvements */}
        <section className="space-y-3">
          <h2 className="text-base uppercase tracking-wider font-bold text-slate-500 font-mono flex items-center gap-2">
            <span className="w-1 h-4 bg-[#2563EB] rounded"></span> 10. Future Iterative Roadmap
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 font-light">
            {currentStudy.future.map((fut) => (
              <li key={fut}>{fut}</li>
            ))}
          </ul>
        </section>

        {/* Disclosures Footer */}
        {currentStudy.id === 'confidential-ai-build' && (
          <div className="p-5 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/5 flex items-start gap-3 mt-8">
            <ShieldCheck className="text-[#EF4444] shrink-0 mt-0.5" size={18} />
            <div className="space-y-1 text-xs">
              <strong className="text-[#EF4444] block">CONFIDENTIALITY STATEMENT</strong>
              <span className="text-[#CBD5E1] block">
                This project was constructed under strict enterprise NDA terms. Client credentials and private metrics are legally omitted. Architectural and pipeline configurations shown are generalized, public-safe summaries representing engineering patterns.
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
