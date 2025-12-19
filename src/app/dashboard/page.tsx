'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import { professionistiHelpers, serviziHelpers, recensioniHelpers } from '@/lib/supabase-helpers';
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
  X,
  Shield,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Servizio, Recensione, Categoria } from '@/types';
import Avatar from '@/components/Avatar';
import CalendarioDisponibilita from '@/components/CalendarioDisponibilita';

export default function DashboardPage() {
  const router = useRouter();
  const { 
    isAdmin, 
    userType, 
    professionistaLoggato, 
    updateProfessionistaProfile,
    isAuthenticated,
    showToast
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Foto profilo (upload)
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [photoStatus, setPhotoStatus] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  // Dati caricati dal database
  const [servizi, setServizi] = useState<Servizio[]>([]);
  const [recensioni, setRecensioni] = useState<Recensione[]>([]);
  
  // Form nuovo servizio
  const [newService, setNewService] = useState({
    nome: '',
    prezzoIndicativo: '',
    descrizione: ''
  });

  // Form modifica profilo
  const [editedProfile, setEditedProfile] = useState({
    nome: '',
    cognome: '',
    telefono: '',
    email: '',
    categoriaServizio: '',
    zonaServizio: '',
    orariDisponibili: '',
    descrizione: ''
  });

  // Categorie disponibili
  const [categorieCaricate, setCategorieCaricate] = useState<Categoria[]>([]);
  const [loadingCategorie, setLoadingCategorie] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Panoramica', icon: BarChart3 },
    { id: 'profile', label: 'Profilo', icon: User },
    { id: 'services', label: 'Servizi', icon: Settings },
    { id: 'reviews', label: 'Recensioni', icon: Star },
    { id: 'calendar', label: 'Calendario', icon: Calendar }
  ];

  // Carica servizi e recensioni del professionista
  const loadProfessionistaData = useCallback(async () => {
    if (!professionistaLoggato?.id) return;
    
    setIsLoading(true);
    try {
      const [serviziData, recensioniData] = await Promise.all([
        serviziHelpers.getServiziForProfessionista(professionistaLoggato.id),
        recensioniHelpers.getRecensioniForProfessionista(professionistaLoggato.id)
      ]);
      
      // Converti i dati Supabase nel formato locale
      setServizi(serviziData.map(s => ({
        id: s.id,
        nome: s.nome,
        prezzoIndicativo: s.prezzo_indicativo,
        descrizione: s.descrizione
      })));
      
      setRecensioni(recensioniData.map(r => ({
        id: r.id,
        professionistaId: r.professionista_id,
        utenteId: r.utente_id,
        utenteNome: r.utente_nome,
        rating: r.rating,
        commento: r.commento,
        data: new Date(r.data),
        stato: r.stato,
        servizioRecensito: r.servizio_recensito
      })));
    } catch (error) {
      console.error('Errore caricamento dati:', error);
    } finally {
      setIsLoading(false);
    }
  }, [professionistaLoggato?.id]);

  // Carica categorie disponibili
  useEffect(() => {
    const loadCategorie = async () => {
      try {
        setLoadingCategorie(true);
        const res = await fetch('/api/categorie/list');
        const json = await res.json().catch(() => null) as { items?: Categoria[] } | null;
        if (res.ok && json?.items && Array.isArray(json.items)) {
          setCategorieCaricate(json.items);
        }
      } catch (error) {
        console.error('Errore caricamento categorie:', error);
      } finally {
        setLoadingCategorie(false);
      }
    };
    loadCategorie();
  }, []);

  // Carica dati all'avvio
  useEffect(() => {
    loadProfessionistaData();
  }, [loadProfessionistaData]);

  // Sincronizza form profilo quando cambia il professionista loggato
  useEffect(() => {
    if (professionistaLoggato) {
      setEditedProfile({
        nome: professionistaLoggato.nome || '',
        cognome: professionistaLoggato.cognome || '',
        telefono: professionistaLoggato.telefono || '',
        email: professionistaLoggato.email || '',
        categoriaServizio: professionistaLoggato.categoriaServizio || '',
        zonaServizio: professionistaLoggato.zonaServizio || '',
        orariDisponibili: professionistaLoggato.orariDisponibili || '',
        descrizione: professionistaLoggato.descrizione || ''
      });
    }
  }, [professionistaLoggato]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    };
  }, [photoPreviewUrl]);

  const handlePhotoSelect = (file: File | null) => {
    setPhotoStatus('');
    if (!file) {
      setPhotoFile(null);
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
      setPhotoPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setPhotoStatus('Seleziona un file immagine valido (PNG/JPG/WebP).');
      return;
    }

    const maxBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxBytes) {
      setPhotoStatus('Immagine troppo grande (max 5MB).');
      return;
    }

    setPhotoFile(file);
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadPhoto = async () => {
    if (!professionistaLoggato?.id || !photoFile) return;
    setPhotoStatus('');
    setIsUploadingPhoto(true);
    try {
      const publicUrl = await professionistiHelpers.uploadFotoProfilo(professionistaLoggato.id, photoFile);
      const cacheBusted = `${publicUrl}${publicUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
      await updateProfessionistaProfile({ fotoProfilo: cacheBusted });

      setPhotoStatus('Foto profilo aggiornata.');
      setPhotoFile(null);
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
      setPhotoPreviewUrl(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Errore durante l’upload della foto';
      setPhotoStatus(message);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Reindirizza se non è un professionista autenticato
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
      return;
    }
    if (userType && userType !== 'professionista') {
      router.replace('/');
    }
  }, [userType, isAuthenticated, router]);

  const handleAddService = async () => {
    if (!professionistaLoggato?.id) return;
    if (!newService.nome || !newService.prezzoIndicativo || !newService.descrizione) return;
    
    setIsSaving(true);
    try {
      const created = await serviziHelpers.addServizio({
        professionista_id: professionistaLoggato.id,
        nome: newService.nome,
        prezzo_indicativo: newService.prezzoIndicativo,
        descrizione: newService.descrizione
      });
      
      setServizi(prev => [...prev, {
        id: created.id,
        nome: created.nome,
        prezzoIndicativo: created.prezzo_indicativo,
        descrizione: created.descrizione
      }]);
      
      setNewService({ nome: '', prezzoIndicativo: '', descrizione: '' });
      setShowAddServiceModal(false);
      showToast('Servizio aggiunto con successo', 'success');
    } catch (error) {
      console.error('Errore aggiunta servizio:', error);
      showToast('Errore durante l\'aggiunta del servizio', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    setIsSaving(true);
    try {
      await serviziHelpers.deleteServizio(serviceId);
      setServizi(prev => prev.filter(s => s.id !== serviceId));
      showToast('Servizio eliminato', 'success');
    } catch (error) {
      console.error('Errore eliminazione servizio:', error);
      showToast('Errore durante l\'eliminazione del servizio', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professionistaLoggato) return;
    
    setIsSaving(true);
    try {
      await updateProfessionistaProfile({
        nome: editedProfile.nome,
        cognome: editedProfile.cognome,
        telefono: editedProfile.telefono,
        categoriaServizio: editedProfile.categoriaServizio,
        zonaServizio: editedProfile.zonaServizio,
        orariDisponibili: editedProfile.orariDisponibili,
        descrizione: editedProfile.descrizione
      });
      showToast('Profilo aggiornato con successo', 'success');
    } catch (error) {
      console.error('Errore aggiornamento profilo:', error);
      showToast('Errore durante l\'aggiornamento del profilo', 'error');
    } finally {
      setIsSaving(false);
    }
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

  // Mostra loading se il professionista non è ancora caricato
  if (!professionistaLoggato) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-2xl font-bold text-gray-900">{professionistaLoggato.rating?.toFixed(1) || '0.0'}</p>
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
              <p className="text-2xl font-bold text-gray-900">{professionistaLoggato.numeroRecensioni || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{servizi.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">—</p>
              <p className="text-sm text-gray-600">Contatti</p>
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
                  {professionistaLoggato.nome} {professionistaLoggato.cognome}
                </h4>
                <p className="text-sm text-gray-600 capitalize">{professionistaLoggato.categoriaServizio}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{professionistaLoggato.zonaServizio || 'Non specificato'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{professionistaLoggato.orariDisponibili || 'Non specificato'}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{professionistaLoggato.telefono}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Rating</h5>
              <div className="flex items-center space-x-2">
                {renderStars(professionistaLoggato.rating || 0)}
                <span className="text-sm text-gray-600">
                  {professionistaLoggato.rating?.toFixed(1) || '0.0'} ({professionistaLoggato.numeroRecensioni || 0} recensioni)
                </span>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">Specializzazioni</h5>
              <div className="flex flex-wrap gap-1">
                {professionistaLoggato.specializzazioni?.length > 0 ? (
                  professionistaLoggato.specializzazioni.map((spec, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {spec}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">Nessuna specializzazione</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stato verifica */}
      {!professionistaLoggato.isVerified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Profilo in attesa di verifica</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Il tuo profilo è visibile ma non ancora verificato. Gli amministratori esamineranno la tua richiesta.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Modifica profilo</h3>
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Foto profilo */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar
                src={photoPreviewUrl || professionistaLoggato?.fotoProfilo || null}
                alt={`${professionistaLoggato?.nome || ''} ${professionistaLoggato?.cognome || ''}`.trim() || 'Foto profilo'}
                size="lg"
              />
              <div className="space-y-1">
                <p className="font-medium text-gray-900">Foto profilo</p>
                <p className="text-sm text-gray-600">Consigliato: immagine quadrata (min 400x400), max 5MB.</p>
              </div>
            </div>

            <div className="sm:ml-auto flex flex-col gap-2 w-full sm:w-auto">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoSelect(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-900 hover:file:bg-gray-200"
                aria-label="Carica foto profilo"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUploadPhoto}
                  disabled={!photoFile || isUploadingPhoto}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingPhoto ? 'Upload…' : 'Carica foto'}
                </button>
                <button
                  type="button"
                  onClick={() => handlePhotoSelect(null)}
                  disabled={!photoFile || isUploadingPhoto}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annulla
                </button>
              </div>
              {photoStatus && (
                <p className="text-sm text-gray-600" aria-live="polite">
                  {photoStatus}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={editedProfile.nome}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Cognome
            </label>
            <input
              type="text"
              value={editedProfile.cognome}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, cognome: e.target.value }))}
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
              value={editedProfile.telefono}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, telefono: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              value={editedProfile.email}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">L&apos;email non può essere modificata</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Categoria Servizio *
          </label>
          <select
            value={editedProfile.categoriaServizio}
            onChange={(e) => setEditedProfile(prev => ({ ...prev, categoriaServizio: e.target.value }))}
            disabled={loadingCategorie}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {loadingCategorie ? 'Caricamento categorie...' : 'Seleziona categoria'}
            </option>
            {categorieCaricate.map(categoria => (
              <option key={categoria.id} value={categoria.nome}>
                {categoria.icona} {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Comune di servizio
          </label>
          <input
            type="text"
            value={editedProfile.zonaServizio}
            onChange={(e) => setEditedProfile(prev => ({ ...prev, zonaServizio: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Orari disponibili
          </label>
          <input
            type="text"
            value={editedProfile.orariDisponibili}
            onChange={(e) => setEditedProfile(prev => ({ ...prev, orariDisponibili: e.target.value }))}
            placeholder="Es: Lun-Ven 8:00-18:00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Descrizione
          </label>
          <textarea
            value={editedProfile.descrizione}
            onChange={(e) => setEditedProfile(prev => ({ ...prev, descrizione: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Salva modifiche</span>
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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : servizi.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Non hai ancora aggiunto servizi</p>
          <p className="text-sm text-gray-500">Aggiungi i servizi che offri per farti trovare dai clienti</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servizi.map((servizio) => (
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
                    disabled={isSaving}
                    className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{servizio.descrizione}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Recensioni ricevute</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {renderStars(professionistaLoggato.rating || 0)}
            <span className="text-sm text-gray-600">
              {professionistaLoggato.rating?.toFixed(1) || '0.0'} ({professionistaLoggato.numeroRecensioni || 0})
            </span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : recensioni.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Non hai ancora ricevuto recensioni</p>
          <p className="text-sm text-gray-500">Le recensioni dei clienti appariranno qui</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recensioni.map((recensione) => (
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
      )}
    </div>
  );

  const renderCalendar = () => {
    if (!professionistaLoggato?.id) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Caricamento calendario...</p>
          </div>
        </div>
      );
    }

    return (
      <CalendarioDisponibilita professionistaId={professionistaLoggato.id} />
    );
  };

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
          <div className="flex items-center space-x-4">
            {/* Pulsante Admin - Solo per amministratori */}
            {isAdmin && (
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-sm font-medium"
                title="Pannello Amministrazione"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Panel</span>
              </button>
            )}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Benvenuto,</span>
              <span className="font-medium text-gray-900">{professionistaLoggato.nome}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Aggiungi servizio</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 