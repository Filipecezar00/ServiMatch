import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { criarServico, listarCategorias } from "../api/serviceOffered";
import {
  Pressable,
  View,
  Text,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export function CriarServicoScreen() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erroLocal, setErroLocal] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const navigation = useNavigation();

  const {
    data: categorias,
    isLoading,
    isError: isErrorCategorias,
  } = useQuery({
    queryKey: ["listarCategorias"],
    queryFn: listarCategorias,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: criarServico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homeAtivos"] });

      navigation.navigate("Home");
    },
  });

  function handleSubmit() {
    setErroLocal("");
    if (!titulo.trim() || titulo.trim().length < 5) {
      return setErroLocal("Preencha o Campo de titulo");
    }

    if (!descricao.trim() || descricao.trim().length < 10) {
      return setErroLocal("Preencha o Campo de descrição");
    }

    if (categoryId === null) {
      return setErroLocal("Preencha uma categoria antes de criar o Serviço");
    }

    mutate({ titulo, descricao, categoriaId: categoryId });
  }

  return (
    <View>
      {isError && <Text>{error?.message}</Text>}
      {erroLocal && <Text>{erroLocal}</Text>}
      <Text>Titulo do Serviço</Text>
      <TextInput
        placeholder="Digite o Titulo"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text>Descrição do Serviço</Text>
      <TextInput
        placeholder="Digite a Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text>Categorias Disponiveis</Text>
      <View>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          categorias?.map((categoria) => {
            const isSelected = categoria.id === categoryId;
            return (
              <View key={categoria.id}>
                <Pressable onPress={() => setCategoryId(categoria.id)}>
                  <Text>{categoria.nome}</Text>
                </Pressable>
              </View>
            );
          })
        )}
      </View>

      <Pressable onPress={handleSubmit} disabled={isPending}>
        {isPending ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text>Cadastrar Serviço</Text>
        )}
      </Pressable>
    </View>
  );
}
