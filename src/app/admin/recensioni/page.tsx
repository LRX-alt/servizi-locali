'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { Check, X, Clock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RecensioneItem {
  id: string;
  professionista_id: string;
  utente_id: string;
  utente_nome: string;
  rating: number;
  commento: string;
  data: string;
  stato: 'approvata' | 'pending' | 'rifiutata';
  servizio_recensito?: string;
}

export default function AdminRecensioniPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, moderateRecensione, error, setError } = useAppStore();
  const [items, setItems] = useState<RecensioneItem[]>([]);
  const [status, setStatus] = useState<'pending' | 'approvata' | 'rifiutata' | 'all'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reindirizza solo se siamo autenticati ma NON admin
    if (isAuthenticated && !isAdmin) {
      router.push('/admin');
      return;
    }
    // Carica elenco
    const load = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const res = await fetch(`/api/recensioni/list?status=${status}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Errore caricamento');
        setItems(json.items);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Errore caricamento');
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && isAdmin) {
      load();
    }
  }, [isAuthenticated, isAdmin, router, status, setError]);

  const onModerate = async (id: string, action: 'approve' | 'reject') => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || null;
    await moderateRecensione(id, action, async () => token);
    // Ricarica
    setStatus(s => s); // trigger effect
  };

  // Stato di attesa autenticazione / verifica admin
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Torna alla Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Moderazione Recensioni</h1>
            </div>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="border rounded-md px-3 py-2"
            >
              <option value="pending">In attesa</option>
              <option value="approvata">Approvate</option>
              <option value="rifiutata">Rifiutate</option>
              <option value="all">Tutte</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-gray-600">Nessuna recensione.</div>
        ) : (
          <div className="space-y-4">
            {items.map((r) => (
              <div key={r.id} className="bg-white border rounded-md p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-gray-500">{new Date(r.data).toLocaleString('it-IT')}</div>
                    <div className="font-medium">{r.utente_nome} • Rating {r.rating}/5</div>
                    {r.servizio_recensito && (
                      <div className="text-sm text-gray-600">Servizio: {r.servizio_recensito}</div>
                    )}
                    <p className="mt-2 text-gray-800">{r.commento}</p>
                    <div className="mt-2 text-xs text-gray-500">Stato: {r.stato}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.stato === 'pending' ? (
                      <>
                        <button
                          onClick={() => onModerate(r.id, 'approve')}
                          className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                          title="Approva"
                        >
                          <Check className="w-4 h-4" /> Approva
                        </button>
                        <button
                          onClick={() => onModerate(r.id, 'reject')}
                          className="inline-flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                          title="Rifiuta"
                        >
                          <X className="w-4 h-4" /> Rifiuta
                        </button>
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm text-gray-600"><Clock className="w-4 h-4" /> Nessuna azione</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>
    </div>
  );
}


