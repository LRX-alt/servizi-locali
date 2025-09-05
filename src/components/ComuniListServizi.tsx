'use client';

import { MapPin } from 'lucide-react';
import { useAppStore } from '@/store';

const comuniDisponibili = [
  'Nereto',
  'Corropoli', 
  'Controguerra',
  'Martinsicuro',
  'Alba Adriatica',
  'Tortoreto',
  'Giulianova',
  'Roseto degli Abruzzi'
];

export default function ComuniListServizi() {
  const { setFiltroComuneServizi, filtroComuneServizi } = useAppStore();

  const handleComuneClick = (comune: string) => {
    if (filtroComuneServizi === comune.toLowerCase()) {
      setFiltroComuneServizi('');
    } else {
      setFiltroComuneServizi(comune.toLowerCase());
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Comuni disponibili
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {comuniDisponibili.map((comune) => (
          <button
            key={comune}
            onClick={() => handleComuneClick(comune)}
            className={`flex items-center justify-center space-x-1 px-2 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              filtroComuneServizi === comune.toLowerCase()
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{comune}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center sm:text-left">
        Clicca su un comune per filtrare i servizi
      </p>
    </div>
  );
}

