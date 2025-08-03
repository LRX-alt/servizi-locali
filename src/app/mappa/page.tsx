'use client';

import { MapPin, Navigation } from 'lucide-react';

export default function MappaPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Mappa Interattiva
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Visualizza servizi pubblici e punti di interesse sulla mappa
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
            <Navigation className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Mappa in Sviluppo
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Questa funzionalità sarà presto disponibile. Potrai visualizzare servizi pubblici, 
            uffici e punti di interesse sulla mappa interattiva.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>Integrazione Google Maps in arrivo</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Servizi Pubblici</h3>
          </div>
          <p className="text-gray-600">
            Visualizza uffici comunali, farmacie, banche e altri servizi essenziali
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Navigation className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Navigazione</h3>
          </div>
          <p className="text-gray-600">
            Ottieni indicazioni stradali e calcola percorsi ottimali
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Punti di Interesse</h3>
          </div>
          <p className="text-gray-600">
            Scopri luoghi di interesse, ristoranti e attività commerciali
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Funzionalità in Arrivo
        </h3>
        <ul className="text-blue-800 space-y-2">
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span>Mappa interattiva con Google Maps</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span>Ricerca per indirizzo e categoria</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span>Indicazioni stradali integrate</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            <span>Filtri avanzati per servizi</span>
          </li>
        </ul>
      </div>
    </div>
  );
} 