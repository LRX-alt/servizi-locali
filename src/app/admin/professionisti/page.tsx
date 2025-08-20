'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';

export default function AdminProfessionistiPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, professionisti, loadProfessionisti } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<{ telefono: string; descrizione: string; zona_servizio: string }>({ telefono: '', descrizione: '', zona_servizio: '' });

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      router.push('/admin');
      return;
    }
    const load = async () => {
      try {
        setLoading(true);
        await loadProfessionisti();
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && isAdmin) {
      load();
    }
  }, [isAuthenticated, isAdmin, router, loadProfessionisti]);

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
              <button onClick={() => router.push('/admin')} className="flex items-center text-gray-800 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-1" /> Torna alla Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Professionisti</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Professionisti</h1>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {loading ? (
          <div className="text-gray-800">Caricamento…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {professionisti.map((p) => (
              <div key={p.id} className="bg-white border rounded-md p-4">
                <div className="font-semibold text-gray-900">{p.nome} {p.cognome}</div>
                <div className="text-sm text-gray-800">{p.email}</div>
                <div className="text-sm text-gray-800">{p.categoriaServizio}</div>
                <div className="text-sm text-gray-800">Zona: {p.zonaServizio}</div>
                <div className="text-sm text-gray-800">Rating: {p.rating} ({p.numeroRecensioni})</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {p.isActive ? 'Attivo' : 'Sospeso'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${p.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {p.isVerified ? 'Verificato' : 'Non verificato'}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-2 rounded ${p.isActive ? 'bg-gray-600 hover:bg-gray-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    onClick={async () => {
                      try {
                        setError(null);
                        const { data: { session } } = await supabase.auth.getSession();
                        const token = session?.access_token || undefined;
                        const res = await fetch('/api/professionisti/set-status', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {})
                          },
                          body: JSON.stringify({ id: p.id, is_active: !p.isActive })
                        });
                        const json = await res.json().catch(() => ({}));
                        if (!res.ok) throw new Error(json.error || 'Errore aggiornamento');
                        await loadProfessionisti();
                      } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Errore'); }
                    }}
                  >
                    {p.isActive ? 'Sospendi' : 'Attiva'}
                  </button>
                  <button
                    className={`px-3 py-2 rounded ${p.isVerified ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                    onClick={async () => {
                      try {
                        setError(null);
                        const { data: { session } } = await supabase.auth.getSession();
                        const token = session?.access_token || undefined;
                        const res = await fetch('/api/professionisti/set-status', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { Authorization: `Bearer ${token}` } : {})
                          },
                          body: JSON.stringify({ id: p.id, is_verified: !p.isVerified })
                        });
                        const json = await res.json().catch(() => ({}));
                        if (!res.ok) throw new Error(json.error || 'Errore aggiornamento');
                        await loadProfessionisti();
                      } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Errore'); }
                    }}
                  >
                    {p.isVerified ? 'Revoca verifica' : 'Verifica profilo'}
                  </button>
                </div>
                <div className="mt-2">
                  <button
                    className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => {
                      setEditId(p.id);
                      setForm({ telefono: p.telefono || '', descrizione: p.descrizione || '', zona_servizio: p.zonaServizio || '' });
                    }}
                  >
                    Modifica
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modale modifica */}
      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditId(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-lg shadow-xl border p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Modifica Profilo</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-900 mb-1">Telefono</label>
                <input className="w-full border rounded px-3 py-2 text-gray-900" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-gray-900 mb-1">Zona di Servizio</label>
                <input className="w-full border rounded px-3 py-2 text-gray-900" value={form.zona_servizio} onChange={e => setForm({ ...form, zona_servizio: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-gray-900 mb-1">Descrizione</label>
                <textarea className="w-full border rounded px-3 py-2 text-gray-900" rows={4} value={form.descrizione} onChange={e => setForm({ ...form, descrizione: e.target.value })} />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-900 hover:bg-gray-50" onClick={() => setEditId(null)}>Annulla</button>
              <button
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                onClick={async () => {
                  try {
                    setError(null);
                    const { data: { session } } = await supabase.auth.getSession();
                    const token = session?.access_token || undefined;
                    const res = await fetch('/api/professionisti/update', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                      },
                      body: JSON.stringify({ id: editId, ...form })
                    });
                    const json = await res.json().catch(() => ({}));
                    if (!res.ok) throw new Error(json.error || 'Errore salvataggio');
                    setEditId(null);
                    await loadProfessionisti();
                  } catch (e: unknown) {
                    setError(e instanceof Error ? e.message : 'Errore');
                  }
                }}
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


