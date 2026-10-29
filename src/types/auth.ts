import type { User } from 'firebase/auth';

// Tudo o que o AuthContext expõe para as telas
export interface AuthContextData {
  user: User | null; // null = ninguém logado
  loading: boolean; // true enquanto o Firebase restaura a sessão salva
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Erro já traduzido, pronto para mostrar ao usuário
export class AuthError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}
