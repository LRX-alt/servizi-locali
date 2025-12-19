'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface RichiediCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  richiedenteEmail: string;
  richiedenteNome: string;
  onRequestSent?: (categoriaNome: string) => void; // Callback quando la richiesta viene inviata
}

export default function RichiediCategoriaModal({
  isOpen,
  onClose,
  richiedenteEmail,
  richiedenteNome,
  onRequestSent,
}: RichiediCategoriaModalProps) {
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset form quando si chiude
      setNomeCategoria('');
      setDescrizione('');
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevenzione doppio click
    if (loading) return;
    
    setError('');
    setLoading(true);

    // Validazione nome categoria
    if (!nomeCategoria.trim()) {
      setError('Il nome categoria è obbligatorio');
      setLoading(false);
      return;
    }

    if (nomeCategoria.trim().length < 3 || nomeCategoria.trim().length > 50) {
      setError('Il nome categoria deve essere tra 3 e 50 caratteri');
      setLoading(false);
      return;
    }

    // Validazione email e nome richiedente
    const emailTrimmed = richiedenteEmail?.trim() || '';
    const nomeTrimmed = richiedenteNome?.trim() || '';
    
    if (!emailTrimmed) {
      setError('Email richiedente mancante. Compila prima il campo email nel form di registrazione.');
      setLoading(false);
      return;
    }

    if (!nomeTrimmed) {
      setError('Nome richiedente mancante. Compila prima i campi nome e cognome nel form di registrazione.');
      setLoading(false);
      return;
    }

    // Validazione formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setError('L\'email fornita non è valida. Verifica il campo email nel form di registrazione.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/richieste-categorie/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_categoria: nomeCategoria.trim(),
          descrizione: descrizione.trim() || null,
          richiedente_email: emailTrimmed,
          richiedente_nome: nomeTrimmed,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error('Errore parsing risposta JSON:', jsonError);
        throw new Error('Errore durante l\'elaborazione della risposta del server');
      }

      if (!res.ok) {
        // Messaggio più user-friendly per errori di duplicate
        const errorMessage = data?.error || data?.details || `Errore durante l'invio della richiesta (${res.status})`;
        console.error('Errore API:', {
          status: res.status,
          statusText: res.statusText,
          error: data,
        });
        throw new Error(errorMessage);
      }

      setSuccess(true);
      // Notifica il parent che la richiesta è stata inviata
      if (onRequestSent) {
        onRequestSent(nomeCategoria.trim());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante l\'invio della richiesta');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Richiedi Nuova Categoria</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          <div className="p-6">
            <div className="flex items-center space-x-3 text-green-600 mb-4">
              <CheckCircle className="w-6 h-6" />
              <p className="font-medium">Richiesta inviata con successo!</p>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                La tua richiesta è stata inviata all&apos;amministratore. Riceverai un&apos;email quando verrà esaminata.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Suggerimento:</strong> Puoi continuare la registrazione selezionando una categoria temporanea (es. &quot;Altro&quot;) e aggiornare la categoria quando la tua richiesta verrà approvata.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Continua Registrazione
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {(!richiedenteEmail?.trim() || !richiedenteNome?.trim()) && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <strong>Attenzione:</strong> Per inviare una richiesta, compila prima i campi <strong>Email</strong>
                  {!richiedenteEmail?.trim() && ' (obbligatorio)'} e <strong>Nome e Cognome</strong>
                  {!richiedenteNome?.trim() && ' (obbligatori)'} nel form di registrazione.
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Categoria *
              </label>
              <input
                type="text"
                value={nomeCategoria}
                onChange={(e) => setNomeCategoria(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="es. Fotografo, Personal Trainer..."
                maxLength={50}
                disabled={loading}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {nomeCategoria.length}/50 caratteri
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrizione (opzionale)
              </label>
              <textarea
                value={descrizione}
                onChange={(e) => setDescrizione(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Spiega brevemente perché questa categoria è necessaria..."
                disabled={loading}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> La tua richiesta verrà esaminata dall&apos;amministratore. 
                Riceverai un&apos;email quando verrà approvata o rifiutata.
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={loading || !nomeCategoria.trim() || !richiedenteEmail?.trim() || !richiedenteNome?.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Invio...' : 'Invia Richiesta'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

