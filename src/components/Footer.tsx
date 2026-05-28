import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-cream/90 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Top */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="font-serif text-lg font-bold text-gold mb-2">FEIO</p>
            <p className="text-sm text-muted leading-relaxed">
              A digital library for the curious. Browse millions of books, read
              classics for free, and share your own collection.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted mb-3">
              Explore
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/browse/fiction" className="text-muted hover:text-gold transition-colors">
                Browse Books
              </Link>
              <Link href="/scriptures" className="text-muted hover:text-gold transition-colors">
                Scriptures
              </Link>
              <Link href="/teachings" className="text-muted hover:text-gold transition-colors">
                Teachings
              </Link>
              <Link href="/heritage" className="text-muted hover:text-gold transition-colors">
                Heritage
              </Link>
              <Link href="/festivals" className="text-muted hover:text-gold transition-colors">
                Festivals
              </Link>
              <Link href="/concepts" className="text-muted hover:text-gold transition-colors">
                Concepts
              </Link>
              <Link href="/meditate" className="text-muted hover:text-gold transition-colors">
                Meditate
              </Link>
              <Link href="/search?q=" className="text-muted hover:text-gold transition-colors">
                Search
              </Link>
              <Link href="/library" className="text-muted hover:text-gold transition-colors">
                Community Library
              </Link>
            </div>
          </div>

          {/* Built by */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted mb-3">
              Built By
            </p>
            <p className="text-sm text-charcoal font-medium mb-1">Karan</p>
            <p className="text-sm text-muted mb-3">
              Full-stack developer building things that matter.
            </p>
            <a
              href="https://kwen.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-burgundy-light transition-colors"
            >
              kwen.in
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gold/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted/60">
          <p>
            Made with care by{" "}
            <a href="https://kwen.in" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
              Karan
            </a>
            {" "}&middot; &copy; {new Date().getFullYear()} FEIO
          </p>
        </div>
      </div>
    </footer>
  );
}
