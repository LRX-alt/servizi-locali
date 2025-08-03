'use client';

import { Search, X } from 'lucide-react';
import { useAppStore } from '@/store';

export default function SearchBar() {
  const {
    filtroRicerca,
    filtroRating,
    setFiltroRicerca,
    setFiltroRating,
    resetFiltri
  } = useAppStore();

  const handleReset = () => {
    resetFiltri();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="space-y-4">
        {/* Barra di ricerca principale */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Cerca per nome, categoria o specializzazione..."
            value={filtroRicerca}
            onChange={(e) => setFiltroRicerca(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 text-base"
          />
        </div>

        {/* Filtri avanzati */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Filtro rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating minimo
            </label>
            <select
              value={filtroRating || ''}
              onChange={(e) => setFiltroRating(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base"
            >
              <option value="">Tutti i rating</option>
              <option value="4">4+ stelle</option>
              <option value="4.5">4.5+ stelle</option>
              <option value="5">5 stelle</option>
            </select>
          </div>

          {/* Pulsante reset */}
          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-300 rounded-md transition-colors text-base"
            >
              <X className="w-4 h-4" />
              <span>Reset filtri</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 