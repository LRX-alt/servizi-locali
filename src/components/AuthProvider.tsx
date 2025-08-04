'use client';

import { useAuth } from '@/hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // Il hook useAuth gestisce automaticamente l'autenticazione
  // e gli errori di refresh token
  useAuth();

  return <>{children}</>;
}