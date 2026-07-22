import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Experience", path: "/experience" },
  { name: "Architecture", path: "/architecture" },
  { name: "Writing", path: "/writing" },
  { name: "Resume", path: "/resume" },
  { name: "Contact", path: "/contact" },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900">
      {/* Keyboard accessibility: jump straight to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      {/* Solid white navigation header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group flex items-center gap-2.5 rounded px-1 focus:outline-none"
            aria-label="Matome Mbowene — home"
          >
            <img
              src="matome-Headshot.jpg"
              alt="Matome Mbowene"
              className="h-8 w-8 rounded object-cover"
              width={32}
              height={32}
            />
            <span className="text-[15px] font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-blue-600">
              Matome Mbowene
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                aria-current={isActive(link.path) ? "page" : undefined}
                className={`rounded px-3 py-2 text-sm transition-colors focus:outline-none ${
                  isActive(link.path)
                    ? "font-semibold text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded p-2 text-gray-600 hover:text-gray-900 focus:outline-none md:hidden"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav
            className="border-t border-gray-200 bg-white px-4 py-3 md:hidden"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    aria-current={isActive(link.path) ? "page" : undefined}
                    className={`block rounded px-3 py-2.5 text-sm transition-colors focus:outline-none ${
                      isActive(link.path)
                        ? "bg-gray-50 font-semibold text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* Page body */}
      <main
        id="main-content"
        className="mx-auto w-full max-w-5xl flex-grow px-4 sm:px-6 lg:px-8"
        tabIndex={-1}
      >
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white print-hidden">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-gray-900">Matome Mbowene</p>
              <p className="text-sm text-gray-500">Software Engineer — Johannesburg, South Africa</p>
              <p className="font-mono text-xs text-gray-400">
                React 19 · TypeScript · Tailwind CSS v4 · GitHub Pages
              </p>
            </div>
            <nav aria-label="Footer" className="text-sm">
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-gray-500">
                <li>
                  <a
                    href="https://github.com/MatomeMb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/in/matomembowene"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="mailto:matomepontso@gmail.com" className="hover:text-blue-600">
                    Email
                  </a>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-blue-600">
                    Privacy
                  </Link>
                </li>
                <li>
                  <a href="sitemap.xml" className="hover:text-blue-600">
                    Sitemap
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <p className="mt-8 border-t border-gray-100 pt-6 text-xs text-gray-400">
            &copy; 2026 Matome Mbowene. Source code available at{" "}
            <a
              href="https://github.com/MatomeMb/MatomeMb.website"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 transition-colors hover:text-blue-600 hover:underline"
            >
              github.com/MatomeMb/MatomeMb.website
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
