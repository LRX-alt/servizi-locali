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

  useEffect(() => {
    if (isAuthenticated && !isAdmin) router.push('/admin');
  }, [isAuthenticated, isAdmin, router]);

  const persist = (z: string[]) => {
    setZone(z.map((nome, idx) => ({ id: nome.toLowerCase().replace(/\s+/g, '-'), nome })));
    // Salva su DB
    (async () => {
      const payload = z.map((nome, ord) => ({ id: nome.toLowerCase().replace(/\s+/g, '-'), nome, ord }));
      try {
        await fetch('/api/zone/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: payload }) });
      } catch {}
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
                  if (zone.includes(val)) return;
                  persist([...zone, val]);
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


