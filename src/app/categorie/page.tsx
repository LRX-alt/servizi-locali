'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useAppStore } from '@/store';
import type { Categoria } from '@/types';

export default function CategoriePage() {
  const router = useRouter();
  const { setCategoriaSelezionata, categoriaSelezionata } = useAppStore();
  const [items, setItems] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/categorie/list', { cache: 'no-store' });
        const json = await res.json().catch(() => null) as { items?: Categoria[]; error?: string } | null;
        if (!res.ok) {
          throw new Error(json?.error || 'Errore caricamento categorie');
        }
        if (!cancelled) setItems(Array.isArray(json?.items) ? json!.items! : []);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Errore');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((c) =>
      c.nome.toLowerCase().includes(needle) ||
      c.id.toLowerCase().includes(needle)
    );
  }, [items, q]);

  const onPick = (id: string) => {
    setCategoriaSelezionata(id);
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tutte le categorie</h1>
              <p className="text-sm text-gray-600 mt-1">
                Cerca e seleziona una categoria per filtrare i professionisti.
              </p>
            </div>
            <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">
              Torna alla home
            </Link>
          </div>

          <div className="mt-4 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cerca categoria (es. idraulico, elettricista...)"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-gray-600">Caricamento…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => onPick(c.id)}
                className={`w-full text-left bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer ${
                  categoriaSelezionata === c.id ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl leading-none">{c.icona}</div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{c.nome}</div>
                    {c.descrizione ? (
                      <div className="text-sm text-gray-600 mt-1 line-clamp-2">{c.descrizione}</div>
                    ) : null}
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-gray-600">
                Nessuna categoria trovata.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}




