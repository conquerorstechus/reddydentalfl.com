import { withOpinlyConfig } from "@opinly/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
};

export default withOpinlyConfig({
  cdnNamespace: "Xlz6qeNMFahM1LnqEBkJU",
  siteUrl: "https://www.reddydentalfl.com",
  blogPath: "/blog",
  companyName: "reddydentalfl.com",
  imagesPath: "/images",
})(nextConfig);
