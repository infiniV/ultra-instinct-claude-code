import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ListBullets } from "@phosphor-icons/react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(container: Element): Heading[] {
  const elements = container.querySelectorAll("h1, h2, h3");
  const headings: Heading[] = [];
  elements.forEach((el) => {
    const id = el.id;
    const text = el.textContent?.trim() || "";
    if (id && text) {
      headings.push({
        id,
        text,
        level: parseInt(el.tagName[1], 10),
      });
    }
  });
  return headings;
}

/** Extract tip number prefix like "#02.01" from heading text */
function parseTipText(text: string): { number: string; label: string } | null {
  const match = text.match(/^#(\d{2}\.\d{2})\s+(.+)$/);
  if (match) return { number: match[1], label: match[2] };
  return null;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const location = useLocation();

  // Extract headings after content renders (using MutationObserver for lazy content)
  useEffect(() => {
    setHeadings([]);

    const extract = () => {
      const content = document.querySelector(".mdx-content");
      if (content) {
        const found = extractHeadings(content);
        if (found.length > 0) {
          setHeadings(found);
          return true;
        }
      }
      return false;
    };

    // Try immediately (content may already be loaded for client-side nav)
    if (extract()) return;

    // Watch for content appearing (handles Suspense lazy loading)
    const target = document.querySelector(".mdx-content");
    if (!target) return;

    const observer = new MutationObserver(() => {
      if (extract()) observer.disconnect();
    });
    observer.observe(target, { childList: true, subtree: true });

    // Cleanup after 5s max
    const timeout = setTimeout(() => observer.disconnect(), 5000);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [location.pathname]);

  // Track active heading with IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  }, []);

  if (headings.length < 2) return null;

  return (
    <aside
      className="hidden xl:block fixed right-0 top-0 h-screen w-[216px] border-l border-notion-border bg-notion-sidebar/50 overflow-y-auto overflow-x-hidden"
      aria-label="Table of contents"
    >
      <div className="pl-3 pr-4 pt-6 pb-2">
        <div className="flex items-center gap-1.5 text-[0.6875rem] font-semibold text-notion-secondary uppercase tracking-wider mb-3">
          <ListBullets size={13} weight="bold" aria-hidden="true" />
          On this page
        </div>
        <nav>
          <ul className="toc-list">
            {headings.map((h) => {
              const isActive = activeId === h.id;
              const tip = h.level === 3 ? parseTipText(h.text) : null;

              return (
                <li key={h.id} className="toc-item">
                  <button
                    onClick={() => scrollTo(h.id)}
                    title={h.text}
                    className={`
                      toc-link
                      ${h.level === 1 ? "toc-h1" : ""}
                      ${h.level === 2 ? "toc-h2" : ""}
                      ${h.level === 3 ? "toc-h3" : ""}
                      ${isActive ? "toc-active" : ""}
                    `}
                  >
                    {tip ? (
                      <>
                        <span className="toc-tip-number">{tip.number}</span>
                        <span className="truncate">{tip.label}</span>
                      </>
                    ) : (
                      <span className="truncate">{h.text}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
