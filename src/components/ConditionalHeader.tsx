'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  const [shouldHide, setShouldHide] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Controlla sia pathname che URL direttamente per sicurezza
    const isResetPage = pathname?.startsWith('/reset-password') || 
                        window.location.pathname.startsWith('/reset-password');
    setShouldHide(isResetPage);
    setChecked(true);
  }, [pathname]);

  // Non renderizzare nulla finché non abbiamo controllato
  if (!checked) {
    return null;
  }

  // Non mostrare l'header sulla pagina di reset-password
  if (shouldHide) {
    return null;
  }
  
  return <Header />;
}

