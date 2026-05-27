import { NextRequest, NextResponse } from "next/server";
import { getGutenbergBook, getReadUrl } from "@/lib/gutenberg";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookId = parseInt(id, 10);
  if (isNaN(bookId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const format = req.nextUrl.searchParams.get("format") || "pdf";

  let book;
  try {
    book = await getGutenbergBook(bookId);
  } catch {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  if (format === "txt") {
    const txtUrl =
      book.formats["text/plain; charset=utf-8"] ||
      book.formats["text/plain"];
    if (!txtUrl) {
      return NextResponse.json({ error: "TXT not available" }, { status: 404 });
    }
    return proxyDownload(txtUrl, book.title, "txt", "text/plain; charset=utf-8");
  }

  if (format === "pdf") {
    const htmlUrl = getReadUrl(book);
    if (!htmlUrl) {
      return NextResponse.json({ error: "No readable format" }, { status: 404 });
    }

    try {
      const res = await fetch(htmlUrl);
      if (!res.ok) throw new Error("fetch failed");
      const rawHtml = await res.text();

      // Extract text content from HTML
      const textContent = extractText(rawHtml);

      // Generate actual PDF using jsPDF
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      const lineHeight = 6;

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      const titleLines = doc.splitTextToSize(book.title, maxWidth);
      doc.text(titleLines, pageWidth / 2, margin, { align: "center" });

      let y = margin + titleLines.length * lineHeight + 5;

      // Author
      if (book.authors.length > 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const authorText = book.authors.map((a) => a.name).join(", ");
        doc.text(authorText, pageWidth / 2, y, { align: "center" });
        y += 10;
      }

      // Separator
      doc.setDrawColor(200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      // Body text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const paragraphs = textContent.split("\n").filter((p) => p.trim());

      for (const para of paragraphs) {
        const lines = doc.splitTextToSize(para, maxWidth);

        for (const line of lines) {
          if (y + lineHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        }
        y += 3; // paragraph gap
      }

      const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
      const safeName = book.title.replace(/[^a-zA-Z0-9\s-_]/g, "").trim();

      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
          "Content-Length": pdfBuffer.length.toString(),
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      return NextResponse.json({ error: "Failed to generate PDF" }, { status: 502 });
    }
  }

  return NextResponse.json({ error: "Unknown format" }, { status: 400 });
}

function extractText(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  // Remove HTML tags
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<\/div>/gi, "\n");
  text = text.replace(/<\/h[1-6]>/gi, "\n\n");
  text = text.replace(/<[^>]+>/g, "");
  // Decode HTML entities
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&nbsp;/g, " ");
  // Clean up whitespace
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.replace(/[ \t]+/g, " ");
  return text.trim();
}

async function proxyDownload(
  url: string,
  title: string,
  format: string,
  mime: string
): Promise<NextResponse> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch file" }, { status: 502 });
    }

    const buffer = await res.arrayBuffer();
    const safeName = title.replace(/[^a-zA-Z0-9\s-_]/g, "").trim();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${safeName}.${format}"`,
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Download failed" }, { status: 502 });
  }
}
