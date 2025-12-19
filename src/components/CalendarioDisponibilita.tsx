'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  X, 
  Plus,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import type {
  DisponibilitaSettimanale,
  DisponibilitaEccezione,
  TipoEccezione,
} from '@/types';
import { disponibilitaHelpers } from '@/lib/supabase-helpers';

interface CalendarioDisponibilitaProps {
  professionistaId: string;
}

const GIORNI_SETTIMANA = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const NOMI_MESI = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

export default function CalendarioDisponibilita({ professionistaId }: CalendarioDisponibilitaProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [disponibilitaSettimanale, setDisponibilitaSettimanale] = useState<DisponibilitaSettimanale[]>([]);
  const [eccezioni, setEccezioni] = useState<DisponibilitaEccezione[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showSettimanaleModal, setShowSettimanaleModal] = useState(false);
  const [showEccezioneModal, setShowEccezioneModal] = useState(false);
  const [selectedGiorno, setSelectedGiorno] = useState<number | null>(null);
  const [selectedData, setSelectedData] = useState<Date | null>(null);
  
  // Form states
  const [formOraInizio, setFormOraInizio] = useState('09:00');
  const [formOraFine, setFormOraFine] = useState('18:00');
  const [formAttivo, setFormAttivo] = useState(true);
  const [formTipoEccezione, setFormTipoEccezione] = useState<TipoEccezione>('disponibile');
  const [formNote, setFormNote] = useState('');

  // Carica dati
  const loadData = useCallback(async () => {
    if (!professionistaId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const [settimanale, eccezioniData] = await Promise.all([
        disponibilitaHelpers.getDisponibilitaSettimanale(professionistaId),
        disponibilitaHelpers.getEccezioni(
          professionistaId,
          new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
          new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        ),
      ]);
      
      setDisponibilitaSettimanale(settimanale);
      setEccezioni(eccezioniData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento dei dati');
    } finally {
      setIsLoading(false);
    }
  }, [professionistaId, currentDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Funzioni calendario
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Primo giorno della settimana (0=Lunedì)
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    
    const days: (Date | null)[] = [];
    
    // Aggiungi giorni vuoti all'inizio
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Aggiungi giorni del mese
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEccezioneForDate = (date: Date): DisponibilitaEccezione | undefined => {
    const dateStr = date.toISOString().split('T')[0];
    return eccezioni.find(e => e.data.toISOString().split('T')[0] === dateStr);
  };

  const getDisponibilitaForDate = (date: Date) => {
    const eccezione = getEccezioneForDate(date);
    if (eccezione) {
      if (eccezione.tipo === 'non_disponibile') return { disponibile: false, orari: null };
      if (eccezione.tipo === 'disponibile') return { disponibile: true, orari: 'Disponibile' };
      if (eccezione.tipo === 'orari_custom' && eccezione.oraInizio && eccezione.oraFine) {
        return { disponibile: true, orari: `${eccezione.oraInizio} - ${eccezione.oraFine}` };
      }
    }
    
    const giornoSettimana = (date.getDay() + 6) % 7;
    const settimanale = disponibilitaSettimanale.find(
      d => d.giornoSettimana === giornoSettimana && d.attivo
    );
    
    if (settimanale) {
      return { disponibile: true, orari: `${settimanale.oraInizio} - ${settimanale.oraFine}` };
    }
    
    return { disponibile: false, orari: null };
  };

  // Gestione disponibilità settimanale
  const handleSaveSettimanale = async () => {
    if (selectedGiorno === null) return;
    
    setIsSaving(true);
    setError(null);
    try {
      await disponibilitaHelpers.upsertDisponibilitaSettimanale(
        professionistaId,
        selectedGiorno,
        formOraInizio,
        formOraFine,
        formAttivo
      );
      await loadData();
      setShowSettimanaleModal(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel salvataggio');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSettimanale = async (giornoSettimana: number) => {
    setIsSaving(true);
    setError(null);
    try {
      await disponibilitaHelpers.deleteDisponibilitaSettimanale(professionistaId, giornoSettimana);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nell\'eliminazione');
    } finally {
      setIsSaving(false);
    }
  };

  // Gestione eccezioni
  const handleSaveEccezione = async () => {
    if (!selectedData) return;
    
    setIsSaving(true);
    setError(null);
    try {
      await disponibilitaHelpers.upsertEccezione(
        professionistaId,
        selectedData,
        formTipoEccezione,
        formTipoEccezione === 'orari_custom' ? formOraInizio : undefined,
        formTipoEccezione === 'orari_custom' ? formOraFine : undefined,
        formNote || undefined
      );
      await loadData();
      setShowEccezioneModal(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel salvataggio');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEccezione = async (data: Date) => {
    setIsSaving(true);
    setError(null);
    try {
      await disponibilitaHelpers.deleteEccezione(professionistaId, data);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nell\'eliminazione');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormOraInizio('09:00');
    setFormOraFine('18:00');
    setFormAttivo(true);
    setFormTipoEccezione('disponibile');
    setFormNote('');
    setSelectedGiorno(null);
    setSelectedData(null);
  };

  const openSettimanaleModal = (giorno: number) => {
    const existing = disponibilitaSettimanale.find(d => d.giornoSettimana === giorno);
    if (existing) {
      setFormOraInizio(existing.oraInizio);
      setFormOraFine(existing.oraFine);
      setFormAttivo(existing.attivo);
    } else {
      resetForm();
    }
    setSelectedGiorno(giorno);
    setShowSettimanaleModal(true);
  };

  const openEccezioneModal = (date: Date) => {
    const existing = getEccezioneForDate(date);
    if (existing) {
      setFormTipoEccezione(existing.tipo);
      setFormOraInizio(existing.oraInizio || '09:00');
      setFormOraFine(existing.oraFine || '18:00');
      setFormNote(existing.note || '');
    } else {
      resetForm();
    }
    setSelectedData(date);
    setShowEccezioneModal(true);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Sezione Orari Settimanali */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Orari Settimanali Ricorrenti</h3>
          <p className="text-sm text-gray-600">Imposta gli orari che si ripetono ogni settimana</p>
        </div>
        
        <div className="space-y-3">
          {GIORNI_SETTIMANA.map((giorno, index) => {
            const disponibilita = disponibilitaSettimanale.find(d => d.giornoSettimana === index);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <span className="font-medium text-gray-900 w-12">{giorno}</span>
                  {disponibilita && disponibilita.attivo ? (
                    <span className="text-sm text-gray-700">
                      {disponibilita.oraInizio} - {disponibilita.oraFine}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Non disponibile</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openSettimanaleModal(index)}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    {disponibilita ? 'Modifica' : 'Aggiungi'}
                  </button>
                  {disponibilita && (
                    <button
                      onClick={() => handleDeleteSettimanale(index)}
                      disabled={isSaving}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    >
                      Elimina
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendario Mensile */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Mese precedente"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            {NOMI_MESI[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Mese successivo"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Header giorni settimana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {GIORNI_SETTIMANA.map((giorno) => (
            <div
              key={giorno}
              className="text-center text-sm font-medium text-gray-600 py-2"
            >
              {giorno}
            </div>
          ))}
        </div>

        {/* Griglia calendario */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const disponibilita = getDisponibilitaForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isPast = date < new Date() && !isToday;

            return (
              <button
                key={date.toISOString()}
                onClick={() => openEccezioneModal(date)}
                disabled={isPast}
                className={`
                  aspect-square p-1 md:p-2 rounded-md text-sm transition-colors
                  ${isPast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                  ${disponibilita.disponibile 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
                  }
                `}
              >
                <div className="text-gray-900 font-medium">{date.getDate()}</div>
                {disponibilita.orari && (
                  <div className="text-xs text-gray-600 mt-1 truncate">
                    {disponibilita.orari}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legenda */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-gray-600">Disponibile</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
            <span className="text-gray-600">Non disponibile</span>
          </div>
        </div>
      </div>

      {/* Modal Orari Settimanali */}
      {showSettimanaleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Orari {selectedGiorno !== null ? GIORNI_SETTIMANA[selectedGiorno] : ''}
              </h3>
              <button
                onClick={() => setShowSettimanaleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Ora Inizio
                </label>
                <input
                  type="time"
                  value={formOraInizio}
                  onChange={(e) => setFormOraInizio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Ora Fine
                </label>
                <input
                  type="time"
                  value={formOraFine}
                  onChange={(e) => setFormOraFine(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="attivo"
                  checked={formAttivo}
                  onChange={(e) => setFormAttivo(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="attivo" className="text-sm text-gray-700">
                  Attivo
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSettimanaleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSaveSettimanale}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Salva</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eccezione */}
      {showEccezioneModal && selectedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Eccezione per {selectedData.toLocaleDateString('it-IT', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <button
                onClick={() => setShowEccezioneModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tipo
                </label>
                <select
                  value={formTipoEccezione}
                  onChange={(e) => setFormTipoEccezione(e.target.value as TipoEccezione)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="disponibile">Disponibile</option>
                  <option value="non_disponibile">Non disponibile</option>
                  <option value="orari_custom">Orari personalizzati</option>
                </select>
              </div>

              {formTipoEccezione === 'orari_custom' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Ora Inizio
                    </label>
                    <input
                      type="time"
                      value={formOraInizio}
                      onChange={(e) => setFormOraInizio(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Ora Fine
                    </label>
                    <input
                      type="time"
                      value={formOraFine}
                      onChange={(e) => setFormOraFine(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Note (opzionale)
                </label>
                <textarea
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Aggiungi una nota..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedData) {
                      handleDeleteEccezione(selectedData);
                    }
                    setShowEccezioneModal(false);
                  }}
                  className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors font-medium"
                >
                  Elimina
                </button>
                <button
                  onClick={() => setShowEccezioneModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSaveEccezione}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Salva</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

