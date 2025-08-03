'use client';

import { Star, Calendar, User } from 'lucide-react';
import { Recensione } from '@/types';

interface RecensioniListProps {
  recensioni: Recensione[];
  showAll?: boolean;
}

export default function RecensioniList({ recensioni, showAll = false }: RecensioniListProps) {
  const recensioniToShow = showAll ? recensioni : recensioni.slice(0, 3);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
              ? 'text-yellow-400 fill-current opacity-50' 
              : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (recensioni.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <Star className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-gray-600">Nessuna recensione ancora</p>
        <p className="text-sm text-gray-500">Sii il primo a lasciare una recensione!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Recensioni ({recensioni.length})
        </h3>
        {!showAll && recensioni.length > 3 && (
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Vedi tutte
          </button>
        )}
      </div>

      <div className="space-y-4">
        {recensioniToShow.map((recensione) => (
          <div
            key={recensione.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{recensione.utenteNome}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(recensione.data)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {renderStars(recensione.rating)}
              </div>
            </div>

            <div className="space-y-2">
              {recensione.servizioRecensito && (
                <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {recensione.servizioRecensito}
                </div>
              )}
              
              <p className="text-gray-700 text-sm leading-relaxed">
                {recensione.commento}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 