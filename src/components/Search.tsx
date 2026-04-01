import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlass, X, ArrowElbowDownLeft } from "@phosphor-icons/react";
import { tips } from "../content";

interface SearchResult {
  slug: string;
  title: string;
  section: string;
  matchType: "title" | "section";
}

interface SearchProps {
  open: boolean;
  onClose: () => void;
}

export default function Search({ open, onClose }: SearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      // Small delay so the DOM is rendered
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo((): SearchResult[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return tips
      .filter((tip) => {
        const title = tip.title.toLowerCase();
        const section = (tip.section || "").toLowerCase();
        return title.includes(q) || section.includes(q);
      })
      .map((tip) => ({
        slug: tip.slug,
        title: tip.title,
        section: tip.section || "Guide",
        matchType: tip.title.toLowerCase().includes(q.toLowerCase())
          ? ("title" as const)
          : ("section" as const),
      }));
  }, [query]);

  const goTo = useCallback(
    (slug: string) => {
      navigate(`/${slug}`);
      onClose();
    },
    [navigate, onClose]
  );

  // Keyboard navigation
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        goTo(results[selectedIndex].slug);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, selectedIndex, goTo]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] sm:pt-[15vh]"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-lg mx-3 sm:mx-4 bg-notion-bg border border-notion-border rounded-xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-label="Search tips"
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 sm:py-3 border-b border-notion-border">
          <MagnifyingGlass
            size={18}
            className="text-notion-secondary shrink-0"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tips..."
            className="flex-1 bg-transparent text-notion-text text-sm outline-none placeholder:text-notion-secondary/60"
          />
          <button
            onClick={onClose}
            className="flex items-center justify-center w-6 h-6 rounded text-notion-secondary hover:text-notion-text transition-colors"
            aria-label="Close search"
          >
            <X size={14} weight="bold" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-notion-secondary">
              No tips found for "{query}"
            </div>
          )}

          {results.length > 0 && (
            <ul className="py-2" role="listbox">
              {results.map((r, i) => (
                <li key={r.slug} role="option" aria-selected={i === selectedIndex}>
                  <button
                    onClick={() => goTo(r.slug)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`
                      w-full text-left px-4 py-3 sm:py-2.5 flex items-center justify-between gap-3 transition-colors min-h-[44px]
                      ${i === selectedIndex ? "bg-notion-hover" : ""}
                    `}
                  >
                    <div>
                      <div className="text-sm text-notion-text font-medium">
                        {r.title}
                      </div>
                      <div className="text-[0.6875rem] text-notion-secondary mt-0.5">
                        {r.section}
                      </div>
                    </div>
                    {i === selectedIndex && (
                      <ArrowElbowDownLeft
                        size={14}
                        className="text-notion-secondary shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!query && (
            <div className="px-4 py-6 text-center text-[0.75rem] text-notion-secondary">
              <kbd className="px-1.5 py-0.5 rounded bg-notion-hover border border-notion-border text-[0.6875rem] font-mono">
                Ctrl K
              </kbd>
              <span className="ml-2">to open anytime</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
