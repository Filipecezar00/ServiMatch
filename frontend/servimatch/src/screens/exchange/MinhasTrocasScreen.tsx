import { useFocusEffect } from "@react-navigation/native";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { listarTrocas, cancelarTroca, concluirTroca } from "../../api/exchange";
import React, { useState } from "react";

import {
  View,
  ActivityIndicator,
  Text,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { EditarMinhaTroca } from "../../components/EditarMinhasTrocas";
import { Troca, FinalizarTroca } from "../../types/exchangeTypes";
import { AvaliarTroca } from "../../components/AvaliarTroca";
export function MinhasTrocas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrocaSelecionada, setIsTrocaSelecionada] = useState<Troca | null>(
    null,
  );

  const [isModalCompleted, setIsModalCompleted] = useState(false);

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

  const handleCancelar = (id: number) => {
    mutateCancelar({
      id,
      status: "cancelled",
      rating: null,
      notes: null,
    });
  };

  const handleEditar = (item: Troca) => {
    setIsTrocaSelecionada(item);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIsTrocaSelecionada(null);
  };

  const handleCloseCompleted = () => {
    setIsModalCompleted(false);
    setIsTrocaSelecionada(null);
  };
  const handleAvaliar = (troca: Troca) => {
    setIsTrocaSelecionada(troca);
    setIsModalCompleted(true);
  };

  function formatarDataBr(dataIso: string | null): string {
    if (!dataIso || dataIso.trim() === "") {
      return "Data não definida";
    }
    const data = new Date(dataIso);
    if (isNaN(data.getTime())) return dataIso;

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");

    if (horas === "00" && minutos === "00") {
      return `${dia}/${mes}/${ano}`;
    }

    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
  }

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
              <View>
                {!item.location || item.location.trim() === "" ? (
                  <Text>localização não definida</Text>
                ) : (
                  <Text>Localização: {item.location}</Text>
                )}
                {!item.scheduled_date || item.scheduled_date.trim() === "" ? (
                  <Text>Data não definida</Text>
                ) : (
                  <Text>Data: {formatarDataBr(item.scheduled_date)}</Text>
                )}
              </View>
              {item?.completed_at && (
                <Text>Completado em: {item.completed_at}</Text>
              )}
              {item.notes && <Text>Avalição: {item?.notes}</Text>}

              {item.status == "scheduled" && (
                <View>
                  <Pressable
                    onPress={() => handleAvaliar(item)}
                    disabled={
                      carregandoConclusao && variablesConcluir?.id === item.id
                    }
                  >
                    {carregandoConclusao && (
                      <ActivityIndicator size={"small"} />
                    )}
                    <Text>Completar Troca</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleCancelar(item.id)}
                    disabled={carregandoCancelar && variables?.id === item.id}
                  >
                    {carregandoCancelar && <ActivityIndicator size={"small"} />}
                    <Text>Cancelar Troca</Text>
                  </Pressable>
                  <Pressable onPress={() => handleEditar(item)}>
                    <Text>Editar local e Agendamento</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        }}
      />
      <EditarMinhaTroca
        visible={isModalOpen}
        troca={isTrocaSelecionada}
        onClose={handleClose}
      />
      <AvaliarTroca
        visible={isModalCompleted}
        troca={isTrocaSelecionada}
        onClose={handleCloseCompleted}
      />
    </View>
  );
}
