import { createOpinlyClient } from "@opinly/backend";

// Picks up OPINLY_API_KEY from the environment. Short revalidate keeps newly
// published posts visible until webhook invalidation is wired up; tags stay
// ready for that later step.
export const opinly = createOpinlyClient({
  apiKey: process.env.OPINLY_API_KEY,
  fetch: (url, init) =>
    fetch(url, { ...init, next: { revalidate: 60, tags: ["opinly"] } }),
});
