import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as TaskRepository from '../src/database/taskRepository';

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id; // true se /form?id=5, false se apenas /form
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  // Ao editar, carrega os dados atuais da tarefa
  useEffect(() => {
    if (!id) {
      return;
    }

    let active = true;

    (async () => {
      try {
        const task = await TaskRepository.getTaskById(Number(id));
        if (!active) {
          return;
        }
        if (task) {
          setTitle(task.title);
          setDescription(task.description ?? '');
        } else {
          Alert.alert('Tarefa não encontrada', 'Ela pode ter sido excluída.');
          router.back();
        }
      } catch (error) {
        console.error('Erro ao carregar a tarefa:', error);
        if (active) {
          Alert.alert('Erro', 'Não foi possível carregar a tarefa.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [id, router]);

  async function handleSave() {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      Alert.alert('Título obrigatório', 'Digite um título para a tarefa.');
      return;
    }

    const trimmedDescription = description.trim();
    const finalDescription =
      trimmedDescription.length === 0 ? null : trimmedDescription;

    try {
      setSaving(true);
      if (isEditing) {
        await TaskRepository.updateTask({
          id: Number(id),
          title: trimmedTitle,
          description: finalDescription,
        });
      } else {
        await TaskRepository.createTask({
          title: trimmedTitle,
          description: finalDescription,
        });
      }
      router.back();
    } catch (error) {
      console.error('Erro ao salvar a tarefa:', error);
      Alert.alert('Erro', 'Não foi possível salvar a tarefa.');
      setSaving(false);
    }
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
      contentContainerStyle={{ padding: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen
        options={{ title: isEditing ? 'Editar Tarefa' : 'Nova Tarefa' }}
      />

      <Text className="mb-2 text-sm font-semibold text-gray-700">Título *</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Ex.: Estudar para a prova"
        placeholderTextColor="#9ca3af"
        maxLength={100}
        className="mb-5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800"
      />

      <Text className="mb-2 text-sm font-semibold text-gray-700">
        Descrição
      </Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Detalhes da tarefa (opcional)"
        placeholderTextColor="#9ca3af"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        maxLength={500}
        className="mb-8 h-28 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800"
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
          {saving ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar tarefa'}
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
