import { OpinlyContent } from "@opinly/react";
import { opinlyConfig } from "@opinly/next";
import type { OpinlyNode } from "@opinly/shared";

const defaultConfig = {
  imagesPrefix: opinlyConfig.imagesPrefix,
  siteUrl: opinlyConfig.siteUrl,
  blogPrefix: opinlyConfig.blogPrefix,
  siteName: opinlyConfig.siteName,
};

export function PostContent({
  content,
  imagesPrefix,
}: {
  content: OpinlyNode;
  imagesPrefix?: string;
}) {
  const config = imagesPrefix
    ? { ...defaultConfig, imagesPrefix }
    : defaultConfig;

  return <OpinlyContent content={content} config={config} />;
}
