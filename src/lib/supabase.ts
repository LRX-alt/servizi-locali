import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipi per le tabelle del database
export interface Database {
  public: {
    Tables: {
      utenti: {
        Row: {
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
        };
        Insert: {
          id?: string;
          nome: string;
          cognome: string;
          email: string;
          telefono?: string;
          indirizzo?: string;
          comune?: string;
          preferenze?: string[];
          data_registrazione?: string;
          ultimo_accesso?: string;
          avatar?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          cognome?: string;
          email?: string;
          telefono?: string;
          indirizzo?: string;
          comune?: string;
          preferenze?: string[];
          data_registrazione?: string;
          ultimo_accesso?: string;
          avatar?: string;
        };
      };
      professionisti: {
        Row: {
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
        };
        Insert: {
          id?: string;
          nome: string;
          cognome: string;
          telefono: string;
          email: string;
          categoria_servizio: string;
          specializzazioni: string[];
          zona_servizio: string;
          orari_disponibili: string;
          rating?: number;
          numero_recensioni?: number;
          foto_profilo?: string;
          descrizione: string;
          is_verified?: boolean;
          is_active?: boolean;
          data_registrazione?: string;
          ultimo_accesso?: string;
          partita_iva?: string;
          codice_fiscale?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          cognome?: string;
          telefono?: string;
          email?: string;
          categoria_servizio?: string;
          specializzazioni?: string[];
          zona_servizio?: string;
          orari_disponibili?: string;
          rating?: number;
          numero_recensioni?: number;
          foto_profilo?: string;
          descrizione?: string;
          is_verified?: boolean;
          is_active?: boolean;
          data_registrazione?: string;
          ultimo_accesso?: string;
          partita_iva?: string;
          codice_fiscale?: string;
        };
      };
      servizi: {
        Row: {
          id: string;
          professionista_id: string;
          nome: string;
          prezzo_indicativo: string;
          descrizione: string;
        };
        Insert: {
          id?: string;
          professionista_id: string;
          nome: string;
          prezzo_indicativo: string;
          descrizione: string;
        };
        Update: {
          id?: string;
          professionista_id?: string;
          nome?: string;
          prezzo_indicativo?: string;
          descrizione?: string;
        };
      };
      recensioni: {
        Row: {
          id: string;
          professionista_id: string;
          utente_id: string;
          utente_nome: string;
          rating: number;
          commento: string;
          data: string;
          stato: 'approvata' | 'pending' | 'rifiutata';
          servizio_recensito?: string;
        };
        Insert: {
          id?: string;
          professionista_id: string;
          utente_id: string;
          utente_nome: string;
          rating: number;
          commento: string;
          data?: string;
          stato?: 'approvata' | 'pending' | 'rifiutata';
          servizio_recensito?: string;
        };
        Update: {
          id?: string;
          professionista_id?: string;
          utente_id?: string;
          utente_nome?: string;
          rating?: number;
          commento?: string;
          data?: string;
          stato?: 'approvata' | 'pending' | 'rifiutata';
          servizio_recensito?: string;
        };
      };
      preferiti: {
        Row: {
          id: string;
          utente_id: string;
          professionista_id: string;
          data_aggiunta: string;
        };
        Insert: {
          id?: string;
          utente_id: string;
          professionista_id: string;
          data_aggiunta?: string;
        };
        Update: {
          id?: string;
          utente_id?: string;
          professionista_id?: string;
          data_aggiunta?: string;
        };
      };
    };
  };
} 