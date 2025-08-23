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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-white/90 backdrop-blur shadow-lg border border-gray-200 rounded-full px-4 py-2 flex items-center gap-3">
        <Lock className="w-4 h-4 text-blue-600" />
        <span className="text-sm text-gray-800 hidden sm:block">
          Accedi per vedere contatti e recensioni complete
        </span>
        <button
          onClick={goToAuth}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700"
        >
          Accedi
        </button>
        <button
          onClick={goToAuth}
          className="px-3 py-1.5 text-sm rounded-full border border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          Registrati
        </button>
      </div>
    </div>
  );
}


