import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface CameraCaptureProps {
  onCapture: (uri: string) => void;
  onClose: () => void;
}

// Abre a câmera tratando os três estados da permissão.
// O componente não sabe o que fazer com a foto: só devolve o uri via onCapture.
export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [taking, setTaking] = useState(false);

  // Estado 1 — ainda consultando o sistema
  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Verificando permissões...</Text>
      </View>
    );
  }

  // Estado 2 — negada. Se o usuário negou permanentemente, o sistema não
  // pergunta de novo: a única saída é abrir os Ajustes do aparelho.
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black p-8">
        <Text className="mb-4 text-6xl">📷</Text>
        <Text className="mb-6 text-center text-white">
          Precisamos da câmera para você tirar sua foto de perfil.
        </Text>
        <TouchableOpacity
          className="rounded-lg bg-indigo-600 px-6 py-3"
          onPress={
            permission.canAskAgain ? requestPermission : Linking.openSettings
          }
        >
          <Text className="font-bold text-white">
            {permission.canAskAgain ? 'Conceder permissão' : 'Abrir ajustes'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-4 py-2" onPress={onClose}>
          <Text className="text-gray-400">Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Estado 3 — liberada
  async function tirarFoto() {
    if (taking) {
      return;
    }
    try {
      setTaking(true);
      const foto = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
      if (foto?.uri) {
        onCapture(foto.uri);
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
    } finally {
      setTaking(false);
    }
  }

  return (
    <View className="flex-1 bg-black">
      {/* CameraView usa style: componentes de terceiros nem sempre aceitam className */}
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />

      <View className="flex-row items-center justify-around bg-black py-6">
        <TouchableOpacity onPress={onClose} accessibilityRole="button">
          <Text className="text-lg text-white">Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={tirarFoto}
          disabled={taking}
          accessibilityRole="button"
          accessibilityLabel="Tirar foto"
          className={`h-20 w-20 rounded-full border-4 border-gray-400 ${
            taking ? 'bg-gray-400' : 'bg-white'
          }`}
        />

        {/* Espaçador para manter o botão de captura centralizado */}
        <View className="w-16" />
      </View>
    </View>
  );
}
