import { useEffect, useId, useRef, useState } from "react";

interface MermaidDiagramProps {
  chart: string;
  caption?: string;
}

/**
 * Renders a Mermaid diagram. The `mermaid` package is loaded lazily via a
 * dynamic import so it never lands in the initial bundle; Vite emits it as a
 * separate chunk that is fetched only when a diagram is actually mounted.
 * The library instance is cached on first load for subsequent diagrams.
 */
let mermaidModule: typeof import("mermaid") | null = null;

async function getMermaid() {
  if (!mermaidModule) {
    mermaidModule = await import("mermaid");
    mermaidModule.default.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      themeVariables: {
        background: "#FFFFFF",
        primaryColor: "#F8FAFC",
        primaryTextColor: "#111827",
        primaryBorderColor: "#D1D5DB",
        lineColor: "#6B7280",
        secondaryColor: "#FFFFFF",
        tertiaryColor: "#F8FAFC",
        noteBkgColor: "#F8FAFC",
        noteTextColor: "#374151",
        noteBorderColor: "#D1D5DB",
        actorBkg: "#F8FAFC",
        actorBorder: "#9CA3AF",
        actorTextColor: "#111827",
        signalColor: "#4B5563",
        signalTextColor: "#111827",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "13px",
      },
    });
  }
  return mermaidModule.default;
}

export default function MermaidDiagram({ chart, caption }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const rawId = useId();
  const id = `mmd-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    let cancelled = false;

    getMermaid()
      .then(async (mermaid) => {
        const { svg } = await mermaid.render(id, chart.trim());
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre className="ascii-diagram" role="img" aria-label={caption ?? "Diagram (failed to render)"}>
        {chart}
      </pre>
    );
  }

  return (
    <figure className="mermaid-figure space-y-2">
      <div
        ref={containerRef}
        className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-4"
        role="img"
        aria-label={caption ?? "Architecture diagram"}
      />
      {caption && (
        <figcaption className="font-mono text-xs text-gray-500">{caption}</figcaption>
      )}
    </figure>
  );
}
