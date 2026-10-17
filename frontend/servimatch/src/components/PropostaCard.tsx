import { View, Text, Pressable, Alert,StyleSheet } from "react-native";
import { PropostaEnviada, PropostaRecebida } from "../types/exchangeTypes";
import { alterarStatusProposta } from "../api/exchangeProposals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { theme } from "../styles/theme/theme";

export function PropostaCardEnviada({
  outro_usuario_nome,
  mensagem,
  status,
  servico_oferecido_titulo,
  servico_desejado_titulo,
}: PropostaEnviada) {
  return (
    <View>
      <Text>Proposta Enviada</Text>
      <View>
        <Text>Serviço Oferecido: {servico_oferecido_titulo}</Text>
        <Text>Serviço Desejado: {servico_desejado_titulo}</Text>
        <Text>Destinatario da proposta: {outro_usuario_nome}</Text>
        <Text>Observações:{mensagem}</Text>
        <Text>Status Atual: {status}</Text>
      </View>
    </View>
  );
}

export function PropostaCardRecebida({
  id,
  outro_usuario_nome,
  mensagem,
  status,
  servico_desejado_titulo,
  servico_oferecido_titulo,
  titulo,
  created_at,
}: PropostaRecebida) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["statusProposta"],
    mutationFn: alterarStatusProposta,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PropostasRecebidas"] });
      Alert.alert("Status alterado com sucesso");
    },
    onError: () => {
      Alert.alert("Erro ao alterar Status da Proposta");
    },
  });

  const handleStatus = (
    id: number,
    statusProposta: "accepted" | "rejected",
  ) => {
    if (!id) {
      return;
    }
    if (!statusProposta) {
      return;
    }
    mutate({ id, statusProposta });
  };

  return (
    <View style={styles.containerPropostas}>
      <Text style={styles.title}>Proposta Recebida</Text>
      <View style={styles.containerInformations}>
        <Text style={styles.titleServico}>Serviço desejado: {servico_desejado_titulo}</Text>
        <Text style={styles.titleServico}>Serviço oferecido: {servico_oferecido_titulo}</Text>
        <Text style={styles.subTitle}>Remetente da proposta: {outro_usuario_nome}</Text>
        <Text style={styles.observacoes}>Observações:{mensagem}</Text>
        <View>
          <Text style={styles.subTitle}>Status Atual: {status} </Text>
          {status === "pending" ? (
            <View style={styles.containerBtns}>
              <Pressable
                onPress={() => handleStatus(id, "rejected")}
                disabled={isPending}
                style={styles.btnRecusar}
              >
                <Text style={styles.textBtn}>Recusar</Text>
              </Pressable>
               <Pressable
                onPress={() => handleStatus(id, "accepted")}
                disabled={isPending}
                style={styles.btnAceitar}
              >
                <Text style={styles.textBtn}>Aceitar</Text>
              </Pressable>
            </View>
          ) : (
            <Text>{status}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
containerPropostas:{
  flexDirection:"column",
  justifyContent:"center",
  alignItems:"center",
  backgroundColor:theme.colors.surface,
  padding:theme.spacing.lg, 
  borderRadius:theme.borderRadius.md, 
  borderColor:theme.colors.border,
  margin:theme.spacing.md
}, 
title:{
  fontSize:16, 
  fontWeight:"600",
  marginBottom:theme.spacing.md
}, 
containerInformations:{
  
}, 
titleServico:{
  fontSize:14, 
  fontWeight:"600",
  marginBottom:theme.spacing.md
}, 
subTitle:{
  fontSize:14,
  color:theme.colors.textSecondary, 
  fontWeight:"600", 
  marginBottom:theme.spacing.md
}, 
observacoes:{
  fontWeight:"600", 
  marginBottom:theme.spacing.md
}, 
containerBtns:{
  flexDirection:"row",
justifyContent:"space-evenly"
}, 
btnRecusar:{
backgroundColor:theme.colors.error,
borderRadius:theme.spacing.xs, 
borderWidth:1, 
borderColor:theme.colors.border, 
padding:theme.spacing.md
}, 
btnAceitar:{
backgroundColor:theme.colors.primary,
borderRadius:theme.spacing.xs, 
borderWidth:1, 
borderColor:theme.colors.border, 
padding:theme.spacing.md
}, 
textBtn:{
  color:theme.colors.surface,
  fontWeight:"400"
}

})
