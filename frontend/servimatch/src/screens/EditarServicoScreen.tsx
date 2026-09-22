import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { listarCategorias } from "../api/serviceOffered";
import { ServiceStackParamList } from "../navigation/ServicesStack";
export function EditarServico() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erroLocal, setErroLocal] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | null>(null);

  const navigation = useNavigation();

  const { data: categorias, isLoading } = useQuery({
    queryKey: ["listarCategorias"],
    queryFn: listarCategorias,
    staleTime: 1000 * 60 * 5,
  });

  type EditarServicoRouteProp = RouteProp<
    ServiceStackParamList,
    "EditarServico"
  >;

  const route = useRoute<EditarServicoRouteProp>();
  const { categoryId } = route.params;

  //   const {} = useQuery({
  //     queryKey: [categoryId],
  //     queryFn:
  //   });

  const handleSubmit = () => {
    setErroLocal("");
    if (!titulo || titulo.trim().length < 5) {
      return setErroLocal(
        "O campo de titulo deve possuir no mínimo cinco caracteres",
      );
    }
    if (!descricao || descricao.trim().length < 10) {
      return setErroLocal(
        "O campo de descrição deve possuir no mínimo dez caracteres",
      );
    }

    if (categoriaId == null) {
      return setErroLocal("Preencha uma categoria antes de criar o Serviço");
    }
  };

  return (
    <View>
      {erroLocal && (
        <View>
          <Text>Erro ao editar serviço: {erroLocal}</Text>
        </View>
      )}
      <View>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={18} />
          <Text>Voltar</Text>
        </Pressable>
      </View>
      <Text>Editar titulo</Text>
      <TextInput
        placeholder="Digite o titulo"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text>Editar descrição</Text>
      <TextInput
        placeholder="Digite a descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text>Editar Categoria</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          {categorias?.map((categoria) => {
            const isSelected = categoria.id === categoryId;
            return (
              <View
                key={categoria.id}
                style={{
                  backgroundColor: isSelected ? "#007AFF" : "#e5e5ea",
                  borderColor: isSelected ? "#0056b3" : "#c7c7cc",
                }}
              >
                <Pressable onPress={() => setCategoriaId(categoria.id)}>
                  <Text>{categoria.nome}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
      <Pressable onPress={handleSubmit} disabled={isLoading}>
        <Text>
          {isLoading ? <ActivityIndicator /> : <Text>Editar Serviço</Text>}
        </Text>
      </Pressable>
    </View>
  );
}
