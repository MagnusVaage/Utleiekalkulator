import type { Metadata } from "next";

// Personal saved-analyses list (localStorage) — not meant for organic search.
export const metadata: Metadata = {
  title: "Mine boliger | Utleiekalkulator",
  robots: { index: false, follow: false },
};

export default function MineBoligerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
