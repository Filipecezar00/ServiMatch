import { useQuery } from "@tanstack/react-query";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useAuthStore } from "../stores/useAuthStore";
import { getHome } from "../api/service";
export function HomeScreen() {
  const logout = useAuthStore((state) => state.logout);

  const {
    data: servicos,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["homeAtivos"],
    queryFn: getHome,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError) {
    return (
      <View>
        <Text>{error.message}</Text>
        <Pressable onPress={() => refetch()}>
          <Text>Fechar erro</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={servicos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>
            {item.nome} - {item.descricao}
          </Text>
        )}
      />
      <Pressable onPress={() => logout()}>
        <Text>Sair</Text>
      </Pressable>
    </View>
  );
}
