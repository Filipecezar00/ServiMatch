import { useQuery, useMutation } from "@tanstack/react-query";
import { obterServicoWantedId } from "../../api/serviceWanted";
import { useState, useEffect } from "react";
import { RouteProp } from "@react-navigation/native";
import { ServicoEditado } from "../../types/service";
import { useRoute } from "@react-navigation/native";
import { ServiceStackParamList } from "../../navigation/ServicesStack";

export function EditarServico() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  type EditarServicoWantedRouter = RouteProp<
    ServiceStackParamList,
    "EditarServicoProcurado"
  >;
  const route = useRoute<EditarServicoWantedRouter>();
  const { id } = route.params;

  const { data: categorias } = useQuery({
    queryKey: ["servicoWanted", id],
    queryFn: () => obterServicoWantedId(id),
    enabled: !!id,
  });
}
