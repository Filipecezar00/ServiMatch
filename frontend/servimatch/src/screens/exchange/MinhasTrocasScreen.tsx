import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { listarTrocas } from "../../api/exchange";
import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  FlatList,
  Pressable,
} from "react-native";

export function MinhasTrocas() {
  const {
    data: trocas,
    isError,
    isPending,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["MinhasTrocas"],
    queryFn: listarTrocas,
  });

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        refetch();
      };
    }, []),
  );

  if (isPending) {
    return (
      <View>
        <ActivityIndicator size={"small"} />
      </View>
    );
  }

  return (
    <View>
      <Text>Historico de Trocas</Text>
      {isError && (
        <View>
          <Text>Erro durante Processamento</Text>
          <Pressable onPress={() => refetch}>
            <Text>Tente Novamente</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={trocas}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text>Você ainda não possui trocas em andamento</Text>
        }
        onRefresh={refetch}
        refreshing={isFetching}
        renderItem={({ item }) => {
          return (
            <View>
              <Text>Meu Serviço: {item.servico_oferecido_titulo}</Text>
              <Text>Servico Desejado: {item.servico_desejado_titulo}</Text>
              <Text>Usuario: {item.outro_usuario_nome}</Text>
              <Text>Status Atual: {item.status}</Text>
              <Text>Localização: {item.location}</Text>
              <Text>Data de Agendamento: {item.scheduled_date}</Text>
              {item?.completed_at && (
                <Text>Completado em: {item.completed_at}</Text>
              )}
              {item.notes && <Text>Avalição: {item?.notes}</Text>}
            </View>
          );
        }}
      />
    </View>
  );
}
