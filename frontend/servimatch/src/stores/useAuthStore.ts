import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthState } from "../types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      token: null,

      login: (usuario, token) => set({ usuario, token }),
      register: (usuario) => set({ usuario }),
      logout: () => set({ usuario: null, token: null }),
    }),
    {
      name: "@auth_store",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
