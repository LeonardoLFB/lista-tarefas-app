import { useState, useEffect, useCallback } from 'react';
import { File } from 'expo-file-system';
import * as ProfileRepository from '../database/profileRepository';
import { UserProfile, SaveProfileInput } from '../types/profile';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega o perfil do banco (null se ainda não foi salvo nenhuma vez)
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ProfileRepository.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Salva o perfil e apaga do disco a foto antiga, se ela foi trocada
  const saveProfile = useCallback(
    async (input: SaveProfileInput) => {
      const oldPhotoUri = profile?.photoUri ?? null;
      await ProfileRepository.saveProfile(input);

      if (oldPhotoUri && oldPhotoUri !== input.photoUri) {
        try {
          const oldPhoto = new File(oldPhotoUri);
          if (oldPhoto.exists) {
            oldPhoto.delete();
          }
        } catch (error) {
          console.warn('Não foi possível apagar a foto antiga:', error);
        }
      }

      await loadProfile();
    },
    [profile, loadProfile],
  );

  return {
    profile,
    loading,
    saveProfile,
  };
}
