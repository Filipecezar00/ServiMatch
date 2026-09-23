import { useMutation, useQuery } from "@tanstack/react-query";
import { criarServicoWanted, listarCategorias } from "../../api/serviceWanted";
import { CriarServico } from "../../types/service";
import { useState } from "react";

export async function criarServico() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [erroLocal, setErroLocal] = useState("");
}
