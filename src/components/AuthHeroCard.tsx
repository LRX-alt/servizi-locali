'use client';

import { useRouter } from 'next/navigation';
import { Heart, Lock, Star } from 'lucide-react';

export default function AuthHeroCard() {
  const router = useRouter();

  const goToAuth = () => {
    router.push('?login=1');
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-blue-200 p-6 md:p-8 col-span-1 md:col-span-2">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
            Accedi per contattare i professionisti
          </h3>
          <p className="text-gray-700">
            Sblocca contatti, recensioni dettagliate e salva i preferiti.
          </p>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Vedi telefono ed email</li>
            <li>Scrivi e leggi recensioni complete <Star className="inline ml-1 w-4 h-4 text-yellow-400" /></li>
            <li>Aggiungi professionisti ai preferiti <Heart className="inline ml-1 w-4 h-4 text-red-500" /></li>
          </ul>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={goToAuth}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              aria-label="Accedi o registrati"
            >
              Accedi
            </button>
            <button
              onClick={goToAuth}
              className="px-4 py-2 bg-white text-blue-700 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
            >
              Registrati gratis
            </button>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-4 text-blue-600" aria-hidden="true">
        <Lock className="w-5 h-5" />
      </div>
    </div>
  );
}


