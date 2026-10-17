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

  if (isLoading || carregamentoPropostaEnviada) {
    return (
      <View style={styles.containerInformation}>
        <ActivityIndicator size="large" color={theme.colors.primary}/>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Propostas</Text>
        <Text style={styles.subtitle}>Acompanhe suas negociações</Text>
      </View>
      <View style={styles.containerBtns}>
       <Pressable onPress={() => setAbaAtiva("recebidas")} style={styles.btn}>
        <Text style={styles.textBtn}>Recebidas</Text>
      </Pressable>
      <Pressable onPress={() => setAbaAtiva("oferecidas")} style={styles.btn}>
        <Text style={styles.textBtn}>Oferecidas</Text>
      </Pressable>

      </View>
     
      {isError && (
        <View style={styles.containerInformation}>
          <Text style={styles.subtitle}>Erro durante Execução</Text>
          <Pressable onPress={() => refetch()} style={styles.btn}>
            <Text style={styles.textBtn}>Tente Novamente</Text>
          </Pressable>
        </View>
      )}

      {erroPropostaEnviada && (
        <View style={styles.containerInformation}>
          <Text style={styles.subtitle}>Erro durante Execução</Text>
          <Pressable onPress={() => refetch()} style={styles.btn}>
            <Text style={styles.textBtn}>Tente Novamente</Text>
          </Pressable>
        </View>
      )}

      {abaAtiva == "oferecidas" ? (
        <FlatList
          data={propostasEnviadas}
          ListEmptyComponent={() => (
            <View style={styles.containerInformation}>
              <Text style={styles.subtitle}>Você ainda não enviou nenhuma proposta!</Text>
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
            <View style={styles.containerInformation}>
              <Text style={styles.subtitle}>Você ainda não recebeu nenhuma proposta!</Text>
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
marginBottom:theme.spacing.lg, 
paddingHorizontal:theme.spacing.lg, 
paddingVertical:theme.spacing.md, 
alignItems:"center", 
justifyContent:"center"
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
containerBtns:{
  flexDirection:"row",
  justifyContent:"space-evenly", 
  alignItems:"center", 
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
textBtn:{
fontSize:16, 
color:theme.colors.surface,
fontWeight:"500"
}, 
containerInformation:{
  justifyContent:"center", 
  alignItems:"center"
}, 


})
