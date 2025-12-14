'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function AdminZonePage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAppStore();
  const [zone, setZone] = useState<{ id: string; nome: string }[]>([]);
  const [newZona, setNewZona] = useState('');
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && !isAdmin) router.push('/admin');
  }, [isAuthenticated, isAdmin, router]);

  // Carica dal DB all'apertura (così dopo refresh non perdi i dati)
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;
    (async () => {
      setDbLoading(true);
      setDbError(null);
      try {
        const res = await fetch('/api/zone/list', {
          cache: 'no-store',
          headers: { 'x-admin-bypass-cache': '1' },
        });
        const json = await res.json().catch(() => null) as { items?: unknown; error?: unknown } | null;
        if (!res.ok) {
          setDbError(json?.error ? String(json.error) : 'Impossibile leggere le zone dal database.');
          return;
        }
        const items = (json && Array.isArray((json as any).items)) ? (json as any).items : [];
        setZone((items as any[]).map((r) => ({ id: String(r.id), nome: String(r.nome) })));
      } catch {
        setDbError('Errore di rete durante il caricamento delle zone.');
      } finally {
        setDbLoading(false);
      }
    })();
  }, [isAuthenticated, isAdmin]);

  const persist = (z: string[]) => {
    setZone(z.map((nome) => ({ id: nome.toLowerCase().replace(/\s+/g, '-'), nome })));
    // Salva su DB
    (async () => {
      const payload = z.map((nome, ord) => ({ id: nome.toLowerCase().replace(/\s+/g, '-'), nome, ord }));
      try {
        setDbError(null);
        const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession();
        const token = session?.access_token || undefined;
        const res = await fetch('/api/zone/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ items: payload })
        });
        if (!res.ok) {
          const json = await res.json().catch(() => null) as { error?: unknown } | null;
          setDbError(json?.error ? String(json.error) : 'Errore durante il salvataggio sul database.');
        }
      } catch {
        setDbError('Errore di rete durante il salvataggio sul database.');
      }
    })();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button onClick={() => router.push('/admin')} className="flex items-center text-gray-800 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-1" /> Torna alla Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Gestisci Zone</h1>
            </div>
            <div className="flex items-center gap-2">
              <input value={newZona} onChange={e => setNewZona(e.target.value)} placeholder="Nuova zona" className="border rounded px-3 py-2 text-gray-900" />
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
                onClick={() => {
                  const val = newZona.trim();
                  if (!val) return;
                  if (zone.some(z => z.nome === val)) return;
                  persist([...zone.map(z => z.nome), val]);
                  setNewZona('');
                }}
              >
                <Plus className="w-4 h-4" /> Aggiungi
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {(dbLoading || dbError) && (
          <div className="mb-4 rounded-lg border bg-white p-4">
            {dbLoading ? (
              <div className="text-sm text-gray-700">Caricamento zone dal database...</div>
            ) : dbError ? (
              <div className="text-sm text-red-700">{dbError}</div>
            ) : null}
          </div>
        )}
        <div className="bg-white border rounded-md">
          <div className="p-4 border-b text-gray-900 font-semibold">Zone ({zone.length})</div>
          <div className="divide-y">
            {zone.map((z) => (
              <div key={z.id} className="p-4 flex items-center justify-between">
                <div className="text-gray-900">{z.nome}</div>
                <button
                  className="text-red-600 hover:text-red-700 flex items-center gap-1"
                  onClick={() => persist(zone.filter(v => v.nome !== z.nome).map(v => v.nome))}
                >
                  <Trash2 className="w-4 h-4" /> Elimina
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


