import type { ReactNode } from "react";

/**
 * Minimal markdown-ish renderer for CMS blog bodies.
 * Supports: ## headings, **bold**, - bullet lists, 1. ordered lists,
 * paragraphs. No external dependency by design.
 */
export function RichText({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function renderBlock(block: string, key: number): ReactNode {
  const lines = block.split("\n");

  if (block.startsWith("## ")) {
    return (
      <h2 key={key} className="pt-4 font-display text-2xl font-bold tracking-tight">
        {inline(block.slice(3))}
      </h2>
    );
  }
  if (lines.every((l) => /^[-*]\s+/.test(l))) {
    return (
      <ul key={key} className="list-disc space-y-1.5 ps-6">
        {lines.map((l, i) => (
          <li key={i}>{inline(l.replace(/^[-*]\s+/, ""))}</li>
        ))}
      </ul>
    );
  }
  if (lines.every((l) => /^\d+[.)]\s+/.test(l))) {
    return (
      <ol key={key} className="list-decimal space-y-1.5 ps-6">
        {lines.map((l, i) => (
          <li key={i}>{inline(l.replace(/^\d+[.)]\s+/, ""))}</li>
        ))}
      </ol>
    );
  }
  return (
    <p key={key} className="leading-[1.9] text-card-foreground/90">
      {inline(block)}
    </p>
  );
}
