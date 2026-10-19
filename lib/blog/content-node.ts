export interface ContentMark {
  type: string;
  attrs?: Record<string, unknown>;
}

/** Tiptap-style document node stored in content/blog/posts. */
export interface ContentNode {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: ContentNode[];
  marks?: ContentMark[];
  text?: string;
}
