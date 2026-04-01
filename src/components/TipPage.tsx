import { Suspense } from "react";
import type { TipEntry } from "../content";

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
  const Content = tip.component;

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
      <div className="mdx-content">
        <Suspense fallback={<LoadingSkeleton />}>
          <Content />
        </Suspense>
      </div>
    </article>
  );
}
