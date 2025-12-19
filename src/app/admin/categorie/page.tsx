'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Edit3, Trash2 } from 'lucide-react';
import type { Categoria } from '@/types';

export default function AdminCategoriePage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, categorie, setCategorie } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nome: '', icona: '🔧', descrizione: '', show_in_home: false, home_order: '' });
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && !isAdmin) router.push('/admin');
  }, [isAuthenticated, isAdmin, router]);

  // Carica eventuali categorie custom da localStorage
  useEffect(() => {
    (async () => {
      try {
        setDbLoading(true);
        setDbError(null);
        const res = await fetch('/api/categorie/list', {
          cache: 'no-store',
          headers: { 'x-admin-bypass-cache': '1' },
        });
        const json = await res.json().catch(() => null) as { items?: Categoria[]; error?: string } | null;
        if (!res.ok) {
          setDbError(json?.error ?? 'Impossibile leggere le categorie dal database.');
          return;
        }
        if (json?.items && Array.isArray(json.items)) setCategorie(json.items);
      } catch {
        setDbError('Errore di rete durante il caricamento delle categorie.');
      } finally {
        setDbLoading(false);
      }
    })();
  }, [setCategorie]);

  type CategoriaRow = {
    id: string;
    nome: string;
    icona: string;
    descrizione: string;
    ord?: number;
    sottocategorie?: string[];
    show_in_home?: boolean;
    home_order?: number | null;
  };
  const persist = (next: CategoriaRow[]) => {
    setCategorie(next);
    (async () => {
      try {
        const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession();
        const token = session?.access_token || undefined;
        setDbError(null);
        const res = await fetch('/api/categorie/save', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ items: next }) });
        if (!res.ok) {
          const json = await res.json().catch(() => null) as { error?: unknown } | null;
          setDbError(json?.error ? String(json.error) : 'Errore durante il salvataggio sul database.');
        }
      } catch {
        setDbError('Errore di rete durante il salvataggio sul database.');
      }
    })();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ nome: '', icona: '🔧', descrizione: '', show_in_home: false, home_order: '' });
    setShowForm(false);
  };

  const slugify = (name: string) => name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

  const onSave = () => {
    const nome = form.nome.trim();
    if (!nome) return;
    const baseId = slugify(nome) || 'categoria';
    if (editingId) {
      const updated = categorie.map(c => c.id === editingId ? {
        ...c,
        nome,
        icona: form.icona,
        descrizione: form.descrizione,
        show_in_home: Boolean(form.show_in_home),
        home_order: form.show_in_home ? (form.home_order === '' ? null : Number(form.home_order)) : null,
      } : c);
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
    const next = [
      ...categorie,
      {
        id,
        nome,
        icona: form.icona,
        descrizione: form.descrizione,
        sottocategorie: [],
        show_in_home: Boolean(form.show_in_home),
        home_order: form.show_in_home ? (form.home_order === '' ? null : Number(form.home_order)) : null,
      }
    ];
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
            <button onClick={() => { setEditingId(null); setForm({ nome: '', icona: '🔧', descrizione: '', show_in_home: false, home_order: '' }); setShowForm(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4" /> Nuova Categoria
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {(dbLoading || dbError) && (
          <div className="mb-4 rounded-lg border bg-white p-4">
            {dbLoading ? (
              <div className="text-sm text-gray-700">Caricamento categorie dal database...</div>
            ) : dbError ? (
              <div className="text-sm text-red-700">{dbError}</div>
            ) : null}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorie.map(cat => (
            <div key={cat.id} className="bg-white border rounded-md p-4">
              <div className="text-2xl">{cat.icona}</div>
              <div className="font-semibold text-gray-900">{cat.nome}</div>
              <div className="text-sm text-gray-800">{cat.descrizione}</div>
              <div className="text-xs text-gray-600">{cat.sottocategorie?.join(', ')}</div>

              <div className="mt-3 grid grid-cols-1 gap-2">
                <label className="flex items-center justify-between gap-3 text-sm text-gray-900">
                  <span className="font-medium">Mostra in home</span>
                  <input
                    type="checkbox"
                    checked={Boolean(cat.show_in_home)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const next = categorie.map((c) =>
                        c.id === cat.id
                          ? { ...c, show_in_home: checked, home_order: checked ? (c.home_order ?? null) : null }
                          : c
                      );
                      persist(next);
                    }}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                    aria-label={`Mostra ${cat.nome} in home`}
                  />
                </label>

                <label className="flex items-center justify-between gap-3 text-sm text-gray-900">
                  <span className="font-medium">Ordine home</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={cat.home_order ?? ''}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const parsed = raw === '' ? NaN : Number(raw);
                      const next = categorie.map((c) =>
                        c.id === cat.id
                          ? { ...c, home_order: raw === '' ? null : (Number.isFinite(parsed) ? Math.trunc(parsed) : null) }
                          : c
                      );
                      persist(next);
                    }}
                    disabled={!cat.show_in_home}
                    className="w-28 border rounded px-2 py-1 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Ordine in home per ${cat.nome}`}
                  />
                </label>
                <p className="text-xs text-gray-600">
                  Suggerimento: imposta 1–12 per definire l’ordine delle categorie in evidenza.
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-blue-600 text-white text-sm flex items-center gap-1 cursor-pointer"
                  onClick={() => {
                    setEditingId(cat.id);
                    setForm({
                      nome: cat.nome,
                      icona: cat.icona,
                      descrizione: cat.descrizione || '',
                      show_in_home: Boolean(cat.show_in_home),
                      home_order: cat.home_order == null ? '' : String(cat.home_order),
                    });
                    setShowForm(true);
                  }}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-900">
                  <input
                    type="checkbox"
                    checked={Boolean(form.show_in_home)}
                    onChange={(e) => setForm({ ...form, show_in_home: e.target.checked, home_order: e.target.checked ? form.home_order : '' })}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                  />
                  Mostra in home
                </label>
                <div>
                  <label className="block text-sm text-gray-900 mb-1">Ordine home</label>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    disabled={!form.show_in_home}
                    value={form.home_order}
                    onChange={(e) => setForm({ ...form, home_order: e.target.value })}
                    className="w-full border rounded px-3 py-2 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="es. 1"
                  />
                </div>
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

