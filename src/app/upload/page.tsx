import UploadForm from "@/components/UploadForm";
import Link from "next/link";

export default function UploadPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <nav className="text-sm text-muted mb-6">
        <Link href="/library" className="link-underline hover:text-charcoal">
          Community Library
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">Upload</span>
      </nav>

      <h1 className="font-serif text-3xl text-charcoal mb-2">Upload a Book</h1>
      <p className="text-muted text-sm mb-8">
        Share a book with the community. PDF, EPUB, TXT, and MOBI files are supported.
      </p>

      <div className="bg-cream-dark/50 border border-charcoal/8 rounded-xl p-6">
        <UploadForm />
      </div>
    </div>
  );
}
