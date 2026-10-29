import '../global.css'; // ⚠️ Deve ser a primeira importação!
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuthContext } from '../src/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

// Componente separado porque useAuthContext() só funciona DENTRO do AuthProvider
function RootLayoutNav() {
  const { user, loading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  // Proteção de rotas: quem não está logado não entra;
  // quem está logado não volta para login/cadastro.
  // replace (e não push) para o botão voltar não levar à tela proibida.
  useEffect(() => {
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, loading, segments, router]);

  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#4f46e5' },
          headerTintColor: '#ffffff',
        }}
      >
        <Stack.Screen name="index" options={{ title: '📋 Minhas Tarefas' }} />
        <Stack.Screen name="form" options={{ title: 'Nova Tarefa' }} />
        <Stack.Screen name="profile" options={{ title: '👤 Meu Perfil' }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>

      {/* Cobre a tela enquanto o Firebase restaura a sessão (evita o "flash" de login) */}
      {loading && (
        <View className="absolute inset-0 items-center justify-center bg-gray-50">
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      )}
    </View>
  );
}
