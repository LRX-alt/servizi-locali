'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function StickyAuthBanner() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  const goToAuth = () => router.push('?login=1');

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md" role="banner" aria-label="Promemoria per accedere">
      <div className="bg-white/95 backdrop-blur shadow-lg border border-gray-200 rounded-full px-3 md:px-4 py-2.5 flex items-center gap-2 md:gap-3">
        <Lock className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
        <span className="text-xs md:text-sm text-gray-800 hidden sm:block flex-1 text-center">
          Accedi per vedere contatti e recensioni complete
        </span>
        <div className="flex gap-1.5 md:gap-2">
          <button
            onClick={goToAuth}
            className="px-2.5 md:px-3 py-1.5 bg-blue-600 text-white text-xs md:text-sm rounded-full hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            aria-label="Accedi al tuo account"
          >
            Accedi
          </button>
          <button
            onClick={goToAuth}
            className="px-2.5 md:px-3 py-1.5 text-xs md:text-sm rounded-full border border-blue-200 text-blue-700 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            aria-label="Registra un nuovo account"
          >
            Registrati
          </button>
        </div>
      </div>
    </div>
  );
}


