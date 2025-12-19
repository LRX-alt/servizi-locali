'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RichiestaCategoria {
  id: string;
  nome_categoria: string;
  descrizione: string | null;
  richiedente_email: string;
  richiedente_nome: string;
  stato: 'pending' | 'approvata' | 'rifiutata';
  data_richiesta: string;
  data_risposta: string | null;
  admin_note: string | null;
  categoria_creata_id: string | null;
}

export default function AdminRichiesteCategoriePage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, logout } = useAppStore();
  const [richieste, setRichieste] = useState<RichiestaCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroStato, setFiltroStato] = useState<'all' | 'pending' | 'approvata' | 'rifiutata'>('pending');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [richiestaSelezionata, setRichiestaSelezionata] = useState<RichiestaCategoria | null>(null);
  const [formApprove, setFormApprove] = useState({ nome: '', icona: '🔧', descrizione: '' });
  const [formReject, setFormReject] = useState({ motivo: '' });

  useEffect(() => {
    if (isAuthenticated && !isAdmin) router.push('/admin');
  }, [isAuthenticated, isAdmin, router]);

  const devAdminEnabled = process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ENABLE_DEV_ADMIN === 'true';

  // Ritorna:
  // - string: token valido
  // - undefined: dev-bypass attivo (ok, prosegui senza Authorization)
  // - null: non autorizzato -> redirect
  const ensureAdminSessionOrRedirect = async (): Promise<string | undefined | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || undefined;
    if (!token && (devAdminEnabled && isAdmin)) {
      // In locale con dev-bypass possiamo operare senza token
      return undefined;
    }
    if (!token) {
      setError('Sessione admin scaduta: effettua nuovamente il login.');
      await logout();
      router.push('/admin');
      return null;
    }
    return token;
  };

  const loadRichieste = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await ensureAdminSessionOrRedirect();
      if (token === null) return;
      const res = await fetch(`/api/richieste-categorie/list?status=${filtroStato}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (res.ok && Array.isArray(json.items)) {
        setRichieste(json.items);
      } else {
        setError(json.error || 'Errore nel caricamento delle richieste');
      }
    } catch {
      setError('Errore di rete durante il caricamento');
    } finally {
      setLoading(false);
    }
  }, [filtroStato]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;
    loadRichieste();
  }, [isAuthenticated, isAdmin, loadRichieste]);

  const handleApprove = async () => {
    if (!richiestaSelezionata || !formApprove.nome || !formApprove.icona) return;

    try {
      const token = await ensureAdminSessionOrRedirect();
      if (token === null) return;
      const res = await fetch('/api/richieste-categorie/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          richiesta_id: richiestaSelezionata.id,
          nome: formApprove.nome,
          icona: formApprove.icona,
          descrizione: formApprove.descrizione,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowApproveModal(false);
        setRichiestaSelezionata(null);
        setFormApprove({ nome: '', icona: '🔧', descrizione: '' });
        loadRichieste();
      } else {
        setError(data.error || 'Errore durante l\'approvazione');
      }
    } catch {
      setError('Errore durante l\'approvazione');
    }
  };

  const handleReject = async () => {
    if (!richiestaSelezionata) return;

    try {
      const token = await ensureAdminSessionOrRedirect();
      if (token === null) return;
      const res = await fetch('/api/richieste-categorie/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          richiesta_id: richiestaSelezionata.id,
          motivo: formReject.motivo || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowRejectModal(false);
        setRichiestaSelezionata(null);
        setFormReject({ motivo: '' });
        loadRichieste();
      } else {
        setError(data.error || 'Errore durante il rifiuto');
      }
    } catch {
      setError('Errore durante il rifiuto');
    }
  };

  const openApproveModal = (richiesta: RichiestaCategoria) => {
    setRichiestaSelezionata(richiesta);
    setFormApprove({
      nome: richiesta.nome_categoria,
      icona: '🔧',
      descrizione: richiesta.descrizione || '',
    });
    setShowApproveModal(true);
  };

  const openRejectModal = (richiesta: RichiestaCategoria) => {
    setRichiestaSelezionata(richiesta);
    setFormReject({ motivo: '' });
    setShowRejectModal(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const richiesteFiltrate = richieste.filter((r) => {
    if (filtroStato === 'all') return true;
    return r.stato === filtroStato;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center text-gray-800 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-1" /> Torna alla Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Richieste Categorie</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Filtri */}
        <div className="mb-6 flex space-x-2">
          {(['all', 'pending', 'approvata', 'rifiutata'] as const).map((stato) => (
            <button
              key={stato}
              onClick={() => setFiltroStato(stato)}
              className={`px-4 py-2 rounded-md transition-colors ${
                filtroStato === stato
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {stato === 'all' ? 'Tutte' : stato === 'pending' ? 'In Attesa' : stato === 'approvata' ? 'Approvate' : 'Rifiutate'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Caricamento richieste...</p>
          </div>
        ) : richiesteFiltrate.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-600">Nessuna richiesta trovata</p>
          </div>
        ) : (
          <div className="space-y-4">
            {richiesteFiltrate.map((richiesta) => (
              <div
                key={richiesta.id}
                className="bg-white border rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {richiesta.nome_categoria}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          richiesta.stato === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : richiesta.stato === 'approvata'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {richiesta.stato === 'pending' ? (
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> In Attesa
                          </span>
                        ) : richiesta.stato === 'approvata' ? (
                          <span className="flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" /> Approvata
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <XCircle className="w-3 h-3 mr-1" /> Rifiutata
                          </span>
                        )}
                      </span>
                    </div>
                    {richiesta.descrizione && (
                      <p className="text-gray-600 mb-2">{richiesta.descrizione}</p>
                    )}
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>
                        <strong>Richiedente:</strong> {richiesta.richiedente_nome} ({richiesta.richiedente_email})
                      </p>
                      <p>
                        <strong>Data richiesta:</strong>{' '}
                        {new Date(richiesta.data_richiesta).toLocaleString('it-IT')}
                      </p>
                      {richiesta.data_risposta && (
                        <p>
                          <strong>Data risposta:</strong>{' '}
                          {new Date(richiesta.data_risposta).toLocaleString('it-IT')}
                        </p>
                      )}
                      {richiesta.admin_note && (
                        <p>
                          <strong>Note admin:</strong> {richiesta.admin_note}
                        </p>
                      )}
                      {richiesta.categoria_creata_id && (
                        <p>
                          <strong>Categoria creata:</strong> {richiesta.categoria_creata_id}
                        </p>
                      )}
                    </div>
                  </div>
                  {richiesta.stato === 'pending' && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => openApproveModal(richiesta)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approva</span>
                      </button>
                      <button
                        onClick={() => openRejectModal(richiesta)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Rifiuta</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Approvazione */}
      {showApproveModal && richiestaSelezionata && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Approva e Crea Categoria</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Categoria *
                </label>
                <input
                  type="text"
                  value={formApprove.nome}
                  onChange={(e) => setFormApprove({ ...formApprove, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icona (emoji) *
                </label>
                <input
                  type="text"
                  value={formApprove.icona}
                  onChange={(e) => setFormApprove({ ...formApprove, icona: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="🔧"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrizione
                </label>
                <textarea
                  value={formApprove.descrizione}
                  onChange={(e) => setFormApprove({ ...formApprove, descrizione: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setRichiestaSelezionata(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annulla
              </button>
              <button
                onClick={handleApprove}
                disabled={!formApprove.nome || !formApprove.icona}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Approva e Crea
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rifiuto */}
      {showRejectModal && richiestaSelezionata && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rifiuta Richiesta</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Stai per rifiutare la richiesta per la categoria <strong>&quot;{richiestaSelezionata.nome_categoria}&quot;</strong>
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo (opzionale)
                </label>
                <textarea
                  value={formReject.motivo}
                  onChange={(e) => setFormReject({ motivo: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Spiega il motivo del rifiuto (verrà inviato via email al richiedente)"
                />
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRichiestaSelezionata(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annulla
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Rifiuta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


