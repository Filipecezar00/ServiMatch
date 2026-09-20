import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listaMeusServicos, editarStatusServico } from "../api/serviceOffered";
import { Alert } from "react-native";

export function MeusServicos() {
  const queryClient = useQueryClient();
  const {
    data: servicos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["Meus-servicos"],
    queryFn: () => listaMeusServicos(),
  });

  const { mutate } = useMutation({
    mutationFn: editarStatusServico,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["Meus-servicos"] });
    },
    onError(erro) {
      Alert.alert("Erro ao editar status:", erro.message);
    },
  });

  const handleSubmit = (id: number, statusAtual: boolean) => {
    mutate({ id, ativo: !statusAtual });
  };
}
