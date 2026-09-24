import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { criarServicoWanted, listarCategorias } from "../../api/serviceWanted";
import { useState } from "react";
import {
  Pressable,
  View,
  Text,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export function criarServico() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [erroLocal, setErroLocal] = useState("");

  const navigation = useNavigation();

  const queryClient = useQueryClient();
  const {
    data: categorias,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listarCategorias"],
    queryFn: listarCategorias,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: criarServicoWanted,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listarServicosProcurados"] });

      navigation.goBack();
    },
    onError: (erro: Error) => {
      setErroLocal(erro.message);
    },
  });

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

    if (!categoryId) {
      return setErroLocal("Preencha uma categoria antes de criar o Serviço");
    }

    mutate({ titulo, descricao, categoryId: categoryId });
  };

  return (
    <View>
      <View>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={18} />
          <Text>Voltar</Text>
        </Pressable>
      </View>
      {erroLocal.length > 0 && <Text>{erroLocal}</Text>}

      <Text>Titulo do Serviço</Text>
      <TextInput
        placeholder="Digite o titulo"
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
              <View
                key={categoria.id}
                style={{
                  backgroundColor: isSelected ? "#007AFF" : "#e5e5ea",
                  borderColor: isSelected ? "#0056b3" : "#c7c7cc",
                }}
              >
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
