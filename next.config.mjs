import path from "path";
import { fileURLToPath } from "url";
import { withOpinlyConfig } from "@opinly/next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Avoid picking C:\Users\CAB\package-lock.json as the monorepo root (breaks dev/build).
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/offer/call-us",
        destination: "/offers/call-us/",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(withOpinlyConfig({
  cdnNamespace: "Xlz6qeNMFahM1LnqEBkJU",
  siteUrl: "https://www.reddydentalfl.com",
  blogPath: "/blog",
  companyName: "Reddy Dental",
  imagesPath: "/images",
})(nextConfig));
