import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuthContext } from '../src/contexts/AuthContext';
import { useTasks } from '../src/hooks/useTasks';
import { TaskItem } from '../src/components/TaskItem';
import { FilterBar } from '../src/components/FilterBar';
import { EmptyState } from '../src/components/EmptyState';

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthContext();
  const {
    tasks,
    filter,
    loading,
    allTasksCount,
    pendingCount,
    completedCount,
    setFilter,
    toggleTask,
    removeTask,
  } = useTasks();

  // Botão 👤 no header. Fica aqui (e não no _layout.tsx) porque o
  // headerRight precisa do router desta tela.
  const header = (
    <Stack.Screen
      options={{
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Abrir meu perfil"
            className="px-2"
          >
            <Text className="text-2xl">👤</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );

  // Não navegamos depois do signOut: o _layout leva para o login sozinho
  function confirmSignOut() {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          signOut().catch(() =>
            Alert.alert('Erro', 'Não foi possível sair. Tente de novo.'),
          );
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        {header}
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-3 text-sm text-gray-500">
          Carregando tarefas...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {header}

      {/* Usuário logado + logout */}
      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
        <Text className="mr-3 flex-1 text-sm text-gray-600" numberOfLines={1}>
          Olá, <Text className="font-semibold">{user?.email}</Text>
        </Text>
        <TouchableOpacity
          onPress={confirmSignOut}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
          className="rounded-lg px-3 py-1"
        >
          <Text className="text-sm font-semibold text-red-600">Sair</Text>
        </TouchableOpacity>
      </View>

      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        allCount={allTasksCount}
        pendingCount={pendingCount}
        completedCount={completedCount}
      />

      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={toggleTask} onDelete={removeTask} />
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 96,
          flexGrow: 1,
        }}
        ListEmptyComponent={<EmptyState filter={filter} />}
      />

      {/* Botão flutuante para criar uma nova tarefa */}
      <TouchableOpacity
        onPress={() => router.push('/form')}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Adicionar nova tarefa"
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-indigo-600 shadow-lg"
      >
        <Text className="text-3xl leading-9 text-white">+</Text>
      </TouchableOpacity>
    </View>
  );
}
