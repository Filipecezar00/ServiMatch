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
import { useNavigation } from "@react-navigation/native";
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

  const navigation = useNavigation();

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
