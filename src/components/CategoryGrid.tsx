'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { categorie as mockCategorie } from '@/data/mockData';
import type { Categoria } from '@/types';

export default function CategoryGrid() {
  const { setCategoriaSelezionata, categoriaSelezionata } = useAppStore();
  const [dbCategorie, setDbCategorie] = useState<Categoria[] | null>(null);
  const [loading, setLoading] = useState(true);

  const handleCategoryClick = (categoryId: string) => {
    if (categoriaSelezionata === categoryId) {
      setCategoriaSelezionata(null);
    } else {
      setCategoriaSelezionata(categoryId);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/categorie/list?scope=home', { cache: 'no-store' });
        const json = await res.json().catch(() => null) as { items?: Categoria[] } | null;
        if (!cancelled && res.ok && json?.items && Array.isArray(json.items)) {
          setDbCategorie(json.items);
        }
      } catch {
        if (!cancelled) setDbCategorie(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const categorieToShow = useMemo(() => {
    // Se il DB non è pronto o non ha categorie in evidenza, fallback ai mockData
    const fromDb = (dbCategorie || []).filter((c) => c.show_in_home);
    if (fromDb.length > 0) return fromDb;
    return mockCategorie;
  }, [dbCategorie]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {loading ? 'Caricamento categorie…' : 'Seleziona una categoria'}
        </span>
        <Link
          href="/categorie"
          className="text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline"
          aria-label="Vedi tutte le categorie"
        >
          Vedi tutte
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categorieToShow.map((categoria) => (
          <button
            key={categoria.id}
            onClick={() => handleCategoryClick(categoria.id)}
            className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${
              categoriaSelezionata === categoria.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
            aria-pressed={categoriaSelezionata === categoria.id}
          >
            <div className="text-center space-y-2">
              <div className="text-2xl sm:text-3xl">{categoria.icona}</div>
              <div className="text-xs sm:text-sm font-medium leading-tight">{categoria.nome}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 