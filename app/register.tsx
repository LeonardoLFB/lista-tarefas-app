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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6; // mínimo exigido pelo Firebase

export default function RegisterScreen() {
  const { signUp } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    const trimmedEmail = email.trim();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      Alert.alert('Email inválido', 'Confira o email digitado.');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      Alert.alert(
        'Senha fraca',
        `A senha precisa ter ao menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Senhas diferentes', 'A confirmação não bate com a senha.');
      return;
    }

    try {
      setLoading(true);
      await signUp(trimmedEmail, password);
      // O Firebase já deixa o usuário logado após o cadastro;
      // o _layout percebe e leva para a lista.
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : 'Não foi possível criar a conta.';
      Alert.alert('Erro ao criar conta', message);
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
        <Text className="mb-1 text-center text-3xl font-bold text-indigo-600">
          Criar conta
        </Text>
        <Text className="mb-8 text-center text-sm text-gray-500">
          Leva menos de um minuto
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
          placeholder={`Ao menos ${MIN_PASSWORD_LENGTH} caracteres`}
          placeholderTextColor="#9ca3af"
          secureTextEntry
          autoComplete="new-password"
          className="mb-4 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800"
        />

        <Text className="mb-2 text-sm font-semibold text-gray-700">
          Confirmar senha
        </Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repita a senha"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          autoComplete="new-password"
          onSubmitEditing={handleSignUp}
          className="mb-6 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800"
        />

        <TouchableOpacity
          onPress={handleSignUp}
          disabled={loading}
          activeOpacity={0.8}
          accessibilityRole="button"
          className={`items-center rounded-xl py-4 ${
            loading ? 'bg-indigo-300' : 'bg-indigo-600'
          }`}
        >
          <Text className="text-base font-bold text-white">
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Text>
        </TouchableOpacity>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-sm text-gray-500">Já tem conta? </Text>
          <Link href="/login" replace asChild>
            <TouchableOpacity disabled={loading}>
              <Text className="text-sm font-semibold text-indigo-600">
                Entrar
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
