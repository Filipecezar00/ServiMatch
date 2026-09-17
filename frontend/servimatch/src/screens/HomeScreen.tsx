import { useQuery } from "@tanstack/react-query";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useAuthStore } from "../stores/useAuthStore";
import getHome from "../api/auth";
export function HomeScreen() {
  const logout = useAuthStore((state) => state.logout);

  const {
    data: usuario,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["perfilUsuario"],
    queryFn: getHome,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError) {
    return (
      <View>
        <Text>{error.message}</Text>
        <Pressable onPress={refetch}>Fechar erro</Pressable>
      </View>
    );
  }

  return (
    <View>
      <Text>Bem vindo, {usuario?.nome}</Text>
      <Text>Email: {usuario?.email}</Text>
      <Pressable onPress={logout}>
        <Text>Sair</Text>
      </Pressable>
    </View>
  );
}
