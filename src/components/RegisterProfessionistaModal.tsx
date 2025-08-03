'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Phone, MapPin, Building2, Briefcase, Clock, FileText } from 'lucide-react';
import { RegisterProfessionistaForm } from '@/types';
import { categorie } from '@/data/mockData';

interface RegisterProfessionistaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (form: RegisterProfessionistaForm) => Promise<void>;
  onSwitchToLogin: () => void;
}

export default function RegisterProfessionistaModal({ isOpen, onClose, onRegister, onSwitchToLogin }: RegisterProfessionistaModalProps) {
  const [form, setForm] = useState<RegisterProfessionistaForm>({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    confermaPassword: '',
    telefono: '',
    categoriaServizio: '',
    specializzazioni: [],
    zonaServizio: '',
    orariDisponibili: '',
    descrizione: '',
    partitaIva: '',
    codiceFiscale: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [newSpecializzazione, setNewSpecializzazione] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confermaPassword) {
      setError('Le password non coincidono');
      return;
    }

    if (form.password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri');
      return;
    }

    if (!form.categoriaServizio) {
      setError('Seleziona una categoria di servizio');
      return;
    }

    if (form.specializzazioni.length === 0) {
      setError('Aggiungi almeno una specializzazione');
      return;
    }

    setIsSubmitting(true);

    try {
      await onRegister(form);
      onClose();
    } catch (error) {
      setError('Errore durante la registrazione. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof RegisterProfessionistaForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleAddSpecializzazione = () => {
    if (newSpecializzazione.trim() && !form.specializzazioni.includes(newSpecializzazione.trim())) {
      setForm(prev => ({
        ...prev,
        specializzazioni: [...prev.specializzazioni, newSpecializzazione.trim()]
      }));
      setNewSpecializzazione('');
    }
  };

  const handleRemoveSpecializzazione = (spec: string) => {
    setForm(prev => ({
      ...prev,
      specializzazioni: prev.specializzazioni.filter(s => s !== spec)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Registrati come Professionista
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Informazioni personali */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Informazioni personali</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nome *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder="Il tuo nome"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Cognome *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.cognome}
                    onChange={(e) => handleInputChange('cognome', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder="Il tuo cognome"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email professionale *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder="La tua email professionale"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Telefono *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder="Il tuo telefono"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Informazioni professionali */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Informazioni professionali</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Categoria di servizio *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={form.categoriaServizio}
                  onChange={(e) => handleInputChange('categoriaServizio', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                >
                  <option value="">Seleziona categoria</option>
                  {categorie.map((categoria) => (
                    <option key={categoria.id} value={categoria.nome}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Specializzazioni *
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSpecializzazione}
                    onChange={(e) => setNewSpecializzazione(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder="Aggiungi specializzazione"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecializzazione())}
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecializzazione}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Aggiungi
                  </button>
                </div>
                {form.specializzazioni.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.specializzazioni.map((spec, index) => (
                      <span
                        key={index}
                        className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        <span>{spec}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecializzazione(spec)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Zona di servizio *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.zonaServizio}
                    onChange={(e) => handleInputChange('zonaServizio', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder="Es: Nereto, Corropoli..."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Orari disponibili *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={form.orariDisponibili}
                    onChange={(e) => handleInputChange('orariDisponibili', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                    placeholder="Es: Lun-Ven 8-18, Sab 8-12"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Descrizione del servizio *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  value={form.descrizione}
                  onChange={(e) => handleInputChange('descrizione', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Descrivi i tuoi servizi e la tua esperienza..."
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Partita IVA
                </label>
                <input
                  type="text"
                  value={form.partitaIva}
                  onChange={(e) => handleInputChange('partitaIva', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Partita IVA (opzionale)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Codice Fiscale
                </label>
                <input
                  type="text"
                  value={form.codiceFiscale}
                  onChange={(e) => handleInputChange('codiceFiscale', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Codice Fiscale (opzionale)"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Sicurezza</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Minimo 6 caratteri"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Conferma Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confermaPassword}
                  onChange={(e) => handleInputChange('confermaPassword', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Conferma la password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required
            />
            <span className="ml-2 text-sm text-gray-600">
              Accetto i{' '}
              <button type="button" className="text-blue-600 hover:text-blue-800">
                termini e condizioni
              </button>
              {' '}e confermo di essere un professionista qualificato
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'Registrazione in corso...' : 'Registrati come Professionista'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Hai già un account professionale?{' '}
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
      </div>
    </div>
  );
} 