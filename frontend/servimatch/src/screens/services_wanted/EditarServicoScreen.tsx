import {
  useQuery,
  useMutation,
  useQueryClient,
  dataTagErrorSymbol,
} from "@tanstack/react-query";
import {
  editarServicoWanted,
  obterServicoWantedId,
  listarCategorias,
} from "../../api/serviceWanted";
import { useState, useEffect } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { ServiceStackParamList } from "../../navigation/ServicesStack";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";

export function EditarServico() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [erroLocal, setErroLocal] = useState("");

  type EditarServicoWantedRouter = RouteProp<
    ServiceStackParamList,
    "EditarServicoProcurado"
  >;
  const route = useRoute<EditarServicoWantedRouter>();
  const { id } = route.params;
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const {
    data: categorias,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["listarCategorias"],
    queryFn: listarCategorias,
    staleTime: 1000 * 60 * 5,
  });

  const { data: servico } = useQuery({
    queryKey: ["servicoWanted", id],
    queryFn: () => obterServicoWantedId(id),
    enabled: !!id,
  });

  const { mutate } = useMutation({
    mutationKey: ["editarServicoWanted"],
    mutationFn: editarServicoWanted,

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
      return setErroLocal("Preencha uma categoria antes de criar o serviço");
    }

    mutate({ id, titulo, descricao, categoryId: categoryId });
  };

  useEffect(() => {
    if (servico) {
      setTitulo(servico.titulo);
      setDescricao(servico.descricao);
      setCategoryId(servico.categoryId);
    }
  }, [servico]);
  return (
    <View>
      {erroLocal && (
        <View>
          <Text>Erro ao Editar serviço: {erroLocal}</Text>
        </View>
      )}

      <View>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={18} />
          <Text>Voltar</Text>
        </Pressable>
      </View>

      <Text>Editar Titulo</Text>
      <TextInput
        placeholder="Digite o titulo"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text>Editar a Descrição</Text>
      <TextInput
        placeholder="Digite a Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text>Editar Categoria</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        categorias?.map((categoria) => {
          const isSelected = categoria.id === categoryId;
          return (
            <View
              key={categoria.id}
              style={{
                backgroundColor: isSelected ? "#007Aff" : "#e5e5ea",
                borderColor: isSelected ? "#0056b3" : "#c7c7cc",
              }}
            >
              <Text>{categoria.nome}</Text>
              <Pressable onPress={() => setCategoryId(categoryId)}>
                <Text>Escolher Categoria</Text>
              </Pressable>
            </View>
          );
        })
      )}
    </View>
  );
}
