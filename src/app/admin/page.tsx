'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { Shield, Users, MapPin, Building, Plus, Edit, Eye, ArrowLeft } from 'lucide-react';
import ClientOnly from '@/components/ClientOnly';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const router = useRouter();
  const { serviziPubblici, professionisti, isAdmin, isAuthenticated, logout } = useAppStore();

  const [pendingApprovals, setPendingApprovals] = useState<number>(0);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;
    const loadPending = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || undefined;
        const res = await fetch('/api/recensioni/list?status=pending', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const json = await res.json();
        if (res.ok && Array.isArray(json.items)) {
          setPendingApprovals(json.items.length);
        }
      } catch {}
    };
    loadPending();
  }, [isAuthenticated, isAdmin]);

  // Controllo accesso admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accesso Negato</h1>
          <p className="text-gray-600 mb-6">
            Solo gli amministratori possono accedere a questa pagina.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Torna alla Home
          </button>
        </div>
      </div>
    );
  }

  const stats = {
    servizi: serviziPubblici.length,
    professionisti: professionisti.length,
    totalUsers: 0, // Da implementare quando ci sarà il DB
    pendingApprovals
  };

  return (
    <ClientOnly>
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pannello Amministrazione</h1>
                <p className="text-sm text-gray-600">Servizi Locali</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Torna alla Dashboard</span>
              </button>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiche */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Building className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Servizi Pubblici</p>
                <p className="text-2xl font-bold text-gray-900">{stats.servizi}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Professionisti</p>
                <p className="text-2xl font-bold text-gray-900">{stats.professionisti}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utenti Totali</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Attesa</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Azioni rapide */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestione Servizi</h3>
            <div className="space-y-3">
              <a
                href="/admin/servizi"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Aggiungi Servizio</span>
              </a>
              <a
                href="/admin/servizi"
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Gestisci Servizi</span>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestione Professionisti</h3>
            <div className="space-y-3">
              <a href="/admin/professionisti" className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors w-full">
                <Users className="w-4 h-4" />
                <span>Vedi Professionisti</span>
              </a>
              <a href="/admin/recensioni" className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors w-full">
                <Shield className="w-4 h-4" />
                <span>Approvazione Recensioni</span>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurazione</h3>
            <div className="space-y-3">
              <a href="/admin/zone" className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors w-full">
                <MapPin className="w-4 h-4" />
                <span>Gestisci Zone</span>
              </a>
              <a href="/admin/categorie" className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors w-full">
                <Building className="w-4 h-4" />
                <span>Categorie</span>
              </a>
            </div>
          </div>
        </div>

        {/* Attività recenti */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attività Recenti</h3>
          <div className="text-gray-600">
            <p>• Ultima modifica servizi: Non disponibile</p>
            <p>• Ultimo accesso admin: {new Date().toLocaleString('it-IT')}</p>
            <p>• Sistema operativo: Sviluppo</p>
          </div>
        </div>
      </div>
    </div>
    </ClientOnly>
  );
}