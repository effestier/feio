import Link from "next/link";
import { getUploads } from "@/lib/uploads";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const uploads = await getUploads();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Community Library</h1>
          <p className="text-muted text-sm mt-1">
            {uploads.length > 0
              ? `${uploads.length} book${uploads.length !== 1 ? "s" : ""} shared by the community`
              : "Be the first to share a book"}
          </p>
        </div>
        <Link
          href="/upload"
          className="px-5 py-2.5 bg-burgundy text-white rounded-lg text-sm font-medium hover:bg-burgundy-light transition-colors"
        >
          Upload a Book
        </Link>
      </div>

      {uploads.length > 0 ? (
        <div className="grid gap-4">
          {uploads.map((book) => {
            const ext = book.originalName.split(".").pop()?.toUpperCase() || "FILE";
            const sizeMB = (book.size / 1024 / 1024).toFixed(1);
            const date = new Date(book.uploadedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={book.id}
                className="flex items-start gap-5 p-5 bg-white border border-charcoal/8 rounded-xl hover:border-burgundy/20 hover:shadow-sm transition-all"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-16 bg-cream-dark rounded flex items-center justify-center">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                    {ext}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-charcoal text-base leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted mt-0.5">by {book.author}</p>
                  {book.description && (
                    <p className="text-sm text-muted/70 mt-1 line-clamp-2">
                      {book.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted/60">
                    <span>{ext}</span>
                    <span>&middot;</span>
                    <span>{sizeMB} MB</span>
                    <span>&middot;</span>
                    <span>{date}</span>
                    <span>&middot;</span>
                    <span>{book.downloads} downloads</span>
                  </div>
                </div>

                {/* Download */}
                <a
                  href={`/api/uploads/${book.id}/download`}
                  className="flex-shrink-0 px-4 py-2 text-xs font-medium bg-charcoal text-white rounded-md hover:bg-charcoal-light transition-colors"
                >
                  Download
                </a>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-muted/20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="text-lg text-muted">The library shelves are empty</p>
          <p className="text-sm text-muted/60 mt-1">
            Upload a book to get started
          </p>
          <Link
            href="/upload"
            className="inline-block mt-4 px-5 py-2.5 bg-burgundy text-white rounded-lg text-sm font-medium hover:bg-burgundy-light transition-colors"
          >
            Upload Your First Book
          </Link>
        </div>
      )}
    </div>
  );
}
