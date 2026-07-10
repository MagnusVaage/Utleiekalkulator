import type { Metadata } from "next";

// Experimental alternate landing page — keep it out of search results
// to avoid duplicate content with the homepage.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return children;
}
