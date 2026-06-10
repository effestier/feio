"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/browse/fiction", label: "Browse" },
  { href: "/library", label: "Library" },
];

const genreLinks = [
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
  { href: "/browse/children", label: "Children" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [genresOpen, setGenresOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const genresRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const isHome = pathname === "/";

  const isGenresActive = pathname.startsWith("/browse/");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (genresRef.current && !genresRef.current.contains(e.target as Node)) {
        setGenresOpen(false);
      }
    }
    if (genresOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [genresOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="border-b border-[#D4C5A9]/30 bg-cream/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="font-serif text-xl font-bold tracking-tight text-burgundy hover:text-burgundy-light transition-colors flex-shrink-0"
          >
            FEIO
          </Link>

          {/* Header search - desktop */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-sm relative">
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search books..."
              className={`w-full bg-white border rounded-lg pl-9 pr-3 py-2 text-sm text-charcoal placeholder:text-[#8B7355]/50 transition-all ${
                searchFocused
                  ? "border-burgundy ring-1 ring-burgundy/20"
                  : "border-[#D4C5A9]/50 hover:border-[#B8860B]/40"
              }`}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8B7355]/50 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]/30 pointer-events-none">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </form>

          <nav className="hidden sm:flex items-center gap-1">
            {mainLinks.map(({ href, label }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : href !== "/" && pathname.startsWith(href.split("?")[0]);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    active
                      ? "bg-burgundy/10 text-burgundy font-medium"
                      : "text-[#6B5B45] hover:text-charcoal hover:bg-[#E8DCCC]/50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            {/* Genres dropdown */}
            <div className="relative" ref={genresRef}>
              <button
                onClick={() => setGenresOpen(!genresOpen)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1 ${
                  isGenresActive
                    ? "bg-burgundy/10 text-burgundy font-medium"
                    : "text-[#6B5B45] hover:text-charcoal hover:bg-[#E8DCCC]/50"
                }`}
              >
                Genres
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${genresOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {genresOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-[#D4C5A9]/40 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="max-h-80 overflow-y-auto p-1">
                    {genreLinks.map(({ href, label }) => {
                      const active = pathname === href;
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setGenresOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
                            active
                              ? "bg-burgundy/10 text-burgundy font-medium"
                              : "text-[#6B5B45] hover:bg-[#E8DCCC]/50 hover:text-charcoal"
                          }`}
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/upload"
              className="ml-2 px-4 py-1.5 text-sm font-medium bg-burgundy text-white rounded-lg hover:bg-burgundy-light transition-colors shadow-sm hover:shadow-md"
            >
              + Upload
            </Link>
          </nav>

          {/* Mobile menu + search button */}
          <div className="sm:hidden flex items-center gap-1">
            <Link
              href="/search"
              className="p-2 text-[#6B5B45] hover:text-burgundy transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[#6B5B45] hover:text-charcoal"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 w-72 h-full bg-white border-l border-[#D4C5A9]/30 p-6 shadow-xl">
            {/* Mobile search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchQuery("");
                  setMobileOpen(false);
                }
              }}
              className="mb-4"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books..."
                className="w-full bg-[#F5F0E8] border border-[#D4C5A9]/50 rounded-lg px-4 py-2.5 text-sm text-charcoal placeholder:text-[#8B7355]/50 focus:border-burgundy focus:ring-1 focus:ring-burgundy/20 transition-colors"
              />
            </form>

            <nav className="flex flex-col gap-1">
              {mainLinks.map(({ href, label }) => {
                const active =
                  href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(href.split("?")[0]);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2.5 text-sm rounded-lg transition-colors ${
                      active
                        ? "bg-burgundy/10 text-burgundy font-medium"
                        : "text-[#6B5B45] hover:text-charcoal hover:bg-[#E8DCCC]/50"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              <div className="h-px bg-[#D4C5A9]/30 my-2" />
              <p className="px-4 text-xs font-medium uppercase tracking-wider text-[#8B7355] mb-1">
                Genres
              </p>
              {genreLinks.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      active
                        ? "bg-burgundy/10 text-burgundy font-medium"
                        : "text-[#6B5B45] hover:text-charcoal hover:bg-[#E8DCCC]/50"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              <div className="h-px bg-[#D4C5A9]/30 my-2" />
              <Link
                href="/upload"
                onClick={() => setMobileOpen(false)}
                className="mx-4 mt-1 px-4 py-2.5 text-sm font-medium bg-burgundy text-white rounded-lg hover:bg-burgundy-light transition-colors text-center"
              >
                Upload a Book
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
