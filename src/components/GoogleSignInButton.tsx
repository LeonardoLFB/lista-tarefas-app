import React, { useEffect } from 'react';
import { Text, TouchableOpacity, Alert, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthContext } from '../contexts/AuthContext';
import { AuthError } from '../types/auth';

// Fecha o navegador do login quando o Google redireciona de volta ao app
WebBrowser.maybeCompleteAuthSession();

const CLIENT_IDS = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || undefined,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || undefined,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || undefined,
};

// O provider do Google exige o client ID da plataforma atual e lança um erro
// se ele faltar. Por isso as telas só renderizam o botão quando ele existe.
export function isGoogleSignInConfigured(): boolean {
  const clientId = Platform.select({
    ios: CLIENT_IDS.iosClientId,
    android: CLIENT_IDS.androidClientId,
    default: CLIENT_IDS.webClientId,
  });
  return !!clientId;
}

interface GoogleSignInButtonProps {
  disabled?: boolean;
}

export function GoogleSignInButton({ disabled }: GoogleSignInButtonProps) {
  const { signInWithGoogle } = useAuthContext();
  const [request, response, promptAsync] =
    Google.useIdTokenAuthRequest(CLIENT_IDS);

  // Quando o Google devolve o id_token, entramos no Firebase com ele.
  // Não navegamos aqui: o _layout redireciona ao perceber o novo user.
  useEffect(() => {
    if (response?.type !== 'success') {
      return;
    }
    const idToken = response.params.id_token;
    signInWithGoogle(idToken).catch((error) => {
      const message =
        error instanceof AuthError ? error.message : 'Falha no login com Google.';
      Alert.alert('Erro', message);
    });
  }, [response, signInWithGoogle]);

  return (
    <TouchableOpacity
      onPress={() => promptAsync()}
      disabled={disabled || !request}
      activeOpacity={0.8}
      accessibilityRole="button"
      className={`flex-row items-center justify-center rounded-xl border border-gray-300 bg-white py-4 ${
        disabled || !request ? 'opacity-50' : ''
      }`}
    >
      <Text className="mr-2 text-lg font-bold text-indigo-600">G</Text>
      <Text className="text-base font-semibold text-gray-700">
        Entrar com Google
      </Text>
    </TouchableOpacity>
  );
}
