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

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const location = useLocation();

  // Extract headings after content renders
  useEffect(() => {
    const timer = setTimeout(() => {
      const content = document.querySelector(".mdx-content");
      if (content) {
        setHeadings(extractHeadings(content));
      }
    }, 200);
    return () => clearTimeout(timer);
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
          <ul className="space-y-0.5">
            {headings.map((h) => (
              <li key={h.id}>
                <button
                  onClick={() => scrollTo(h.id)}
                  title={h.text}
                  className={`
                    block w-full text-left text-[0.6875rem] leading-snug py-1 transition-colors rounded truncate
                    ${h.level === 1 ? "pl-0 font-semibold text-[0.75rem]" : ""}
                    ${h.level === 2 ? "pl-2.5" : ""}
                    ${h.level === 3 ? "pl-5" : ""}
                    ${
                      activeId === h.id
                        ? "text-notion-accent font-medium"
                        : "text-notion-secondary hover:text-notion-text"
                    }
                  `}
                >
                  {h.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
