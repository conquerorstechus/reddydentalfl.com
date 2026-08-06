import { OpinlyContent } from "@opinly/react";
import { opinlyConfig } from "@opinly/next";
import type { OpinlyNode } from "@opinly/shared";

const config = {
  imagesPrefix: opinlyConfig.imagesPrefix,
  siteUrl: opinlyConfig.siteUrl,
  blogPrefix: opinlyConfig.blogPrefix,
  siteName: opinlyConfig.siteName,
};

export function PostContent({ content }: { content: OpinlyNode }) {
  return <OpinlyContent content={content} config={config} />;
}
