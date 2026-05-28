"use client";

interface Props {
  content: string;
}

function parseInline(text: string): React.ReactNode {
  // Split on **bold** markers
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-charcoal font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function parseLine(line: string, key: number): React.ReactNode {
  // Headers: ## text
  if (line.startsWith("## ")) {
    return (
      <h3 key={key} className="font-serif text-xl text-charcoal mt-8 mb-3">
        {parseInline(line.slice(3))}
      </h3>
    );
  }

  // Bold header lines (e.g. **The Core Teaching**)
  if (/^\*\*[^*]+\*\*\s*$/.test(line)) {
    return (
      <h4 key={key} className="font-serif text-lg text-charcoal mt-6 mb-2">
        {parseInline(line)}
      </h4>
    );
  }

  // Numbered list: 1. text
  const numbered = line.match(/^(\d+)\.\s+(.+)$/);
  if (numbered) {
    return (
      <div key={key} className="flex gap-3 mb-2 ml-1">
        <span className="text-gold font-mono text-sm mt-0.5 w-5 text-right flex-shrink-0">
          {numbered[1]}.
        </span>
        <p className="text-ink text-sm leading-relaxed">
          {parseInline(numbered[2])}
        </p>
      </div>
    );
  }

  // Bullet: - text
  if (line.startsWith("- ")) {
    return (
      <div key={key} className="flex gap-2.5 mb-1.5 ml-1">
        <span className="text-gold/50 mt-1.5 flex-shrink-0">&#8226;</span>
        <p className="text-ink text-sm leading-relaxed">
          {parseInline(line.slice(2))}
        </p>
      </div>
    );
  }

  // Empty line = paragraph break
  if (line.trim() === "") {
    return <div key={key} className="h-3" />;
  }

  // Regular paragraph
  return (
    <p key={key} className="text-ink text-sm leading-relaxed mb-2">
      {parseInline(line)}
    </p>
  );
}

export default function TeachingContent({ content }: Props) {
  const lines = content.split("\n");
  return <div>{lines.map((line, i) => parseLine(line, i))}</div>;
}
