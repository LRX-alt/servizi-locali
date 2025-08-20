'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { ArrowLeft, Plus, Edit, Trash2, MapPin, Phone, Clock, Save, X } from 'lucide-react';
import type { ServizioPubblico } from '@/types';

export default function AdminServiziPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ServizioPubblico, 'id'>>({
    nome: '',
    tipo: 'altro',
    indirizzo: '',
    coordinate: { lat: 42.8333, lng: 13.8167 },
    telefono: '',
    orari: '',
    descrizione: ''
  });

  const { serviziPubblici, setServiziPubblici, isAdmin, isAuthenticated } = useAppStore();

  // Controllo accesso admin
  useEffect(() => {
    console.log('Admin servizi check:', { isAuthenticated, isAdmin });
    
    // Solo redirect se siamo sicuri che l'utente non è admin
    // (evita redirect durante il caricamento iniziale)
    if (isAuthenticated && !isAdmin) {
      console.log('Redirecting: authenticated but not admin');
      router.push('/admin');
    }
  }, [isAuthenticated, isAdmin, router]);

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: 'altro',
      indirizzo: '',
      coordinate: { lat: 42.8333, lng: 13.8167 },
      telefono: '',
      orari: '',
      descrizione: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (servizio: ServizioPubblico) => {
    setFormData({
      nome: servizio.nome,
      tipo: servizio.tipo,
      indirizzo: servizio.indirizzo,
      coordinate: servizio.coordinate,
      telefono: servizio.telefono || '',
      orari: servizio.orari,
      descrizione: servizio.descrizione
    });
    setEditingId(servizio.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.indirizzo || !formData.orari) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    const newServizi = [...serviziPubblici];
    
    if (editingId) {
      // Modifica esistente
      const index = newServizi.findIndex(s => s.id === editingId);
      if (index !== -1) {
        newServizi[index] = { ...formData, id: editingId };
      }
    } else {
      // Nuovo servizio
      const newId = (Math.max(...serviziPubblici.map(s => parseInt(s.id))) + 1).toString();
      newServizi.push({ ...formData, id: newId });
    }

    setServiziPubblici(newServizi);
    resetForm();

    // Salva su DB
    try {
      const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession();
      const token = session?.access_token || undefined;
      await fetch('/api/servizi-pubblici/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ items: newServizi })
      });
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo servizio?')) {
      const newServizi = serviziPubblici.filter(s => s.id !== id);
      setServiziPubblici(newServizi);
      try {
        const { data: { session } } = await (await import('@/lib/supabase')).supabase.auth.getSession();
        const token = session?.access_token || undefined;
        await fetch('/api/servizi-pubblici/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ items: newServizi })
        });
      } catch {}
    }
  };

  const getTipoIcon = (tipo: string) => {
    const icons = {
      comune: '🏛️',
      poste: '📮',
      farmacia: '💊',
      banca: '🏦',
      ospedale: '🏥',
      ufficio: '🏢',
      altro: '🏪'
    };
    return icons[tipo as keyof typeof icons] || '🏢';
  };

  useEffect(() => {
    // Carica dal DB all'apertura
    (async () => {
      try {
        const res = await fetch('/api/servizi-pubblici/list');
        const json = await res.json();
        if (res.ok && Array.isArray(json.items)) setServiziPubblici(json.items);
      } catch {}
    })();
  }, [setServiziPubblici]);

  // Mostra loading se non siamo ancora autenticati, 
  // o se siamo autenticati ma la verifica admin è in corso
  if (!isAuthenticated || (isAuthenticated && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Torna alla Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Gestione Servizi Pubblici</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Aggiungi Servizio</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingId ? 'Modifica Servizio' : 'Aggiungi Nuovo Servizio'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Servizio *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="es. Farmacia Comunale"
                    />
                  </div>

                  {/* Tipo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo di Servizio *
                    </label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({...formData, tipo: e.target.value as ServizioPubblico['tipo']})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      <option value="comune">Comune</option>
                      <option value="farmacia">Farmacia</option>
                      <option value="banca">Banca</option>
                      <option value="poste">Poste</option>
                      <option value="ufficio">Ufficio</option>
                      <option value="ospedale">Ospedale</option>
                      <option value="altro">Altro</option>
                    </select>
                  </div>

                  {/* Indirizzo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Indirizzo Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.indirizzo}
                      onChange={(e) => setFormData({...formData, indirizzo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="es. Via Roma, 15, 64015 Nereto TE"
                    />
                  </div>

                  {/* Coordinate */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitudine
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.coordinate.lat}
                        onChange={(e) => setFormData({
                          ...formData, 
                          coordinate: {...formData.coordinate, lat: parseFloat(e.target.value) || 0}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitudine
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.coordinate.lng}
                        onChange={(e) => setFormData({
                          ...formData, 
                          coordinate: {...formData.coordinate, lng: parseFloat(e.target.value) || 0}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Telefono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefono
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="es. +39 0736 123456"
                    />
                  </div>

                  {/* Orari */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Orari di Apertura *
                    </label>
                    <input
                      type="text"
                      value={formData.orari}
                      onChange={(e) => setFormData({...formData, orari: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="es. Lun-Ven 8:30-19:30, Sab 8:30-12:30"
                    />
                  </div>

                  {/* Descrizione */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrizione
                    </label>
                    <textarea
                      value={formData.descrizione}
                      onChange={(e) => setFormData({...formData, descrizione: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Breve descrizione del servizio offerto"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingId ? 'Salva Modifiche' : 'Aggiungi Servizio'}</span>
                  </button>
                  <button
                    onClick={resetForm}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Annulla
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista Servizi */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Servizi Esistenti ({serviziPubblici.length})
            </h2>
          </div>
          
          <div className="divide-y">
            {serviziPubblici.map((servizio) => (
              <div key={servizio.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getTipoIcon(servizio.tipo)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{servizio.nome}</h3>
                        <p className="text-sm text-gray-600 capitalize">{servizio.tipo}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{servizio.indirizzo}</span>
                      </div>
                      {servizio.telefono && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{servizio.telefono}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{servizio.orari}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(servizio)}
                      className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(servizio.id)}
                      className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}