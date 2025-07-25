import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

interface User {
  id: string;
  name?: string;
  email?: string;
  // Ajoute d'autres champs si besoin
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  login: (user, token) => {
    AsyncStorage.setItem("token", token);
    set({ isAuthenticated: true, user, token });
  },
  logout: () => {
    AsyncStorage.removeItem("token");
    set({ isAuthenticated: false, user: null, token: null });
  },
  hydrate: async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      // Optionnel : récupérer le profil utilisateur ici si besoin
      set({ isAuthenticated: true, token });
    }
  },
}));

// Hook pour hydrater automatiquement le store au lancement de l'app
export function useHydrateAuth() {
  const hydrate = useAuthStore((state) => state.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
}
