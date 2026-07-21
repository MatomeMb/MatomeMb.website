import { Suspense, lazy } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "../layouts/Layout.tsx";
import Home from "../pages/Home.tsx";
import Projects from "../pages/Projects.tsx";
import ProjectDetails from "../pages/ProjectDetails.tsx";
import Experience from "../pages/Experience.tsx";
import Writing from "../pages/Writing.tsx";
import Resume from "../pages/Resume.tsx";
import Contact from "../pages/Contact.tsx";
import Privacy from "../pages/Privacy.tsx";

// Mermaid is heavy — the Architecture page ships as its own chunk.
const Architecture = lazy(() => import("../pages/Architecture.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="font-mono text-sm text-gray-500">404 / not-found</p>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        This page doesn&rsquo;t exist.
      </h1>
      <a href="#/" className="text-sm font-semibold text-blue-600 hover:underline">
        &larr; Back to home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/experience" element={<Experience />} />
            <Route
              path="/architecture"
              element={
                <Suspense
                  fallback={
                    <div className="py-24 text-center font-mono text-sm text-gray-500">
                      Loading diagrams&hellip;
                    </div>
                  }
                >
                  <Architecture />
                </Suspense>
              }
            />
            <Route path="/writing" element={<Writing />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </HashRouter>
    </QueryClientProvider>
  );
}
