import type { Metadata } from "next";
import ThankYouContent from "./thank-you-content";

export const metadata: Metadata = {
  title: "Thank You | Reddy Dental",
  description: "Your callback request has been received. Our team will get back to you shortly.",
};

export default function CallUsThankYouPage() {
  return <ThankYouContent />;
}
