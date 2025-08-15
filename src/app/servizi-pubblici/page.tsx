'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/store';
import { serviziPubblici } from '@/data/mockData';
import { MapPin, Phone, Clock, Navigation, Search, X, Filter, Building } from 'lucide-react';

export default function ServiziPubbliciPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    setServiziPubblici, 
    serviziPubbliciFiltrati: servizi,
    filtroTipoServizio,
    filtroRicercaServizi,
    filtroComuneServizi,
    setFiltroTipoServizio,
    setFiltroRicercaServizi,
    setFiltroComuneServizi,
    resetFiltriServizi,
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

      {/* Barra di ricerca e filtri */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Barra di ricerca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Cerca servizi per nome, tipo o indirizzo..."
              value={filtroRicercaServizi}
              onChange={(e) => setFiltroRicercaServizi(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Filtri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tipo servizio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Tipo di servizio
              </label>
              <div className="flex flex-wrap gap-2">
                {['tutti', 'comune', 'farmacia', 'banca', 'poste', 'ufficio', 'ospedale'].map((tipo) => (
                  <button
                    key={tipo}
                    onClick={() => setFiltroTipoServizio(tipo)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      filtroTipoServizio === tipo || (tipo === 'tutti' && !filtroTipoServizio)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro comune */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Località
              </label>
              <select
                value={filtroComuneServizi}
                onChange={(e) => setFiltroComuneServizi(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="">Tutte le località</option>
                <option value="nereto">Nereto</option>
                <option value="corropoli">Corropoli</option>
                <option value="controguerra">Controguerra</option>
                <option value="sant'omero">Sant&apos;Omero</option>
              </select>
            </div>

            {/* Reset filtri */}
            <div className="flex items-end">
              <button
                onClick={resetFiltriServizi}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-300 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Reset filtri</span>
              </button>
            </div>
          </div>
        </div>
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
            <p className="text-gray-600 mb-4">
              Prova a modificare i filtri di ricerca per trovare i servizi di cui hai bisogno
            </p>
            <button
              onClick={resetFiltriServizi}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Reset filtri
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servizi.map((servizio) => (
            <div
              key={servizio.id}
              className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              {/* Overlay blur per utenti non autenticati */}
              {hasMounted && !isAuthenticated && (
                <div className="absolute inset-0 backdrop-blur-sm bg-white/30 rounded-lg z-10 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="mb-2">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Accedi per i contatti
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Registrati per accedere a telefono e navigazione
                    </p>
                    <button
                      onClick={() => router.push(`${pathname}?login=1`)}
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Accedi
                    </button>
                  </div>
                </div>
              )}
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
    </div>
  );
} 