'use client';

import { useState, useEffect } from 'react';
import { X, User, Mail, Lock, MapPin, Building2, FileText, Eye, EyeOff, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store';
import RichiediCategoriaModal from './RichiediCategoriaModal';
import PhoneInput from './PhoneInput';
import type { Categoria } from '@/types';

interface RegisterProfessionistaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegister: (userData: { nome: string; cognome: string; email: string; password: string; telefono: string; categoria_servizio: string; specializzazioni: string[]; zona_servizio: string; orari_disponibili: string; descrizione: string; partita_iva?: string; codice_fiscale?: string; acceptTerms: boolean; acceptPrivacy: boolean; acceptMarketing: boolean; }) => void;
}

export default function RegisterProfessionistaModal({ isOpen, onClose, onSwitchToLogin, onRegister }: RegisterProfessionistaModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    telefono: '',
    categoria_servizio: '',
    specializzazioni: [] as string[],
    zona_servizio: '',
    orari_disponibili: '',
    descrizione: '',
    partita_iva: '',
    codice_fiscale: '',
    acceptTerms: false,
    acceptPrivacy: false,
    acceptMarketing: false
  });

  const [error, setError] = useState('');
  const [invalid, setInvalid] = useState({
    nome: false,
    cognome: false,
    email: false,
    password: false,
    telefono: false,
    categoria_servizio: false,
    zona_servizio: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRichiediCategoria, setShowRichiediCategoria] = useState(false);
  const [categoriaRichiesta, setCategoriaRichiesta] = useState<string | null>(null);
  const [categorieCaricate, setCategorieCaricate] = useState<Categoria[]>([]);
  const [loadingCategorie, setLoadingCategorie] = useState(true);
  const { categorie } = useAppStore();

  // Carica categorie dal database
  useEffect(() => {
    const loadCategorie = async () => {
      try {
        setLoadingCategorie(true);
        const res = await fetch('/api/categorie/list');
        const json = await res.json().catch(() => null) as { items?: Categoria[] } | null;
        if (res.ok && json?.items && Array.isArray(json.items)) {
          setCategorieCaricate(json.items);
        } else {
          // Fallback a categorie hardcoded se API fallisce
          setCategorieCaricate([
            { id: 'idraulico', nome: 'Idraulico', icona: '🔧', descrizione: '' },
            { id: 'elettricista', nome: 'Elettricista', icona: '⚡', descrizione: '' },
            { id: 'giardiniere', nome: 'Giardiniere', icona: '🌳', descrizione: '' },
            { id: 'pulizie', nome: 'Pulizie', icona: '🧹', descrizione: '' },
            { id: 'traslochi', nome: 'Traslochi', icona: '📦', descrizione: '' },
            { id: 'ristrutturazioni', nome: 'Ristrutturazioni', icona: '🏗️', descrizione: '' },
            { id: 'informatica', nome: 'Informatica', icona: '💻', descrizione: '' },
            { id: 'altro', nome: 'Altro', icona: '🔧', descrizione: '' },
          ]);
        }
      } catch (error) {
        console.error('Errore caricamento categorie:', error);
        // Fallback a categorie hardcoded
        setCategorieCaricate([
          { id: 'idraulico', nome: 'Idraulico', icona: '🔧', descrizione: '' },
          { id: 'elettricista', nome: 'Elettricista', icona: '⚡', descrizione: '' },
          { id: 'giardiniere', nome: 'Giardiniere', icona: '🌳', descrizione: '' },
          { id: 'pulizie', nome: 'Pulizie', icona: '🧹', descrizione: '' },
          { id: 'traslochi', nome: 'Traslochi', icona: '📦', descrizione: '' },
          { id: 'ristrutturazioni', nome: 'Ristrutturazioni', icona: '🏗️', descrizione: '' },
          { id: 'informatica', nome: 'Informatica', icona: '💻', descrizione: '' },
          { id: 'altro', nome: 'Altro', icona: '🔧', descrizione: '' },
        ]);
      } finally {
        setLoadingCategorie(false);
      }
    };

    if (isOpen) {
      loadCategorie();
    }
  }, [isOpen]);

  const specializzazioni = [
    'Riparazioni urgenti',
    'Installazioni',
    'Manutenzione',
    'Progetti su misura',
    'Consulenza',
    'Preventivi gratuiti'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validazione
    const nextInvalid = {
      nome: !formData.nome,
      cognome: !formData.cognome,
      email: !formData.email,
      password: !formData.password,
      telefono: !formData.telefono,
      categoria_servizio: !formData.categoria_servizio,
      zona_servizio: !formData.zona_servizio,
    };
    setInvalid(nextInvalid);
    if (
      nextInvalid.nome ||
      nextInvalid.cognome ||
      nextInvalid.email ||
      nextInvalid.password ||
      nextInvalid.telefono ||
      nextInvalid.categoria_servizio ||
      nextInvalid.zona_servizio
    ) {
      setError('Tutti i campi obbligatori devono essere compilati');
      return;
    }

    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      setError('Devi accettare i Termini di Servizio e la Privacy Policy');
      return;
    }

    try {
      await onRegister(formData);
      onClose();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Errore durante la registrazione';
      setError(message);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (field in invalid) setInvalid(prev => ({ ...prev, [field]: false } as typeof prev));
    if (error) setError('');
  };

  const handleSpecializzazioneChange = (specializzazione: string) => {
    setFormData(prev => ({
      ...prev,
      specializzazioni: prev.specializzazioni.includes(specializzazione)
        ? prev.specializzazioni.filter(s => s !== specializzazione)
        : [...prev.specializzazioni, specializzazione]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Registrazione Professionista</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Informazioni Personali */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 ${invalid.nome ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'}`}
                  placeholder="Nome"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cognome *
              </label>
              <input
                type="text"
                value={formData.cognome}
                onChange={(e) => handleInputChange('cognome', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 ${invalid.cognome ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'}`}
                placeholder="Cognome"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 ${invalid.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'}`}
                placeholder="email@esempio.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 ${invalid.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'}`}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefono *
            </label>
            <PhoneInput
              value={formData.telefono}
              onChange={(value) => handleInputChange('telefono', value)}
              placeholder="123 456 7890"
              invalid={invalid.telefono}
              required
            />
          </div>

          {/* Informazioni Professionali */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Categoria Servizio *
              </label>
              <button
                type="button"
                onClick={() => setShowRichiediCategoria(true)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Richiedi nuova categoria</span>
              </button>
            </div>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={formData.categoria_servizio}
                onChange={(e) => handleInputChange('categoria_servizio', e.target.value)}
                disabled={loadingCategorie}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 ${invalid.categoria_servizio ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'} ${loadingCategorie ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            <p className="text-xs text-gray-500 mt-1">
              Non trovi la tua categoria? Clicca su "Richiedi nuova categoria"
            </p>
            {categoriaRichiesta && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded-md p-2">
                <p className="text-xs text-blue-800">
                  <strong>✓ Richiesta inviata:</strong> "{categoriaRichiesta}" è stata richiesta. 
                  Puoi continuare la registrazione selezionando una categoria temporanea (es. "Altro") e aggiornare quando la tua richiesta verrà approvata.
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specializzazioni
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {specializzazioni.map(spec => (
                <label key={spec} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.specializzazioni.includes(spec)}
                    onChange={() => handleSpecializzazioneChange(spec)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{spec}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zona di Servizio *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={formData.zona_servizio}
                onChange={(e) => handleInputChange('zona_servizio', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 ${invalid.zona_servizio ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'}`}
                placeholder="es. Nereto, Teramo, Provincia di Teramo"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orari Disponibili
            </label>
            <input
              type="text"
              value={formData.orari_disponibili}
              onChange={(e) => handleInputChange('orari_disponibili', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="es. Lun-Ven 8:00-18:00, Sab 8:00-12:00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrizione
            </label>
            <textarea
              value={formData.descrizione}
              onChange={(e) => handleInputChange('descrizione', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Descrivi i tuoi servizi, esperienza, specializzazioni..."
            />
          </div>

          {/* Informazioni Fiscali */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Partita IVA
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.partita_iva}
                  onChange={(e) => handleInputChange('partita_iva', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="IT12345678901"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Codice Fiscale
              </label>
              <input
                type="text"
                value={formData.codice_fiscale}
                onChange={(e) => handleInputChange('codice_fiscale', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="RSSMRA80A01H501U"
              />
            </div>
          </div>

          {/* Checkbox per termini e privacy */}
          <div className="space-y-3 pt-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                Accetto i{' '}
                <Link href="/termini" className="text-blue-600 hover:text-blue-800 underline" target="_blank">
                  Termini di Servizio
                </Link>
                {' '}*
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="acceptPrivacy"
                checked={formData.acceptPrivacy}
                onChange={(e) => handleInputChange('acceptPrivacy', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptPrivacy" className="text-sm text-gray-700">
                Accetto la{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline" target="_blank">
                  Privacy Policy
                </Link>
                {' '}*
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="acceptMarketing"
                checked={formData.acceptMarketing}
                onChange={(e) => handleInputChange('acceptMarketing', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptMarketing" className="text-sm text-gray-700">
                Accetto di ricevere comunicazioni marketing (opzionale)
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Registrati come Professionista
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Hai già un account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Accedi
              </button>
            </p>
          </div>
        </form>

        {/* Modal Richiesta Categoria */}
        <RichiediCategoriaModal
          isOpen={showRichiediCategoria}
          onClose={() => setShowRichiediCategoria(false)}
          richiedenteEmail={formData.email || ''}
          richiedenteNome={`${formData.nome} ${formData.cognome}`.trim() || ''}
          onRequestSent={(categoriaNome) => {
            setCategoriaRichiesta(categoriaNome);
            setShowRichiediCategoria(false);
            // Suggerisci di selezionare "Altro" se disponibile
            const categoriaAltro = categorieCaricate.find(c => c.nome.toLowerCase() === 'altro');
            if (categoriaAltro && !formData.categoria_servizio) {
              handleInputChange('categoria_servizio', categoriaAltro.nome);
            }
          }}
        />
      </div>
    </div>
  );
} 