'use client';

import { useState } from 'react';
import { 
  User, 
  Star, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Edit, 
  LogOut,
  Heart,
  Calendar,
  Settings,
  Shield
} from 'lucide-react';
import { Utente, ProfiloUtente } from '@/types';

export default function ProfiloPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [utente] = useState<Utente>({
    id: 'user-1',
    nome: 'Mario',
    cognome: 'Bianchi',
    email: 'mario.bianchi@email.com',
    telefono: '+39 333 1234567',
    indirizzo: 'Via Roma, 15',
    comune: 'Nereto',
    preferenze: ['idraulico', 'elettricista'],
    recensioniScritte: [
      {
        id: 'rec-1',
        professionistaId: '1',
        utenteId: 'user-1',
        utenteNome: 'Mario Bianchi',
        rating: 5,
        commento: 'Ottimo lavoro! Molto professionale.',
        data: new Date('2024-01-15'),
        stato: 'approvata',
        servizioRecensito: 'Riparazione perdite'
      }
    ],
    professionistiPreferiti: ['1', '2'],
    dataRegistrazione: new Date('2024-01-01'),
    ultimoAccesso: new Date('2024-01-15')
  });

  const [profilo, setProfilo] = useState<ProfiloUtente>({
    nome: utente.nome,
    cognome: utente.cognome,
    email: utente.email,
    telefono: utente.telefono,
    indirizzo: utente.indirizzo,
    comune: utente.comune,
    preferenze: utente.preferenze
  });

  const handleSave = () => {
    // Simula il salvataggio
    console.log('Profilo salvato:', profilo);
    setIsEditing(false);
    alert('Profilo aggiornato con successo!');
  };

  const handleLogout = () => {
    // Simula il logout
    alert('Logout effettuato');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
              ? 'text-yellow-400 fill-current opacity-50' 
              : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderProfileInfo = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Informazioni personali</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          <Edit className="w-4 h-4" />
          <span>{isEditing ? 'Annulla' : 'Modifica'}</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={profilo.nome}
              onChange={(e) => setProfilo(prev => ({ ...prev, nome: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Cognome
            </label>
            <input
              type="text"
              value={profilo.cognome}
              onChange={(e) => setProfilo(prev => ({ ...prev, cognome: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Email
          </label>
          <input
            type="email"
            value={profilo.email}
            onChange={(e) => setProfilo(prev => ({ ...prev, email: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Telefono
            </label>
            <input
              type="tel"
              value={profilo.telefono || ''}
              onChange={(e) => setProfilo(prev => ({ ...prev, telefono: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Comune
            </label>
            <input
              type="text"
              value={profilo.comune || ''}
              onChange={(e) => setProfilo(prev => ({ ...prev, comune: e.target.value }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Indirizzo
          </label>
          <input
            type="text"
            value={profilo.indirizzo || ''}
            onChange={(e) => setProfilo(prev => ({ ...prev, indirizzo: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Salva modifiche
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{utente.recensioniScritte.length}</p>
            <p className="text-sm text-gray-600">Recensioni scritte</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{utente.professionistiPreferiti.length}</p>
            <p className="text-sm text-gray-600">Professionisti preferiti</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.floor((new Date().getTime() - utente.dataRegistrazione.getTime()) / (1000 * 60 * 60 * 24))}
            </p>
            <p className="text-sm text-gray-600">Giorni registrato</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Le tue recensioni</h3>
      {utente.recensioniScritte.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Non hai ancora scritto recensioni</p>
        </div>
      ) : (
        <div className="space-y-4">
          {utente.recensioniScritte.map((recensione) => (
            <div
              key={recensione.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">Servizio recensito</p>
                  <p className="text-sm text-gray-600">
                    {new Date(recensione.data).toLocaleDateString('it-IT')}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(recensione.rating)}
                </div>
              </div>
              <p className="text-gray-700">{recensione.commento}</p>
              {recensione.servizioRecensito && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {recensione.servizioRecensito}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Impostazioni</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Privacy</p>
              <p className="text-sm text-gray-600">Gestisci le impostazioni privacy</p>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Modifica
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <Settings className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Notifiche</p>
              <p className="text-sm text-gray-600">Gestisci le notifiche</p>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Modifica
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center space-x-3">
            <LogOut className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Logout</p>
              <p className="text-sm text-red-600">Esci dal tuo account</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Il tuo profilo</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Benvenuto,</span>
          <span className="font-medium text-gray-900">{utente.nome}</span>
        </div>
      </div>

      {/* Statistiche */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Panoramica</h2>
        {renderStats()}
      </div>

      {/* Informazioni profilo */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Profilo</h2>
        {renderProfileInfo()}
      </div>

      {/* Recensioni */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Attività</h2>
        {renderReviews()}
      </div>

      {/* Impostazioni */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Impostazioni</h2>
        {renderSettings()}
      </div>
    </div>
  );
} 