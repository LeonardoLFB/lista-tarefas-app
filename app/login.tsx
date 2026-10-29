import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuthContext } from '../src/contexts/AuthContext';
import { AuthError } from '../src/types/auth';
import {
  GoogleSignInButton,
  isGoogleSignInConfigured,
} from '../src/components/GoogleSignInButton';

export default function LoginScreen() {
  const { signIn } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    const trimmedEmail = email.trim();
    if (trimmedEmail.length === 0 || password.length === 0) {
      Alert.alert('Atenção', 'Informe seu email e sua senha.');
      return;
    }

    try {
      setLoading(true);
      await signIn(trimmedEmail, password);
      // Não navegamos aqui! O _layout redireciona sozinho.
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : 'Não foi possível entrar.';
      Alert.alert('Erro ao entrar', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center p-6"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-2 text-center text-5xl">📋</Text>
        <Text className="mb-1 text-center text-3xl font-bold text-indigo-600">
          Entrar
        </Text>
        <Text className="mb-8 text-center text-sm text-gray-500">
          Acesse suas tarefas
        </Text>

        <Text className="mb-2 text-sm font-semibold text-gray-700">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="email@exemplo.com"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
          className="mb-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800"
        />

        <Text className="mb-2 text-sm font-semibold text-gray-700">Senha</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Sua senha"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          autoComplete="password"
          onSubmitEditing={handleSignIn}
          className="mb-6 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800"
        />

        <TouchableOpacity
          onPress={handleSignIn}
          disabled={loading}
          activeOpacity={0.8}
          accessibilityRole="button"
          className={`mb-3 items-center rounded-xl py-4 ${
            loading ? 'bg-indigo-300' : 'bg-indigo-600'
          }`}
        >
          <Text className="text-base font-bold text-white">
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        {isGoogleSignInConfigured() && (
          <>
            <Text className="my-3 text-center text-xs text-gray-400">ou</Text>
            <GoogleSignInButton disabled={loading} />
          </>
        )}

        <View className="mt-6 flex-row justify-center">
          <Text className="text-sm text-gray-500">Não tem conta? </Text>
          {/* replace: o voltar não alterna entre login e cadastro */}
          <Link href="/register" replace asChild>
            <TouchableOpacity disabled={loading}>
              <Text className="text-sm font-semibold text-indigo-600">
                Criar conta
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
