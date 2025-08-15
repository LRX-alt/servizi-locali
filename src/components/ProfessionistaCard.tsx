'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { Professionista } from '@/types';
import { Star, Phone, MessageCircle, Heart, MapPin, Clock } from 'lucide-react';
import Avatar from './Avatar';
import FormRecensione from './FormRecensione';
import RecensioniList from './RecensioniList';

interface ProfessionistaCardProps {
  professionista: Professionista;
}

export default function ProfessionistaCard({ professionista }: ProfessionistaCardProps) {
  const { utente, isAuthenticated, addReview, showToast, addFavorite, removeFavorite } = useAppStore();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Previeni errori di idratazione
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleCall = () => {
    try {
      const telLink = document.createElement('a');
      telLink.href = `tel:${professionista.telefono}`;
      telLink.click();
      showToast('Apertura app telefono...', 'info');
    } catch {
      showToast('Impossibile aprire l\'app telefono', 'error');
    }
  };

  const handleWhatsApp = () => {
    try {
      const message = `Ciao ${professionista.nome}, sono interessato ai tuoi servizi. Potresti fornirmi maggiori informazioni?`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappLink = document.createElement('a');
      whatsappLink.href = `https://wa.me/${professionista.telefono.replace(/\s/g, '')}?text=${encodedMessage}`;
      whatsappLink.target = '_blank';
      whatsappLink.rel = 'noopener noreferrer';
      whatsappLink.click();
      showToast('Apertura WhatsApp...', 'info');
    } catch {
      showToast('Impossibile aprire WhatsApp', 'error');
    }
  };

  const handleReview = () => {
    if (!isAuthenticated) {
      showToast('Devi essere loggato per scrivere una recensione', 'error');
      return;
    }
    setShowReviewForm(true);
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      showToast('Devi essere loggato per aggiungere ai preferiti', 'error');
      return;
    }
    try {
      if (isFavorite) {
        await removeFavorite(professionista.id);
        showToast('Professionista rimosso dai preferiti', 'success');
      } else {
        await addFavorite(professionista.id);
        showToast('Professionista aggiunto ai preferiti', 'success');
      }
    } catch {
      showToast('Errore durante la gestione dei preferiti', 'error');
    }
  };

  const isFavorite = utente?.professionistiPreferiti?.includes(professionista.id) || false;

  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Overlay blur per utenti non autenticati */}
      {hasMounted && !isAuthenticated && (
        <div className="absolute inset-0 backdrop-blur-sm bg-white/30 rounded-lg z-10 flex items-center justify-center">
          <div className="text-center p-4">
            <div className="mb-2">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Accedi per vedere i dettagli
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Registrati per contattare i professionisti e vedere tutte le informazioni
            </p>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar 
            src={professionista.fotoProfilo} 
            alt={`${professionista.nome} ${professionista.cognome}`} 
            size="md"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {professionista.nome} {professionista.cognome}
            </h3>
            <p className="text-sm text-gray-600">{professionista.categoriaServizio}</p>
          </div>
        </div>
        {hasMounted && isAuthenticated ? (
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        ) : null}
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