import React from "react";
import { View, FlatList, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTasks } from "../src/hooks/useTasks";
// ... componentes

export default function HomeScreen() {
  const { tasks, filter, loading, ... } = useTasks(); // Toda a lógica está no hook!
  // A tela só renderiza a UI com os dados que o hook fornece
}