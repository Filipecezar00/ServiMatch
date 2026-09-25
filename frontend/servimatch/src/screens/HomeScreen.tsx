import { useQuery } from "@tanstack/react-query";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
// import { getHome } from "../api/serviceOffered";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { listarCategorias, listarServicoWanted } from "../api/serviceWanted";
export function HomeScreen() {
  const {
    data: categorias,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["ListarCategorias"],
    queryFn: listarCategorias,
  });

  const { data: servicos } = useQuery({
    queryKey: ["listarServicosProcurados"],
    queryFn: listarServicoWanted,
  });

  const [termoBusca, setTermoBusca] = useState("");
  const [categoriaSelecionadaId, setCategoriaSelecionadaId] =
    useState<Number | null>(null);
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
    <FlatList
      data={servicos}
      renderItem={({ item }) => (
        <View>
          <Text>{item.titulo}</Text>
          <Text>{item.descricao}</Text>
        </View>
      )}
      ListHeaderComponent={() => (
        <View>
          <Text>Serviços localizados: </Text>
        </View>
      )}
    />
  );
}
