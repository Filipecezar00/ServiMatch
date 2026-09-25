import { useQuery } from "@tanstack/react-query";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
  TextInput,
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
      ListHeaderComponent={() => (
        <View>
          <View>
            <TextInput
              placeholder="Procurar Serviço"
              value={termoBusca}
              onChangeText={setTermoBusca}
            >
              <MaterialCommunityIcons name="magnify" size={24} />
            </TextInput>
          </View>
          <Text>Serviços localizados:</Text>
        </View>
      )}
      renderItem={({ item }) => {
        const isSelected = categoriaSelecionadaId === item.id;
        return (
          <View
            style={{
              backgroundColor: isSelected ? "#007Aff" : "#e5e5ea",
              borderColor: isSelected ? "#0056b3" : "#c7c7cc",
            }}
          >
            <Text>{item.titulo}</Text>
            <Text>{item.descricao}</Text>
          </View>
        );
      }}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    />
  );
}
