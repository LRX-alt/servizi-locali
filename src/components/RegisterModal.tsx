'use client';

import { useEffect, useRef, useState } from 'react';
import { X, User, Mail, Lock, MapPin, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import PhoneInput from './PhoneInput';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegister: (userData: { nome: string; cognome: string; email: string; password: string; telefono?: string; comune?: string; acceptTerms: boolean; acceptPrivacy: boolean; acceptMarketing: boolean; }) => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin, onRegister }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    telefono: '',
    indirizzo: '',
    comune: '',
    acceptTerms: false,
    acceptPrivacy: false,
    acceptMarketing: false
  });

  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [invalid, setInvalid] = useState({
    nome: false,
    cognome: false,
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  // Funzione per calcolare la forza della password
  const calculatePasswordStrength = (password: string): { score: number; level: 'vuota' | 'debole' | 'media' | 'forte' | 'molto_forte'; requirements: { label: string; met: boolean }[] } => {
    if (!password) {
      return {
        score: 0,
        level: 'vuota',
        requirements: [
          { label: 'Almeno 8 caratteri', met: false },
          { label: 'Almeno una lettera maiuscola', met: false },
          { label: 'Almeno una lettera minuscola', met: false },
          { label: 'Almeno un numero', met: false },
          { label: 'Almeno un carattere speciale', met: false },
        ],
      };
    }

    const requirements = [
      { label: 'Almeno 8 caratteri', met: password.length >= 8 },
      { label: 'Almeno una lettera maiuscola', met: /[A-Z]/.test(password) },
      { label: 'Almeno una lettera minuscola', met: /[a-z]/.test(password) },
      { label: 'Almeno un numero', met: /[0-9]/.test(password) },
      { label: 'Almeno un carattere speciale (!@#$%^&*)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
    ];

    const metCount = requirements.filter(r => r.met).length;
    let score = 0;
    let level: 'debole' | 'media' | 'forte' | 'molto_forte' = 'debole';

    // Calcolo score basato su requisiti e lunghezza
    score += requirements[0].met ? 20 : 0; // Lunghezza
    score += requirements[1].met ? 20 : 0; // Maiuscola
    score += requirements[2].met ? 20 : 0; // Minuscola
    score += requirements[3].met ? 20 : 0; // Numero
    score += requirements[4].met ? 20 : 0; // Speciale

    // Bonus per lunghezza extra
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    if (score < 40) level = 'debole';
    else if (score < 70) level = 'media';
    else if (score < 90) level = 'forte';
    else level = 'molto_forte';

    return { score, level, requirements };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validazione
    const nextInvalid = {
      nome: !formData.nome,
      cognome: !formData.cognome,
      email: !formData.email,
      password: !formData.password,
    };
    setInvalid(nextInvalid);
    if (nextInvalid.nome || nextInvalid.cognome || nextInvalid.email || nextInvalid.password) {
      setError('Tutti i campi obbligatori devono essere compilati');
      return;
    }

    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      setError('Devi accettare i Termini di Servizio e la Privacy Policy');
      return;
    }

    // Validazione forza password
    const passwordStrengthCheck = calculatePasswordStrength(formData.password);
    const unmetRequirements = passwordStrengthCheck.requirements.filter(r => !r.met);
    if (unmetRequirements.length > 0) {
      setError(`La password non soddisfa tutti i requisiti. Verifica: ${unmetRequirements.map(r => r.label).join(', ')}`);
      setInvalid(prev => ({ ...prev, password: true }));
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Reset stato invalid sul campo modificato
    if (field === 'nome' && invalid.nome) setInvalid(prev => ({ ...prev, nome: false }));
    if (field === 'cognome' && invalid.cognome) setInvalid(prev => ({ ...prev, cognome: false }));
    if (field === 'email' && invalid.email) setInvalid(prev => ({ ...prev, email: false }));
    if (field === 'password' && invalid.password) setInvalid(prev => ({ ...prev, password: false }));
    if (error) setError('');
  };

  // Gestione focus iniziale, ESC e focus trap
  useEffect(() => {
    if (!isOpen) return;
    const container = modalRef.current;
    const firstInput = container?.querySelector('input');
    (firstInput as HTMLInputElement | null)?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Tab' && container) {
        const focusables = Array.from(
          container.querySelectorAll<HTMLElement>('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])')
        ).filter(el => !el.hasAttribute('disabled'));
        if (focusables.length === 0) return;
        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];
        if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        } else if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="register-modal-title">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 id="register-modal-title" className="text-2xl font-bold text-gray-900">Registrazione</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md" role="alert" aria-live="assertive" id="register-error">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
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
                  autoComplete="given-name"
                  aria-invalid={invalid.nome}
                  aria-describedby={invalid.nome ? 'register-error' : undefined}
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
                autoComplete="family-name"
                aria-invalid={invalid.cognome}
                aria-describedby={invalid.cognome ? 'register-error' : undefined}
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
                autoComplete="email"
                aria-invalid={invalid.email}
                aria-describedby={invalid.email ? 'register-error' : undefined}
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
                autoComplete="new-password"
                aria-invalid={invalid.password}
                aria-describedby={invalid.password ? 'register-error' : undefined}
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

            {/* Indicatore forza password */}
            {formData.password && (
              <div className="mt-2 space-y-2">
                {/* Barra di progresso */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.level === 'debole'
                        ? 'bg-red-500'
                        : passwordStrength.level === 'media'
                        ? 'bg-yellow-500'
                        : passwordStrength.level === 'forte'
                        ? 'bg-blue-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>

                {/* Etichetta livello */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    Forza password:{' '}
                    <span
                      className={
                        passwordStrength.level === 'debole'
                          ? 'text-red-600'
                          : passwordStrength.level === 'media'
                          ? 'text-yellow-600'
                          : passwordStrength.level === 'forte'
                          ? 'text-blue-600'
                          : 'text-green-600'
                      }
                    >
                      {passwordStrength.level === 'vuota'
                        ? ''
                        : passwordStrength.level === 'debole'
                        ? 'Debole'
                        : passwordStrength.level === 'media'
                        ? 'Media'
                        : passwordStrength.level === 'forte'
                        ? 'Forte'
                        : 'Molto Forte'}
                    </span>
                  </span>
                  <span className="text-xs text-gray-500">{formData.password.length} caratteri</span>
                </div>

                {/* Lista requisiti */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 space-y-1.5">
                  <p className="text-xs font-medium text-gray-700 mb-1.5">Requisiti password:</p>
                  {passwordStrength.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                          req.met ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        {req.met && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs ${req.met ? 'text-green-700' : 'text-gray-600'}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefono
            </label>
            <PhoneInput
              value={formData.telefono}
              onChange={(value) => handleInputChange('telefono', value)}
              placeholder="123 456 7890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Indirizzo
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={formData.indirizzo}
                onChange={(e) => handleInputChange('indirizzo', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Via Roma 123"
                autoComplete="street-address"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comune
            </label>
            <input
              type="text"
              value={formData.comune}
              onChange={(e) => handleInputChange('comune', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Nereto"
              autoComplete="address-level2"
            />
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
                <Link href="/termini" prefetch={false} rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline" target="_blank">
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
                <Link href="/privacy" prefetch={false} rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline" target="_blank">
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Registrati
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
      </div>
    </div>
  );
} 