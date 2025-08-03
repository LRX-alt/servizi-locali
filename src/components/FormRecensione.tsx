'use client';

import { useState } from 'react';
import { Star, Send, X } from 'lucide-react';
import type { FormRecensione, Professionista } from '@/types';
import { useAppStore } from '@/store';

interface FormRecensioneProps {
  professionista: Professionista;
  onClose: () => void;
  onSubmit: (recensione: FormRecensione) => void;
}

export default function FormRecensione({ professionista, onClose, onSubmit }: FormRecensioneProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commento, setCommento] = useState('');
  const [servizioRecensito, setServizioRecensito] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      showToast('Seleziona un rating', 'error');
      return;
    }

    if (commento.trim().length < 10) {
      showToast('Il commento deve essere di almeno 10 caratteri', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const recensione: FormRecensione = {
        professionistaId: professionista.id,
        rating,
        commento: commento.trim(),
        servizioRecensito: servizioRecensito || undefined
      };

      await onSubmit(recensione);
      onClose();
    } catch (error) {
      console.error('Errore durante l\'invio della recensione:', error);
      showToast('Errore durante l\'invio della recensione', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= (hoverRating || rating);
      
      return (
        <button
          key={i}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          className="transition-colors"
        >
          <Star
            className={`w-8 h-8 ${
              isFilled
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
          />
        </button>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Lascia una recensione
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {professionista.nome[0]}{professionista.cognome[0]}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {professionista.nome} {professionista.cognome}
              </h3>
              <p className="text-sm text-gray-600">{professionista.categoriaServizio}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Valutazione *
            </label>
            <div className="flex items-center space-x-2">
              {renderStars()}
              <span className="ml-3 text-sm text-gray-700 font-medium">
                {rating > 0 && `${rating}/5 stelle`}
              </span>
            </div>
          </div>

          {/* Servizio recensito */}
          {professionista.servizi.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Servizio recensito (opzionale)
              </label>
              <select
                value={servizioRecensito}
                onChange={(e) => setServizioRecensito(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="">Seleziona un servizio</option>
                {professionista.servizi.map((servizio) => (
                  <option key={servizio.id} value={servizio.nome}>
                    {servizio.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Commento */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              La tua recensione *
            </label>
            <textarea
              value={commento}
              onChange={(e) => setCommento(e.target.value)}
              placeholder="Racconta la tua esperienza con questo professionista..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-500"
              required
            />
            <p className="text-xs text-gray-600 mt-1">
              Minimo 10 caratteri. {commento.length}/500
            </p>
          </div>

          {/* Pulsanti */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || commento.trim().length < 10}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Invio...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Invia recensione</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 