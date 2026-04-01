import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { House, MagnifyingGlass } from "@phosphor-icons/react";
import Sidebar from "./components/Sidebar";
import TipPage from "./components/TipPage";
import TableOfContents from "./components/TableOfContents";
import Search from "./components/Search";
import { tips } from "./content";

function useTheme() {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next ? "#1e1c19" : "#fdfcfa");
  };

  return { dark, toggle };
}

function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="font-serif text-[clamp(2rem,1.5rem+1.5vw,2.5rem)] font-bold text-notion-text mb-3">
        Page not found
      </h1>
      <p className="text-notion-secondary mb-6">
        This tip doesn't exist yet. Try one from the sidebar.
      </p>
      <a
        href="/readme"
        className="inline-flex items-center gap-1.5 text-notion-accent underline underline-offset-2 text-sm font-medium"
      >
        <House size={14} weight="bold" />
        Go to Overview
      </a>
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { dark, toggle: toggleTheme } = useTheme();

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-screen bg-notion-bg">
      {/* Skip to content */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          role="presentation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        dark={dark}
        onToggleTheme={toggleTheme}
        onOpenSearch={openSearch}
      />

      <main className="flex-1 overflow-y-auto relative xl:mr-[216px]">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-notion-bg/80 backdrop-blur border-b border-notion-border px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            className="flex items-center justify-center w-11 h-11 -ml-2 hover:bg-notion-hover rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-notion-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="leading-none flex-1">
            <span className="text-sm font-extrabold text-notion-text tracking-tight">
              Ultra Instinct
            </span>
            <span className="block text-[0.5625rem] font-bold tracking-[0.08em] uppercase text-notion-secondary">
              Claude Code
            </span>
          </div>
          <button
            onClick={openSearch}
            aria-label="Search tips"
            className="flex items-center justify-center w-11 h-11 -mr-2 hover:bg-notion-hover rounded-lg transition-colors"
          >
            <MagnifyingGlass size={18} className="text-notion-secondary" />
          </button>
        </div>

        <div id="main-content" className="max-w-[54rem] mx-auto px-5 py-6 sm:px-6 sm:py-8 lg:px-12 lg:py-12">
          <Routes>
            <Route path="/" element={<Navigate to="/readme" replace />} />
            {tips.map((tip) => (
              <Route
                key={tip.slug}
                path={`/${tip.slug}`}
                element={<TipPage tip={tip} />}
              />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* Monogram */}
        <div className="hidden sm:block fixed bottom-4 right-4 xl:right-[228px] text-[0.625rem] text-notion-secondary/50 tracking-wide select-none pointer-events-none z-10">
          <span className="font-medium">ultra-instinct-claude-code</span>
          <span className="mx-1 opacity-60">/</span>
          <span>curated by infiniv</span>
        </div>
      </main>

      {/* Right panel: Table of Contents */}
      <TableOfContents />

      {/* Search modal */}
      <Search open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
