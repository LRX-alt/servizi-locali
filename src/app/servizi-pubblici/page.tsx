'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store';
import { serviziPubblici } from '@/data/mockData';
import { MapPin, Phone, Clock, Navigation, Building2 } from 'lucide-react';

export default function ServiziPubbliciPage() {
  const { setServiziPubblici, serviziPubblici: servizi } = useAppStore();

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

      {/* Filtri */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Filtra per tipo di servizio
        </h2>
        <div className="flex flex-wrap gap-2">
          {['tutti', 'comune', 'farmacia', 'banca', 'poste', 'ospedale'].map((tipo) => (
            <button
              key={tipo}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Lista servizi */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Servizi disponibili
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servizi.map((servizio) => (
            <div
              key={servizio.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
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
              </div>
            </div>
          ))}
        </div>
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
    </div>
  );
} 