'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store';
import SearchBar from '@/components/SearchBar';
import CategoryGrid from '@/components/CategoryGrid';
import ComuniList from '@/components/ComuniList';
import ProfessionistaCard from '@/components/ProfessionistaCard';
import { Users, Building2, Map } from 'lucide-react';

export default function HomePage() {
  const {
    professionistiFiltrati,
    isLoading,
    error,
    loadProfessionisti
  } = useAppStore();

  useEffect(() => {
    // Carica i professionisti da Supabase all'avvio
    loadProfessionisti();
  }, [loadProfessionisti]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento professionisti...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Errore: {error}</p>
        <button 
          onClick={() => loadProfessionisti()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Professionisti</h3>
          </div>
          <p className="text-gray-600">
            Trova professionisti qualificati per ogni tipo di lavoro
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Servizi Pubblici</h3>
          </div>
          <p className="text-gray-600">
            Informazioni su uffici, farmacie, banche e altri servizi
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Map className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Mappa</h3>
          </div>
          <p className="text-gray-600">
            Visualizza servizi pubblici sulla mappa interattiva
          </p>
        </div>
      </div>
    </div>
  );
}
