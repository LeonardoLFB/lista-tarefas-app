import React, { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthContextData } from '../types/auth';

const AuthContext = createContext<AuthContextData | undefined>(undefined);

// Roda o useAuth uma única vez, no topo da árvore, e compartilha o resultado
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextData {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Transforma um bug silencioso ("user sempre null") numa mensagem clara
    throw new Error('useAuthContext deve ser usado dentro de um <AuthProvider>');
  }
  return context;
}
