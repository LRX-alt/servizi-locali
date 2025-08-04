import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";
import ToastContainer from "@/components/ToastContainer";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Servizi Locali - Trova professionisti nella tua zona",
  description: "Trova professionisti e servizi pubblici nella tua zona. Idraulici, elettricisti, giardinieri e molto altro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head />
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1">
              {children}
            </main>
            <ToastContainer />
          
          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Logo e descrizione */}
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">SL</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">Servizi Locali</span>
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
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} Servizi Locali. Tutti i diritti riservati.
                  </p>
                  <p className="text-sm text-gray-500 mt-2 md:mt-0">
                    Made with ❤️ in Italia
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
