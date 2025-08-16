'use client';

import { useEffect, useRef } from 'react';
import { X, Shield } from 'lucide-react';
import { useAppStore } from '@/store';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const { privacySettings, updatePrivacySettings } = useAppStore();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const el = ref.current;
    const first = el?.querySelector<HTMLElement>('input,button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div ref={ref} className="relative bg-white w-full max-w-lg rounded-lg shadow-xl border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h2 id="privacy-title" className="text-lg font-semibold text-gray-900">Impostazioni Privacy</h2>
          </div>
          <button onClick={onClose} aria-label="Chiudi" className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={privacySettings.shareProfile}
              onChange={(e) => updatePrivacySettings({ shareProfile: e.target.checked })}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Rendi il mio profilo visibile nei risultati pubblici</span>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={privacySettings.allowIndexing}
              onChange={(e) => updatePrivacySettings({ allowIndexing: e.target.checked })}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Consenti l&apos;indicizzazione del profilo sui motori di ricerca</span>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={privacySettings.dataSharing}
              onChange={(e) => updatePrivacySettings({ dataSharing: e.target.checked })}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Consento l&apos;uso anonimo dei miei dati per migliorare il servizio</span>
          </label>
        </div>
        <div className="p-4 pt-0 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}


