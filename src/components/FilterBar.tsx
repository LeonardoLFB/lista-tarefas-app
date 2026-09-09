import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TaskFilter } from '../types/task';

interface FilterBarProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  allCount: number;
  pendingCount: number;
  completedCount: number;
}

// Exibe três botões: Todas, Pendentes e Concluídas.
// O botão ativo fica com fundo índigo e texto branco.
export function FilterBar({
  filter,
  onFilterChange,
  allCount,
  pendingCount,
  completedCount,
}: FilterBarProps) {
  const options: { value: TaskFilter; label: string; count: number }[] = [
    { value: 'all', label: 'Todas', count: allCount },
    { value: 'pending', label: 'Pendentes', count: pendingCount },
    { value: 'completed', label: 'Concluídas', count: completedCount },
  ];

  return (
    <View className="flex-row border-b border-gray-200 bg-white px-3 py-3">
      {options.map((option) => {
        const isActive = filter === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onFilterChange(option.value)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className={`mx-1 flex-1 rounded-full py-2 ${
              isActive ? 'bg-indigo-600' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-center text-xs font-semibold ${
                isActive ? 'text-white' : 'text-gray-600'
              }`}
            >
              {option.label} ({option.count})
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
