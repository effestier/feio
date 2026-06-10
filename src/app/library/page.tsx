import Link from "next/link";
import { getUploads } from "@/lib/uploads";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const uploads = await getUploads();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-block px-3 py-1 mb-3 text-[10px] font-medium uppercase tracking-widest text-burgundy bg-burgundy/8 rounded-full border border-burgundy/20">
            Community
          </div>
          <h1 className="font-serif text-3xl text-charcoal">Community Library</h1>
          <p className="text-[#6B5B45] text-sm mt-1">
            {uploads.length > 0
              ? `${uploads.length} book${uploads.length !== 1 ? "s" : ""} shared by the community`
              : "Be the first to share a book"}
          </p>
        </div>
        <Link
          href="/upload"
          className="px-5 py-2.5 bg-burgundy text-white rounded-lg text-sm font-medium hover:bg-burgundy-light transition-all shadow-sm hover:shadow-md"
        >
          + Upload a Book
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
                className="flex items-start gap-5 p-5 bg-white border border-[#D4C5A9]/30 rounded-xl hover:border-burgundy/20 hover:shadow-md transition-all group"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-16 bg-[#EDE6DC] rounded-lg flex items-center justify-center group-hover:bg-burgundy/10 transition-colors">
                  <span className="text-[10px] font-bold text-[#8B7355] uppercase tracking-wider">
                    {ext}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-charcoal text-base leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-sm text-[#6B5B45] mt-0.5">by {book.author}</p>
                  {book.description && (
                    <p className="text-sm text-[#6B5B45]/70 mt-1 line-clamp-2">
                      {book.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#8B7355]/60">
                    <span className="font-medium text-burgundy/70">{ext}</span>
                    <span className="text-[#D4C5A9]">·</span>
                    <span>{sizeMB} MB</span>
                    <span className="text-[#D4C5A9]">·</span>
                    <span>{date}</span>
                    <span className="text-[#D4C5A9]">·</span>
                    <span>{book.downloads} download{book.downloads !== 1 ? "s" : ""}</span>
                  </div>
                </div>

                {/* Download */}
                <a
                  href={`/api/uploads/${book.id}/download`}
                  className="flex-shrink-0 px-4 py-2 text-xs font-medium bg-burgundy text-white rounded-md hover:bg-burgundy-light transition-colors"
                >
                  Download
                </a>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#EDE6DC] flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#8B7355]/40"
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
          </div>
          <h3 className="font-serif text-xl text-charcoal mb-2">The library shelves are empty</h3>
          <p className="text-sm text-[#6B5B45] mb-6">
            Upload a book to get started and share it with the world.
          </p>
          <Link
            href="/upload"
            className="inline-block px-5 py-2.5 bg-burgundy text-white rounded-lg text-sm font-medium hover:bg-burgundy-light transition-all shadow-sm hover:shadow-md"
          >
            Upload Your First Book
          </Link>
        </div>
      )}
    </div>
  );
}
