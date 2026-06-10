import Link from "next/link";

const GENRE_LINKS = [
  { href: "/browse/fiction", label: "Fiction" },
  { href: "/browse/science", label: "Science" },
  { href: "/browse/history", label: "History" },
  { href: "/browse/philosophy", label: "Philosophy" },
  { href: "/browse/romance", label: "Romance" },
  { href: "/browse/mystery", label: "Mystery" },
  { href: "/browse/fantasy", label: "Fantasy" },
  { href: "/browse/biography", label: "Biography" },
  { href: "/browse/poetry", label: "Poetry" },
  { href: "/browse/science_fiction", label: "Sci-Fi" },
  { href: "/browse/horror", label: "Horror" },
  { href: "/browse/adventure", label: "Adventure" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#D4C5A9]/30 bg-cream/95 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Top */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="sm:col-span-1">
            <p className="font-serif text-lg font-bold text-burgundy mb-2">FEIO</p>
            <p className="text-sm text-[#6B5B45] leading-relaxed">
              A classic digital library. Browse millions of free books, read
              timeless classics, and discover your next great read.
            </p>
          </div>

          {/* Browse */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#8B7355] mb-3">
              Browse
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/browse/fiction" className="text-[#6B5B45] hover:text-burgundy transition-colors">
                All Genres
              </Link>
              <Link href="/search" className="text-[#6B5B45] hover:text-burgundy transition-colors">
                Search Books
              </Link>
              <Link href="/library" className="text-[#6B5B45] hover:text-burgundy transition-colors">
                Community Library
              </Link>
              <Link href="/upload" className="text-[#6B5B45] hover:text-burgundy transition-colors">
                Upload a Book
              </Link>
            </div>
          </div>

          {/* Genres */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#8B7355] mb-3">
              Genres
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {GENRE_LINKS.slice(0, 8).map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-[#6B5B45] hover:text-burgundy transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Built by */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[#8B7355] mb-3">
              Built By
            </p>
            <p className="text-sm text-charcoal font-medium mb-1">Karan</p>
            <p className="text-sm text-[#6B5B45] mb-3">
              Full-stack developer building things that matter.
            </p>
            <a
              href="https://kwen.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-burgundy hover:text-burgundy-light transition-colors"
            >
              kwen.in
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#D4C5A9]/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8B7355]/70">
          <p>
            Made with care by{" "}
            <a href="https://kwen.in" target="_blank" rel="noopener noreferrer" className="text-burgundy hover:underline">
              Karan
            </a>
            {" "}&middot; &copy; {new Date().getFullYear()} FEIO
          </p>
          <p>Powered by Open Library, Project Gutenberg &amp; Internet Archive</p>
        </div>
      </div>
    </footer>
  );
}
