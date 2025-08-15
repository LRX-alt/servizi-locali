import { useAppStore } from '@/store';

export function useAuth() {
  const store = useAppStore();

  // Hook semplificato per evitare loop infiniti
  // La gestione degli errori di autenticazione è temporaneamente disabilitata
  // per risolvere il problema del loop SIGNED_OUT
  
  return {
    isAuthenticated: store.isAuthenticated,
    user: store.utente,
    professionista: store.professionistaLoggato,
    userType: store.userType,
    isLoading: store.authLoading,
    error: store.error
  };
}