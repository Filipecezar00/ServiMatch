import { useQuery } from "@tanstack/react-query";
import {
  listaPropostasEnviadas,
  listaPropostasRecebidas,
} from "../../api/exchangeProposals";

export function listarExchangesProposals() {
  const {
    data: propostasRecebidas,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["PropostasRecebidas"],
    queryFn: listaPropostasRecebidas,
  });

  const {
    data: propostasEnviadas,
    isError: erroPropostaEnviada,
    isLoading: carregamentoPropostaEnviada,
  } = useQuery({
    queryKey: ["PropostasEnviadas"],
    queryFn: listaPropostasEnviadas,
  });
}
