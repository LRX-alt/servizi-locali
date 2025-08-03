'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store';
import { serviziPubblici } from '@/data/mockData';
import { MapPin, Phone, Clock, Building2, Navigation } from 'lucide-react';

export default function ServiziPubbliciPage() {
  const { setServiziPubblici, serviziPubblici: servizi } = useAppStore();

  useEffect(() => {
    setServiziPubblici(serviziPubblici);
  }, [setServiziPubblici]);

  const handleNavigation = (indirizzo: string) => {
    // Apre l'app di navigazione del dispositivo
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
          Trova uffici, farmacie, banche e altri servizi pubblici nella tua zona
        </p>
      </div>

      {/* Lista servizi pubblici */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Servizi disponibili
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servizi.map((servizio) => (
            <div
              key={servizio.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{getTipoIcon(servizio.tipo)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {servizio.nome}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {servizio.tipo}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {/* Indirizzo */}
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{servizio.indirizzo}</p>
                    <button
                      onClick={() => handleNavigation(servizio.indirizzo)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Apri navigazione</span>
                    </button>
                  </div>
                </div>

                {/* Orari */}
                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{servizio.orari}</p>
                </div>

                {/* Telefono */}
                {servizio.telefono && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <button
                      onClick={() => handleCall(servizio.telefono!)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {servizio.telefono}
                    </button>
                  </div>
                )}

                {/* Descrizione */}
                <div>
                  <p className="text-sm text-gray-600">{servizio.descrizione}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Informazioni aggiuntive */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Come utilizzare i servizi pubblici
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Navigazione</h4>
            <p>
              Clicca su "Apri navigazione" per avviare l'app di navigazione del tuo dispositivo 
              e ottenere indicazioni stradali per raggiungere il servizio.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Contatti</h4>
            <p>
              Clicca sul numero di telefono per chiamare direttamente il servizio 
              e ottenere informazioni aggiornate su orari e disponibilità.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 