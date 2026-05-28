"use client";

import { useState, useRef, type FormEvent } from "react";

interface UploadResult {
  success: boolean;
  book?: { id: string; title: string };
  error?: string;
}

export default function UploadForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [key, setKey] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title || file.name.replace(/\.[^.]+$/, ""));
    formData.append("author", author || "Anonymous");
    formData.append("description", description);
    if (key) formData.append("key", key);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);

      if (data.success) {
        setTitle("");
        setAuthor("");
        setDescription("");
        setFile(null);
        if (fileRef.current) fileRef.current.value = "";
      }
    } catch {
      setResult({ success: false, error: "Upload failed. Try again." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* File input */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          Book File
        </label>
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            file
              ? "border-burgundy/40 bg-burgundy/5"
              : "border-charcoal/15 hover:border-burgundy/30 bg-white"
          }`}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.epub,.txt,.mobi"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
          {file ? (
            <div>
              <p className="text-sm font-medium text-charcoal">{file.name}</p>
              <p className="text-xs text-muted mt-1">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="text-xs text-burgundy mt-2 hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <svg
                className="w-8 h-8 mx-auto mb-2 text-muted/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <p className="text-sm text-muted">
                Drop a file here, or <span className="text-burgundy font-medium">browse</span>
              </p>
              <p className="text-xs text-muted/60 mt-1">
                PDF, EPUB, TXT, MOBI &middot; Max 50MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Book title"
          className="w-full bg-white border border-charcoal/15 rounded-lg px-4 py-2.5 text-sm text-charcoal placeholder:text-muted/50 focus:border-burgundy focus:ring-0 transition-colors"
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          Author
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author name"
          className="w-full bg-white border border-charcoal/15 rounded-lg px-4 py-2.5 text-sm text-charcoal placeholder:text-muted/50 focus:border-burgundy focus:ring-0 transition-colors"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          Description
          <span className="font-normal text-muted/60"> (optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description..."
          rows={3}
          className="w-full bg-white border border-charcoal/15 rounded-lg px-4 py-2.5 text-sm text-charcoal placeholder:text-muted/50 focus:border-burgundy focus:ring-0 transition-colors resize-none"
        />
      </div>

      {/* Upload Key */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          Upload Key
        </label>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter upload key"
          className="w-full bg-white border border-charcoal/15 rounded-lg px-4 py-2.5 text-sm text-charcoal placeholder:text-muted/50 focus:border-burgundy focus:ring-0 transition-colors"
        />
        <p className="text-xs text-muted/60 mt-1">Required to prevent unauthorized uploads</p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!file || uploading}
        className="w-full py-3 bg-burgundy text-white rounded-lg font-medium text-sm hover:bg-burgundy-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {uploading ? "Uploading..." : "Upload Book"}
      </button>

      {/* Result */}
      {result && (
        <div
          className={`p-4 rounded-lg text-sm ${
            result.success
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {result.success
            ? `"${result.book?.title}" uploaded successfully!`
            : result.error}
        </div>
      )}
    </form>
  );
}
