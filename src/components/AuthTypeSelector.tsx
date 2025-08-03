'use client';

import { useState } from 'react';
import { User, Building2, X } from 'lucide-react';

interface AuthTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: () => void;
  onSelectProfessionista: () => void;
}

export default function AuthTypeSelector({ isOpen, onClose, onSelectUser, onSelectProfessionista }: AuthTypeSelectorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Scegli il tipo di account
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-center mb-6">
            Seleziona il tipo di account che vuoi creare o a cui vuoi accedere
          </p>

          <div className="grid grid-cols-1 gap-4">
            {/* Opzione Utente Privato */}
            <button
              onClick={onSelectUser}
              className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Utente Privato</h3>
                <p className="text-sm text-gray-600">
                  Per cercare professionisti, scrivere recensioni e gestire preferiti
                </p>
              </div>
            </button>

            {/* Opzione Professionista */}
            <button
              onClick={onSelectProfessionista}
              className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Professionista</h3>
                <p className="text-sm text-gray-600">
                  Per offrire servizi, gestire il profilo e ricevere richieste
                </p>
              </div>
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Differenze principali:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Utenti:</strong> Cercano e contattano professionisti</li>
              <li>• <strong>Professionisti:</strong> Offrono servizi e gestiscono richieste</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 