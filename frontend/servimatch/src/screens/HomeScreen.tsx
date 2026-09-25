import { useQuery } from "@tanstack/react-query";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { getHome } from "../api/serviceOffered";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export function HomeScreen() {
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
          <Text>Tentar Novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <Pressable onPress={() => navigation.navigate("CriarServicoProcurado")}>
        <MaterialCommunityIcons name="plus" />
        <Text>Criar Serviço desejado</Text>
      </Pressable>
      <Text>Principais serviços</Text>
      <FlatList
        data={servicos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.titulo} - {item.descricao} - {item.prestador_nome} -{" "}
            {item.categoria}
          </Text>
        )}
      />
    </View>
  );
}
