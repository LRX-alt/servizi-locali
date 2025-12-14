import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import Header from "@/components/Header";
import ToastContainer from "@/components/ToastContainer";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Servizi Locali - Trova professionisti nella tua zona",
    template: "%s | Servizi Locali",
  },
  description:
    "Trova professionisti e servizi pubblici nella tua zona. Idraulici, elettricisti, giardinieri e molto altro.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Servizi Locali - Trova professionisti nella tua zona",
    description:
      "Trova professionisti e servizi pubblici nella tua zona. Idraulici, elettricisti, giardinieri e molto altro.",
    siteName: "Servizi Locali",
    images: [
      {
        url: "/logo_servizi-locali.png",
        width: 1200,
        height: 630,
        alt: "Servizi Locali",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Servizi Locali - Trova professionisti nella tua zona",
    description:
      "Trova professionisti e servizi pubblici nella tua zona. Idraulici, elettricisti, giardinieri e molto altro.",
    images: ["/logo_servizi-locali.png"],
  },
  icons: {
    icon: [
      { url: "/logo_servizi-locali.png", type: "image/png" },
      { url: "/logo_servizi-locali_white.png", type: "image/png", media: "(prefers-color-scheme: dark)" }
    ],
    shortcut: "/logo_servizi-locali.png",
    apple: "/logo_servizi-locali.png",
  },
  keywords: [
    "servizi locali",
    "professionisti",
    "idraulico",
    "elettricista",
    "giardiniere",
    "Nereto",
    "Abruzzo",
  ],
  authors: [{ name: "Servizi Locali" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Servizi Locali",
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-8 flex-1">
              {children}
            </main>
            <ToastContainer />
          
          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Logo e descrizione */}
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <Image
                      src="/logo_servizi-locali.png"
                      alt="Servizi Locali"
                      width={160}
                      height={160}
                      className="h-40 w-auto"
                    />
                  </div>
                  <p className="text-gray-600 mb-4">
                    Connettere utenti con professionisti locali per servizi di qualità nella tua zona.
                  </p>
                </div>

                {/* Link rapidi */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Link Rapidi</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/servizi-pubblici" className="text-sm text-gray-600 hover:text-gray-900">
                        Servizi Pubblici
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Legale */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Legale</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/termini" className="text-sm text-gray-600 hover:text-gray-900">
                        Termini di Servizio
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="mailto:privacy@servizilocali.it" className="text-sm text-gray-600 hover:text-gray-900">
                        Contatti
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Copyright */}
              <div className="border-t border-gray-200 mt-8 pt-8">
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-between md:items-center gap-1 text-center md:text-left">
                  <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} Servizi Locali. Tutti i diritti riservati.
                  </p>
                  <p className="text-sm text-gray-500">
                    Ideato e Sviluppato da{' '}
                    <Link href="https://neuralcodestudio.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                      Loris Di Furio - Neuralcodestudio.dev
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
