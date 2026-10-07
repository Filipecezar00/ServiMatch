import { useQuery } from "@tanstack/react-query";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { listarCategorias } from "../api/serviceWanted";
import { BuscarServicoOffered } from "../api/serviceOffered";
import { useAuthStore } from "../stores/useAuthStore";
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
  const [termoBusca, setTermoBusca] = useState("");
  const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState<
    number | null
  >(null);
  const [termoDebounced, setTermoDebounced] = useState("");
  const navigation = useNavigation();

  const logout = useAuthStore((state) => state.logout);
  useEffect(() => {
    const temporizador_debounce = setTimeout(() => {
      setTermoDebounced(termoBusca);
    }, 400);
    return () => {
      clearTimeout(temporizador_debounce);
    };
  }, [termoBusca]);

  const { data: servicos, isLoading: isLoadingServicos } = useQuery({
    queryKey: [
      "listarServicosProcurados",
      termoDebounced,
      categoriaSelecionadaId,
    ],
    queryFn: () => BuscarServicoOffered(termoDebounced, categoriaSelecionadaId),
  });

  const handleOptionsDetails = (id: number) => {
    navigation.navigate("DetalhesServico", { id });
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError) {
    return (
      <View>
        <Text>{error.message}</Text>

        <Pressable onPress={logout}>
          <Text>Deslogar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={servicos}
      keyExtractor={(item) => item?.id?.toString() ?? String(Math.random())}
      ListEmptyComponent={() => {
        return isLoadingServicos ? (
          <ActivityIndicator />
        ) : (
          <Text>Nenhum serviço encontrado</Text>
        );
      }}
      ListHeaderComponent={
        <View>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              placeholder="Procurar Serviço"
              value={termoBusca}
              onChangeText={setTermoBusca}
            ></TextInput>
            <MaterialCommunityIcons name="magnify" size={24} />
          </View>

          <FlatList
            data={categorias}
            horizontal={true}
            keyExtractor={(item) =>
              item?.id?.toString() ?? String(Math.random())
            }
            renderItem={({ item }) => {
              const isSelected = Number(categoriaSelecionadaId) === item.id;
              return (
                <View
                  style={{
                    backgroundColor: isSelected ? "#007Aff" : "#e5e5ea",
                    borderColor: isSelected ? "#0056b3" : "#c7c7cc",
                  }}
                >
                  <Pressable
                    onPress={() =>
                      Number(categoriaSelecionadaId) === Number(item.id)
                        ? setCategoriaSelecionadaId(null)
                        : setCategoriaSelecionadaId(item.id)
                    }
                  >
                    <Text>{item.nome}</Text>
                  </Pressable>
                </View>
              );
            }}
          />
          <Text>Serviços localizados:</Text>
        </View>
      }
      renderItem={({ item }) => {
        return (
          <Pressable
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            onPress={() => handleOptionsDetails(item.id)}
          >
            <View>
              <Text>{item.titulo}</Text>
              <Text>{item.descricao}</Text>
            </View>
          </Pressable>
        );
      }}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
    />
  );
}
