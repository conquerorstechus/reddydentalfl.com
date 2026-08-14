import { createOpinlyClient } from "@opinly/backend";

const apiKey = process.env.OPINLY_API_KEY?.trim();

const fetchWithRevalidate: typeof fetch = (input, init) =>
  fetch(input, { ...init, next: { revalidate: 60, tags: ["opinly"] } });

export const hasOpinlyApiKey = Boolean(apiKey);

export const opinly = hasOpinlyApiKey
  ? createOpinlyClient({
      apiKey,
      fetch: fetchWithRevalidate,
    })
  : ({
      posts: async () => ({ data: [] }),
      categories: async () => [],
      authors: async () => ({ data: [] }),
      author: async () => ({ type: "not-found", data: null }),
      post: async () => null,
    } as any);
