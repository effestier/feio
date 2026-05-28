import { notFound } from "next/navigation";
import Link from "next/link";
import { HERITAGE_SITES, getHeritageSiteById } from "@/lib/spiritual-content";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return HERITAGE_SITES.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const site = getHeritageSiteById(id);
  if (!site) return {};
  return {
    title: `${site.name} — FEIO Heritage`,
    description: site.description,
  };
}

export default async function HeritageSitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const site = getHeritageSiteById(id);
  if (!site) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-6">
        <Link href="/heritage" className="link-underline hover:text-gold">
          Heritage Sites
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{site.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{site.traditionEmoji}</span>
          <span className="text-xs font-medium text-gold/60 uppercase tracking-wider">
            {site.tradition}
          </span>
          {site.unesco && (
            <span className="text-[10px] px-2 py-0.5 bg-gold/10 text-gold rounded-full">
              UNESCO World Heritage
            </span>
          )}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal mb-1">
          {site.name}
        </h1>
        <p className="text-gold/70 text-lg font-serif">{site.nameLocal}</p>
        <p className="text-sm text-muted mt-1">
          {site.location}, {site.country}
          {site.yearBuilt && <span> · {site.yearBuilt}</span>}
        </p>
      </div>

      {/* Description */}
      <div className="p-6 bg-paper border border-charcoal/8 rounded-xl mb-6">
        <h2 className="text-xs font-medium text-gold uppercase tracking-wider mb-3">
          About
        </h2>
        <p className="text-charcoal text-base leading-relaxed">
          {site.description}
        </p>
      </div>

      {/* Spiritual Significance */}
      <div className="p-6 bg-gold/5 border border-gold/15 rounded-xl mb-6">
        <h2 className="text-xs font-medium text-gold uppercase tracking-wider mb-3">
          Spiritual Significance
        </h2>
        <p className="text-charcoal text-base leading-relaxed">
          {site.significance}
        </p>
      </div>

      {/* History */}
      <div className="p-6 bg-paper border border-charcoal/8 rounded-xl mb-8">
        <h2 className="text-xs font-medium text-gold uppercase tracking-wider mb-3">
          History
        </h2>
        <p className="text-muted text-base leading-relaxed">
          {site.history}
        </p>
      </div>

      {/* Back */}
      <div className="pt-6 border-t border-gold/10">
        <Link href="/heritage" className="text-sm text-gold hover:underline">
          ← All Heritage Sites
        </Link>
      </div>
    </div>
  );
}
