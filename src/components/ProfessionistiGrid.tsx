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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AuthHeroCard />
      </div>
    );
  }

  // Ottieni professionisti separati per priorità
  const { professionistiLocali, altriProfessionisti, hasLocali } = getProfessionistiPerPriorita();

  // Se non ci sono risultati
  if (professionistiFiltrati.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Nessun professionista trovato con i filtri attuali.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Prova a modificare i filtri o la ricerca.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Sezione professionisti locali */}
      {hasLocali && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              🏠 Professionisti nel tuo comune
            </h2>
            <p className="text-gray-600 text-sm">
              Professionisti disponibili a <span className="font-medium">{utente?.comune}</span> - 
              i più vicini a te per servizi rapidi e convenienti
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionistiLocali.map((professionista) => (
              <ProfessionistaCard 
                key={professionista.id} 
                professionista={professionista} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Sezione altri professionisti */}
      {altriProfessionisti.length > 0 && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              🌍 Altri professionisti disponibili
            </h2>
            <p className="text-gray-600 text-sm">
              {hasLocali 
                ? `Professionisti di qualità anche fuori ${utente?.comune} - 
                   disponibili per servizi specializzati o quando hai bisogno di alternative`
                : 'Professionisti di qualità disponibili nella tua zona - scegli quello che meglio si adatta alle tue esigenze'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {altriProfessionisti.map((professionista) => (
              <ProfessionistaCard 
                key={professionista.id} 
                professionista={professionista} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Messaggio se non ci sono professionisti locali ma l'utente ha un comune */}
      {utente?.comune && !hasLocali && professionistiFiltrati.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Nessun professionista trovato a {utente.comune}
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Al momento non ci sono professionisti registrati nel tuo comune. 
                I professionisti mostrati sono disponibili nelle zone limitrofe.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
