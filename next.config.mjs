import path from "path";
import { fileURLToPath } from "url";
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
      // Apex host → www. HTTPS is terminated by the host (Vercel) before this runs,
      // so an HTTP→HTTPS rule here would never match and is omitted on purpose.
      {
        source: "/:path*",
        has: [{ type: "host", value: "reddydentalfl.com" }],
        destination: "https://www.reddydentalfl.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
