import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '../layouts/Layout.tsx';
import Home from '../pages/Home.tsx';
import Projects from '../pages/Projects.tsx';
import ProjectDetails from '../pages/ProjectDetails.tsx';
import Experience from '../pages/Experience.tsx';
import Writing from '../pages/Writing.tsx';
import Resume from '../pages/Resume.tsx';
import Contact from '../pages/Contact.tsx';
import Privacy from '../pages/Privacy.tsx';

// Instantiate TanStack Query Client for professional state caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache stale
      refetchOnWindowFocus: false,
    },
  },
});

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
            <Route path="/writing" element={<Writing />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <h1 className="text-4xl font-extrabold text-[#F8FAFC]">404</h1>
                <p className="text-[#CBD5E1]">Engineering resource not found.</p>
                <a href="#/" className="text-sm font-semibold text-[#2563EB] hover:underline">&larr; Return to Dashboard</a>
              </div>
            } />
          </Routes>
        </Layout>
      </HashRouter>
    </QueryClientProvider>
  );
}
