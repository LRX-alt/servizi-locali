'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { Edit3, Settings, LogOut, Star, Heart, Calendar } from 'lucide-react';

export default function ProfiloPage() {
  const { utente, logout } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    nome: utente?.nome || '',
    cognome: utente?.cognome || '',
    email: utente?.email || '',
    telefono: utente?.telefono || '',
    comune: utente?.comune || '',
  });

  if (!utente) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Devi essere loggato per vedere il tuo profilo</p>
      </div>
    );
  }

  const handleSave = () => {
    // Implementa il salvataggio del profilo
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  const daysRegistered = utente.dataRegistrazione ? 
    Math.floor((Date.now() - utente.dataRegistrazione.getTime()) / (1000 * 60 * 60 * 24)) : 
    0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Il Mio Profilo</h1>
        <p className="text-xl text-gray-600">
          Gestisci le tue informazioni personali e le tue attività
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informazioni Personali */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Informazioni Personali</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isEditing ? 'Annulla' : 'Modifica'}
                </span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.nome}
                      onChange={(e) => setEditedProfile({ ...editedProfile, nome: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{utente.nome}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cognome
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.cognome}
                      onChange={(e) => setEditedProfile({ ...editedProfile, cognome: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{utente.cognome}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{utente.email}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefono
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.telefono}
                      onChange={(e) => setEditedProfile({ ...editedProfile, telefono: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{utente.telefono || 'Non specificato'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comune
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.comune}
                      onChange={(e) => setEditedProfile({ ...editedProfile, comune: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{utente.comune || 'Non specificato'}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Salva Modifiche
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Annulla
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Statistiche */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Le Mie Statistiche</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{utente.recensioniScritte.length}</p>
                <p className="text-sm text-gray-600">Recensioni Scritte</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{utente.professionistiPreferiti.length}</p>
                <p className="text-sm text-gray-600">Professionisti Preferiti</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{daysRegistered}</p>
                <p className="text-sm text-gray-600">Giorni Registrato</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Impostazioni */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Impostazioni</h3>
            <div className="space-y-3">
              <button className="flex items-center space-x-2 w-full text-left p-2 rounded-md hover:bg-gray-50">
                <Settings className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Privacy</span>
              </button>
              <button className="flex items-center space-x-2 w-full text-left p-2 rounded-md hover:bg-gray-50">
                <Settings className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Notifiche</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full text-left p-2 rounded-md hover:bg-red-50 text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>

          {/* Recensioni Recenti */}
          {utente.recensioniScritte.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recensioni Recenti</h3>
              <div className="space-y-3">
                {utente.recensioniScritte.slice(0, 3).map((recensione) => (
                  <div key={recensione.id} className="border-l-4 border-blue-500 pl-3">
                    <div className="flex items-center space-x-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < recensione.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{recensione.commento}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 