import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Code } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Experience', path: '/experience' },
    { name: 'Writing', path: '/writing' },
    { name: 'Resume', path: '/resume' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] flex flex-col font-sans">
      {/* Navigation Header - Highly professional flat navbar */}
      <header className="sticky top-0 z-50 bg-[#020617] border-b border-[#1E293B] h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#2563EB] rounded px-1">
          <span className="w-8 h-8 rounded bg-[#111827] border border-[#1E293B] flex items-center justify-center text-[#2563EB] font-bold text-sm tracking-tight group-hover:border-[#2563EB]/40 transition-colors">
            <Code size={16} />
          </span>
          <span className="font-bold text-[#F8FAFC] tracking-tight group-hover:text-[#2563EB] transition-colors">
            Matome Mbowene
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] rounded px-2 py-1 ${
                isActive(link.path)
                  ? 'text-[#2563EB] font-semibold'
                  : 'text-[#CBD5E1] hover:text-[#2563EB]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 focus:ring-offset-[#020617]"
          >
            Let's Talk
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#CBD5E1] hover:text-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] rounded"
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Slide-out Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0F172A] border-b border-[#1E293B] px-4 pt-2 pb-6 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`text-base font-medium py-2 px-3 rounded transition-colors focus:outline-none ${
                isActive(link.path)
                  ? 'bg-[#111827] text-[#2563EB] font-semibold'
                  : 'text-[#CBD5E1] hover:bg-[#111827] hover:text-[#2563EB]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center justify-center px-4 py-3 mt-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded transition-all"
          >
            Let's Talk
          </Link>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid-bg relative">
        {children}
      </main>

      {/* Developer-first minimal Footer */}
      <footer className="border-t border-[#1E293B] bg-[#020617] text-center py-8 text-xs text-[#CBD5E1] font-mono w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p>&copy; 2026 Matome Mbowene. All rights reserved.</p>
          <p>
            Designed as a high-integrity, product-focused platform. Built with React 19, TS, Vite, &amp; Tailwind CSS v4.
          </p>
          <div class="flex justify-center gap-4 text-[#CBD5E1] font-semibold pt-2">
            <Link to="/privacy" class="hover:underline hover:text-[#2563EB]">Privacy Policy</Link>
            <span>&bull;</span>
            <a href="sitemap.xml" class="hover:underline hover:text-[#2563EB]">Sitemap</a>
            <span>&bull;</span>
            <a href="mailto:matomepontso@gmail.com" class="hover:underline hover:text-[#2563EB]">Get in Touch</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
