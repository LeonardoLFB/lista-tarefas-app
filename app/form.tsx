import { useLocalSearchParams, useNavigation } from 'expo-router';

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id; // true se /form?id=5, false se apenas /form
  // ...
}