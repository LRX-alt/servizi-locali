'use client';

import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Building2 } from 'lucide-react';
import { LoginProfessionistaForm } from '@/types';

interface LoginProfessionistaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (form: LoginProfessionistaForm) => Promise<void>;
  onSwitchToRegister: () => void;
}

export default function LoginProfessionistaModal({ isOpen, onClose, onLogin, onSwitchToRegister }: LoginProfessionistaModalProps) {
  const [form, setForm] = useState<LoginProfessionistaForm>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onLogin(form);
      onClose();
    } catch (error) {
      setError('Email o password non corretti');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof LoginProfessionistaForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errorMessage) setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Accedi come Professionista
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email professionale
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
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="La tua password"
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

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Ricordami</span>
            </label>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Password dimenticata?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? 'Accesso in corso...' : 'Accedi come Professionista'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Non hai ancora un account professionale?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Registrati come Professionista
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 