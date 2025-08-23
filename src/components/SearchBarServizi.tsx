'use client';

import { Search } from 'lucide-react';
import { useAppStore } from '@/store';

export default function SearchBarServizi() {
  const {
    filtroRicercaServizi,
    setFiltroRicercaServizi
  } = useAppStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      {/* Barra di ricerca principale */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Cerca per nome, tipo o indirizzo..."
          value={filtroRicercaServizi}
          onChange={(e) => setFiltroRicercaServizi(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 text-base"
        />
      </div>
    </div>
  );
}
