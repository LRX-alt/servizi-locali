'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Building, MapPin, Phone, Clock } from 'lucide-react';

export default function AuthHeroCardServizi() {
  const router = useRouter();
  const pathname = usePathname();

  const goToAuth = () => {
    router.push(`${pathname}?login=1`);
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-blue-200 p-4 md:p-6 col-span-1 md:col-span-2">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
          <Building className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
            Accedi per contattare i servizi
          </h3>
          <p className="text-gray-700">
            Sblocca contatti diretti, orari dettagliati e navigazione ai servizi pubblici.
          </p>
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
            <li>Vedi telefono e orari completi <Phone className="inline ml-1 w-4 h-4 text-green-600" /></li>
            <li>Naviga direttamente ai servizi <MapPin className="inline ml-1 w-4 h-4 text-blue-600" /></li>
            <li>Accedi a informazioni aggiornate <Clock className="inline ml-1 w-4 h-4 text-gray-600" /></li>
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
        <Building className="w-5 h-5" />
      </div>
    </div>
  );
}

