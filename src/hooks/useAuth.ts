import { useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../services/firebaseConfig';
import { AuthContextData, AuthError } from '../types/auth';

// Códigos do Firebase → mensagens que o usuário entende
const ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'O email informado não é válido.',
  'auth/missing-password': 'Digite sua senha.',
  'auth/invalid-credential': 'Email ou senha incorretos.',
  'auth/wrong-password': 'Email ou senha incorretos.',
  'auth/user-not-found': 'Email ou senha incorretos.',
  'auth/user-disabled': 'Esta conta foi desativada.',
  'auth/email-already-in-use': 'Já existe uma conta com este email.',
  'auth/weak-password': 'A senha precisa ter ao menos 6 caracteres.',
  'auth/too-many-requests':
    'Muitas tentativas seguidas. Aguarde um pouco e tente de novo.',
  'auth/network-request-failed': 'Sem conexão com a internet.',
  'auth/operation-not-allowed':
    'Este método de login não está habilitado no Firebase.',
  'auth/invalid-api-key':
    'Configuração do Firebase inválida. Confira o arquivo .env.',
  'auth/account-exists-with-different-credential':
    'Este email já está cadastrado com outro método de login.',
};

// Converte qualquer erro em um AuthError com mensagem em português
function translateError(error: unknown): AuthError {
  if (error instanceof FirebaseError) {
    const message =
      ERROR_MESSAGES[error.code] ?? 'Não foi possível autenticar. Tente de novo.';
    return new AuthError(error.code, message);
  }
  return new AuthError('unknown', 'Erro inesperado. Tente de novo.');
}

export function useAuth(): AuthContextData {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Única fonte da verdade: login, logout e sessão restaurada passam por aqui.
  // Nenhuma das funções abaixo chama setUser.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw translateError(error);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw translateError(error);
    }
  }, []);

  // Recebe o id_token devolvido pelo Google e troca por uma sessão do Firebase
  const signInWithGoogle = useCallback(async (idToken: string) => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
    } catch (error) {
      throw translateError(error);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw translateError(error);
    }
  }, []);

  return { user, loading, signIn, signUp, signInWithGoogle, signOut };
}
