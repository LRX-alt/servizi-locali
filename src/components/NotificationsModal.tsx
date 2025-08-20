'use client';

import { useEffect, useRef } from 'react';
import { X, Bell } from 'lucide-react';
import { useAppStore } from '@/store';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const { notificationSettings, updateNotificationSettings } = useAppStore();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="notifications-title">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div ref={ref} className="relative bg-white w-full max-w-lg rounded-lg shadow-xl border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h2 id="notifications-title" className="text-lg font-semibold text-gray-900">Impostazioni Notifiche</h2>
          </div>
          <button onClick={onClose} aria-label="Chiudi" className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={notificationSettings.emailGeneral}
              onChange={(e) => updateNotificationSettings({ emailGeneral: e.target.checked })}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Email generali (aggiornamenti account)</span>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={notificationSettings.emailSecurity}
              onChange={(e) => updateNotificationSettings({ emailSecurity: e.target.checked })}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Email di sicurezza (accessi sospetti, reset password)</span>
          </label>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={notificationSettings.emailMarketing}
              onChange={(e) => updateNotificationSettings({ emailMarketing: e.target.checked })}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Email marketing (promozioni e novità)</span>
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






