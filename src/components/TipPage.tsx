import { Suspense, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CaretLeft, CaretRight, House } from "@phosphor-icons/react";
import { tips, type TipEntry } from "../content";

const SITE_NAME = "Ultra Instinct Claude Code";
const SITE_URL = "https://ultra-instinct-claude-code.vercel.app";

function useSEO(tip: TipEntry) {
  useEffect(() => {
    const pageTitle = tip.slug === "readme"
      ? SITE_NAME
      : `${tip.title} — ${SITE_NAME}`;
    document.title = pageTitle;

    const description = tip.slug === "readme"
      ? "The best Claude Code tips from 50+ repos. No installation. No setup. Just read and apply."
      : `${tip.title} tips for Claude Code. ${tip.count ? tip.count + " curated tips" : "Expert guidance"} in the ${tip.section || "Guide"} section.`;

    const pageUrl = `${SITE_URL}/${tip.slug}`;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      canonical.href = pageUrl;
    } else {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = pageUrl;
      document.head.appendChild(canonical);
    }

    // Update Open Graph tags
    const ogUpdates: Record<string, string> = {
      "og:title": pageTitle,
      "og:description": description,
      "og:url": pageUrl,
    };
    for (const [property, content] of Object.entries(ogUpdates)) {
      const tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) tag.setAttribute("content", content);
    }

    // Update Twitter Card tags
    const twitterUpdates: Record<string, string> = {
      "twitter:title": pageTitle,
      "twitter:description": description,
    };
    for (const [name, content] of Object.entries(twitterUpdates)) {
      const tag = document.querySelector(`meta[name="${name}"]`);
      if (tag) tag.setAttribute("content", content);
    }

    // Update JSON-LD structured data for article pages
    const existingLd = document.getElementById("seo-article-jsonld");
    if (tip.slug !== "readme") {
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": tip.title,
        "description": description,
        "url": pageUrl,
        "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
        "author": { "@type": "Organization", "name": "Infiniv" },
        "publisher": {
          "@type": "Organization",
          "name": "Ultra Instinct Claude Code",
        },
        "articleSection": tip.section || "Guide",
      };
      if (existingLd) {
        existingLd.textContent = JSON.stringify(articleSchema);
      } else {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = "seo-article-jsonld";
        script.textContent = JSON.stringify(articleSchema);
        document.head.appendChild(script);
      }
    } else if (existingLd) {
      existingLd.remove();
    }

    return () => {
      // Reset to defaults on unmount
      document.title = SITE_NAME;
    };
  }, [tip.slug, tip.title, tip.section, tip.count]);
}

/** Hide the raw markdown breadcrumb + bottom nav, enhance level/impact blockquotes */
function useEnhanceMdx(contentRef: React.RefObject<HTMLDivElement | null>) {
  const location = useLocation();
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const enhance = () => {
      // Hide the first paragraph if it's the breadcrumb (e.g. "Home > 02 CLAUDE.md")
      const firstP = el.querySelector(".mdx-content > p:first-child");
      if (firstP && firstP.textContent?.includes(">") && firstP.querySelector('a[href="/readme"]')) {
        (firstP as HTMLElement).style.display = "none";
      }

      // Hide the bottom nav paragraph (contains "< prev | Home | next >")
      const allPs = el.querySelectorAll(".mdx-content > p");
      const lastP = allPs[allPs.length - 1];
      if (lastP && lastP.querySelector('a[href="/readme"]') && lastP.textContent?.includes("|")) {
        (lastP as HTMLElement).style.display = "none";
        // Also hide the preceding <hr> elements
        let prev = lastP.previousElementSibling;
        let hrCount = 0;
        while (prev && prev.tagName === "HR" && hrCount < 2) {
          (prev as HTMLElement).style.display = "none";
          prev = prev.previousElementSibling;
          hrCount++;
        }
      }

      // Style level/impact blockquotes as pill badges
      // IMPORTANT: Never remove/replace React-owned nodes — only hide + insert siblings
      el.querySelectorAll("blockquote").forEach((bq) => {
        if ((bq as HTMLElement).dataset.enhanced) return;
        const text = bq.textContent || "";
        if (!text.includes("Level:") || !text.includes("Impact:")) return;

        const levelMatch = text.match(/Level:\s*(Beginner|Intermediate|Advanced|Expert)/);
        const impactMatch = text.match(/Impact:\s*(High|Medium|Low)/);
        if (!levelMatch || !impactMatch) return;

        const level = levelMatch[1];
        const impact = impactMatch[1];

        const levelColors: Record<string, string> = {
          Beginner: "var(--color-notion-tag-green)",
          Intermediate: "var(--color-notion-tag-blue)",
          Advanced: "var(--color-notion-tag-orange)",
          Expert: "var(--color-notion-tag-red)",
        };
        const impactColors: Record<string, string> = {
          High: "var(--color-notion-tag-red)",
          Medium: "var(--color-notion-tag-orange)",
          Low: "var(--color-notion-tag-blue)",
        };

        // Hide the original blockquote (don't remove it — React owns it)
        (bq as HTMLElement).style.display = "none";
        (bq as HTMLElement).dataset.enhanced = "true";

        // Insert badge row after the hidden blockquote
        const wrapper = document.createElement("div");
        wrapper.className = "tip-badge-row";
        wrapper.setAttribute("data-badge", "true");
        wrapper.innerHTML = `
          <span class="tip-badge" style="background:${levelColors[level]}">
            <span class="tip-badge-label">Level</span> ${level}
          </span>
          <span class="tip-badge" style="background:${impactColors[impact]}">
            <span class="tip-badge-label">Impact</span> ${impact}
          </span>
        `;
        bq.after(wrapper);
      });
    };

    // Try immediately, then observe for lazy content
    enhance();
    const observer = new MutationObserver(enhance);
    observer.observe(el, { childList: true, subtree: true });
    const timeout = setTimeout(() => observer.disconnect(), 3000);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      // Clean up injected badge nodes so React doesn't trip on them
      el.querySelectorAll("[data-badge]").forEach((n) => n.remove());
    };
  }, [location.pathname, contentRef]);
}

