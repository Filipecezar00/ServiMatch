import { useQuery } from "@tanstack/react-query";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
  TextInput,
  StyleSheet
} from "react-native";
import {theme} from "../styles/theme/theme"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { listarCategorias } from "../api/serviceWanted";
import { BuscarServicoOffered } from "../api/serviceOffered";
import { useAuthStore } from "../stores/useAuthStore";
export function HomeScreen() {
  const {
    data: categorias,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["ListarCategorias"],
    queryFn: listarCategorias,
  });
  const [termoBusca, setTermoBusca] = useState("");
  const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState<
    number | null
  >(null);
  const [termoDebounced, setTermoDebounced] = useState("");
  const navigation = useNavigation();

  const logout = useAuthStore((state) => state.logout);
  useEffect(() => {
    const temporizador_debounce = setTimeout(() => {
      setTermoDebounced(termoBusca);
    }, 400);
    return () => {
      clearTimeout(temporizador_debounce);
    };
  }, [termoBusca]);

  const { data: servicos, isLoading: isLoadingServicos } = useQuery({
    queryKey: [
      "listarServicosProcurados",
      termoDebounced,
      categoriaSelecionadaId,
    ],
    queryFn: () => BuscarServicoOffered(termoDebounced, categoriaSelecionadaId),
  });

  const handleOptionsDetails = (id: number) => {
    navigation.navigate("DetalhesServico", { id });
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError) {
    return (
      <View>
        <Text>{error.message}</Text>

        <Pressable onPress={logout}>
          <Text>Deslogar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={servicos}
      keyExtractor={(item) => item?.id?.toString() ?? String(Math.random())}
      ListEmptyComponent={() => {
        return isLoadingServicos ? (
          <ActivityIndicator />
        ) : (
          <Text>Nenhum serviço encontrado</Text>
        );
      }}
      ListHeaderComponent={
        <View style={styles.containerBusca}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Servimatch</Text>
            <Text style={styles.subtitle}>Busque serviços por categorias</Text>
          </View>
            <View style={styles.containerInput}>
            <TextInput
              placeholder="Procurar Serviço"
              placeholderTextColor={theme.colors.textSecondary}
              value={termoBusca}
              onChangeText={setTermoBusca}
              style={styles.inputPesquisa}
            ></TextInput>
            <MaterialCommunityIcons name="magnify" size={24} style={styles.iconeLupa}/>
          </View>

          <FlatList
            data={categorias}
            horizontal={true}
            keyExtractor={(item) =>
              item?.id?.toString() ?? String(Math.random())
            }
            renderItem={({ item }) => {
              const isSelected = Number(categoriaSelecionadaId) === item.id;
              return (
                <View
                 style={styles.containerCategorias}
                >
                  <View style={styles.listaCategorias}>
                   <Pressable
                    onPress={() =>
                      Number(categoriaSelecionadaId) === Number(item.id)
                        ? setCategoriaSelecionadaId(null)
                        : setCategoriaSelecionadaId(item.id)
                    }
                    style={[styles.botaoCategoria, isSelected && styles.botaoCategoriaSelecionada]}
                  >
                    <Text style={[styles.nomeCategoria, isSelected && styles.nomeCategoriaSelecionada]}>{item.nome}</Text>
                  </Pressable>
                  </View>
  
                </View>
              );
            }}
          />
          <Text style={styles.subtitleServicos}>Serviços localizados:</Text>
        </View>
      }
      renderItem={({ item }) => {
        return (
          <Pressable
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            onPress={() => handleOptionsDetails(item.id)}
          >
            <View style={styles.containerServico}>
              <View style={styles.textoServico}>
                <Text style={styles.tituloServico}>{item.titulo}</Text>
              </View>
              <Text style={styles.descricao}>{item.descricao}</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.textSecondary}/>
            </View>
          </Pressable>
        );
      }}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
containerBusca:{
paddingHorizontal:theme.spacing.lg, 
paddingTop:theme.spacing.xl, 
paddingBottom:theme.spacing.md
}, 
containerInput:{
flexDirection:'row',
alignItems:'center', 
backgroundColor:theme.colors.surface, 
borderWidth:1,
borderColor:theme.colors.border,
borderRadius:theme.borderRadius.md,
paddingHorizontal:theme.spacing.md,
minHeight:52,
marginBottom:theme.spacing.lg
}, 
inputPesquisa:{
paddingVertical:theme.spacing.md,
color:theme.colors.textPrimary, 
fontSize:16,
flex:1
},
iconeLupa:{
paddingLeft:theme.spacing.sm
}, 
headerContainer:{
alignItems:"center", 
marginBottom:theme.spacing.xl
},
title:{
fontSize:28, 
fontWeight:"700", 
color:theme.colors.primary, 
textAlign:'center', 
marginBottom:theme.spacing.sm
},
subtitle:{
  fontSize:15,
  color:theme.colors.textSecondary, 
  textAlign:'center', 
  lineHeight:22,
  maxWidth:300
},
subtitleServicos:{
  fontSize:18,
  fontWeight:"700",
  color:theme.colors.textPrimary,
  marginTop:theme.spacing.lg,
  marginBottom:theme.spacing.sm, 
},
containerCategorias:{
marginRight:theme.spacing.sm
},
botaoCategoria:{
alignItems:"center",
justifyContent:"center", 
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.sm,
borderRadius:theme.borderRadius.md,
borderWidth:1,
borderColor:theme.colors.border,
backgroundColor:theme.colors.surface

}, 
nomeCategoria:{
color:theme.colors.textPrimary,
fontSize:14,
fontWeight:"600"
}, 
containerServico:{
backgroundColor:theme.colors.surface,
borderRadius:theme.borderRadius.lg,
padding:theme.spacing.lg,
borderWidth:1,
borderColor:theme.colors.border,
marginHorizontal:theme.spacing.lg,
marginBottom:theme.spacing.md
}, 
tituloServico:{
fontSize:16,
fontWeight:"700", 
color:theme.colors.textPrimary,
marginBottom:theme.spacing.sm,
}, 
descricao:{
fontSize:14,
color:theme.colors.textSecondary,
lineHeight:21,
},
botaoCategoriaSelecionada:{
backgroundColor:theme.colors.primary,
borderColor:theme.colors.primary
}, 
nomeCategoriaSelecionada:{
color:theme.colors.surface
},
listaCategorias:{
  paddingVertical:theme.spacing.sm, 
  alignItems:'center'
}, 
textoServico:{
flex:1,
flexShrink:1,
marginRight:theme.spacing.sm
}
})