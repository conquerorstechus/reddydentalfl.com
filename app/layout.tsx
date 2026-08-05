import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://reddydentalfl.com"),
  title: "Dentist Near Me in St. Petersburg, FL | Reddy Dental",
  description:
    "Reddy Dental is a dentist near me located in St. Petersburg, FL 33707 for all your family and cosmetic dentistry needs.",
  openGraph: {
    type: "website",
    siteName: "Reddy Dental",
    locale: "en_US",
    title: "Dentist Near Me in St. Petersburg, FL | Reddy Dental",
    description:
      "Reddy Dental is a dentist near me located in St. Petersburg, FL 33707 for all your family and cosmetic dentistry needs.",
    url: "https://reddydentalfl.com/",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dentist Near Me in St. Petersburg, FL | Reddy Dental",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dentist Near Me in St. Petersburg, FL | Reddy Dental",
    description:
      "Reddy Dental is a dentist near me located in St. Petersburg, FL 33707 for all your family and cosmetic dentistry needs.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