function TipNav({ currentSlug }: { currentSlug: string }) {
  const idx = tips.findIndex((t) => t.slug === currentSlug);
  if (idx === -1 || currentSlug === "readme") return null;

  const prev = idx > 0 ? tips[idx - 1] : null;
  const next = idx < tips.length - 1 ? tips[idx + 1] : null;

  // Skip readme as prev (it's the overview, not a tip)
  const prevTip = prev && prev.slug !== "readme" ? prev : null;

  return (
    <nav className="flex items-stretch gap-3 mt-12 pt-6 border-t border-notion-border" aria-label="Tip navigation">
      {prevTip ? (
        <Link
          to={`/${prevTip.slug}`}
          className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border border-notion-border hover:bg-notion-hover transition-colors group no-underline"
        >
          <CaretLeft size={16} weight="bold" className="text-notion-secondary shrink-0 group-hover:text-notion-text transition-colors" />
          <div className="min-w-0">
            <span className="block text-[0.625rem] text-notion-secondary uppercase tracking-wider font-medium">Previous</span>
            <span className="block text-[0.8125rem] text-notion-text font-medium truncate">{prevTip.title}</span>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      <Link
        to="/readme"
        className="flex items-center justify-center w-11 rounded-lg border border-notion-border hover:bg-notion-hover transition-colors"
        aria-label="Go to overview"
      >
        <House size={16} weight="bold" className="text-notion-secondary" />
      </Link>

      {next ? (
        <Link
          to={`/${next.slug}`}
          className="flex-1 flex items-center justify-end gap-3 px-4 py-3 rounded-lg border border-notion-border hover:bg-notion-hover transition-colors group text-right no-underline"
        >
          <div className="min-w-0">
            <span className="block text-[0.625rem] text-notion-secondary uppercase tracking-wider font-medium">Next</span>
            <span className="block text-[0.8125rem] text-notion-text font-medium truncate">{next.title}</span>
          </div>
          <CaretRight size={16} weight="bold" className="text-notion-secondary shrink-0 group-hover:text-notion-text transition-colors" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading content">
      <div className="skeleton h-10 w-3/4" />
      <div className="space-y-2.5 mt-6">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-4/5" />
      </div>
      <div className="space-y-2.5 mt-8">
        <div className="skeleton h-7 w-1/2" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-11/12" />
        <div className="skeleton h-4 w-3/4" />
      </div>
      <div className="space-y-2.5 mt-8">
        <div className="skeleton h-7 w-2/5" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface TipPageProps {
  tip: TipEntry;
}

export default function TipPage({ tip }: TipPageProps) {
  useSEO(tip);
  const Content = tip.component;
  const contentRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEnhanceMdx(articleRef);

  // Intercept clicks on <a> tags inside MDX content for client-side routing
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Only intercept internal links (starting with /)
      if (href.startsWith("/")) {
        e.preventDefault();
        navigate(href);
      }
    },
    [navigate]
  );

  // Scroll to hash fragment after content loads
  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;

    const id = hash.slice(1);
    // Wait for Suspense content to render, then scroll
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      return false;
    };

    // Try immediately, then retry with observer for lazy content
    if (tryScroll()) return;

    const observer = new MutationObserver(() => {
      if (tryScroll()) observer.disconnect();
    });

    const container = contentRef.current;
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }

    // Cleanup after 3s max
    const timeout = setTimeout(() => observer.disconnect(), 3000);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [location.pathname, location.hash]);

  return (
    <article ref={articleRef}>
      {/* Banner on overview page */}
      {tip.slug === "readme" && (
        <picture>
          <source srcSet="/banner.webp" type="image/webp" />
          <img
            src="/banner.png"
            alt="Ultra Instinct Claude Code"
            className="w-full rounded-lg mb-8"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1400}
            height={782}
          />
        </picture>
      )}

      {/* Breadcrumb */}
      <div className="text-[0.6875rem] text-notion-secondary uppercase tracking-wider font-medium mb-6">
        {tip.section || "Guide"}
      </div>

      {/* Content */}
      <div className="mdx-content" ref={contentRef} onClick={handleClick}>
        <Suspense fallback={<LoadingSkeleton />}>
          <Content />
        </Suspense>
      </div>

      {/* Prev / Next navigation */}
      <TipNav currentSlug={tip.slug} />
    </article>
  );
}
