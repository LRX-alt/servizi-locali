'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/store';
import { serviziPubblici } from '@/data/mockData';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import AuthHeroCardServizi from '@/components/AuthHeroCardServizi';
import StickyAuthBanner from '@/components/StickyAuthBanner';
import SearchBarServizi from '@/components/SearchBarServizi';
import ComuniListServizi from '@/components/ComuniListServizi';
import TipoServiziGrid from '@/components/TipoServiziGrid';

export default function ServiziPubbliciPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    setServiziPubblici, 
    serviziPubbliciFiltrati: servizi,
    isAuthenticated
  } = useAppStore();

  const [hasMounted, setHasMounted] = useState(false);

  // Previeni errori di idratazione
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setServiziPubblici(serviziPubblici);
  }, [setServiziPubblici]);

  const handleNavigation = (indirizzo: string) => {
    const encodedAddress = encodeURIComponent(indirizzo);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      window.open(`maps://maps.apple.com/?q=${encodedAddress}`, '_blank');
    } else {
      window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
    }
  };

  const handleCall = (telefono: string) => {
    window.open(`tel:${telefono}`, '_self');
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'comune':
        return '🏛️';
      case 'poste':
        return '📮';
      case 'farmacia':
        return '💊';
      case 'banca':
        return '🏦';
      case 'ospedale':
        return '🏥';
      case 'ufficio':
        return '🏢';
      default:
        return '🏢';
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Servizi Pubblici
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Trova uffici, farmacie, banche e altri servizi essenziali nella tua zona
        </p>
      </div>

      {/* Barra di ricerca */}
      <SearchBarServizi />

      {/* Comuni disponibili */}
      <ComuniListServizi />

      {/* Tipi di servizio */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Tipi di servizio</h2>
        <TipoServiziGrid />
      </div>

      {/* Lista servizi */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Servizi disponibili
          </h2>
          <span className="text-sm text-gray-600">
            {servizi?.length || 0} risultati
          </span>
        </div>

        {!servizi || servizi.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nessun servizio trovato
            </h3>
            <p className="text-gray-600">
              Prova a modificare i filtri di ricerca per trovare i servizi di cui hai bisogno
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Griglia servizi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card-hero per utenti non autenticati */}
              {!isAuthenticated && <AuthHeroCardServizi />}
              
              {servizi.map((servizio) => (
                <div
                  key={servizio.id}
                  className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  {/* Overlay trasparente per utenti non autenticati */}
                  {hasMounted && !isAuthenticated && (
                    <div 
                      className="absolute inset-0 bg-transparent rounded-lg z-10 cursor-pointer"
                      onClick={() => router.push(`${pathname}?login=1`)}
                      aria-label="Accedi per vedere i dettagli del servizio"
                    />
                  )}
                  
                  <div className={`${!isAuthenticated ? 'blur' : ''}`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-2xl">{getTipoIcon(servizio.tipo)}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {servizio.nome}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {servizio.tipo}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{servizio.indirizzo}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{servizio.orari}</span>
                      </div>

                      {/* Azioni - Solo per utenti autenticati */}
                      {isAuthenticated && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleNavigation(servizio.indirizzo)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            <Navigation className="w-4 h-4" />
                            <span>Naviga</span>
                          </button>

                          {servizio.telefono && (
                            <button
                              onClick={() => handleCall(servizio.telefono!)}
                              className="flex items-center space-x-1 text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              <Phone className="w-4 h-4" />
                              <span>Chiama</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Informazioni */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informazioni sui servizi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">📍 Indirizzi</h4>
            <p>
              Tutti gli indirizzi sono verificati e aggiornati. Clicca su &quot;Naviga&quot; 
              per aprire l&apos;app di navigazione del tuo dispositivo.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">📞 Contatti</h4>
            <p>
              I numeri di telefono sono direttamente cliccabili per avviare 
              una chiamata immediata.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">🕒 Orari</h4>
            <p>
              Gli orari di apertura sono indicativi. Ti consigliamo di 
              verificare sempre prima di recarti presso il servizio.
            </p>
          </div>
        </div>
      </div>
      
      {/* Banner sticky per utenti non autenticati */}
      {!isAuthenticated && <StickyAuthBanner />}
    </div>
  );
} 