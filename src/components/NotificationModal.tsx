'use client';

import { X, Info } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export default function NotificationModal({ isOpen, onClose, title = 'Informazione', message }: NotificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="notification-modal-title">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-lg shadow-xl border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <Info className="w-5 h-5" />
            </div>
            <h3 id="notification-modal-title" className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Chiudi">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 text-gray-700">
          <p>{message}</p>
        </div>
        <div className="p-4 pt-0 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}


