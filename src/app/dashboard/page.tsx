'use client';

import { useState } from 'react';
import { 
  User, 
  Star, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Clock, 
  Edit, 
  Plus, 
  Trash2,
  Settings,
  BarChart3,
  Calendar,
  X
} from 'lucide-react';
import { Professionista, Servizio } from '@/types';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newService, setNewService] = useState({
    nome: '',
    prezzoIndicativo: '',
    descrizione: ''
  });
  const [professionista, setProfessionista] = useState<Professionista>({
    id: '1',
    nome: 'Mario',
    cognome: 'Rossi',
    telefono: '+39 333 1234567',
    email: 'mario.rossi@email.com',
    categoriaServizio: 'idraulico',
    specializzazioni: ['Riparazioni', 'Installazioni'],
    zonaServizio: 'Centro città',
    orariDisponibili: 'Lun-Ven 8:00-18:00',
    rating: 4.8,
    numeroRecensioni: 15,
    descrizione: 'Idraulico esperto con 10 anni di esperienza. Specializzato in riparazioni e installazioni.',
    servizi: [
      {
        id: '1-1',
        nome: 'Riparazione perdite',
        prezzoIndicativo: '€50-100',
        descrizione: 'Riparazione perdite d\'acqua e tubature'
      },
      {
        id: '1-2',
        nome: 'Installazione sanitari',
        prezzoIndicativo: '€200-500',
        descrizione: 'Installazione bagni e cucine'
      }
    ],
    recensioni: [
      {
        id: 'rec-1',
        professionistaId: '1',
        utenteId: 'user-1',
        utenteNome: 'Giuseppe Bianchi',
        rating: 5,
        commento: 'Ottimo lavoro! Ha risolto il problema della perdita in fretta e con professionalità.',
        data: new Date('2024-01-15'),
        stato: 'approvata',
        servizioRecensito: 'Riparazione perdite'
      }
    ]
  });

  const tabs = [
    { id: 'overview', label: 'Panoramica', icon: BarChart3 },
    { id: 'profile', label: 'Profilo', icon: User },
    { id: 'services', label: 'Servizi', icon: Settings },
    { id: 'reviews', label: 'Recensioni', icon: Star },
    { id: 'calendar', label: 'Calendario', icon: Calendar }
  ];

  const handleAddService = () => {
    if (newService.nome && newService.prezzoIndicativo && newService.descrizione) {
      const service: Servizio = {
        id: `service-${Date.now()}`,
        nome: newService.nome,
        prezzoIndicativo: newService.prezzoIndicativo,
        descrizione: newService.descrizione
      };

      setProfessionista(prev => ({
        ...prev,
        servizi: [...prev.servizi, service]
      }));

      setNewService({ nome: '', prezzoIndicativo: '', descrizione: '' });
      setShowAddServiceModal(false);
    }
  };

  const handleDeleteService = (serviceId: string) => {
    setProfessionista(prev => ({
      ...prev,
      servizi: prev.servizi.filter(service => service.id !== serviceId)
    }));
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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{professionista.rating}</p>
              <p className="text-sm text-gray-600">Rating medio</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{professionista.numeroRecensioni}</p>
              <p className="text-sm text-gray-600">Recensioni</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{professionista.servizi.length}</p>
              <p className="text-sm text-gray-600">Servizi</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Chiamate oggi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profilo rapido */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Il tuo profilo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {professionista.nome} {professionista.cognome}
                </h4>
                <p className="text-sm text-gray-600">{professionista.categoriaServizio}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{professionista.zonaServizio}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{professionista.orariDisponibili}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{professionista.telefono}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Rating</h5>
              <div className="flex items-center space-x-2">
                {renderStars(professionista.rating)}
                <span className="text-sm text-gray-600">
                  {professionista.rating} ({professionista.numeroRecensioni} recensioni)
                </span>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">Specializzazioni</h5>
              <div className="flex flex-wrap gap-1">
                {professionista.specializzazioni.map((spec, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Modifica profilo</h3>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Nome
            </label>
            <input
              type="text"
              defaultValue={professionista.nome}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Cognome
            </label>
            <input
              type="text"
              defaultValue={professionista.cognome}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Telefono
            </label>
            <input
              type="tel"
              defaultValue={professionista.telefono}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue={professionista.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Comune di servizio
          </label>
          <input
            type="text"
            defaultValue={professionista.zonaServizio}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Orari disponibili
          </label>
          <input
            type="text"
            defaultValue={professionista.orariDisponibili}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Descrizione
          </label>
          <textarea
            defaultValue={professionista.descrizione}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Salva modifiche
          </button>
        </div>
      </form>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">I tuoi servizi</h3>
        <button 
          onClick={() => setShowAddServiceModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Aggiungi servizio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {professionista.servizi.map((servizio) => (
          <div
            key={servizio.id}
            className="bg-white p-4 rounded-lg shadow-sm border"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{servizio.nome}</h4>
                <p className="text-sm text-gray-600">{servizio.prezzoIndicativo}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-1 text-gray-400 hover:text-blue-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteService(servizio.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{servizio.descrizione}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Recensioni ricevute</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {renderStars(professionista.rating)}
            <span className="text-sm text-gray-600">
              {professionista.rating} ({professionista.numeroRecensioni})
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {professionista.recensioni.map((recensione) => (
          <div
            key={recensione.id}
            className="bg-white p-4 rounded-lg shadow-sm border"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{recensione.utenteNome}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(recensione.data).toLocaleDateString('it-IT')}
                  </p>
                </div>
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
    </div>
  );

  const renderCalendar = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendario disponibilità</h3>
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Calendario in sviluppo</p>
        <p className="text-sm text-gray-500">Qui potrai gestire la tua disponibilità</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'profile':
        return renderProfile();
      case 'services':
        return renderServices();
      case 'reviews':
        return renderReviews();
      case 'calendar':
        return renderCalendar();
      default:
        return renderOverview();
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Professionista</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Benvenuto,</span>
            <span className="font-medium text-gray-900">{professionista.nome}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="min-h-96">
          {renderTabContent()}
        </div>
      </div>

      {/* Modal Aggiungi Servizio */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Aggiungi nuovo servizio
              </h2>
              <button
                onClick={() => setShowAddServiceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddService(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nome servizio *
                </label>
                <input
                  type="text"
                  value={newService.nome}
                  onChange={(e) => setNewService(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Es: Riparazione perdite"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Prezzo indicativo *
                </label>
                <input
                  type="text"
                  value={newService.prezzoIndicativo}
                  onChange={(e) => setNewService(prev => ({ ...prev, prezzoIndicativo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Es: €50-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Descrizione *
                </label>
                <textarea
                  value={newService.descrizione}
                  onChange={(e) => setNewService(prev => ({ ...prev, descrizione: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-500"
                  placeholder="Descrivi il servizio..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Aggiungi servizio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 