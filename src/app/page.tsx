'use client';

import { useEffect } from 'react';
import { Users } from 'lucide-react';
import { useAppStore } from '@/store';
import SearchBar from '@/components/SearchBar';
import ComuniList from '@/components/ComuniList';
import CategoryGrid from '@/components/CategoryGrid';
import ProfessionistaCard from '@/components/ProfessionistaCard';

export default function HomePage() {
  const {
    professionistiFiltrati,
    professionisti,
    isLoading,
    error,
    loadProfessionisti
  } = useAppStore();

  useEffect(() => {
    loadProfessionisti();
  }, [loadProfessionisti]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento professionisti...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Users className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Errore nel caricamento
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadProfessionisti}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Trova professionisti nella tua zona
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connessioni dirette con idraulici, elettricisti, giardinieri e altri professionisti locali
        </p>
      </div>

      {/* DEBUG TEMPORANEO - Rimuovere dopo il fix */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">🔍 DEBUG - Dati Professionisti:</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p><strong>Totali:</strong> {professionisti.length}</p>
            <p><strong>Filtrati:</strong> {professionistiFiltrati.length}</p>
            <p><strong>Categorie disponibili:</strong> {[...new Set(professionisti.map(p => p.categoriaServizio))].join(', ')}</p>
          </div>
        </div>
      )}

      {/* Barra di ricerca */}
      <SearchBar />

      {/* Comuni disponibili */}
      <ComuniList />

      {/* Categorie */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Categorie</h2>
        <CategoryGrid />
      </div>

      {/* Lista professionisti */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Professionisti disponibili
          </h2>
          <span className="text-sm text-gray-600">
            {professionistiFiltrati?.length || 0} risultati
          </span>
        </div>

        {!professionistiFiltrati || professionistiFiltrati.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nessun professionista trovato
            </h3>
            <p className="text-gray-600">
              Prova a modificare i filtri di ricerca
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionistiFiltrati.map((professionista) => (
              <ProfessionistaCard
                key={professionista.id}
                professionista={professionista}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sezioni aggiuntive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Come funziona
          </h3>
          <p className="text-gray-600">
            Cerca il professionista che ti serve, contattalo direttamente e ricevi un preventivo personalizzato.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Professionisti verificati
          </h3>
          <p className="text-gray-600">
            Tutti i professionisti sono verificati e hanno recensioni autentiche da clienti reali.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Contatto diretto
          </h3>
          <p className="text-gray-600">
            Nessuna commissione nascosta. Contatti diretti con i professionisti senza intermediari.
          </p>
        </div>
      </div>
    </div>
  );
}
