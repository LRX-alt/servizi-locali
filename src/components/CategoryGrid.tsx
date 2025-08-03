'use client';

import { useAppStore } from '@/store';
import { categorie } from '@/data/mockData';

export default function CategoryGrid() {
  const { setCategoriaSelezionata, categoriaSelezionata } = useAppStore();

  const handleCategoryClick = (categoryId: string) => {
    if (categoriaSelezionata === categoryId) {
      setCategoriaSelezionata(null);
    } else {
      setCategoriaSelezionata(categoryId);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {categorie.map((categoria) => (
        <button
          key={categoria.id}
          onClick={() => handleCategoryClick(categoria.id)}
          className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
            categoriaSelezionata === categoria.id
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="text-center space-y-2">
            <div className="text-2xl sm:text-3xl">{categoria.icona}</div>
            <div className="text-xs sm:text-sm font-medium leading-tight">{categoria.nome}</div>
          </div>
        </button>
      ))}
    </div>
  );
} 