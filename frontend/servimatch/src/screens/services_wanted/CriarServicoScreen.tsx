import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { criarServicoWanted, listarCategorias } from "../../api/serviceWanted";
import { CriarServico } from "../../types/service";
import { useState } from "react";

export async function criarServico() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [erroLocal, setErroLocal] = useState("");

  const queryClient = useQueryClient();
  const { isLoading } = useQuery({
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
}
