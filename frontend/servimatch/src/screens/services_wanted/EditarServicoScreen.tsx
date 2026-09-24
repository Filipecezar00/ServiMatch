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
import { View, Text, Pressable, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
}
