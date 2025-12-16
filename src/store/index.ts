import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { serviziPubblici, categorie } from '@/data/mockData';
import { authHelpers, professionistiHelpers, recensioniHelpers, preferitiHelpers } from '@/lib/supabase-helpers';
import type { Professionista, ServizioPubblico, Categoria, Recensione, Utente, LoginForm, RegisterForm, LoginProfessionistaForm, RegisterProfessionistaForm, UserType, SupabaseUtente, SupabaseProfessionista } from '@/types';
import type { Database } from '@/lib/supabase';

// Mappatura categorie per gestire discrepanze tra Supabase e categorie locali
const categoriaMapping: Record<string, string> = {
  'Idraulico': 'idraulico',
  'Elettricista': 'elettricista', 
  'Giardiniere': 'giardiniere',
  'Imbianchino': 'imbianchino',
  'Meccanico': 'meccanico',
  'Informatico': 'informatico',
  'Pulizie': 'pulizie',
  'Traslochi': 'traslochi',
  'Ristrutturazioni': 'ristrutturazioni',
  'Altro': 'altro'
};

// Funzione per convertire SupabaseUtente in Utente
const convertSupabaseUtente = (supabaseUser: SupabaseUtente): Utente => ({
  id: supabaseUser.id,
  nome: supabaseUser.nome,
  cognome: supabaseUser.cognome,
  email: supabaseUser.email,
  telefono: supabaseUser.telefono,
  indirizzo: supabaseUser.indirizzo,
  comune: supabaseUser.comune,
  preferenze: supabaseUser.preferenze || [],
  recensioniScritte: [], // Verrà caricato separatamente
  professionistiPreferiti: [], // Verrà caricato separatamente
  dataRegistrazione: supabaseUser.data_registrazione || new Date().toISOString(),
  ultimoAccesso: supabaseUser.ultimo_accesso ? new Date(supabaseUser.ultimo_accesso) : undefined,
  avatar: supabaseUser.avatar,
});

