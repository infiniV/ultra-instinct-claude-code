import { Suspense, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { TipEntry } from "../content";

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
  const navigate = useNavigate();
  const location = useLocation();

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
    <article>
      {/* Banner on overview page */}
      {tip.slug === "readme" && (
        <img
          src="/banner.png"
          alt="Ultra Instinct Claude Code"
          className="w-full rounded-lg mb-8"
        />
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
    </article>
  );
}
