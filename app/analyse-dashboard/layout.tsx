import type { Metadata } from "next";

// Internal/experimental dashboard view — not meant for organic search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AnalyseDashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