// Funzione per convertire SupabaseProfessionista in Professionista
const convertSupabaseProfessionista = (supabaseProf: SupabaseProfessionista): Professionista => {
  // Normalizza la categoria usando la mappatura
  const categoriaNormalizzata = categoriaMapping[supabaseProf.categoria_servizio] || supabaseProf.categoria_servizio.toLowerCase();
  
  return {
    id: supabaseProf.id,
    nome: supabaseProf.nome,
    cognome: supabaseProf.cognome,
    telefono: supabaseProf.telefono,
    email: supabaseProf.email,
    categoriaServizio: categoriaNormalizzata,
    specializzazioni: supabaseProf.specializzazioni,
    zonaServizio: supabaseProf.zona_servizio,
    orariDisponibili: supabaseProf.orari_disponibili,
    rating: supabaseProf.rating,
    numeroRecensioni: supabaseProf.numero_recensioni,
    fotoProfilo: supabaseProf.foto_profilo,
    descrizione: supabaseProf.descrizione,
    servizi: [], // Verrà caricato separatamente
    recensioni: [], // Verrà caricato separatamente
    isVerified: supabaseProf.is_verified,
    isActive: supabaseProf.is_active,
    dataRegistrazione: new Date(supabaseProf.data_registrazione),
    ultimoAccesso: supabaseProf.ultimo_accesso ? new Date(supabaseProf.ultimo_accesso) : undefined,
    partitaIva: supabaseProf.partita_iva,
    codiceFiscale: supabaseProf.codice_fiscale,
  };
};

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface AppState {
  // Dati principali
  professionisti: Professionista[];
  professionistiFiltrati: Professionista[];
  serviziPubblici: ServizioPubblico[];
  serviziPubbliciFiltrati: ServizioPubblico[];
  categorie: Categoria[];
  professionistaSelezionato: Professionista | null;
  categoriaSelezionata: string | null;
  lastUpdate: number | null;
  
  // Paginazione
  page: number;
  hasMore: boolean;
  itemsPerPage: number;
  loadMore: () => void;

  // Notifiche
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;

  // Filtri professionisti
  filtroRicerca: string;
  filtroZona: string;
  filtroRating: number | null;
  
  // Filtri servizi pubblici
  filtroTipoServizio: string;
  filtroRicercaServizi: string;
  filtroComuneServizi: string;

  // Stato UI
  isLoading: boolean;
  error: string | null;

  // Preferenze utente
  privacySettings: {
    shareProfile: boolean; // profilo visibile nei risultati
    allowIndexing: boolean; // indicizzazione motori di ricerca
    dataSharing: boolean; // condivisione dati anonimi per miglioramenti
  };
  notificationSettings: {
    emailGeneral: boolean;
    emailSecurity: boolean;
    emailMarketing: boolean;
  };

  // Autenticazione
  utente: Utente | null;
  professionistaLoggato: Professionista | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  isAdmin: boolean;

  // Azioni dati
  setProfessionisti: (professionisti: Professionista[]) => void;
  setServiziPubblici: (servizi: ServizioPubblico[]) => void;
  setCategorie: (categorie: Categoria[]) => void;
  setProfessionistaSelezionato: (professionista: Professionista | null) => void;
  setCategoriaSelezionata: (categoriaId: string | null) => void;

  // Azioni filtri professionisti
  setFiltroRicerca: (ricerca: string) => void;
  setFiltroZona: (zona: string) => void;
  setFiltroRating: (rating: number | null) => void;
  resetFiltri: () => void;
  filtraProfessionisti: () => void;
  getProfessionistiPerPriorita: () => {
    professionistiLocali: Professionista[];
    altriProfessionisti: Professionista[];
    hasLocali: boolean;
  };
  
  // Azioni filtri servizi pubblici
  setFiltroTipoServizio: (tipo: string) => void;
  setFiltroRicercaServizi: (ricerca: string) => void;
  setFiltroComuneServizi: (comune: string) => void;
  resetFiltriServizi: () => void;
  filtraServiziPubblici: () => void;

  // Azioni UI
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Aggiornamento preferenze
  updatePrivacySettings: (updates: Partial<AppState['privacySettings']>) => void;
  updateNotificationSettings: (updates: Partial<AppState['notificationSettings']>) => void;

  // Azioni autenticazione utenti
  login: (form: LoginForm) => Promise<void>;
  register: (form: RegisterForm) => Promise<void>;
  
  // Azioni autenticazione professionisti
  loginProfessionista: (form: LoginProfessionistaForm) => Promise<void>;
  registerProfessionista: (form: RegisterProfessionistaForm) => Promise<void>;
  
  // Azioni comuni
  logout: () => void;
  deleteCurrentAccount: () => Promise<void>;
  deleteCurrentAccountCompletely: (getAccessToken: () => Promise<string | null>) => Promise<void>;
  updateProfile: (profile: Partial<Utente>) => void;
  updateProfessionistaProfile: (profile: Partial<Professionista>) => void;
  addReview: (review: Recensione) => void;
  addFavorite: (professionistaId: string) => void;
  removeFavorite: (professionistaId: string) => void;
  // Admin
  moderateRecensione: (id: string, action: 'approve' | 'reject', getAccessToken: () => Promise<string | null>) => Promise<void>;
  
  // Azioni Supabase
  loadProfessionisti: () => Promise<void>;
  loadUserProfile: (userId: string) => Promise<void>;
  loadProfessionistaProfile: (profId: string) => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Stato iniziale
      professionisti: [],
      professionistiFiltrati: [],
      serviziPubblici,
      serviziPubbliciFiltrati: serviziPubblici,
      categorie,
      professionistaSelezionato: null,
      categoriaSelezionata: null,
      lastUpdate: null,
      
      // Paginazione
      page: 1,
      hasMore: true,
      itemsPerPage: 9,

      // Notifiche
      toasts: [],
      filtroRicerca: '',
      filtroZona: '',
      filtroRating: null,
      
      // Filtri servizi pubblici
      filtroTipoServizio: '',
      filtroRicercaServizi: '',
      filtroComuneServizi: '',
      
      isLoading: false,
      error: null,
      privacySettings: {
        shareProfile: true,
        allowIndexing: false,
        dataSharing: false,
      },
      notificationSettings: {
        emailGeneral: true,
        emailSecurity: true,
        emailMarketing: false,
      },
      utente: null,
      professionistaLoggato: null,
      userType: null,
      isAuthenticated: false,
      authLoading: false,
      isAdmin: false,

      // Azioni dati
      setProfessionisti: (professionisti) => {
        set({ professionisti, professionistiFiltrati: professionisti });
      },

      setServiziPubblici: (servizi) => set({ serviziPubblici: servizi, serviziPubbliciFiltrati: servizi }),
      setCategorie: (categorie) => set({ categorie }),

      setProfessionistaSelezionato: (professionista) => set({ professionistaSelezionato: professionista }),

      setCategoriaSelezionata: (categoriaId) => {
        set({ categoriaSelezionata: categoriaId, page: 1 });
        setTimeout(() => get().filtraProfessionisti(), 0);
      },

      // Azioni filtri
      setFiltroRicerca: (ricerca) => {
        set({ filtroRicerca: ricerca, page: 1 });
        setTimeout(() => get().filtraProfessionisti(), 0);
      },
      setFiltroZona: (zona) => {
        set({ filtroZona: zona, page: 1 });
        setTimeout(() => get().filtraProfessionisti(), 0);
      },
      setFiltroRating: (rating) => {
        set({ filtroRating: rating, page: 1 });
        setTimeout(() => get().filtraProfessionisti(), 0);
      },

      resetFiltri: () => {
        set({
          filtroRicerca: '',
          filtroZona: '',
          filtroRating: null,
          categoriaSelezionata: null,
          professionistiFiltrati: get().professionisti
        });
      },
      
      // Azioni filtri servizi pubblici
      setFiltroTipoServizio: (tipo) => {
        set({ filtroTipoServizio: tipo });
        setTimeout(() => get().filtraServiziPubblici(), 0);
      },
      
      setFiltroRicercaServizi: (ricerca) => {
        set({ filtroRicercaServizi: ricerca });
        setTimeout(() => get().filtraServiziPubblici(), 0);
      },
      
      setFiltroComuneServizi: (comune) => {
        set({ filtroComuneServizi: comune });
        setTimeout(() => get().filtraServiziPubblici(), 0);
      },
      
      resetFiltriServizi: () => {
        set({
          filtroTipoServizio: '',
          filtroRicercaServizi: '',
          filtroComuneServizi: '',
          serviziPubbliciFiltrati: get().serviziPubblici
        });
      },
      
      filtraServiziPubblici: () => {
        const { serviziPubblici, filtroTipoServizio, filtroRicercaServizi, filtroComuneServizi } = get();
        
        let filtered = [...serviziPubblici];

        // Filtro per tipo servizio
        if (filtroTipoServizio && filtroTipoServizio !== 'tutti') {
          filtered = filtered.filter(s => s.tipo === filtroTipoServizio);
        }

        // Filtro per ricerca
        if (filtroRicercaServizi) {
          const termini = filtroRicercaServizi.toLowerCase().split(/\s+/).filter(Boolean);
          filtered = filtered.filter(s => {
            const searchableText = [
              s.nome,
              s.tipo,
              s.indirizzo,
              s.descrizione
            ].join(' ').toLowerCase();
            
            return termini.every(termine => searchableText.includes(termine));
          });
        }

        // Filtro per comune
        if (filtroComuneServizi) {
          filtered = filtered.filter(s => 
            s.indirizzo.toLowerCase().includes(filtroComuneServizi.toLowerCase())
          );
        }

        set({ serviziPubbliciFiltrati: filtered });
      },

      filtraProfessionisti: () => {
        const { professionisti, filtroRicerca, filtroZona, filtroRating, categoriaSelezionata, page, itemsPerPage, utente } = get();
        
        let filtered = [...professionisti];

        // Filtro per zona (prioritario perché usa i tab)
        if (filtroZona) {
          filtered = filtered.filter(p => 
            p.zonaServizio.toLowerCase() === filtroZona.toLowerCase()
          );
        }

        // Filtro per ricerca (ottimizzato)
        if (filtroRicerca) {
          const termini = filtroRicerca.toLowerCase().split(/\s+/).filter(Boolean);
          filtered = filtered.filter(p => {
            const searchableText = [
              p.nome,
              p.cognome,
              p.categoriaServizio,
              ...p.specializzazioni
            ].join(' ').toLowerCase();
            
            return termini.every(termine => searchableText.includes(termine));
          });
        }

        // Filtro per rating
        if (filtroRating) {
          filtered = filtered.filter(p => p.rating >= filtroRating);
        }

        // Filtro per categoria
        if (categoriaSelezionata) {
          const categoria = categorie.find(c => c.id === categoriaSelezionata);
          if (categoria) {
            filtered = filtered.filter(p => {
              const categoriaProf = p.categoriaServizio.toLowerCase();
              const categoriaNome = categoria.nome.toLowerCase();
              const categoriaId = categoriaSelezionata.toLowerCase();
              
              return categoriaProf === categoriaNome || 
                     categoriaProf === categoriaId ||
                     categoriaProf === categoriaMapping[categoria.nome]?.toLowerCase();
            });
          }
        }

        // Ordinamento per priorità geografica (prima quelli del comune dell'utente)
        if (utente?.comune) {
          filtered.sort((a, b) => {
            const aIsLocal = a.zonaServizio.toLowerCase() === utente.comune!.toLowerCase();
            const bIsLocal = b.zonaServizio.toLowerCase() === utente.comune!.toLowerCase();
            
            if (aIsLocal && !bIsLocal) return -1;
            if (!aIsLocal && bIsLocal) return 1;
            
            // Se entrambi sono locali o entrambi non locali, mantieni l'ordine originale
            return 0;
          });
        }

        // Paginazione
        const start = 0;
        const end = page * itemsPerPage;
        const hasMore = filtered.length > end;
        const paginatedResults = filtered.slice(start, end);

        set({ 
          professionistiFiltrati: paginatedResults,
          hasMore
        });
      },

      // Nuova funzione per separare professionisti per priorità geografica
      getProfessionistiPerPriorita: () => {
        const { professionistiFiltrati, utente } = get();
        
        if (!utente?.comune) {
          return {
            professionistiLocali: [],
            altriProfessionisti: professionistiFiltrati,
            hasLocali: false
          };
        }

        // Normalizza il comune dell'utente: trim, lowercase
        const comuneNormalizzato = utente.comune.trim().toLowerCase();

        const professionistiLocali = professionistiFiltrati.filter(p => {
          // Normalizza anche la zona del professionista
          const zonaNormalizzata = (p.zonaServizio || '').trim().toLowerCase();
          return zonaNormalizzata === comuneNormalizzato;
        });
        
        const altriProfessionisti = professionistiFiltrati.filter(p => {
          const zonaNormalizzata = (p.zonaServizio || '').trim().toLowerCase();
          return zonaNormalizzata !== comuneNormalizzato;
        });

        return {
          professionistiLocali,
          altriProfessionisti,
          hasLocali: professionistiLocali.length > 0
        };
      },

      // Azioni UI
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      updatePrivacySettings: (updates) =>
        set((state) => ({ privacySettings: { ...state.privacySettings, ...updates } })),

      updateNotificationSettings: (updates) =>
        set((state) => ({ notificationSettings: { ...state.notificationSettings, ...updates } })),
      
      // Notifiche
      showToast: (message, type = 'info') => {
        const id = Date.now().toString();
        set(state => ({
          toasts: [...state.toasts, { id, message, type }]
        }));
      },
      
      removeToast: (id) => {
        set(state => ({
          toasts: state.toasts.filter(toast => toast.id !== id)
        }));
      },

      loadMore: () => {
        const { page, hasMore } = get();
        if (hasMore) {
          set({ page: page + 1 });
          get().filtraProfessionisti();
        }
      },

      // Azioni autenticazione utenti
      login: async (form) => {
        set({ authLoading: true, error: null });
        
        try {
          // Controllo utente admin di sviluppo (solo se abilitato via env)
          // ATTENZIONE: Questo è solo per sviluppo locale. In produzione usare
          // l'autenticazione Supabase con ruolo admin configurato via app_metadata.
          const devAdminEnabled =
            process.env.NODE_ENV !== 'production' &&
            process.env.NEXT_PUBLIC_ENABLE_DEV_ADMIN === 'true';
          const devAdminEmail = process.env.NEXT_PUBLIC_DEV_ADMIN_EMAIL;
          const devAdminPassword = process.env.NEXT_PUBLIC_DEV_ADMIN_PASSWORD;

          if (
            devAdminEnabled &&
            devAdminEmail &&
            devAdminPassword &&
            form.email === devAdminEmail &&
            form.password === devAdminPassword
          ) {
            set({ 
              utente: {
                id: 'dev_admin_user',
                nome: 'Admin',
                cognome: 'Sviluppo',
                email: devAdminEmail,
                telefono: '',
                indirizzo: '',
                comune: '',
                preferenze: [],
                recensioniScritte: [],
                professionistiPreferiti: [],
                dataRegistrazione: new Date().toISOString(),
                avatar: ''
              },
              professionistaLoggato: null,
              userType: 'utente',
              isAuthenticated: true, 
              isAdmin: true,
              authLoading: false 
            });
            return;
          }

          const { user } = await authHelpers.loginUser(form.email, form.password);
          
          if (user) {
            const profile = await authHelpers.getUserProfile(user.id);
            
            if (profile) {
              // Carichiamo i preferiti dell'utente
              const preferiti = await preferitiHelpers.getUserFavorites(user.id);
              const utenteConvertito = convertSupabaseUtente(profile);
              
              set({ 
                utente: {
                  ...utenteConvertito,
                  professionistiPreferiti: preferiti
                },
                professionistaLoggato: null,
                userType: 'utente',
                isAuthenticated: true,
                isAdmin: false,
                authLoading: false 
              });
            }
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Errore durante il login';
          set({ 
            error: errorMessage, 
            authLoading: false 
          });
          throw error;
        }
      },

      register: async (form) => {
        set({ authLoading: true, error: null });
        
        try {
          const { user } = await authHelpers.registerUser({
            nome: form.nome,
            cognome: form.cognome,
            email: form.email,
            password: form.password,
            telefono: form.telefono,
            comune: form.comune,
          });
          
          if (user) {
            // Non autenticare ancora finché l'email non è confermata
            set({ authLoading: false });
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Errore durante la registrazione';
          set({ 
            error: errorMessage, 
            authLoading: false 
          });
          throw error;
        }
      },

      // Azioni autenticazione professionisti
      loginProfessionista: async (form) => {
        set({ authLoading: true, error: null });
        
        try {
          const { user } = await authHelpers.loginUser(form.email, form.password);
          
          if (user) {
            const profile = await professionistiHelpers.getProfessionistaById(user.id);
            
            if (profile) {
              set({ 
                professionistaLoggato: convertSupabaseProfessionista(profile), 
                utente: null,
                userType: 'professionista',
                isAuthenticated: true, 
                authLoading: false 
              });
            } else {
              throw new Error('Profilo professionista non trovato');
            }
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Errore durante il login';
          set({ 
            error: errorMessage, 
            authLoading: false 
          });
          throw error;
        }
      },

      registerProfessionista: async (form) => {
        set({ authLoading: true, error: null });
        
        try {
          const { user } = await professionistiHelpers.registerProfessionista({
            nome: form.nome,
            cognome: form.cognome,
            email: form.email,
            password: form.password,
            telefono: form.telefono,
                      categoria_servizio: form.categoria_servizio,
          specializzazioni: form.specializzazioni,
          zona_servizio: form.zona_servizio,
          orari_disponibili: form.orari_disponibili,
          descrizione: form.descrizione,
          partita_iva: form.partita_iva,
          codice_fiscale: form.codice_fiscale,
          });
          
          if (user) {
            // Non autenticare ancora finché l'email non è confermata
            set({ authLoading: false });
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Errore durante la registrazione';
          set({ 
            error: errorMessage, 
            authLoading: false 
          });
          throw error;
        }
      },

      logout: async () => {
        // Pulizia locale SEMPRE (anche se Supabase signOut fallisce)
        set({
          utente: null,
          professionistaLoggato: null,
          userType: null,
          isAuthenticated: false,
          isAdmin: false
        });
        try {
          await authHelpers.logout();
        } catch (error: unknown) {
          // Non bloccare il logout UI: logga e continua
          console.error('Logout error:', error);
        } finally {
          // Best-effort: pulisci eventuale persistenza client
          try { localStorage.removeItem('supabase.auth.token'); } catch {}
          try { localStorage.removeItem('servizi-locali-storage'); } catch {}
        }
      },

      deleteCurrentAccount: async () => {
        const { utente, professionistaLoggato } = get();
        if (!utente && !professionistaLoggato) return;
        try {
          if (utente) {
            await authHelpers.deleteUtenteAccount(utente.id);
          } else if (professionistaLoggato) {
            await professionistiHelpers.deleteProfessionistaAccount(professionistaLoggato.id);
          }
          await authHelpers.logout();
          set({
            utente: null,
            professionistaLoggato: null,
            userType: null,
            isAuthenticated: false,
            isAdmin: false
          });
          try { localStorage.removeItem('servizi-locali-storage'); } catch {}
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Errore durante l\'eliminazione dell\'account';
          set({ error: errorMessage });
          throw error;
        }
      },

      // Elimina dati app + utente in Supabase Auth (email compresa)
      deleteCurrentAccountCompletely: async (getAccessToken) => {
        const { utente, professionistaLoggato } = get();
        if (!utente && !professionistaLoggato) return;
        try {
          const userId = utente?.id || professionistaLoggato?.id as string;
          // 1) Dati applicativi
          if (utente) {
            await authHelpers.deleteUtenteAccount(userId);
          } else if (professionistaLoggato) {
            await professionistiHelpers.deleteProfessionistaAccount(userId);
          }
          // 2) Chiamata API per eliminare l'utente dall'Auth (email compresa)
          const token = await getAccessToken();
          if (!token) throw new Error('Token di accesso mancante');
          const res = await fetch('/api/account/delete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userId })
          });
          if (!res.ok) {
            const { error } = await res.json().catch(() => ({ error: 'Errore' }));
            throw new Error(error || 'Errore durante l\'eliminazione dall\'Auth');
          }

          await authHelpers.logout();
          set({
            utente: null,
            professionistaLoggato: null,
            userType: null,
            isAuthenticated: false,
            isAdmin: false
          });
          try { localStorage.removeItem('servizi-locali-storage'); } catch {}
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Errore durante l\'eliminazione dell\'account';
          set({ error: errorMessage });
          throw error;
        }
      },

      updateProfile: async (profile) => {
        const { utente } = get();
        if (utente) {
          try {
            const updatedProfile = await authHelpers.updateUserProfile(utente.id, profile);
            if (updatedProfile) {
              set({ utente: convertSupabaseUtente(updatedProfile) });
            }
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Errore durante l\'aggiornamento';
            set({ error: errorMessage });
          }
        }
      },

      updateProfessionistaProfile: async (profile) => {
        const { professionistaLoggato } = get();
        if (professionistaLoggato) {
          try {
            // Mappa camelCase (app) -> snake_case (Supabase)
            const updates: Database['public']['Tables']['professionisti']['Update'] = {};
            if (profile.nome !== undefined) updates.nome = profile.nome;
            if (profile.cognome !== undefined) updates.cognome = profile.cognome;
            if (profile.telefono !== undefined) updates.telefono = profile.telefono;
            if (profile.email !== undefined) updates.email = profile.email;
            if (profile.categoriaServizio !== undefined) updates.categoria_servizio = profile.categoriaServizio;
            if (profile.specializzazioni !== undefined) updates.specializzazioni = profile.specializzazioni;
            if (profile.zonaServizio !== undefined) updates.zona_servizio = profile.zonaServizio;
            if (profile.orariDisponibili !== undefined) updates.orari_disponibili = profile.orariDisponibili;
            if (profile.descrizione !== undefined) updates.descrizione = profile.descrizione;
            if (profile.fotoProfilo !== undefined) updates.foto_profilo = profile.fotoProfilo || undefined;
            if (profile.isVerified !== undefined) updates.is_verified = Boolean(profile.isVerified);
            if (profile.isActive !== undefined) updates.is_active = Boolean(profile.isActive);
            if (profile.partitaIva !== undefined) updates.partita_iva = profile.partitaIva || undefined;
            if (profile.codiceFiscale !== undefined) updates.codice_fiscale = profile.codiceFiscale || undefined;

            const updatedProfile = await professionistiHelpers.updateProfessionistaProfile(professionistaLoggato.id, updates);
            if (updatedProfile) {
              set({ professionistaLoggato: convertSupabaseProfessionista(updatedProfile) });
            }
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Errore durante l\'aggiornamento';
            set({ error: errorMessage });
          }
        }
      },

      addReview: async (review) => {
        try {
          await recensioniHelpers.addRecensione({
            professionista_id: review.professionistaId,
            utente_id: review.utenteId,
            utente_nome: review.utenteNome,
            rating: review.rating,
            commento: review.commento,
            servizio_recensito: review.servizioRecensito,
          });
          
          // Ricarica i professionisti per aggiornare i rating
          await get().loadProfessionisti();
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Errore durante l\'aggiunta della recensione';
          set({ error: errorMessage });
        }
      },

      addFavorite: async (professionistaId) => {
        const { utente } = get();
        if (utente) {
          try {
            await preferitiHelpers.addToFavorites(utente.id, professionistaId);
            // Aggiorniamo la lista dei preferiti
            const preferiti = await preferitiHelpers.getUserFavorites(utente.id);
            set(state => ({
              utente: state.utente ? {
                ...state.utente,
                professionistiPreferiti: preferiti
              } : null
            }));
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Errore durante l\'aggiunta ai preferiti';
            set({ error: errorMessage });
          }
        }
      },

      removeFavorite: async (professionistaId) => {
        const { utente } = get();
        if (utente) {
          try {
            await preferitiHelpers.removeFromFavorites(utente.id, professionistaId);
            // Aggiorniamo la lista dei preferiti
            const preferiti = await preferitiHelpers.getUserFavorites(utente.id);
            set(state => ({
              utente: state.utente ? {
                ...state.utente,
                professionistiPreferiti: preferiti
              } : null
            }));
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Errore durante la rimozione dai preferiti';
            set({ error: errorMessage });
          }
        }
      },

      // Admin: moderazione recensioni (richiede token e ruolo admin)
      moderateRecensione: async (id, action, getAccessToken) => {
        try {
          const token = await getAccessToken();
          if (!token) throw new Error('Token mancante');
          const res = await fetch('/api/recensioni/moderate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ id, action })
          });
          if (!res.ok) {
            const { error } = await res.json().catch(() => ({ error: 'Errore richiesta' }));
            throw new Error(error || 'Errore');
          }
          // Aggiorna elenco professionisti per riflettere rating
          await get().loadProfessionisti();
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Errore moderazione';
          set({ error: errorMessage });
          throw error;
        }
      },

      // Azioni Supabase
      loadProfessionisti: async () => {
        const state = get();
        const CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minuti in millisecondi
        
        // Verifica se i dati in cache sono ancora validi
        const isCacheValid = state.lastUpdate && 
                           state.professionisti.length > 0 && 
                           Date.now() - state.lastUpdate < CACHE_TIMEOUT;

        if (isCacheValid) {
          // Usa i dati dalla cache
          return;
        }

        set({ isLoading: true });
        try {
          const supabaseProfessionisti = await professionistiHelpers.getAllProfessionisti();
          const professionisti = supabaseProfessionisti.map(convertSupabaseProfessionista);
          set({ 
            professionisti, 
            professionistiFiltrati: professionisti, 
            lastUpdate: Date.now(),
            isLoading: false 
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Errore durante il caricamento';
          set({ error: errorMessage, isLoading: false });
        }
      },

      loadUserProfile: async (userId: string) => {
        try {
          const profile = await authHelpers.getUserProfile(userId);
          if (profile) {
            set({ utente: convertSupabaseUtente(profile) });
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Errore durante il caricamento del profilo';
          set({ error: errorMessage });
        }
      },

      loadProfessionistaProfile: async (profId: string) => {
        try {
          const profile = await professionistiHelpers.getProfessionistaById(profId);
          if (profile) {
            set({ professionistaLoggato: convertSupabaseProfessionista(profile) });
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Errore durante il caricamento del profilo';
          set({ error: errorMessage });
        }
      },
    }),
    {
      name: 'servizi-locali-storage',
      partialize: (state) => ({
        utente: state.utente,
        professionistaLoggato: state.professionistaLoggato,
        userType: state.userType,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin, // Aggiungiamo isAdmin alla persistenza
        professionisti: state.professionisti,
        professionistiFiltrati: state.professionistiFiltrati,
        categorie: state.categorie,
        lastUpdate: state.lastUpdate, // Manteniamo il timestamp reale dell'ultimo aggiornamento
        privacySettings: state.privacySettings,
        notificationSettings: state.notificationSettings,
      }),
      version: 4,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        switch (version) {
          case 0:
            // Migrazione dalla versione 0 alla 1
            return {
              ...state,
              professionisti: [],
              professionistiFiltrati: [],
              lastUpdate: null
            };
          case 1:
            // Migrazione dalla versione 1 alla 2
            return {
              ...state,
              toasts: []
            };
          case 2:
            // Migrazione dalla versione 2 alla 3
            return {
              ...state,
              isAdmin: false // Default per utenti esistenti
            };
          case 3:
            // Aggiunge preferenze con default
            return {
              ...state,
              privacySettings: {
                shareProfile: true,
                allowIndexing: false,
                dataSharing: false,
              },
              notificationSettings: {
                emailGeneral: true,
                emailSecurity: true,
                emailMarketing: false,
              }
            };
          default:
            return state;
        }
      }
    }
  )
); 