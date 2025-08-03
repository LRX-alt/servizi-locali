'use client';

import Link from 'next/link';
import { FileText, Shield, Users, Building2 } from 'lucide-react';

export default function TerminiPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Termini di Servizio
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
            1. Accettazione dei Termini
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Utilizzando Servizi Locali ("il Servizio"), accetti di essere vincolato da questi Termini di Servizio. 
            Se non accetti questi termini, non utilizzare il Servizio.
          </p>
        </section>

        {/* Descrizione del Servizio */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Descrizione del Servizio
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Servizi Locali è una piattaforma che connette utenti privati con professionisti locali, 
            facilitando la ricerca e il contatto diretto per servizi professionali.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Utenti Privati</h3>
                <p className="text-sm text-gray-600">
                  Possono cercare professionisti, scrivere recensioni e gestire preferiti
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900">Professionisti</h3>
                <p className="text-sm text-gray-600">
                  Possono creare profili, gestire servizi e ricevere contatti
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Registrazione e Account */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Registrazione e Account
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              • Devi fornire informazioni accurate e complete durante la registrazione
            </p>
            <p>
              • Sei responsabile della sicurezza del tuo account e password
            </p>
            <p>
              • Non puoi trasferire il tuo account a terzi
            </p>
            <p>
              • Ci riserviamo il diritto di sospendere o terminare account inappropriati
            </p>
          </div>
        </section>

        {/* Uso del Servizio */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Uso del Servizio
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Permesso:</strong> Utilizzare il Servizio solo per scopi legittimi
            </p>
            <p>
              <strong>Vietato:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Utilizzare il Servizio per attività illegali</li>
              <li>Violare diritti di proprietà intellettuale</li>
              <li>Spam o contenuti offensivi</li>
              <li>Tentativi di hacking o accesso non autorizzato</li>
            </ul>
          </div>
        </section>

        {/* Contenuti e Recensioni */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. Contenuti e Recensioni
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              • Le recensioni devono essere veritiere e basate su esperienze reali
            </p>
            <p>
              • Non sono ammessi contenuti diffamatori o offensivi
            </p>
            <p>
              • Ci riserviamo il diritto di moderare e rimuovere contenuti inappropriati
            </p>
            <p>
              • Mantieni la proprietà dei tuoi contenuti, ma ci concedi licenza di utilizzo
            </p>
          </div>
        </section>

        {/* Privacy e Dati */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Privacy e Protezione Dati
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              • Raccogliamo e processiamo i tuoi dati secondo la nostra 
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                Privacy Policy
              </Link>
            </p>
            <p>
              • Utilizziamo cookie e tecnologie simili per migliorare il Servizio
            </p>
            <p>
              • I tuoi dati personali sono protetti secondo il GDPR
            </p>
          </div>
        </section>

        {/* Limitazioni di Responsabilità */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Limitazioni di Responsabilità
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              • Servizi Locali è una piattaforma di connessione, non fornisce servizi direttamente
            </p>
            <p>
              • Non garantiamo la qualità dei servizi dei professionisti
            </p>
            <p>
              • Non siamo responsabili per dispute tra utenti e professionisti
            </p>
            <p>
              • Il Servizio è fornito &quot;così com&apos;è&quot; senza garanzie esplicite
            </p>
          </div>
        </section>

        {/* Modifiche ai Termini */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Modifiche ai Termini
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. 
            Le modifiche saranno comunicate tramite email o notifica sul sito. 
            L&apos;uso continuato del Servizio dopo le modifiche costituisce accettazione dei nuovi termini.
          </p>
        </section>

        {/* Contatti */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            9. Contatti
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Email:</strong> privacy@servizilocali.it
            </p>
            <p>
              <strong>Indirizzo:</strong> [Inserisci indirizzo legale]
            </p>
            <p>
              Per domande sui termini, contattaci all&apos;indirizzo email sopra indicato.
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Termini di Servizio - Servizi Locali</span>
          </div>
        </div>
      </div>
    </div>
  );
} 