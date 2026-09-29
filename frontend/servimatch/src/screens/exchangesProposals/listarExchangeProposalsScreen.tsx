import { useQuery } from "@tanstack/react-query";
import {
  listaPropostasEnviadas,
  listaPropostasRecebidas,
} from "../../api/exchangeProposals";
import { useState } from "react";
import {
  Pressable,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
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
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["PropostasRecebidas"],
    queryFn: listaPropostasRecebidas,
  });

  const {
    data: propostasEnviadas,
    isError: erroPropostaEnviada,
    isLoading: carregamentoPropostaEnviada,
    refetch: refetchPropostasEnviadas,
    isFetching: isFetchingPropostasEnviadas,
  } = useQuery({
    queryKey: ["PropostasEnviadas"],
    queryFn: listaPropostasEnviadas,
  });

  if (isLoading || carregamentoPropostaEnviada) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }
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
          refreshing={isFetchingPropostasEnviadas}
          onRefresh={refetchPropostasEnviadas}
          renderItem={({ item }) => {
            return <PropostaCardEnviada {...item} />;
          }}
        />
      ) : (
        <FlatList
          data={propostasRecebidas}
          keyExtractor={(item) => String(item?.id)}
          refreshing={isFetching}
          onRefresh={refetch}
          renderItem={({ item }) => {
            return <PropostaCardRecebida {...item} />;
          }}
        />
      )}
    </View>
  );
}
