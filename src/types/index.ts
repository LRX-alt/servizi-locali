export interface Professionista {
  id: string;
  nome: string;
  cognome: string;
  telefono: string;
  email: string;
  categoriaServizio: string;
  specializzazioni: string[];
  zonaServizio: string;
  orariDisponibili: string;
  rating: number;
  numeroRecensioni: number;
  fotoProfilo?: string;
  descrizione: string;
  servizi: Servizio[];
  recensioni: Recensione[];
  // Campi per autenticazione
  password?: string;
  isVerified?: boolean;
  isActive?: boolean;
  dataRegistrazione?: Date;
  ultimoAccesso?: Date;
  // Campi aggiuntivi per Supabase
  partitaIva?: string;
  codiceFiscale?: string;
}

export interface Servizio {
  id: string;
  nome: string;
  prezzoIndicativo: string;
  descrizione: string;
}

export interface ServizioPubblico {
  id: string;
  nome: string;
  tipo: 'comune' | 'ufficio' | 'banca' | 'farmacia' | 'ospedale' | 'poste' | 'altro';
  indirizzo: string;
  coordinate: {
    lat: number;
    lng: number;
  };
  telefono?: string;
  orari: string;
  descrizione: string;
}

export interface Categoria {
  id: string;
  nome: string;
  icona: string;
  descrizione: string;
  sottocategorie?: string[];
  // Campi DB (opzionali) per gestione home/ordinamenti
  ord?: number;
  show_in_home?: boolean;
  home_order?: number | null;
}

export interface Recensione {
  id: string;
  professionistaId: string;
  utenteId: string;
  utenteNome: string;
  rating: number;
  commento: string;
  data: Date;
  stato: 'approvata' | 'pending' | 'rifiutata';
  servizioRecensito?: string;
}

export interface Utente {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  indirizzo?: string;
  comune?: string;
  preferenze?: string[];
  recensioniScritte: Recensione[];
  professionistiPreferiti: string[];
  dataRegistrazione: string;
  ultimoAccesso?: Date;
  avatar?: string;
}

export interface FormRecensione {
  professionistaId: string;
  rating: number;
  commento: string;
  servizioRecensito?: string;
}

// Form per utenti privati
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  nome: string;
  cognome: string;
  email: string;
  password: string;
  telefono?: string;
  comune?: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptMarketing: boolean;
}

// Form per professionisti
export interface LoginProfessionistaForm {
  email: string;
  password: string;
}

export interface RegisterProfessionistaForm {
  nome: string;
  cognome: string;
  email: string;
  password: string;
  telefono: string;
  categoria_servizio: string;
  specializzazioni: string[];
  zona_servizio: string;
  orari_disponibili: string;
  descrizione: string;
  partita_iva?: string;
  codice_fiscale?: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptMarketing: boolean;
}

export interface ProfiloUtente {
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  indirizzo?: string;
  comune?: string;
  preferenze?: string[];
}

export interface ProfiloProfessionista {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  categoriaServizio: string;
  specializzazioni: string[];
  zonaServizio: string;
  orariDisponibili: string;
  descrizione: string;
  partitaIva?: string;
  codiceFiscale?: string;
}

// Tipo per distinguere il tipo di utente
export type UserType = 'utente' | 'professionista';

// Tipi per il database Supabase
export interface SupabaseUtente {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  indirizzo?: string;
  comune?: string;
  preferenze?: string[];
  data_registrazione: string;
  ultimo_accesso?: string;
  avatar?: string;
}

export interface SupabaseProfessionista {
  id: string;
  nome: string;
  cognome: string;
  telefono: string;
  email: string;
  categoria_servizio: string;
  specializzazioni: string[];
  zona_servizio: string;
  orari_disponibili: string;
  rating: number;
  numero_recensioni: number;
  foto_profilo?: string;
  descrizione: string;
  is_verified: boolean;
  is_active: boolean;
  data_registrazione: string;
  ultimo_accesso?: string;
  partita_iva?: string;
  codice_fiscale?: string;
} 