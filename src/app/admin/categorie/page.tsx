'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Edit3, Trash2 } from 'lucide-react';

export default function AdminCategoriePage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, categorie, setCategorie } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nome: '', icona: '🔧', descrizione: '' });

  useEffect(() => {
    if (isAuthenticated && !isAdmin) router.push('/admin');
  }, [isAuthenticated, isAdmin, router]);

  // Carica eventuali categorie custom da localStorage
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/categorie/list');
        const json = await res.json();
        if (res.ok && Array.isArray(json.items)) setCategorie(json.items);
      } catch {}
    })();
  }, [setCategorie]);

  const persist = (next: any[]) => {
    setCategorie(next);
    (async () => {
      try {
        const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession();
        const token = session?.access_token || undefined;
        await fetch('/api/categorie/save', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ items: next }) });
      } catch {}
    })();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ nome: '', icona: '🔧', descrizione: '' });
    setShowForm(false);
  };

  const slugify = (name: string) => name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

  const onSave = () => {
    const nome = form.nome.trim();
    if (!nome) return;
    const baseId = slugify(nome) || 'categoria';
    if (editingId) {
      const updated = categorie.map(c => c.id === editingId ? { ...c, nome, icona: form.icona, descrizione: form.descrizione } : c);
      persist(updated);
      resetForm();
      return;
    }
    let id = baseId;
    let i = 2;
    const existingIds = new Set(categorie.map(c => c.id));
    while (existingIds.has(id)) {
      id = `${baseId}-${i++}`;
    }
    const next = [...categorie, { id, nome, icona: form.icona, descrizione: form.descrizione, sottocategorie: [] }];
    persist(next);
    resetForm();
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
              <h1 className="text-2xl font-bold text-gray-900">Categorie</h1>
            </div>
            <button onClick={() => { setEditingId(null); setForm({ nome: '', icona: '🔧', descrizione: '' }); setShowForm(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4" /> Nuova Categoria
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorie.map(cat => (
            <div key={cat.id} className="bg-white border rounded-md p-4">
              <div className="text-2xl">{cat.icona}</div>
              <div className="font-semibold text-gray-900">{cat.nome}</div>
              <div className="text-sm text-gray-800">{cat.descrizione}</div>
              <div className="text-xs text-gray-600">{cat.sottocategorie?.join(', ')}</div>
              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-blue-600 text-white text-sm flex items-center gap-1 cursor-pointer"
                  onClick={() => { setEditingId(cat.id); setForm({ nome: cat.nome, icona: cat.icona, descrizione: cat.descrizione || '' }); setShowForm(true); }}
                >
                  <Edit3 className="w-4 h-4" /> Modifica
                </button>
                <button
                  className="px-3 py-1 rounded bg-red-600 text-white text-sm flex items-center gap-1 cursor-pointer"
                  onClick={() => {
                    if (!confirm('Eliminare questa categoria?')) return;
                    persist(categorie.filter(c => c.id !== cat.id));
                  }}
                >
                  <Trash2 className="w-4 h-4" /> Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-lg shadow-xl border p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">{editingId ? 'Modifica Categoria' : 'Nuova Categoria'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-900 mb-1">Nome</label>
                <input className="w-full border rounded px-3 py-2 text-gray-900" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-gray-900 mb-1">Icona (emoji)</label>
                <input className="w-full border rounded px-3 py-2 text-gray-900" value={form.icona} onChange={e => setForm({ ...form, icona: e.target.value })} placeholder="Incolla un'emoji" />
              </div>
              <div>
                <label className="block text-sm text-gray-900 mb-1">Descrizione</label>
                <textarea className="w-full border rounded px-3 py-2 text-gray-900" rows={3} value={form.descrizione} onChange={e => setForm({ ...form, descrizione: e.target.value })} />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 cursor-pointer" onClick={resetForm}>Annulla</button>
              <button className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer" onClick={onSave}>Salva</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

