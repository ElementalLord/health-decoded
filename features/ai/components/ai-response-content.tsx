import { Fragment } from "react";

import { cn } from "@/lib/utils";

type ContentBlock =
  | { readonly kind: "ordered"; readonly items: string[] }
  | { readonly kind: "paragraph"; readonly text: string }
  | { readonly kind: "unordered"; readonly items: string[] };

function parseBlocks(content: string): ContentBlock[] {
  const lines = content.split("\n");
  const blocks: ContentBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index]?.trim() ?? "";
    if (!line) {
      index += 1;
      continue;
    }

    const unordered = /^[-*]\s+(.+)$/.exec(line);
    const ordered = /^\d+[.)]\s+(.+)$/.exec(line);
    if (unordered || ordered) {
      const kind = unordered ? "unordered" : "ordered";
      const items: string[] = [];

      while (index < lines.length) {
        const current = lines[index]?.trim() ?? "";
        const match =
          kind === "unordered" ? /^[-*]\s+(.+)$/.exec(current) : /^\d+[.)]\s+(.+)$/.exec(current);
        if (!match) break;
        items.push(match[1]!);
        index += 1;
      }

      blocks.push({ items, kind });
      continue;
    }

    const paragraph: string[] = [];
    while (index < lines.length && lines[index]?.trim()) {
      paragraph.push(lines[index]!.trim());
      index += 1;
    }
    blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

function renderEmphasis(text: string) {
  return text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).map((part, index) => {
    const bold = /^\*\*([^*]+)\*\*$/.exec(part);
    const italic = /^_([^_]+)_$/.exec(part);

    if (bold) return <strong key={index}>{bold[1]}</strong>;
    if (italic) return <em key={index}>{italic[1]}</em>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function AiResponseContent({ className, content }: { className?: string; content: string }) {
  return (
    <div className={cn("space-y-4 leading-7", className)}>
      {parseBlocks(content).map((block, index) => {
        if (block.kind === "unordered") {
          return (
            <ul className="list-disc space-y-1.5 pl-5" key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderEmphasis(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.kind === "ordered") {
          return (
            <ol className="list-decimal space-y-1.5 pl-5" key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderEmphasis(item)}</li>
              ))}
            </ol>
          );
        }

        return <p key={index}>{renderEmphasis(block.text)}</p>;
      })}
    </div>
  );
}
