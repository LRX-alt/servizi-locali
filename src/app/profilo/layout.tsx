import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  title: "Profilo Utente",
};

export default function ProfiloLayout({ children }: { children: React.ReactNode }) {
  return children;
}



