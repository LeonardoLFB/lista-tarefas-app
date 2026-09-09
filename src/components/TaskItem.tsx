import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, currentCompleted: number) => void;
  onDelete: (id: number) => void;
}

// Formata a data ISO do banco no padrão brasileiro: 09/09/2026 às 14:30
function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (value: number) => String(value).padStart(2, '0');
  const dia = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  const hora = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return `${dia} às ${hora}`;
}

// Exibe: checkbox, título, descrição, data, botões editar/excluir
export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const router = useRouter();
  const isCompleted = task.completed === 1;

  function confirmDelete() {
    Alert.alert(
      'Excluir tarefa',
      `Deseja realmente excluir "${task.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => onDelete(task.id),
        },
      ],
    );
  }

  return (
    <View className="mb-3 flex-row items-start rounded-xl bg-white p-4 shadow-sm">
      {/* Checkbox */}
      <TouchableOpacity
        onPress={() => onToggle(task.id, task.completed)}
        activeOpacity={0.7}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isCompleted }}
        className={`mr-3 mt-0.5 h-6 w-6 items-center justify-center rounded-md border-2 ${
          isCompleted ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
        }`}
      >
        {isCompleted && (
          <Text className="text-xs font-bold text-white">✓</Text>
        )}
      </TouchableOpacity>

      {/* Título, descrição e data */}
      <View className="flex-1">
        <Text
          className={`text-base font-semibold ${
            isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
          }`}
        >
          {task.title}
        </Text>

        {task.description ? (
          <Text
            className={`mt-1 text-sm ${
              isCompleted ? 'text-gray-300 line-through' : 'text-gray-500'
            }`}
          >
            {task.description}
          </Text>
        ) : null}

        <Text className="mt-2 text-xs text-gray-400">
          {formatDate(task.createdAt)}
        </Text>
      </View>

      {/* Botões editar / excluir */}
      <View className="ml-2 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.push(`/form?id=${task.id}`)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Editar tarefa ${task.title}`}
          className="p-2"
        >
          <Text className="text-lg">✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={confirmDelete}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Excluir tarefa ${task.title}`}
          className="p-2"
        >
          <Text className="text-lg">🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
