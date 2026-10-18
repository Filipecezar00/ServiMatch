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
  StyleSheet, 
} from "react-native";
import {
  PropostaCardEnviada,
  PropostaCardRecebida,
} from "../../components/PropostaCard";
import { theme } from "../../styles/theme/theme";
export function MinhasPropostas() {
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

  const erroAtual = abaAtiva === "recebidas" ? isError : erroPropostaEnviada; 
  const tentarNovamente = abaAtiva === "recebidas" ? refetch : refetchPropostasEnviadas; 
  const carregamentoAtual = abaAtiva === "recebidas" ? isLoading : carregamentoPropostaEnviada; 



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Propostas</Text>
        <Text style={styles.subtitle}>Acompanhe suas negociações</Text>
      </View>
      <View style={styles.containerAbas}>
       <Pressable onPress={() => setAbaAtiva("recebidas")} style={[styles.aba,abaAtiva==="recebidas" && styles.abaAtiva]} accessibilityRole="tab" accessibilityState={{selected:abaAtiva==="recebidas"}}>
        <Text style={[styles.textAba,abaAtiva==="recebidas" && styles.textAbaAtiva]}>Recebidas</Text>
      </Pressable>
      <Pressable onPress={() => setAbaAtiva("oferecidas")} style={[styles.aba,abaAtiva==="oferecidas" && styles.abaAtiva]}>
        <Text style={[styles.textAba,abaAtiva==="oferecidas" && styles.textAbaAtiva]}>Oferecidas</Text>
      </Pressable>

      </View>
     
      {erroAtual && (
        <View style={styles.containerInformation}>
          <Text style={styles.textErro}>Não foi possivel carregar as propostas</Text>
          <Pressable onPress={() => tentarNovamente()} style={styles.btnTentarNovamente}>
            <Text style={styles.textBtnTentarNovamente}>Tente Novamente</Text>
          </Pressable>
        </View>
      )}

      {carregamentoAtual&&(
       <View style={styles.containerInformation}>
        <ActivityIndicator size="large" color={theme.colors.primary}/>
      </View>
      )}

      {abaAtiva == "oferecidas" ? (
        <FlatList
          data={propostasEnviadas}
          ListEmptyComponent={() => (
            <View style={styles.containerListaVazia}>
              <Text style={styles.tituloListaVazia}>Você ainda não enviou nenhuma proposta!</Text>
              <Text style={styles.descricaoListaVazia}>Quando alguém enviar uma proposta para você, ela aparecerá aqui.</Text>
            </View>
          )}
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
          ListEmptyComponent={() => (
            <View style={styles.containerListaVazia}>
              <Text style={styles.tituloListaVazia}>Você ainda não recebeu nenhuma proposta!</Text>
            </View>
          )}
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

const styles= StyleSheet.create({
container:{
flex:1, 
backgroundColor:theme.colors.background,
}, 
header:{
backgroundColor:theme.colors.surface,
paddingHorizontal:theme.spacing.lg, 
paddingVertical:theme.spacing.lg, 
alignItems:"flex-start",
}, 
title:{
fontSize:22,
fontWeight:"600",
marginBottom:theme.spacing.xs,
color:theme.colors.textPrimary
}, 
subtitle:{
fontSize:14,
color:theme.colors.textSecondary, 
fontWeight:"600"
}, 
containerAbas:{
  flexDirection:"row",
  marginHorizontal:theme.spacing.lg,
  marginBottom:theme.spacing.lg,
  padding:theme.spacing.xs,
  backgroundColor:theme.colors.surface,
  borderRadius:theme.borderRadius.md,
  borderWidth:1,
  borderColor:theme.colors.border
}, 
containerInformation:{
flex:1,
justifyContent:"center", 
alignItems:"center", 
padding:theme.spacing.lg
}, 
aba:{
flex:1,
alignItems:"center",
justifyContent:"center",
paddingVertical:theme.spacing.md,
borderRadius:theme.borderRadius.sm
},
textAba:{
fontSize:14, 
color:theme.colors.textPrimary,
fontWeight:"700"
}, 
textBtn:{
fontSize:14, 
color:theme.colors.textPrimary,
fontWeight:"400"
}, 
btn:{
backgroundColor:theme.colors.primary,
padding:theme.spacing.md, 
borderRadius:theme.spacing.sm, 
borderWidth:1,
borderColor:theme.colors.border,
marginBottom:theme.spacing.lg, 
marginTop:theme.spacing.md
}, 
abaAtiva:{
backgroundColor:theme.colors.primary
}, 
textAbaAtiva:{
color:theme.colors.surface
},
textErro:{
fontSize:14, 
color:theme.colors.error,
textAlign:"center", 
marginBottom:theme.spacing.md,
}, 
btnTentarNovamente:{
backgroundColor:theme.colors.primary, 
paddingHorizontal:theme.spacing.lg,
paddingVertical:theme.spacing.md, 
borderRadius:theme.borderRadius.md,
alignItems:"center", 
justifyContent:"center"
}, 
textBtnTentarNovamente:{
fontSize:14, 
fontWeight:"600", 
color:theme.colors.surface
},
containerListaVazia:{
alignItems:"center", 
justifyContent:"center", 
paddingHorizontal:theme.spacing.xl, 
paddingVertical:theme.spacing.xl *2, 
}, 
tituloListaVazia:{
fontSize:16, 
fontWeight:"600", 
color:theme.colors.textPrimary, 
textAlign:"center", 
marginBottom:theme.spacing.sm
}, 
descricaoListaVazia:{
  fontSize:14,
  color:theme.colors.textSecondary, 
  textAlign:"center", 
  lineHeight:20
}
})
