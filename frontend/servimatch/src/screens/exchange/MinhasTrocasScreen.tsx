import { useFocusEffect } from "@react-navigation/native";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { listarTrocas, cancelarTroca, concluirTroca } from "../../api/exchange";
import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  FlatList,
  Pressable,
  Alert,
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

  const queryClient = useQueryClient();

  const {
    mutate,
    isError: errorConcluir,
    isPending: carregandoConclusao,
    variables: variablesConcluir,
  } = useMutation({
    mutationFn: concluirTroca,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MinhasTrocas"] });
      Alert.alert("Troca concluida com Sucesso");
    },
    onError: (error) => {
      return Alert.alert("Erro ao Concluir Troca:", error?.message);
    },
  });

  const {
    mutate: mutateCancelar,
    isError: errorCancelar,
    isPending: carregandoCancelar,
    variables,
  } = useMutation({
    mutationFn: cancelarTroca,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MinhasTrocas"] });
      Alert.alert("Troca cancelada com Sucesso");
    },
    onError: (error) => {
      return Alert.alert("Erro ao Cancelar Troca:", error?.message);
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      refetch();
      return () => {};
    }, [refetch]),
  );

  const handleStatusTroca = (id: number, status: "cancelled" | "completed") => {
    if (status === "completed") {
      mutate({ id, status: "completed" });
    } else {
      mutateCancelar({ id, status: "cancelled" });
    }
  };

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
          <Pressable onPress={() => refetch()}>
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

              {item.status == "scheduled" && (
                <View>
                  <Pressable
                    onPress={() => handleStatusTroca(item.id, "completed")}
                    disabled={
                      carregandoConclusao && variablesConcluir?.id === item.id
                    }
                  >
                    {carregandoConclusao && (
                      <ActivityIndicator size={"small"} />
                    )}
                    Completar Troca
                  </Pressable>
                  <Pressable
                    onPress={() => handleStatusTroca(item.id, "cancelled")}
                    disabled={carregandoCancelar && variables?.id === item.id}
                  >
                    {carregandoCancelar && <ActivityIndicator size={"small"} />}
                    Cancelar Troca
                  </Pressable>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
