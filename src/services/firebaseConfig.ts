import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  type Auth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Os valores vêm do .env (prefixo EXPO_PUBLIC_ obrigatório).
// Depois de alterar o .env, reinicie com: npx expo start -c
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// getApps() evita inicializar duas vezes quando o Fast Refresh recarrega o módulo
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// initializeAuth (e não getAuth) para informar onde guardar a sessão:
// React Native não tem localStorage, então usamos o AsyncStorage.
function createAuth(): Auth {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // auth/already-initialized: o Fast Refresh já criou a instância
    return getAuth(app);
  }
}

export const auth: Auth = createAuth();

export default app;
