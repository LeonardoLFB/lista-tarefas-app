import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { File, Paths } from 'expo-file-system';
import { useProfile } from '../src/hooks/useProfile';
import { CameraCapture } from '../src/components/CameraCapture';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, loading, saveProfile } = useProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [saving, setSaving] = useState(false);

  // Preenche o formulário com o perfil salvo assim que ele carregar
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhotoUri(profile.photoUri);
    }
  }, [profile]);

  async function handleCapture(tempUri: string) {
    try {
      // O uri da câmera fica no cache, que o sistema pode apagar.
      // Copiamos para Paths.document, que é permanente.
      const destino = new File(Paths.document, `perfil-${Date.now()}.jpg`);
      await new File(tempUri).copy(destino);

      // Se já havia uma foto tirada agora e ainda não salva, ela não serve mais
      if (photoUri && photoUri !== profile?.photoUri) {
        const rascunho = new File(photoUri);
        if (rascunho.exists) {
          rascunho.delete();
        }
      }

      setPhotoUri(destino.uri);
    } catch (error) {
      console.error('Erro ao salvar a foto:', error);
      Alert.alert('Erro', 'Não foi possível salvar a foto.');
    } finally {
      setShowCamera(false);
    }
  }

  async function handleSave() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length === 0) {
      Alert.alert('Nome obrigatório', 'Digite seu nome.');
      return;
    }
    if (trimmedEmail.length > 0 && !EMAIL_REGEX.test(trimmedEmail)) {
      Alert.alert('Email inválido', 'Confira o email digitado.');
      return;
    }

    try {
      setSaving(true);
      await saveProfile({ name: trimmedName, email: trimmedEmail, photoUri });
      router.back();
    } catch (error) {
      console.error('Erro ao salvar o perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar o perfil.');
      setSaving(false);
    }
  }

  // A câmera troca a tela inteira (e esconde o header enquanto está aberta)
  if (showCamera) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <CameraCapture
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      </>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerClassName="p-4"
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen options={{ headerShown: true }} />

      {/* Foto de perfil */}
      <View className="mb-8 mt-4 items-center">
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            className="mb-4 h-40 w-40 rounded-full"
          />
        ) : (
          <View className="mb-4 h-40 w-40 items-center justify-center rounded-full bg-gray-200">
            <Text className="text-5xl">👤</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => setShowCamera(true)}
          disabled={saving}
          activeOpacity={0.8}
          accessibilityRole="button"
          className="rounded-lg bg-indigo-100 px-5 py-2"
        >
          <Text className="font-semibold text-indigo-700">
            {photoUri ? '📷 Trocar foto' : '📷 Tirar foto'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="mb-2 text-sm font-semibold text-gray-700">Nome *</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Seu nome"
        placeholderTextColor="#9ca3af"
        autoCapitalize="words"
        maxLength={80}
        className="mb-5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800"
      />

      <Text className="mb-2 text-sm font-semibold text-gray-700">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="voce@exemplo.com"
        placeholderTextColor="#9ca3af"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={120}
        className="mb-8 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800"
      />

      <TouchableOpacity
        onPress={handleSave}
        disabled={saving}
        activeOpacity={0.8}
        accessibilityRole="button"
        className={`items-center rounded-xl py-4 ${
          saving ? 'bg-indigo-300' : 'bg-indigo-600'
        }`}
      >
        <Text className="text-base font-bold text-white">
          {saving ? 'Salvando...' : 'Salvar perfil'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        disabled={saving}
        activeOpacity={0.7}
        accessibilityRole="button"
        className="mt-3 items-center py-3"
      >
        <Text className="text-sm font-semibold text-gray-500">Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
