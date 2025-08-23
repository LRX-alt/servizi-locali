'use client';

import { useRouter } from 'next/navigation';
import { Heart, Lock, Star, Phone } from 'lucide-react';

export default function AuthHeroCard() {
  const router = useRouter();

  const goToAuth = () => {
    router.push('?login=1');
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-blue-200 p-4 md:p-6 lg:p-8 col-span-1 md:col-span-2" role="banner" aria-labelledby="auth-hero-title">
      <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 rounded-full flex items-center justify-center shrink-0 mx-auto sm:mx-0">
          <Heart className="w-6 h-6 md:w-7 md:h-7 text-white" aria-hidden="true" />
        </div>
        <div className="space-y-3 flex-1 text-center sm:text-left">
          <h3 id="auth-hero-title" className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 leading-tight">
            Accedi per contattare i professionisti
          </h3>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            Sblocca contatti diretti, recensioni dettagliate e la possibilità di salvare i tuoi professionisti preferiti.
          </p>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1.5 text-left">
            <li className="flex items-center gap-2">
              <span>Vedi telefono ed email diretti</span>
              <Phone className="w-4 h-4 text-green-600" aria-hidden="true" />
            </li>
            <li className="flex items-center gap-2">
              <span>Recensioni complete e dettagliate</span>
              <Star className="w-4 h-4 text-yellow-500" aria-hidden="true" />
            </li>
            <li className="flex items-center gap-2">
              <span>Salva nei preferiti</span>
              <Heart className="w-4 h-4 text-red-500" aria-hidden="true" />
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-2 pt-3">
            <button
              onClick={goToAuth}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              aria-label="Accedi al tuo account"
            >
              Accedi
            </button>
            <button
              onClick={goToAuth}
              className="px-4 py-2.5 bg-white text-blue-700 border border-blue-200 rounded-md hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              aria-label="Registra un nuovo account gratuito"
            >
              Registrati gratis
            </button>
          </div>
        </div>
      </div>

      <div className="absolute right-3 top-3 md:right-4 md:top-4 text-blue-600" aria-hidden="true">
        <Lock className="w-4 h-4 md:w-5 md:h-5" />
      </div>
    </div>
  );
}


