import React from "react";
import { View, Text, Pressable } from "react-native";
import { useAuthStore } from "../stores/useAuthStore";

export function HomeScreen() {
  const logout = useAuthStore((state) => state.logout);
  return (
    <View>
      <Text>Tela Home</Text>
      <Pressable onPress={logout}>
        <Text>Sair</Text>
      </Pressable>
    </View>
  );
}
