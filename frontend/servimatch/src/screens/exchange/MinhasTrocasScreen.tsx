import { useFocusEffect } from "@react-navigation/native";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  listarTrocas,
  cancelarTroca,
  concluirTroca,
  updateStatus,
} from "../../api/exchange";
import { listarReview } from "../../api/reviews";
import React, { useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  FlatList,
  Pressable,
  Alert,
  StyleSheet
} from "react-native";
import { theme } from "../../styles/theme/theme";
import { EditarMinhaTroca } from "../../components/EditarMinhasTrocas";
import { Troca } from "../../types/exchangeTypes";
import { AvaliarTroca } from "../../components/AvaliarTroca";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthStore } from "../../stores/useAuthStore";
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
  const { usuario } = useAuthStore();

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

  const { data: reviews } = useQuery({
    queryKey: ["MeusReviews", usuario?.id],
    queryFn: () => listarReview(usuario?.id ?? null),
    enabled: !!usuario?.id,
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

  const handleAvaliar = (item: Troca) => {
    setIsModalAvaliarOpen(true);
    setIsTrocaAvaliada(item);
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historico de Trocas</Text>
        <Text style={styles.subTitle}>Todas trocas que você faz fica aqui!</Text>
      </View>
      
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
          <Text style={styles.textInfomation}>Você ainda não possui trocas em andamento</Text>
        }
        onRefresh={refetch}
        refreshing={isFetching}
        renderItem={({ item }) => {
          const listaDeReviews = Array.isArray(reviews)
            ? reviews
            : Array.isArray((reviews as any)?.reviews)
              ? (reviews as any).reviews
              : [];
          const minhaReview = listaDeReviews.find(
            (r: any) =>
              Number(r.exchange_id) === Number(item.id) &&
              Number(r.reviewer_id) === Number(usuario?.id),
          );
          const estrelas = [1, 2, 3, 4, 5];

          const status = ["scheduled","in_progress","completed","cancelled","disputed"]
          const corStatus = ["#186497","#e7a61b","#0f6a07","#e93f3f","#e2b100"]
          const funcaoStatus = ()=>{

          }
          return (
            <View style={styles.cardContainer}>
              <Text style={styles.titleServiço}>Meu Serviço: {item.servico_oferecido_titulo}</Text>
              <Text style={styles.titleServiço}>Servico Desejado: {item.servico_desejado_titulo}</Text>
              <Text style={styles.usuarioTitle}>Usuario: {item.outro_usuario_nome}</Text>
              <View style={styles.containerLocalizacao}>
                {!item.location || item.location.trim() === "" ? (
                  <Text style={styles.textLocalizacao}>localização não definida</Text>
                ) : (
                  <Text style={styles.textLocalizacao}>Localização: {item.location}</Text>
                )}
                {!item.scheduled_date || item.scheduled_date.trim() === "" ? (
                  <Text style={styles.textLocalizacao}>Data não definida</Text>
                ) : (
                  <Text style={styles.textData}>
                    Data do serviço: {formatarDataBr(item.scheduled_date)}
                  </Text>
                )}
              </View>
              <Text >Status Atual: {item.status}</Text>

              {item?.completed_at && (
                <Text style={styles.textcompletado}>Completado em: {formatarDataBr(item.completed_at)}</Text>
              )}
              {item.status == "completed" && (
                <View style={styles.containerAvaliacao}>
                  <Text style={styles.textContainer}>Solicitação completada com sucesso!</Text>
                  {minhaReview ? (
                    <View>
                      <Text style={styles.textContainer}>Detalhes da Minha avaliação</Text>
                      <View
                        style={styles.containerNota}
                      >
                        <Text style={styles.textNota}>
                          Nota: {minhaReview.rating}
                        </Text>
                        {estrelas.map((estrela) => {
                          const isSelected = estrela <= minhaReview.rating;
                          return (
                            <MaterialCommunityIcons
                              key={estrela}
                              name="star"
                              size={18}
                              color={isSelected ? "#c8ce1a" : "#a09f9f"}
                            />
                          );
                        })}
                      </View>
                      {minhaReview.comment && (
                        <Text style={styles.textContainer}>Comentário:{minhaReview.comment}</Text>
                      )}

                      {minhaReview.created_at && (
                        <Text style={styles.textContainer}>
                          Data de Criação:{" "}
                          {formatarDataBr(minhaReview.created_at)}
                        </Text>
                      )}
                    </View>
                  ) : (
                    <View style={styles.container_btn_avaliar}>
                      <Pressable onPress={() => handleAvaliar(item)} style={styles.btnAvaliar}>
                        <Text style={styles.textAvaliar}>Avaliar Troca</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              )}

              {item.status === "cancelled" && (
                <View>
                  <Text style={styles.textInfomation}>Solicitação cancelada com sucesso ! </Text>
                </View>
              )}

              {item.status == "scheduled" && (
                <View style={styles.containerBtns}>
                  <Pressable
                    onPress={() => handleCancelar(item.id)}
                    disabled={carregandoCancelar && variables?.id === item.id}
                    style={styles.btnCancelar}
                  >
                    {carregandoCancelar && variables?.id === item.id && (
                      <ActivityIndicator size={"small"} />
                    )}
                    <Text style={styles.textBtns}>Cancelar Troca</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleIniciarServico(item.id)}
                    disabled={
                      carregandoIniciar &&
                      variablesIniciar?.exchangeId === item.id
                    }
                    style={styles.btnAcaoServico}
                  >
                    <Text style={styles.textBtns}>Iniciar Serviço</Text>
                  </Pressable>
                  <Pressable onPress={() => handleEditar(item)} style={styles.btnEditar}>
                    <Text style={styles.textEditar}>Editar local e Agendamento</Text>
                  </Pressable>
                </View>
              )}
              {item.status == "in_progress" && (
                <View style={styles.containerBtns}>
                <Pressable
                    onPress={() => handleCancelar(item.id)}
                    disabled={carregandoCancelar && variables?.id === item.id}
                    style={styles.btnCancelar}
                  >
                    {carregandoCancelar && variables?.id === item.id && (
                      <ActivityIndicator size={"small"} />
                    )}
                    <Text style={styles.textBtns}>Cancelar Troca</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleCompletar(item)}
                    disabled={
                      carregandoConclusao && variablesConcluir?.id === item.id
                    }
                    style={styles.btnAcaoServico}
                  >
                    {carregandoConclusao &&
                      variablesConcluir?.id === item.id && (
                        <ActivityIndicator size={"small"} />
                      )}
                    <Text style={styles.textBtns}>Completar Troca</Text>
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
const styles = StyleSheet.create({
  container:{
    flex:1, 
    padding:theme.spacing.md
  }, 
  cardContainer:{
    backgroundColor:theme.colors.surface, 
    borderWidth:1, 
    borderColor:theme.colors.border, 
    borderRadius:theme.borderRadius.md, 
    padding:theme.spacing.md, 
    marginBottom:theme.spacing.md
  }, 
  titleServiço:{
    fontSize:16, 
    fontWeight:"600", 
    marginBottom:theme.spacing.sm
  }, 
  usuarioTitle:{
    fontSize:16, 
    marginBottom:theme.spacing.sm,
    color:theme.colors.textPrimary, 
    fontWeight:"400"
  },
containerLocalizacao:{
  marginBottom:theme.spacing.xs,
}, 
textLocalizacao:{
  fontSize:14,
  fontWeight:"400", 
  color:theme.colors.textSecondary
}, 
textData:{
  fontSize:14,
  fontWeight:"400", 
  color:theme.colors.primaryDark
},
textcompletado:{
  fontWeight:"600",
  marginBottom:theme.spacing.xs
}, 
containerAvaliacao:{
  flexDirection:"column",
  paddingVertical:theme.spacing.sm,
  justifyContent:"center",
  backgroundColor:theme.colors.primaryDark,
  borderColor:theme.colors.border,
  borderWidth:1, 
  borderRadius:theme.borderRadius.sm,
  padding:theme.spacing.md, 
  marginTop:theme.spacing.md
}, 
textContainer:{
  fontSize:14,
  color:theme.colors.surface, 
  textAlign:"center"
}, 
textNota:{
  color:theme.colors.surface,
  marginRight:theme.spacing.xs
}, 
containerNota:{
   flexDirection: "row",
   alignItems: "center",
   gap: 4,
}, 
title:{
fontSize:20, 
fontWeight:"600",
textAlign:"center"
}, 
subTitle:{
fontSize:14, 
fontWeight:"400", 
textAlign:"center", 
color:theme.colors.textSecondary
}, 
header:{
  marginBottom:theme.spacing.md, 
  marginTop:theme.spacing.lg
},
container_btn_avaliar:{
  justifyContent:"center",
}, 
textInfomation:{
  fontSize:16,
  color:theme.colors.textPrimary,
  marginTop:theme.spacing.md
}, 
containerBtns:{
  flexDirection:"row",
  justifyContent:'center', 
  flexWrap:"wrap",
  alignItems:"center",
  marginVertical:theme.spacing.xs, 
  gap:theme.spacing.lg, 
  marginTop:theme.spacing.md
},
btnAcaoServico:{
backgroundColor:theme.colors.primary, 
borderWidth:1, 
borderColor:theme.colors.border,
padding:theme.spacing.xs,
borderRadius:theme.spacing.xs
}, 
btnCancelar:{
backgroundColor:theme.colors.error, 
borderWidth:1, 
borderColor:theme.colors.border,
padding:theme.spacing.xs,
borderRadius:theme.spacing.xs
}, 
btnEditar:{
backgroundColor:theme.colors.surface, 
borderWidth:1, 
borderColor:theme.colors.border,
padding:theme.spacing.xs,
borderRadius:theme.spacing.xs
}, 
textEditar:{
fontSize:14,
color:theme.colors.textPrimary
}, 
textBtns:{
fontSize:14, 
color:theme.colors.surface
}, 
btnAvaliar:{
backgroundColor:theme.colors.background, 
borderColor:theme.colors.border,
borderRadius:theme.borderRadius.md, 
alignItems:"center",
paddingHorizontal:theme.spacing.xs, 
paddingVertical:theme.spacing.xs
}, 
textAvaliar:{
fontWeight:"600"
}
})