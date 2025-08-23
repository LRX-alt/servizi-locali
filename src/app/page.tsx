'use client';

import { useEffect } from 'react';
import { Users } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useAppStore } from '@/store';
import SearchBar from '@/components/SearchBar';
import ComuniList from '@/components/ComuniList';
import CategoryGrid from '@/components/CategoryGrid';
import ProfessionistiGrid from '@/components/ProfessionistiGrid';
import StickyAuthBanner from '@/components/StickyAuthBanner';
import { useAppStore as useStore } from '@/store';
import ProfessionistaCardSkeleton from '@/components/ProfessionistaCardSkeleton';

export default function HomePage() {
  const {
    professionistiFiltrati,
    isLoading,
    error,
    loadProfessionisti,
    hasMore,
    loadMore
  } = useAppStore();
  const { isAuthenticated } = useStore();
  


  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    loadProfessionisti();
  }, [loadProfessionisti]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);

  if (isLoading) {
    return (
      <main className="space-y-6 md:space-y-8" role="main" aria-live="polite" aria-label="Caricamento in corso">
        {/* Hero Section */}
        <section className="text-center space-y-3 md:space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Trova professionisti nella tua zona
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connessioni dirette con idraulici, elettricisti, giardinieri e altri professionisti locali
          </p>
        </section>

        {/* Barra di ricerca */}
        <SearchBar />

        {/* Comuni disponibili */}
        <ComuniList />

        {/* Categorie */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Categorie</h2>
          <CategoryGrid />
        </section>

        {/* Lista professionisti */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              Professionisti disponibili
            </h2>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <ProfessionistaCardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Sezioni aggiuntive */}
        <section className="mt-8 md:mt-12">
          <h2 className="sr-only">Caratteristiche del servizio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <article className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                Come funziona
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Cerca il professionista che ti serve, contattalo direttamente e ricevi un preventivo personalizzato.
              </p>
            </article>

            <article className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                Professionisti verificati
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Tutti i professionisti sono verificati e hanno recensioni autentiche da clienti reali.
              </p>
            </article>

            <article className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Contatto diretto
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Nessuna commissione nascosta. Contatti diretti con i professionisti senza intermediari.
              </p>
            </article>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 md:py-12" role="alert" aria-live="polite">
        <div className="text-red-600 mb-4">
          <Users className="w-16 h-16 mx-auto" aria-hidden="true" />
        </div>
        <h3 className="text-lg md:text-xl font-medium text-gray-900 mb-2">
          Errore nel caricamento
        </h3>
        <p className="text-gray-600 mb-4 text-sm md:text-base">{error}</p>
        <button
          onClick={loadProfessionisti}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          aria-label="Riprova a caricare i professionisti"
        >
          Riprova
        </button>
      </div>
    );
  }

  return (
    <main className="space-y-6 md:space-y-8" role="main">
      {/* Hero Section */}
      <section className="text-center space-y-3 md:space-y-4" aria-labelledby="hero-title">
        <h1 id="hero-title" className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
          Trova professionisti nella tua zona
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Connessioni dirette con idraulici, elettricisti, giardinieri e altri professionisti locali
        </p>
      </section>

      {/* Barra di ricerca */}
      <SearchBar />

      {/* Comuni disponibili */}
      <ComuniList />

      {/* Categorie */}
      <section className="space-y-4" aria-labelledby="categorie-heading">
        <h2 id="categorie-heading" className="text-xl md:text-2xl font-semibold text-gray-900">Categorie</h2>
        <CategoryGrid />
      </section>

      {/* Lista professionisti */}
      <section className="space-y-4" aria-labelledby="professionisti-heading">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 id="professionisti-heading" className="text-xl md:text-2xl font-semibold text-gray-900">
            Professionisti disponibili
          </h2>
          <span className="text-sm text-gray-600">
            {professionistiFiltrati?.length || 0} risultati
          </span>
        </div>

        <ProfessionistiGrid />
        
        {/* Paginazione infinita */}
        {hasMore && (
          <div ref={ref} className="flex justify-center py-4" role="status" aria-label="Caricamento professionisti aggiuntivi">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" aria-hidden="true"></div>
          </div>
        )}
      </section>

      {/* Sezioni aggiuntive */}
      <section className="mt-8 md:mt-12" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">Caratteristiche del servizio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <article className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
              Come funziona
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Cerca il professionista che ti serve, contattalo direttamente e ricevi un preventivo personalizzato.
            </p>
          </article>

          <article className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
              Professionisti verificati
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Tutti i professionisti sono verificati e hanno recensioni autentiche da clienti reali.
            </p>
          </article>

          <article className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
              Contatto diretto
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              Nessuna commissione nascosta. Contatti diretti con i professionisti senza intermediari.
            </p>
          </article>
        </div>
      </section>
      {/* Banner sticky per utenti non autenticati */}
      {!isAuthenticated && <StickyAuthBanner />}
    </main>
  );
}
