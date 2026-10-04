import { useFocusEffect } from "@react-navigation/native";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  listarTrocas,
  cancelarTroca,
  concluirTroca,
  updateStatus,
} from "../../api/exchange";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
export function MinhasTrocas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrocaSelecionada, setIsTrocaSelecionada] = useState<Troca | null>(
    null,
  );

  const [isModalAvaliarOpen, setIsModalAvaliarOpen] = useState(false);
  const [exchangeToReviewId, setExchangeToReviewId] = useState<number | null>(
    null,
  );
  const [isTrocaAvaliada, setIsTrocaAvaliada] = useState<Troca | null>(null);

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
    Alert.alert(
      "Confirmar cancelamento",
      "Deseja realmente cancelar ?",
      [
        {
          text: "Voltar",
          style: "cancel",
        },
        {
          text: "Sim, Cancelar",
          style: "destructive",
          onPress: () =>
            mutateCancelar({
              id,
              status: "cancelled",
            }),
        },
      ],
      { cancelable: true },
    );
  };

  const {
    mutate: mutateUpdateStatus,
    isPending: carregandoIniciar,
    variables: variablesIniciar,
  } = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MinhasTrocas"] });
    },
    onError: () => {
      return Alert.alert("Erro ao atualizar status do serviço!");
    },
  });

  const handleIniciarServico = (id: number) => {
    mutateUpdateStatus(
      {
        exchangeId: id,
        status: "in_progress",
      },
      {
        onSuccess: () => {
          Alert.alert("Sucesso", "Serviço iniciado com sucesso!");
        },
      },
    );
  };

  const handleEditar = (item: Troca) => {
    setIsTrocaSelecionada(item);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIsTrocaSelecionada(null);
  };

  const handleCloseAvaliar = () => {
    setIsModalAvaliarOpen(false);
    setIsTrocaSelecionada(null);
  };

  const handleCompletar = (item: Troca) => {
    mutate(
      { id: item.id, status: "completed" },
      {
        onSuccess: () => {
          setIsTrocaAvaliada(item);

          setIsModalAvaliarOpen(true);
        },
        onError: (error) => {
          Alert.alert(
            "Erro",
            "Não foi possível concluir a troca. Tente novamente",
          );
        },
      },
    );
  };

  const handleSuccessAvaliar = () => {
    handleCloseAvaliar();
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
          const estrelas = [1, 2, 3, 4, 5];
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
                  <Text>
                    Data do serviço: {formatarDataBr(item.scheduled_date)}
                  </Text>
                )}
              </View>
              {item?.completed_at && (
                <Text>Completado em: {formatarDataBr(item.completed_at)}</Text>
              )}
              {item.status === "completed" && item.rating != null && (
                <View>
                  <Text>Solicitação completada com sucesso!</Text>
                  <View style={{ flexDirection: "row" }}>
                    {estrelas.map((estrela) => {
                      const isSelected = estrela <= (item?.rating ?? 0);
                      return (
                        <MaterialCommunityIcons
                          key={estrela}
                          name="star"
                          color={isSelected ? "#c8ce1a" : "#a09f9f"}
                        />
                      );
                    })}
                    {item.notes && (
                      <Text style={{ fontStyle: "italic" }}>
                        Avaliação: {item?.notes}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {item.status === "cancelled" && (
                <View>
                  <Text>Solicitação cancelada com sucesso ! </Text>
                </View>
              )}

              {item.status == "scheduled" && (
                <View>
                  <Pressable
                    onPress={() => handleIniciarServico(item.id)}
                    disabled={
                      carregandoIniciar &&
                      variablesIniciar?.exchangeId === item.id
                    }
                  >
                    <Text>Iniciar Serviço</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleCancelar(item.id)}
                    disabled={carregandoCancelar && variables?.id === item.id}
                  >
                    {carregandoCancelar && variables?.id === item.id && (
                      <ActivityIndicator size={"small"} />
                    )}
                    <Text>Cancelar Troca</Text>
                  </Pressable>
                  <Pressable onPress={() => handleEditar(item)}>
                    <Text>Editar local e Agendamento</Text>
                  </Pressable>
                </View>
              )}
              {item.status == "in_progress" && (
                <View>
                  <Pressable
                    onPress={() => handleCompletar(item)}
                    disabled={
                      carregandoConclusao && variablesConcluir?.id === item.id
                    }
                  >
                    {carregandoConclusao &&
                      variablesConcluir?.id === item.id && (
                        <ActivityIndicator size={"small"} />
                      )}
                    <Text>Completar Troca</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleCancelar(item.id)}
                    disabled={carregandoCancelar && variables?.id === item.id}
                  >
                    {carregandoCancelar && variables?.id === item.id && (
                      <ActivityIndicator size={"small"} />
                    )}
                    <Text>Cancelar Troca</Text>
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
        visible={isModalAvaliarOpen}
        troca={isTrocaAvaliada}
        onClose={handleCloseAvaliar}
        onSuccess={handleCloseAvaliar}
      />
    </View>
  );
}
