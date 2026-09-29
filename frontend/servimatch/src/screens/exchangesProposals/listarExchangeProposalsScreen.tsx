import { useQuery } from "@tanstack/react-query";
import {
  listaPropostasEnviadas,
  listaPropostasRecebidas,
} from "../../api/exchangeProposals";
import { useState } from "react";
import { Pressable, View, Text, FlatList } from "react-native";
import {
  PropostaCardEnviada,
  PropostaCardRecebida,
} from "../../components/PropostaCard";

export function MinhasPropostasScreen() {
  const [abaAtiva, setAbaAtiva] = useState<"recebidas" | "oferecidas">(
    "recebidas",
  );
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

  return (
    <View>
      <Pressable onPress={() => setAbaAtiva("recebidas")}>
        <Text>Recebidas</Text>
      </Pressable>
      <Pressable onPress={() => setAbaAtiva("oferecidas")}>
        <Text>Oferecidas</Text>
      </Pressable>

      {abaAtiva == "oferecidas" ? (
        <FlatList
          data={propostasEnviadas}
          keyExtractor={(item) => String(item?.id)}
          renderItem={({ item }) => {
            return (
              <PropostaCardEnviada
                id={item.id}
                outro_usuario_nome={item.outro_usuario_nome}
                mensagem={item.mensagem}
                status={item.status}
                servico_desejado_titulo={item.servico_desejado_titulo}
                servico_oferecido_titulo={item.servico_oferecido_titulo}
                titulo={item.titulo}
                created_at={item.created_at}
              />
            );
          }}
        />
      ) : (
        <FlatList
          data={propostasRecebidas}
          keyExtractor={(item) => String(item?.id)}
          renderItem={({ item }) => {
            return (
              <PropostaCardRecebida
                id={item.id}
                outro_usuario_nome={item.outro_usuario_nome}
                mensagem={item.mensagem}
                status={item.status}
                servico_desejado_titulo={item.servico_desejado_titulo}
                servico_oferecido_titulo={item.servico_oferecido_titulo}
                titulo={item.titulo}
                created_at={item.created_at}
              />
            );
          }}
        />
      )}
    </View>
  );
}
