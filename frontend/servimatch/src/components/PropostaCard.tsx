import { View, Text, Pressable, Alert,StyleSheet } from "react-native";
import { PropostaEnviada, PropostaRecebida } from "../types/exchangeTypes";
import { alterarStatusProposta } from "../api/exchangeProposals";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { theme } from "../styles/theme/theme";

 const statusStyle = {
    accepted:{
      label:"Aceita", 
      backgroundColor:theme.colors.success, 
      color:theme.colors.surface
    }, 
    rejected:{
      label:"Rejeitada", 
      backgroundColor:theme.colors.error, 
      color:theme.colors.surface
    }, 
    pending:{
      label:"Pendente", 
      backgroundColor:theme.colors.primaryDark, 
      color:theme.colors.surface
    },
    cancelled:{
      label:"Cancelada", 
      backgroundColor:theme.colors.error, 
      color:theme.colors.surface
    }
  }
export function PropostaCardEnviada({
  outro_usuario_nome,
  mensagem,
  status,
  servico_oferecido_titulo,
  servico_desejado_titulo,
}: PropostaEnviada) {
  const statusReference = statusStyle[status]
  return (
    <View style={styles.containerPropostas}>
      <View style={styles.cabecalhoCard}>
        <Text style={styles.title}>Proposta Enviada</Text>
        {status&&(
          <View style={[styles.containerStatus,{backgroundColor:statusReference.backgroundColor}]}>
            <Text style={[styles.statusText,{color:statusReference.color}]}>{statusReference.label}</Text>
          </View>
        )}
       
      </View>
      <View style={styles.containerInformations}>
        <View style={styles.informacaoServico}>
         <Text style={styles.informacaoTexto}>Serviço Oferecido:</Text>
        <Text style={styles.valorInformacao}>{servico_oferecido_titulo}</Text>
        </View>
      <View style={styles.informacaoServico}>
        <Text style={styles.informacaoTexto}>Serviço Desejado:</Text>
        <Text style={styles.valorInformacao}>{servico_desejado_titulo}</Text>
      </View>
      <View style={styles.informacaoServico}>
        <Text style={styles.informacaoTexto}>Destinatario da proposta:</Text>
        <Text style={styles.valorInformacao}>{outro_usuario_nome}</Text>
      </View>
      <View style={styles.containerObservacoes}>
        <Text style={styles.informacaoTexto}>Observações:</Text>
        <Text style={styles.textoObservacoes}>{mensagem?.trim() || "Nenhuma observação informada"}</Text>
      </View>
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

  const { mutate, isPending } = useMutation({
    mutationKey: ["statusProposta"],
    mutationFn: alterarStatusProposta,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PropostasRecebidas"] });
      Alert.alert("Sucesso","O status da proposta foi atualizado.");
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

 
  const statusReference = statusStyle[status]
  return (
    <View style={styles.containerPropostas}>
      <View style={styles.cabecalhoCard}>
      <Text style={styles.title}>Proposta Recebida</Text>
      {status!=="pending"&&(
          <View style={[styles.containerStatus,{backgroundColor:statusReference.backgroundColor}]}>
              <Text style={[styles.statusText, {color:statusReference.color}]}>{statusReference.label}</Text>
            </View>
      )}
      </View>
      
      <View style={styles.containerInformations}>

        <View style={styles.informacaoServico}>  
          <Text style={styles.informacaoTexto}>Serviço desejado: </Text>
          <Text style={styles.valorInformacao}>{servico_desejado_titulo}</Text>
        </View>
        <View style={styles.informacaoServico}>
          <Text style={styles.informacaoTexto}>Serviço oferecido:</Text>
          <Text style={styles.valorInformacao}>{servico_oferecido_titulo}</Text>
        </View>
        
        <View style={styles.informacaoServico}>
          <Text style={styles.informacaoTexto}>Remetente da proposta:</Text>
          <Text style={styles.valorInformacao}>{outro_usuario_nome}</Text>
        </View>

        <View style={styles.containerObservacoes}>
          <Text style={styles.informacaoTexto}>Observações:</Text>
          <Text style={styles.textoObservacoes}>{mensagem?.trim() || "Nenhuma observação informada"}</Text>
        </View>
        
          {status === "pending" && (
            <View style={styles.containerBtns}>
              <Pressable
                onPress={() => handleStatus(id, "rejected")}
                disabled={isPending}
                style={({pressed})=>[styles.btnRecusar,pressed && !isPending && styles.btnPressionado,isPending && styles.btnDesabilitado]}
              >
                <Text style={styles.textBtn}>Recusar</Text>
              </Pressable>
               <Pressable
                onPress={() => handleStatus(id, "accepted")}
                disabled={isPending}
                style={({pressed})=>[
                  styles.btnAceitar,pressed && !isPending && styles.btnPressionado,
                  isPending && styles.btnDesabilitado, 
                ]}
              >
                <Text style={styles.textBtn}>{isPending ? "Aguarde...":"Aceitar"}</Text>
              </Pressable>
            </View>
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
containerPropostas:{
  backgroundColor:theme.colors.surface,
  padding:theme.spacing.lg, 
  borderRadius:theme.borderRadius.lg, 
  borderWidth:1,
  borderColor:theme.colors.border,
  marginHorizontal:theme.spacing.md,
  marginVertical:theme.spacing.sm
}, 
title:{
  flexShrink:1,
  fontSize:17, 
  fontWeight:"700",
  color:theme.colors.textPrimary, 
}, 
containerInformations:{
  
}, 
containerBtns:{
flexDirection:"row",
gap:theme.spacing.md,
marginTop:theme.spacing.sm,
}, 
btnRecusar:{
minHeight:48, 
backgroundColor:theme.colors.error,
borderRadius:theme.borderRadius.md, 
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
alignItems:"center",
justifyContent:"center",
}, 
btnAceitar:{
minHeight:48,
backgroundColor:theme.colors.primary,
borderRadius:theme.borderRadius.md, 
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
alignItems:"center", 
justifyContent:"center", 
}, 
textBtn:{
  color:theme.colors.surface,
  fontSize:14,
  fontWeight:"400", 
  textAlign:'center'
}, 

statusText:{
fontSize:12,
fontWeight:"700"
},
containerStatus:{
alignSelf:"flex-start", 
borderRadius:theme.spacing.sm, 
paddingHorizontal:theme.spacing.sm, 
paddingVertical:theme.spacing.xs,
}, 
informacaoServico:{
marginBottom:theme.spacing.md,
}, 
informacaoTexto:{
fontSize:12,
fontWeight:"600", 
color:theme.colors.textSecondary, 
marginBottom:theme.spacing.xs
}, 
valorInformacao:{
fontSize:15, 
fontWeight:"600", 
color:theme.colors.textPrimary
}, 
containerObservacoes:{
marginTop:theme.spacing.xs, 
marginBottom:theme.spacing.lg
}, 
textoObservacoes:{
fontSize:14,
lineHeight:20, 
color:theme.colors.textPrimary
}, 
cabecalhoCard:{
  flexDirection:"row", 
  justifyContent:"space-between", 
  alignItems:"center", 
  gap:theme.spacing.sm, 
  marginBottom:theme.spacing.lg
},
btnPressionado:{
  opacity:0.8,
}, 
btnDesabilitado:{
  opacity:0.6
}
})
