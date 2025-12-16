'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface RichiediCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  richiedenteEmail: string;
  richiedenteNome: string;
}

export default function RichiediCategoriaModal({
  isOpen,
  onClose,
  richiedenteEmail,
  richiedenteNome,
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
    setError('');
    setLoading(true);

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

    try {
      const res = await fetch('/api/richieste-categorie/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_categoria: nomeCategoria.trim(),
          descrizione: descrizione.trim() || null,
          richiedente_email: richiedenteEmail,
          richiedente_nome: richiedenteNome,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Errore durante l\'invio della richiesta');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
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
            <p className="text-gray-600 text-sm">
              La tua richiesta è stata inviata all'amministratore. Riceverai un'email quando verrà esaminata.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Spiega brevemente perché questa categoria è necessaria..."
                disabled={loading}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> La tua richiesta verrà esaminata dall'amministratore. 
                Riceverai un'email quando verrà approvata o rifiutata.
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
                disabled={loading || !nomeCategoria.trim()}
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

