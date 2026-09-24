import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { criarServicoWanted, listarCategorias } from "../../api/serviceWanted";
import { CriarServico } from "../../types/service";
import { useState } from "react";
import { extractErrorMessage } from "../../api/utils";

export async function criarServico() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [erroLocal, setErroLocal] = useState("");

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

      navigation.back();
    },
    onError: (erro: string) => {
      setErroLocal(erro);
    },
  });

  const handleSubmit = () => {
    setErroLocal("");

    if (!titulo || titulo.length < 5) {
      return setErroLocal(
        "O campo de titulo deve possuir no mínimo cinco caracteres",
      );
    }

    if (!descricao || descricao.length < 10) {
      return setErroLocal(
        "O campo de descrição deve possuir no mínimo dez caracteres",
      );
    }

    if (!categoryId) {
      return setErroLocal("Preencha uma categoria antes de criar o Serviço");
    }

    mutate({ titulo, descricao, categoryId: categoryId });
  };

  return <View></View>;
}
