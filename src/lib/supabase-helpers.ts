import { supabase } from './supabase';
import type { Database } from './supabase';

type Utente = Database['public']['Tables']['utenti']['Row'];
type Professionista = Database['public']['Tables']['professionisti']['Row'];
type Recensione = Database['public']['Tables']['recensioni']['Row'];
type Servizio = Database['public']['Tables']['servizi']['Row'];

// ===== UTENTI =====
export const authHelpers = {
  // Registrazione utente
  async registerUser(userData: {
    nome: string;
    cognome: string;
    email: string;
    password: string;
    telefono?: string;
    comune?: string;
  }) {
    try {
      // Prima verifichiamo se l'email esiste già
      const { data: existingUser } = await supabase
        .from('utenti')
        .select('id')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        throw new Error('Un account con questa email esiste già.');
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new Error('Un account con questa email esiste già.');
        }
        throw new Error('Errore durante la registrazione. Riprova più tardi.');
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('utenti')
          .insert({
            id: authData.user.id,
            nome: userData.nome,
            cognome: userData.cognome,
            email: userData.email,
            telefono: userData.telefono,
            comune: userData.comune,
            preferenze: [],
          });

        if (profileError) {
          if (profileError.code === '23505') { // Unique constraint violation
            throw new Error('Un account con questa email esiste già.');
          }
          throw new Error('Errore durante la creazione del profilo. Riprova più tardi.');
        }
      }

      return authData;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Errore durante la registrazione. Riprova più tardi.');
    }
  },

  // Login utente
  async loginUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === 'Email not confirmed') {
        throw new Error('Email non confermata. Controlla la tua casella email per il link di conferma.');
      }
      if (error.message === 'Invalid login credentials') {
        throw new Error('Email o password non corretti.');
      }
      throw new Error('Errore durante il login. Riprova più tardi.');
    }
    return data;
  },

  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<Utente | null> {
    const { data, error } = await supabase
      .from('utenti')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<Utente>) {
    const { data, error } = await supabase
      .from('utenti')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ===== PROFESSIONISTI =====
export const professionistiHelpers = {
  // Get all professionisti
  async getAllProfessionisti(): Promise<Professionista[]> {
    const { data, error } = await supabase
      .from('professionisti')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get professionista by ID
  async getProfessionistaById(id: string): Promise<Professionista | null> {
    const { data, error } = await supabase
      .from('professionisti')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Register professionista
  async registerProfessionista(profData: {
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
  }) {
    try {
      // Prima verifichiamo se l'email esiste già
      const { data: existingProf } = await supabase
        .from('professionisti')
        .select('id')
        .eq('email', profData.email)
        .single();

      if (existingProf) {
        throw new Error('Un account con questa email esiste già.');
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: profData.email,
        password: profData.password,
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new Error('Un account con questa email esiste già.');
        }
        throw new Error('Errore durante la registrazione. Riprova più tardi.');
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('professionisti')
          .insert({
            id: authData.user.id,
            nome: profData.nome,
            cognome: profData.cognome,
            email: profData.email,
            telefono: profData.telefono,
            categoria_servizio: profData.categoria_servizio,
            specializzazioni: profData.specializzazioni,
            zona_servizio: profData.zona_servizio,
            orari_disponibili: profData.orari_disponibili,
            descrizione: profData.descrizione,
            partita_iva: profData.partita_iva,
            codice_fiscale: profData.codice_fiscale,
            is_verified: false,
            is_active: true,
          });

        if (profileError) {
          if (profileError.code === '23505') { // Unique constraint violation
            throw new Error('Un account con questa email esiste già.');
          }
          throw new Error('Errore durante la creazione del profilo. Riprova più tardi.');
        }
      }

      return authData;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Errore durante la registrazione. Riprova più tardi.');
    }
  },

  // Update professionista profile
  async updateProfessionistaProfile(profId: string, updates: Partial<Professionista>) {
    const { data, error } = await supabase
      .from('professionisti')
      .update(updates)
      .eq('id', profId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ===== RECENSIONI =====
export const recensioniHelpers = {
  // Get recensioni for professionista
  async getRecensioniForProfessionista(profId: string): Promise<Recensione[]> {
    const { data, error } = await supabase
      .from('recensioni')
      .select('*')
      .eq('professionista_id', profId)
      .eq('stato', 'approvata')
      .order('data', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Add recensione
  async addRecensione(recensione: {
    professionista_id: string;
    utente_id: string;
    utente_nome: string;
    rating: number;
    commento: string;
    servizio_recensito?: string;
  }) {
    const { data, error } = await supabase
      .from('recensioni')
      .insert({
        ...recensione,
        stato: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user recensioni
  async getUserRecensioni(userId: string): Promise<Recensione[]> {
    const { data, error } = await supabase
      .from('recensioni')
      .select('*')
      .eq('utente_id', userId)
      .order('data', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};

// ===== PREFERITI =====
export const preferitiHelpers = {
  // Add to favorites
  async addToFavorites(userId: string, professionistaId: string) {
    const { data, error } = await supabase
      .from('preferiti')
      .insert({
        utente_id: userId,
        professionista_id: professionistaId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove from favorites
  async removeFromFavorites(userId: string, professionistaId: string) {
    const { error } = await supabase
      .from('preferiti')
      .delete()
      .eq('utente_id', userId)
      .eq('professionista_id', professionistaId);

    if (error) throw error;
  },

  // Get user favorites
  async getUserFavorites(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('preferiti')
      .select('professionista_id')
      .eq('utente_id', userId);

    if (error) throw error;
    return data?.map(fav => fav.professionista_id) || [];
  },

  // Check if professionista is favorite
  async isFavorite(userId: string, professionistaId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('preferiti')
      .select('id')
      .eq('utente_id', userId)
      .eq('professionista_id', professionistaId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },
};

// ===== SERVIZI =====
export const serviziHelpers = {
  // Get servizi for professionista
  async getServiziForProfessionista(profId: string): Promise<Servizio[]> {
    const { data, error } = await supabase
      .from('servizi')
      .select('*')
      .eq('professionista_id', profId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Add servizio
  async addServizio(servizio: {
    professionista_id: string;
    nome: string;
    prezzo_indicativo: string;
    descrizione: string;
  }) {
    const { data, error } = await supabase
      .from('servizi')
      .insert(servizio)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update servizio
  async updateServizio(servizioId: string, updates: Partial<Servizio>) {
    const { data, error } = await supabase
      .from('servizi')
      .update(updates)
      .eq('id', servizioId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete servizio
  async deleteServizio(servizioId: string) {
    const { error } = await supabase
      .from('servizi')
      .delete()
      .eq('id', servizioId);

    if (error) throw error;
  },
}; 