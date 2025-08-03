'use client';

import Link from 'next/link';
import { Shield, Database, Eye, Mail, Phone } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Privacy Policy
        </h1>
        <p className="text-xl text-gray-600">
          Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
        </p>
      </div>

      {/* Contenuto */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-8">
        
        {/* Introduzione */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Introduzione
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Servizi Locali ("noi", "nostro", "ci") rispetta la tua privacy e si impegna a proteggere i tuoi dati personali. 
            Questa Privacy Policy spiega come raccogliamo, utilizziamo e proteggiamo le tue informazioni quando utilizzi il nostro servizio.
          </p>
        </section>

        {/* Dati che Raccogliamo */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Dati che Raccogliamo
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dati Personali</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Informazioni di Contatto</h4>
                    <p className="text-sm text-gray-600">
                      Nome, cognome, email, telefono, indirizzo
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Database className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Dati Account</h4>
                    <p className="text-sm text-gray-600">
                      Credenziali di accesso, preferenze, attività
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dati di Utilizzo</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Log di accesso e attività</li>
                <li>Dati di navigazione e ricerca</li>
                <li>Interazioni con professionisti</li>
                <li>Recensioni e valutazioni</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Dati Tecnici</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Indirizzo IP e informazioni dispositivo</li>
                <li>Cookie e tecnologie simili</li>
                <li>Dati di geolocalizzazione (se consentito)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Come Utilizziamo i Dati */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Come Utilizziamo i Dati
          </h2>
          <div className="space-y-4 text-gray-700">
            <p><strong>Fornire il Servizio:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Gestire il tuo account e profilo</li>
              <li>Connettere utenti con professionisti</li>
              <li>Facilitare comunicazioni dirette</li>
              <li>Gestire recensioni e valutazioni</li>
            </ul>
            
            <p><strong>Migliorare il Servizio:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Analizzare l'utilizzo per ottimizzazioni</li>
              <li>Sviluppare nuove funzionalità</li>
              <li>Risolvere problemi tecnici</li>
            </ul>

            <p><strong>Comunicazioni:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Notifiche importanti sul servizio</li>
              <li>Aggiornamenti sui termini e privacy</li>
              <li>Marketing (solo con consenso esplicito)</li>
            </ul>
          </div>
        </section>

        {/* Condivisione Dati */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Condivisione dei Dati
          </h2>
          <div className="space-y-4 text-gray-700">
            <p><strong>Non vendiamo i tuoi dati personali.</strong></p>
            
            <p><strong>Condivisione con:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Professionisti:</strong> Solo le informazioni necessarie per il contatto</li>
              <li><strong>Fornitori di servizi:</strong> Hosting, analytics, email (con garanzie di sicurezza)</li>
              <li><strong>Autorità:</strong> Solo se richiesto per legge</li>
            </ul>

            <p><strong>Protezione:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Tutti i partner sono vincolati da accordi di protezione dati</li>
              <li>Utilizziamo solo servizi conformi al GDPR</li>
              <li>I dati sono crittografati in transito e a riposo</li>
            </ul>
          </div>
        </section>

        {/* I Tuoi Diritti */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. I Tuoi Diritti (GDPR)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Diritto di Accesso</h4>
                  <p className="text-sm text-gray-600">
                    Richiedere copia dei tuoi dati personali
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Database className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Diritto di Rettifica</h4>
                  <p className="text-sm text-gray-600">
                    Correggere dati inesatti o incompleti
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Shield className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Diritto alla Cancellazione</h4>
                  <p className="text-sm text-gray-600">
                    Richiedere la cancellazione dei tuoi dati
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Diritto di Portabilità</h4>
                  <p className="text-sm text-gray-600">
                    Ricevere i tuoi dati in formato strutturato
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sicurezza */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Sicurezza dei Dati
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Implementiamo misure di sicurezza appropriate per proteggere i tuoi dati personali:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Crittografia SSL/TLS per tutte le comunicazioni</li>
              <li>Autenticazione a due fattori disponibile</li>
              <li>Backup regolari e sicuri</li>
              <li>Controlli di accesso rigorosi</li>
              <li>Monitoraggio continuo per minacce</li>
            </ul>
          </div>
        </section>

        {/* Cookie */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Cookie e Tecnologie Simili
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Utilizziamo cookie per migliorare la tua esperienza:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Cookie Essenziali</h4>
                <p className="text-sm text-gray-600">
                  Necessari per il funzionamento del sito
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Cookie Analitici</h4>
                <p className="text-sm text-gray-600">
                  Per analizzare l'utilizzo del servizio
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Cookie Funzionali</h4>
                <p className="text-sm text-gray-600">
                  Per ricordare le tue preferenze
                </p>
              </div>
            </div>
            <p>
              Puoi gestire le impostazioni dei cookie nelle preferenze del tuo browser.
            </p>
          </div>
        </section>

        {/* Contatti */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Contatti
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Data Protection Officer:</strong> privacy@servizilocali.it
            </p>
            <p>
              <strong>Indirizzo:</strong> [Inserisci indirizzo legale]
            </p>
            <p>
              Per esercitare i tuoi diritti o per domande sulla privacy, 
              contattaci all'indirizzo email sopra indicato.
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Privacy Policy - Servizi Locali</span>
          </div>
        </div>
      </div>
    </div>
  );
} 