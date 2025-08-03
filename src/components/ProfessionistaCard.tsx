'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { Professionista } from '@/types';
import { Star, Phone, MessageCircle, Heart, MapPin, Clock, User } from 'lucide-react';
import FormRecensione from './FormRecensione';
import RecensioniList from './RecensioniList';

interface ProfessionistaCardProps {
  professionista: Professionista;
}

export default function ProfessionistaCard({ professionista }: ProfessionistaCardProps) {
  const { utente, isAuthenticated, addReview } = useAppStore();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const handleCall = () => {
    window.open(`tel:${professionista.telefono}`, '_self');
  };

  const handleWhatsApp = () => {
    const message = `Ciao ${professionista.nome}, sono interessato ai tuoi servizi. Potresti fornirmi maggiori informazioni?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${professionista.telefono.replace(/\s/g, '')}?text=${encodedMessage}`, '_blank');
  };

  const handleReview = () => {
    if (!isAuthenticated) {
      alert('Devi essere loggato per scrivere una recensione');
      return;
    }
    setShowReviewForm(true);
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      alert('Devi essere loggato per aggiungere ai preferiti');
      return;
    }
    // Implementa la logica per i preferiti
  };

  const isFavorite = utente?.professionistiPreferiti?.includes(professionista.id) || false;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {professionista.nome} {professionista.cognome}
            </h3>
            <p className="text-sm text-gray-600">{professionista.categoriaServizio}</p>
          </div>
        </div>
        <button
          onClick={handleFavorite}
          className={`p-2 rounded-full transition-colors ${
            isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(professionista.rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {professionista.rating} ({professionista.numeroRecensioni} recensioni)
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{professionista.zonaServizio}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{professionista.orariDisponibili}</span>
        </div>
      </div>

      {/* Specializzazioni */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Specializzazioni:</p>
        <div className="flex flex-wrap gap-1">
          {professionista.specializzazioni.map((spec, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Descrizione */}
      <p className="text-gray-700 mb-4 line-clamp-3">{professionista.descrizione}</p>

      {/* Azioni */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCall}
          className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
        >
          <Phone className="w-4 h-4" />
          <span>Chiama</span>
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>
        <button
          onClick={handleReview}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          <Star className="w-4 h-4" />
          <span>Recensisci</span>
        </button>
      </div>

      {/* Recensioni */}
      {professionista.recensioni.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showReviews ? 'Nascondi' : 'Mostra'} recensioni ({professionista.recensioni.length})
          </button>
          {showReviews && (
            <RecensioniList recensioni={professionista.recensioni} />
          )}
        </div>
      )}

      {/* Modal Recensione */}
      {showReviewForm && (
        <FormRecensione
          professionista={professionista}
          onClose={() => setShowReviewForm(false)}
          onSubmit={(review) => {
            if (utente) {
              const fullReview = {
                id: Date.now().toString(),
                professionistaId: review.professionistaId,
                utenteId: utente.id,
                utenteNome: `${utente.nome} ${utente.cognome}`,
                rating: review.rating,
                commento: review.commento,
                data: new Date(),
                stato: 'pending' as const,
                servizioRecensito: review.servizioRecensito,
              };
              addReview(fullReview);
            }
            setShowReviewForm(false);
          }}
        />
      )}
    </div>
  );
} 