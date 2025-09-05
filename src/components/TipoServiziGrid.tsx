'use client';

import { useAppStore } from '@/store';

const tipiServizi = [
  { id: 'comune', nome: 'Comune', icona: '🏛️' },
  { id: 'farmacia', nome: 'Farmacia', icona: '💊' },
  { id: 'banca', nome: 'Banca', icona: '🏦' },
  { id: 'poste', nome: 'Poste', icona: '📮' },
  { id: 'ufficio', nome: 'Ufficio', icona: '🏢' },
  { id: 'ospedale', nome: 'Ospedale', icona: '🏥' }
];

export default function TipoServiziGrid() {
  const { setFiltroTipoServizio, filtroTipoServizio } = useAppStore();

  const handleTipoClick = (tipoId: string) => {
    if (filtroTipoServizio === tipoId) {
      setFiltroTipoServizio('');
    } else {
      setFiltroTipoServizio(tipoId);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {tipiServizi.map((tipo) => (
        <button
          key={tipo.id}
          onClick={() => handleTipoClick(tipo.id)}
          className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
            filtroTipoServizio === tipo.id
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-center space-y-2">
            <div className="text-2xl sm:text-3xl">{tipo.icona}</div>
            <div className="text-xs sm:text-sm font-medium leading-tight">{tipo.nome}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

