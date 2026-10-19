import type { ContentMark, ContentNode } from "./content-node";

function escapeInline(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/([*_`[\]])/g, "\\$1");
}

function inlineToMarkdown(nodes: ContentNode[] | undefined): string {
  return (nodes ?? [])
    .map((node) => {
      if (node.type && node.type !== "text" && node.text == null) {
        return inlineToMarkdown(node.content);
      }
      let text = escapeInline(node.text ?? "");
      const marks = node.marks ?? [];
      if (marks.some((mark) => mark.type === "italic")) text = `*${text}*`;
      if (marks.some((mark) => mark.type === "bold")) text = `**${text}**`;
      const link = marks.find((mark) => mark.type === "link");
      if (link) {
        const href = typeof link.attrs?.href === "string" ? link.attrs.href : "";
        const title =
          typeof link.attrs?.title === "string" && link.attrs.title
            ? ` "${link.attrs.title.replace(/"/g, '\\"')}"`
            : "";
        text = `[${text}](${href}${title})`;
      }
      return text;
    })
    .join("");
}

function blockToMarkdown(node: ContentNode): string {
  switch (node.type) {
    case "heading": {
      const level = Math.min(6, Math.max(1, Number(node.attrs?.level ?? 2)));
      return `${"#".repeat(level)} ${inlineToMarkdown(node.content)}`;
    }
    case "paragraph":
      return inlineToMarkdown(node.content);
    case "bulletList":
      return (node.content ?? [])
        .map((item) => `- ${inlineToMarkdown(item.content).replace(/\n+/g, " ").trim()}`)
        .join("\n");
    case "blockquote":
      return (node.content ?? [])
        .map((child) => `> ${blockToMarkdown(child)}`)
        .join("\n");
    case "horizontalRule":
      return "---";
    case "table": {
      const rows = node.content ?? [];
      const rendered = rows.map((row) => {
        const cells = (row.content ?? []).map((cell) =>
          inlineToMarkdown(cell.content).replace(/\|/g, "\\|").replace(/\n+/g, " ").trim(),
        );
        return `| ${cells.join(" | ")} |`;
      });
      const columns = (rows[0]?.content ?? []).length;
      if (columns > 0) {
        rendered.splice(1, 0, `| ${Array(columns).fill("---").join(" | ")} |`);
      }
      return rendered.join("\n");
    }
    default:
      return (node.content ?? []).map(blockToMarkdown).filter(Boolean).join("\n\n");
  }
}

export function contentToMarkdown(doc: ContentNode): string {
  const blocks = (doc.content ?? []).map(blockToMarkdown).filter((block) => block.length > 0);
  return `${blocks.join("\n\n")}\n`;
}

function addMark(nodes: ContentNode[], mark: ContentMark): ContentNode[] {
  return nodes.map((node) => {
    if (node.text != null || node.type === "text") {
      return { ...node, type: "text", marks: [...(node.marks ?? []), mark] };
    }
    return {
      ...node,
      content: node.content ? addMark(node.content, mark) : node.content,
    };
  });
}

function parseInline(text: string): ContentNode[] {
  const nodes: ContentNode[] = [];
  let buffer = "";
  let index = 0;

  const flush = () => {
    if (!buffer) return;
    nodes.push({ type: "text", text: buffer });
    buffer = "";
  };

  while (index < text.length) {
    if (text[index] === "\\" && index + 1 < text.length) {
      buffer += text[index + 1];
      index += 2;
      continue;
    }

    if (text[index] === "[") {
      const link = readLink(text, index);
      if (link) {
        flush();
        const marked = addMark(parseInline(link.label), {
          type: "link",
          attrs: link.title ? { href: link.href, title: link.title } : { href: link.href },
        });
        nodes.push(...marked);
        index = link.end;
        continue;
      }
    }

    if (text.startsWith("**", index)) {
      const end = text.indexOf("**", index + 2);
      if (end !== -1) {
        flush();
        nodes.push(...addMark(parseInline(text.slice(index + 2, end)), { type: "bold" }));
        index = end + 2;
        continue;
      }
    }

    if (text[index] === "*" && text[index + 1] !== "*") {
      const end = text.indexOf("*", index + 1);
      if (end !== -1) {
        flush();
        nodes.push(...addMark(parseInline(text.slice(index + 1, end)), { type: "italic" }));
        index = end + 1;
        continue;
      }
    }

    buffer += text[index];
    index += 1;
  }

  flush();
  return nodes.length ? nodes : [{ type: "text", text: "" }];
}

function readLink(
  text: string,
  start: number,
): { label: string; href: string; title?: string; end: number } | null {
  let index = start + 1;
  let label = "";
  while (index < text.length) {
    if (text[index] === "\\" && index + 1 < text.length) {
      label += text[index + 1];
      index += 2;
      continue;
    }
    if (text[index] === "]") break;
    label += text[index];
    index += 1;
  }
  if (text[index] !== "]" || text[index + 1] !== "(") return null;
  index += 2;
  let href = "";
  while (index < text.length && text[index] !== ")" && text[index] !== " ") {
    href += text[index];
    index += 1;
  }
  let title: string | undefined;
  if (text[index] === " ") {
    const titleMatch = /^\s+"((?:\\.|[^"\\])*)"/.exec(text.slice(index));
    if (!titleMatch) return null;
    title = titleMatch[1].replace(/\\"/g, '"');
    index += titleMatch[0].length;
  }
  if (text[index] !== ")" || !href) return null;
  return { label, href, title, end: index + 1 };
}

function paragraph(text: string): ContentNode {
  return { type: "paragraph", content: parseInline(text.trim()) };
}

export function markdownToContent(markdown: string): ContentNode {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const content: ContentNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      content.push({
        type: "heading",
        attrs: { level: heading[1].length },
        content: parseInline(heading[2].trim()),
      });
      index += 1;
      continue;
    }

    if (line.trim() === "---") {
      content.push({ type: "horizontalRule" });
      index += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }
      content.push(parseTable(tableLines));
      continue;
    }

    if (/^[-*] /.test(line)) {
      const items: ContentNode[] = [];
      while (index < lines.length && /^[-*] /.test(lines[index])) {
        items.push({
          type: "listItem",
          content: [paragraph(lines[index].replace(/^[-*] /, ""))],
        });
        index += 1;
      }
      content.push({ type: "bulletList", content: items });
      continue;
    }

    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (index < lines.length && lines[index].startsWith("> ")) {
        quote.push(lines[index].slice(2));
        index += 1;
      }
      content.push({
        type: "blockquote",
        content: [paragraph(quote.join(" "))],
      });
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6}\s|[-*] |> |\||---\s*$)/.test(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    content.push(paragraph(paragraphLines.join(" ")));
  }

  return { type: "doc", content };
}

function isTableSeparator(line: string): boolean {
  const cells = line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|");
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell.trim()));
}

function parseTable(lines: string[]): ContentNode {
  const rows = lines
    .filter((line) => !isTableSeparator(line))
    .map((line, rowIndex) => {
      const cells = line
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.trim().replace(/\\\|/g, "|"));
      const type = rowIndex === 0 ? "tableHeader" : "tableCell";
      return {
        type: "tableRow",
        content: cells.map((cell) => ({
          type,
          content: [paragraph(cell)],
        })),
      };
    });

  return { type: "table", content: rows };
}
