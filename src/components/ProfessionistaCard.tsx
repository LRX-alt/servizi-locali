'use client';

import { useState } from 'react';
import { Phone, Star, MapPin, Clock, User, MessageSquare, Plus } from 'lucide-react';
import { Professionista } from '@/types';
import { useAppStore } from '@/store';
import RecensioniList from './RecensioniList';
import FormRecensione from './FormRecensione';

interface ProfessionistaCardProps {
  professionista: Professionista;
  showDetails?: boolean;
}

export default function ProfessionistaCard({ professionista, showDetails = false }: ProfessionistaCardProps) {
  const { setProfessionistaSelezionato } = useAppStore();
  const [showRecensioni, setShowRecensioni] = useState(false);
  const [showFormRecensione, setShowFormRecensione] = useState(false);

  const handleCardClick = () => {
    setProfessionistaSelezionato(professionista);
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`tel:${professionista.telefono}`, '_self');
  };

  const handleSubmitRecensione = async (recensione: any) => {
    // Simula l'invio della recensione
    console.log('Recensione inviata:', recensione);
    // In futuro, qui andrà la chiamata API
    alert('Recensione inviata con successo!');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
              ? 'text-yellow-400 fill-current opacity-50' 
              : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {professionista.nome} {professionista.cognome}
              </h3>
              <p className="text-sm text-gray-600 truncate">{professionista.categoriaServizio}</p>
            </div>
          </div>
          
          <button
            onClick={handleCallClick}
            className="flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium hover:bg-green-200 transition-colors flex-shrink-0"
          >
            <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Chiama</span>
          </button>
        </div>

        <div className="space-y-3">
          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(professionista.rating)}
            </div>
            <span className="text-xs sm:text-sm text-gray-600">
              {professionista.rating} ({professionista.numeroRecensioni} recensioni)
            </span>
          </div>

          {/* Zona e orari */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{professionista.zonaServizio}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{professionista.orariDisponibili}</span>
            </div>
          </div>

          {/* Specializzazioni */}
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">Specializzazioni:</p>
            <div className="flex flex-wrap gap-1">
              {professionista.specializzazioni.map((spec, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Descrizione */}
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {professionista.descrizione}
          </p>

          {/* Servizi */}
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Servizi principali:</p>
            <div className="space-y-1">
              {professionista.servizi.slice(0, 2).map((servizio) => (
                <div key={servizio.id} className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 truncate">{servizio.nome}</span>
                  <span className="text-gray-900 font-medium flex-shrink-0 ml-2">{servizio.prezzoIndicativo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pulsanti azioni */}
          <div className="flex space-x-2 pt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowRecensioni(!showRecensioni);
              }}
              className="flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Recensioni</span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFormRecensione(true);
              }}
              className="flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium hover:bg-green-200 transition-colors"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Recensisci</span>
            </button>
          </div>

          {/* Sezione recensioni espandibile */}
          {showRecensioni && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <RecensioniList recensioni={professionista.recensioni} />
            </div>
          )}
        </div>
      </div>

      {/* Modal form recensione */}
      {showFormRecensione && (
        <FormRecensione
          professionista={professionista}
          onClose={() => setShowFormRecensione(false)}
          onSubmit={handleSubmitRecensione}
        />
      )}
    </>
  );
} 