"use client";

import { useRef } from "react";
import Link from "next/link";
import ReaderSettings from "@/components/ReaderSettings";

export default function ReadPageContent({
  title,
  authors,
  readUrl,
  downloadPdfUrl,
  downloadTxtUrl,
  detailsUrl,
  detailsLabel,
}: {
  title: string;
  authors: string;
  readUrl: string;
  downloadPdfUrl: string;
  downloadTxtUrl: string;
  detailsUrl?: string;
  detailsLabel?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="bg-paper min-h-[calc(100dvh-4rem)]">
      {/* Top bar */}
      <div className="sticky top-16 z-40 bg-paper/90 backdrop-blur-sm border-b border-charcoal/8">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-base sm:text-lg text-charcoal truncate">
              {title}
            </h1>
            <p className="text-xs text-muted truncate">{authors}</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-3">
            <a
              href={downloadPdfUrl}
              className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider bg-paper border border-charcoal/10 rounded hover:border-gold hover:text-gold transition-colors"
            >
              PDF
            </a>
            <a
              href={downloadTxtUrl}
              className="px-2 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider bg-paper border border-charcoal/10 rounded hover:border-gold hover:text-gold transition-colors"
            >
              TXT
            </a>
            {detailsUrl && (
              <>
                <span className="w-px h-6 bg-charcoal/10 mx-0.5 sm:mx-1 hidden sm:block" />
                <Link
                  href={detailsUrl}
                  className="px-2 sm:px-3 py-1.5 text-xs text-muted hover:text-charcoal transition-colors hidden sm:block"
                >
                  {detailsLabel || "Details"}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content — loaded via iframe */}
      <iframe
        ref={iframeRef}
        src={readUrl}
        className="w-full border-0"
        title={`Read ${title}`}
        style={{ minHeight: "calc(100dvh - 9rem)" }}
      />

      {/* Footer */}
      <div className="text-center py-6 text-xs text-muted/50">
        Read on{" "}
        <Link href="/" className="text-gold hover:underline">
          FEIO
        </Link>
      </div>

      {/* Settings panel */}
      <ReaderSettings iframeRef={iframeRef} />
    </div>
  );
}
