import { createOpinlyClient } from "@opinly/backend";

// Picks up OPINLY_API_KEY from the environment. `force-cache` puts responses in
// the data cache; the tags allow webhook invalidation later.
export const opinly = createOpinlyClient({
  apiKey: process.env.OPINLY_API_KEY,
  fetch: (url, init) =>
    fetch(url, { ...init, cache: "force-cache", next: { tags: ["opinly"] } }),
});
