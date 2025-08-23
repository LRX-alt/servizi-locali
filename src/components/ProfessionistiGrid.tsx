'use client';

import { useAppStore } from '@/store';
import ProfessionistaCard from './ProfessionistaCard';
import AuthHeroCard from './AuthHeroCard';

export default function ProfessionistiGrid() {
  const { 
    professionistiFiltrati, 
    isAuthenticated, 
    utente,
    getProfessionistiPerPriorita 
  } = useAppStore();

  // Se non autenticato, mostra solo la card-hero
  if (!isAuthenticated) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <AuthHeroCard />
      </div>
    );
  }

  // Ottieni professionisti separati per priorità
  const { professionistiLocali, altriProfessionisti, hasLocali } = getProfessionistiPerPriorita();

  // Se non ci sono risultati
  if (professionistiFiltrati.length === 0) {
    return (
      <div className="text-center py-8 md:py-12" role="status" aria-live="polite">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
          Nessun professionista trovato
        </h3>
        <p className="text-gray-600 text-sm md:text-base mb-2">
          Prova a modificare i filtri di ricerca o allargare la zona di servizio.
        </p>
        <p className="text-gray-500 text-sm">
          Potresti trovare professionisti disponibili nelle zone limitrofe.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8" role="main" aria-label="Lista professionisti organizzati per priorità geografica">
      {/* Sezione professionisti locali */}
      {hasLocali && (
        <section aria-labelledby="locali-heading">
          <div className="mb-4 md:mb-6">
            <h2 id="locali-heading" className="text-lg md:text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span role="img" aria-label="Casa" className="text-xl">🏠</span>
              Professionisti nel tuo comune
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Professionisti disponibili a <span className="font-medium text-gray-900">{utente?.comune}</span> - 
              i più vicini a te per servizi rapidi e convenienti
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {professionistiLocali.map((professionista) => (
              <ProfessionistaCard 
                key={professionista.id} 
                professionista={professionista} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Sezione altri professionisti */}
      {altriProfessionisti.length > 0 && (
        <section aria-labelledby="altri-heading">
          <div className="mb-4 md:mb-6">
            <h2 id="altri-heading" className="text-lg md:text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span role="img" aria-label="Globo terrestre" className="text-xl">🌍</span>
              Altri professionisti disponibili
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {hasLocali 
                ? `Professionisti di qualità anche fuori ${utente?.comune} - 
                   disponibili per servizi specializzati o quando hai bisogno di alternative`
                : 'Professionisti di qualità disponibili nella tua zona - scegli quello che meglio si adatta alle tue esigenze'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {altriProfessionisti.map((professionista) => (
              <ProfessionistaCard 
                key={professionista.id} 
                professionista={professionista} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Messaggio se non ci sono professionisti locali ma l'utente ha un comune */}
      {utente?.comune && !hasLocali && professionistiFiltrati.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 mb-6" role="alert" aria-live="polite">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-medium text-blue-800 mb-1">
                Nessun professionista trovato a {utente.comune}
              </h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                Al momento non ci sono professionisti registrati nel tuo comune. 
                I professionisti mostrati sono disponibili nelle zone limitrofe e possono comunque offrirti servizi di qualità.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
