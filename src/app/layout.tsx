import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Servizi Locali - Trova professionisti nella tua zona",
  description: "Trova professionisti e servizi pubblici nella tua zona. Idraulici, elettricisti, giardinieri e molto altro.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1">
            {children}
          </main>
          
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
                      <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="/servizi-pubblici" className="text-sm text-gray-600 hover:text-gray-900">
                        Servizi Pubblici
                      </a>
                    </li>
                    <li>
                      <a href="/mappa" className="text-sm text-gray-600 hover:text-gray-900">
                        Mappa
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Legale */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Legale</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="/termini" className="text-sm text-gray-600 hover:text-gray-900">
                        Termini di Servizio
                      </a>
                    </li>
                    <li>
                      <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="mailto:privacy@servizilocali.it" className="text-sm text-gray-600 hover:text-gray-900">
                        Contatti
                      </a>
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
      </body>
    </html>
  );
}
