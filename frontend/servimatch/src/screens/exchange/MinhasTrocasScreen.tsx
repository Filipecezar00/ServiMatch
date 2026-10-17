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
type StatusTroca = Troca["status"]
const statusTroca:Record<StatusTroca,{label:string; backgroundColor:string; color:string;}> = {
    scheduled:{
      label:"Agendada", 
      backgroundColor:"#E8F2FA", 
      color:"#186497"
    }, 
    in_progress:{
      label:"Em andamento", 
      backgroundColor:"#FFF3D6", 
      color:"#946200"
    }, 
    completed:{
      label:"Concluída", 
      backgroundColor:"#E3F5F1", 
      color:"#18794E"
    }, 
    cancelled:{
      label:"Cancelada", 
      backgroundColor:"#FCE8EA", 
      color:"#B42332", 
    }, 
    disputed:{
      label:"Em disputa", 
      backgroundColor:"#FFF0E0", 
      color:"#A34B00", 
    }, 
  }
export function MinhasTrocas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrocaSelecionada, setIsTrocaSelecionada] = useState<Troca | null>(
    null,
  );

  const [isModalAvaliarOpen, setIsModalAvaliarOpen] = useState(false);
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
    setIsTrocaAvaliada(null);
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={"large"}  color={theme.colors.primaryDark}/>
        <Text style={styles.textInfomation}>Carregando suas trocas...</Text>
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
        <View style={styles.containerError}>
          <Text style={styles.textInfomation}>Não foi possível carregar seu histórico de trocas</Text>
          <Pressable onPress={() => refetch()} style={styles.btnRefetch}>
            <Text style={styles.textBtns}>Tente Novamente</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={trocas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listaContainer}
        ListEmptyComponent={
          !isError ? (
            <Text style={styles.textInfomation}>Você ainda não possui trocas em andamento</Text>
          ):null
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

          const etiloStatus = statusTroca[item.status]
        
          return (
            <View style={styles.cardContainer}>
              <Text style={styles.titleServiço}>Serviço oferecido: {item.servico_oferecido_titulo}</Text>
              <Text style={styles.titleServiço}>Servico desejado: {item.servico_desejado_titulo}</Text>
              <Text style={styles.usuarioTitle}>Outro participante: {item.outro_usuario_nome}</Text>
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
              <View style={[styles.statusContainer,{backgroundColor:etiloStatus.backgroundColor},]}>
                <Text style={[styles.statusText,{color:etiloStatus.color}]} >Status Atual: {etiloStatus.label}</Text>
              </View>

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
                      <ActivityIndicator size={"small"} color={theme.colors.primaryDark}/>
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
                        <ActivityIndicator size={"small"} color={theme.colors.primaryDark}/>
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
    padding:theme.spacing.md, 
    backgroundColor:theme.colors.background
  }, 
  listaContainer:{
    paddingBottom:theme.spacing.xl
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
    color:theme.colors.textPrimary,
    marginBottom:theme.spacing.sm
  }, 
  usuarioTitle:{
    fontSize:14, 
    marginBottom:theme.spacing.sm,
    color:theme.colors.textSecondary, 
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
  backgroundColor:theme.colors.background,
  borderColor:theme.colors.border,
  borderWidth:1, 
  borderRadius:theme.borderRadius.md,
  padding:theme.spacing.md, 
  marginTop:theme.spacing.md
}, 
textContainer:{
  fontSize:14,
  color:theme.colors.textPrimary, 
  textAlign:"center"
}, 
textNota:{
  color:theme.colors.textPrimary,
  textAlign:"center",
}, 
containerNota:{
   flexDirection: "row",
   alignItems: "center",
   justifyContent:"center",
   gap: 4,
}, 
title:{
fontSize:22, 
fontWeight:"700",
color:theme.colors.textPrimary,
marginBottom:theme.spacing.xs,
textAlign:"center"
}, 
subTitle:{
fontSize:14, 
fontWeight:"400", 
lineHeight:20,
textAlign:"center", 
color:theme.colors.textSecondary
}, 
header:{
  marginBottom:theme.spacing.lg, 
  marginTop:theme.spacing.sm
},
container_btn_avaliar:{
  justifyContent:"center",
}, 
textInfomation:{
  fontSize:15,
  color:theme.colors.textSecondary,
  textAlign:"center", 
  lineHeight:22, 
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
btnRefetch:{
marginBottom:theme.spacing.lg,
marginTop:theme.spacing.sm,
flex:1,
minHeight:48,
backgroundColor:theme.colors.primary, 
borderColor:theme.colors.border,
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
borderRadius:theme.borderRadius.md,
alignItems:"center",
justifyContent:"center"
}, 
btnAcaoServico:{
flex:1,
minHeight:48,
backgroundColor:theme.colors.primary, 
borderColor:theme.colors.border,
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
borderRadius:theme.borderRadius.md,
alignItems:"center",
justifyContent:"center"
}, 
btnCancelar:{
minHeight:48, 
backgroundColor:theme.colors.error,  
borderColor:theme.colors.border,
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
borderRadius:theme.borderRadius.md,
alignItems:"center", 
justifyContent:"center"
}, 
btnEditar:{
minHeight:48,
backgroundColor:theme.colors.surface, 
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
borderColor:theme.colors.primaryDark,
borderRadius:theme.borderRadius.md, 
alignItems:"center",
justifyContent:"center"
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
backgroundColor:theme.colors.surface, 
borderWidth:1,
borderColor:theme.colors.primary,
borderRadius:theme.borderRadius.md, 
alignItems:"center",
justifyContent:"center",
minHeight:44,
paddingHorizontal:theme.spacing.md, 
paddingVertical:theme.spacing.sm
}, 
textAvaliar:{
fontWeight:"600",
color:theme.colors.primaryDark
}, 
containerError:{
  alignItems:'center',
  padding:theme.spacing.md,
  backgroundColor:theme.colors.surface, 
  borderRadius:theme.borderRadius.md,
  marginBottom:theme.spacing.md
}, 
statusContainer:{
  alignSelf:"flex-start", 
  paddingHorizontal:theme.spacing.sm,
  paddingVertical:theme.spacing.xs, 
  borderRadius:theme.borderRadius.md, 
  marginTop:theme.spacing.sm,
  marginBottom:theme.spacing.md
}, 
statusText:{
  fontSize:13,
  fontWeight:"600"
}, 
loadingContainer:{
  flex:1,
  alignItems:"center", 
  justifyContent:"center",
  backgroundColor:theme.colors.background,
  gap:theme.spacing.sm
}
})