import type { ReactNode } from "react";
import styles from "@/app/blog/blog.module.css";
import type { ContentMark, ContentNode } from "@/lib/blog/content-node";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function textContent(node: ContentNode): string {
  if (node.text) return node.text;
  return (node.content ?? []).map(textContent).join("");
}

function uriLooksSafe(href: string): boolean {
  const trimmed = href.trim();
  if (/^\s*(javascript|data|vbscript):/i.test(trimmed)) return false;
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return true;
  return !/^[a-z][a-z0-9+.-]*:/i.test(trimmed);
}

function renderMarks(
  text: string,
  marks: ContentMark[] | undefined,
  key: string,
): ReactNode {
  let node: ReactNode = text;
  (marks ?? []).forEach((mark, index) => {
    const markKey = `${key}-m${index}`;
    if (mark.type === "bold") {
      node = <strong key={markKey}>{node}</strong>;
      return;
    }
    if (mark.type === "italic") {
      node = <em key={markKey}>{node}</em>;
      return;
    }
    if (mark.type === "link") {
      const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : "";
      if (!href || !uriLooksSafe(href)) return;
      const target =
        typeof mark.attrs?.target === "string" ? mark.attrs.target : undefined;
      const rel =
        typeof mark.attrs?.rel === "string"
          ? mark.attrs.rel
          : target === "_blank"
            ? "noopener noreferrer"
            : undefined;
      const title =
        typeof mark.attrs?.title === "string" ? mark.attrs.title : undefined;
      node = (
        <a key={markKey} href={href} target={target} rel={rel} title={title}>
          {node}
        </a>
      );
    }
  });
  return node;
}

function spanAttrs(node: ContentNode) {
  return {
    colSpan: typeof node.attrs?.colspan === "number" ? node.attrs.colspan : undefined,
    rowSpan: typeof node.attrs?.rowspan === "number" ? node.attrs.rowspan : undefined,
  };
}

function renderNode(node: ContentNode, key: string): ReactNode {
  if (node.type === "text" || node.text !== undefined) {
    return renderMarks(node.text ?? "", node.marks, key);
  }

  const children = (node.content ?? []).map((child, index) =>
    renderNode(child, `${key}-${index}`),
  );

  switch (node.type) {
    case "doc":
      return children;
    case "paragraph":
      return <p key={key}>{children}</p>;
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const id = slugify(textContent(node));
      if (level <= 1) return <h2 key={key} id={id}>{children}</h2>;
      if (level === 3) return <h3 key={key} id={id}>{children}</h3>;
      if (level >= 4) return <h4 key={key} id={id}>{children}</h4>;
      return <h2 key={key} id={id}>{children}</h2>;
    }
    case "bulletList":
      return <ul key={key}>{children}</ul>;
    case "orderedList":
      return <ol key={key}>{children}</ol>;
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return <blockquote key={key}>{children}</blockquote>;
    case "horizontalRule":
      return <hr key={key} />;
    case "hardBreak":
      return <br key={key} />;
    case "table":
      return (
        <div key={key} className={styles.tableWrap}>
          <table>{children}</table>
        </div>
      );
    case "tableRow":
      return <tr key={key}>{children}</tr>;
    case "tableHeader":
      return (
        <th key={key} {...spanAttrs(node)}>
          {children}
        </th>
      );
    case "tableCell":
      return (
        <td key={key} {...spanAttrs(node)}>
          {children}
        </td>
      );
    case "image": {
      const fileKey = typeof node.attrs?.fileKey === "string" ? node.attrs.fileKey : "";
      const src =
        typeof node.attrs?.src === "string"
          ? node.attrs.src
          : fileKey
            ? `/blog-images/${fileKey.replace(/^\/+/, "")}`
            : "";
      if (!src) return null;
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      const title = typeof node.attrs?.title === "string" ? node.attrs.title : undefined;
      const width = typeof node.attrs?.width === "number" ? node.attrs.width : undefined;
      const height = typeof node.attrs?.height === "number" ? node.attrs.height : undefined;
      return (
        <img
          key={key}
          src={src}
          alt={alt}
          title={title}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
        />
      );
    }
    default:
      return children.length ? <div key={key}>{children}</div> : null;
  }
}

export function PostContent({ content }: { content: ContentNode }) {
  return <>{renderNode(content, "doc")}</>;
}
