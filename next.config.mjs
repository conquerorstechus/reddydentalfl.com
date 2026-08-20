import { withOpinlyConfig } from "@opinly/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default withOpinlyConfig({
  cdnNamespace: "Xlz6qeNMFahM1LnqEBkJU",
  siteUrl: "https://www.reddydentalfl.com",
  blogPath: "/blog",
  companyName: "Reddy Dental",
  imagesPath: "/images",
})(nextConfig);
