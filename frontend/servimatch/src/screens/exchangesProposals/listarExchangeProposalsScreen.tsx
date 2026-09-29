import { useQuery } from "@tanstack/react-query";
import {
  listaPropostasEnviadas,
  listaPropostasRecebidas,
} from "../../api/exchangeProposals";
import { useState } from "react";
import { Pressable, View, Text, FlatList } from "react-native";

export function listarExchangesProposals() {
  const [isMenu, setIsMenu] = useState(false);
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

  const handleMenu = () => {
    setMenu(!isMenu);
  };

  return (
    <View>
      <Pressable onPress={handleMenu}>
        <Text>Recebidas</Text>
      </Pressable>
      <Pressable onPress={handleMenu}>
        <Text>Oferecidas</Text>
      </Pressable>

      {isMenu ? (
        <FlatList
          data={[propostasEnviadas]}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => {
            return (
              <View>
                <Text>{item?.titulo}</Text>
                <Text>{item?.status}</Text>
                <Text>{item?.mensagem}</Text>
                <Text>{item?.created_at}</Text>
                <Text>{item?.outro_usuario_nome}</Text>
                <Text>{item?.servico_oferecido_titulo}</Text>
                <Text>{item?.servico_desejado_titulo}</Text>
              </View>
            );
          }}
        />
      ) : (
        <FlatList
          data={[propostasRecebidas]}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => {
            return (
              <View>
                <Text>{item?.titulo}</Text>
                <Text>{item?.status}</Text>
                <Text>{item?.mensagem}</Text>
                <Text>{item?.created_at}</Text>
                <Text>{item?.outro_usuario_nome}</Text>
                <Text>{item?.servico_oferecido_titulo}</Text>
                <Text>{item?.servico_desejado_titulo}</Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
