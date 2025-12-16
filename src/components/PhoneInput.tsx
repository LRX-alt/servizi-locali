'use client';

import { useState, useRef, useEffect } from 'react';
import { Phone, ChevronDown, Search } from 'lucide-react';

export interface Country {
  code: string; // Codice ISO (es. 'IT', 'US')
  name: string; // Nome paese
  dialCode: string; // Prefisso telefonico (es. '+39')
  flag: string; // Emoji bandiera
}

// Lista paesi comuni con prefissi telefonici
const COUNTRIES: Country[] = [
  { code: 'IT', name: 'Italia', dialCode: '+39', flag: '🇮🇹' },
  { code: 'US', name: 'Stati Uniti', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'Regno Unito', dialCode: '+44', flag: '🇬🇧' },
  { code: 'FR', name: 'Francia', dialCode: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Germania', dialCode: '+49', flag: '🇩🇪' },
  { code: 'ES', name: 'Spagna', dialCode: '+34', flag: '🇪🇸' },
  { code: 'CH', name: 'Svizzera', dialCode: '+41', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgio', dialCode: '+32', flag: '🇧🇪' },
  { code: 'NL', name: 'Paesi Bassi', dialCode: '+31', flag: '🇳🇱' },
  { code: 'PT', name: 'Portogallo', dialCode: '+351', flag: '🇵🇹' },
  { code: 'GR', name: 'Grecia', dialCode: '+30', flag: '🇬🇷' },
  { code: 'PL', name: 'Polonia', dialCode: '+48', flag: '🇵🇱' },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴' },
  { code: 'CZ', name: 'Repubblica Ceca', dialCode: '+420', flag: '🇨🇿' },
  { code: 'HU', name: 'Ungheria', dialCode: '+36', flag: '🇭🇺' },
  { code: 'SE', name: 'Svezia', dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norvegia', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Danimarca', dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlandia', dialCode: '+358', flag: '🇫🇮' },
  { code: 'IE', name: 'Irlanda', dialCode: '+353', flag: '🇮🇪' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'TR', name: 'Turchia', dialCode: '+90', flag: '🇹🇷' },
  { code: 'CN', name: 'Cina', dialCode: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Giappone', dialCode: '+81', flag: '🇯🇵' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'BR', name: 'Brasile', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Messico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'ZA', name: 'Sudafrica', dialCode: '+27', flag: '🇿🇦' },
  { code: 'EG', name: 'Egitto', dialCode: '+20', flag: '🇪🇬' },
  { code: 'MA', name: 'Marocco', dialCode: '+212', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳' },
  { code: 'AL', name: 'Albania', dialCode: '+355', flag: '🇦🇱' },
  { code: 'BA', name: 'Bosnia ed Erzegovina', dialCode: '+387', flag: '🇧🇦' },
  { code: 'HR', name: 'Croazia', dialCode: '+385', flag: '🇭🇷' },
  { code: 'RS', name: 'Serbia', dialCode: '+381', flag: '🇷🇸' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬' },
  { code: 'SK', name: 'Slovacchia', dialCode: '+421', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenia', dialCode: '+386', flag: '🇸🇮' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = '123 456 7890',
  invalid = false,
  required = false,
  disabled = false,
  className = '',
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]); // Default: Italia
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse il valore per estrarre prefisso e numero quando cambia dall'esterno
  useEffect(() => {
    if (value) {
      // Cerca se il valore inizia con un prefisso conosciuto
      const matchingCountry = COUNTRIES.find(country => 
        value.startsWith(country.dialCode)
      );
      if (matchingCountry) {
        setSelectedCountry(prev => {
          // Aggiorna solo se è diverso dal paese attuale
          if (prev.code !== matchingCountry.code) {
            return matchingCountry;
          }
          return prev;
        });
      }
    }
  }, [value]);

  // Chiudi dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Filtra paesi in base alla ricerca
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');
    
    // Se c'è già un numero, mantienilo e aggiorna solo il prefisso
    const currentNumber = value.replace(/^\+\d+\s*/, ''); // Rimuovi prefisso esistente
    if (currentNumber) {
      onChange(`${country.dialCode} ${currentNumber}`);
    } else {
      onChange(country.dialCode);
    }
    
    // Focus sull'input del numero
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value.replace(/\D/g, ''); // Solo numeri
    // Formatta il numero con spazi ogni 3 cifre
    const formatted = number.replace(/(\d{3})(?=\d)/g, '$1 ');
    const newValue = formatted ? `${selectedCountry.dialCode} ${formatted}`.trim() : selectedCountry.dialCode;
    onChange(newValue);
  };

  // Estrai solo il numero (senza prefisso) per l'input
  // Gestisce anche il caso in cui il valore non ha ancora il prefisso
  const getNumberValue = () => {
    if (!value) return '';
    // Se il valore inizia con il prefisso selezionato, rimuovilo
    if (value.startsWith(selectedCountry.dialCode)) {
      return value.replace(selectedCountry.dialCode, '').trim();
    }
    // Se il valore inizia con un altro prefisso, cerca il paese corrispondente
    const matchingCountry = COUNTRIES.find(country => 
      value.startsWith(country.dialCode)
    );
    if (matchingCountry) {
      return value.replace(matchingCountry.dialCode, '').trim();
    }
    // Se non inizia con nessun prefisso, assumi che sia solo il numero
    return value.trim();
  };

  const numberValue = getNumberValue();

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex">
        {/* Selettore Prefisso */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            flex items-center space-x-1 px-3 py-2 border-r-0 rounded-l-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10
            ${invalid 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            transition-colors
          `}
          aria-label="Seleziona prefisso telefonico"
        >
          <span className="text-lg" role="img" aria-label={selectedCountry.name}>
            {selectedCountry.flag}
          </span>
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {selectedCountry.dialCode}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Input Numero */}
        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          <input
            ref={inputRef}
            type="tel"
            value={numberValue}
            onChange={handleNumberChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`
              w-full pl-10 pr-3 py-2 border rounded-r-md
              focus:outline-none focus:ring-2
              ${invalid 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
              }
              text-gray-900
              ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}
            `}
            autoComplete="tel-national"
          />
        </div>
      </div>

      {/* Dropdown Paesi */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full sm:w-80 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden"
        >
          {/* Barra di ricerca */}
          <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca paese..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Lista paesi */}
          <div className="overflow-y-auto max-h-64">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Nessun paese trovato
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`
                    w-full px-4 py-3 flex items-center space-x-3 hover:bg-blue-50
                    transition-colors text-left
                    ${selectedCountry.code === country.code ? 'bg-blue-50 border-l-4 border-blue-600' : ''}
                  `}
                >
                  <span className="text-2xl" role="img" aria-label={country.name}>
                    {country.flag}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {country.name}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 font-mono">
                    {country.dialCode}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

