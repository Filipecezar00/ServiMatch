import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listarServicoWanted,
  editarStatusServicoWanted,
} from "../../api/serviceWanted";
import {
  View,
  ActivityIndicator,
  Text,
  FlatList,
  Pressable,
  Alert,
  StyleSheet
} from "react-native";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { theme } from "../../styles/theme/theme";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ServiceStackWantedParamList } from "../../navigation/ServicesStack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export function ListarServicosProcurados() {
  type ListarServicosWantedNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<
      ServiceStackWantedParamList,
      "ListarServicosProcurados"
    >,
    DrawerNavigationProp<any>
  >;

  const navigation = useNavigation<ListarServicosWantedNavigationProp>();
  const queryClient = useQueryClient();

  const {
    data: servicos = [],
    isError,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["listarServicosProcurados"],
    queryFn: () => listarServicoWanted(),
  });

  const { mutate } = useMutation({
    mutationFn: editarStatusServicoWanted,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listarServicosProcurados"] });
    },
    onError: (erro) => {
      Alert.alert("Erro ao editar status:", erro.message);
    },
  });
  const handleSubmit = (id: number, statusAtual: boolean) => {
    mutate({ id, ativo: !statusAtual });
  };

  return (
    <View style={styles.container}>
      <View>
        <Pressable onPress={() => navigation.openDrawer()} style={styles.menu}>
          <MaterialCommunityIcons name="menu" size={24} />
        </Pressable>
      </View>
      <View style={styles.containerAdicionar}>
         <Pressable
            onPress={() => navigation.navigate("CriarServicoProcurado")} style={styles.botaoAdicionar}
          >
            <MaterialCommunityIcons name="plus" size={18} color={theme.colors.surface}/>
            <Text style={styles.textCriarServico}>Adicionar novo serviço desejado</Text>
          </Pressable>
      </View>
      {isError && (
        <View style={styles.errorBox}>
          <Text style={styles.textError}>Não foi possível carregar seus serviços, tente logar novamente.</Text>
          <Pressable onPress={() => refetch()} style={styles.buttonRefetch}>
            <Text style={styles.textTentarNovamente}>Tentar Novamente</Text>
          </Pressable>
        </View>
      )}
      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>Serviços Desejados</Text>
        <Text style={styles.descriptionHeader}>Seus serviços desejados ficam aqui!</Text>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
         <ActivityIndicator  size="small" color={theme.colors.primary}/>
        </View>
      ) : (
        <View style={styles.listacontainer}>
          <FlatList
            data={servicos}
            refreshing={isLoading}
            onRefresh={refetch}
            ListEmptyComponent={
              <Text style={styles.textInformation}>
                Você ainda não possui nenhum serviço do seu interesse
                Cadastrado!
              </Text>
            }
            keyExtractor={(servico) => servico.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cardContainer}>
                <Text style={styles.titulo}>{item.titulo}</Text>
                <Text style={styles.descricao}>Descrição: {item.descricao}</Text>
                <View style={[styles.statusContainer,item.ativo ? styles.containerAtivo : styles.containerInativo]}>
                  <Text style={[styles.statusAtual,item.ativo ? styles.ativo : styles.inativo]}>Status Atual: {item.ativo ? "Ativo" : "Inativo"}</Text>
                </View>
              <View style={styles.containerBtns}>
                <Pressable onPress={() => handleSubmit(item.id, item.ativo)} style={styles.btnStatus} accessibilityRole="button" accessibilityLabel={item.ativo?"Desativar serviço":"Ativar Serviço"}>
                  <Text style={styles.buttonText}>
                    {item.ativo ? "Desativar Serviço" : "Ativar Serviço"}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    navigation.navigate("EditarServicoProcurado", {
                      id: item.id,
                    })
                  }
                  style={({pressed})=> [styles.btnEditar,pressed && styles.botaoPressionado]}
                >
                  <Text style={styles.buttonTextEditar}>Editar Serviço</Text>
                 <MaterialCommunityIcons size={18} name="pencil"/>
                </Pressable>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:theme.colors.background, 
    padding:theme.spacing.lg
  },  
  listacontainer:{
    flex:1,
 }, 
 botaoAdicionar:{
  flexDirection:"row", 
  gap:theme.spacing.xs,
  paddingBottom:theme.spacing.xs, 
  backgroundColor:theme.colors.primary, 
  borderWidth:1, 
  borderColor:theme.colors.border, 
  padding:theme.spacing.md,
  justifyContent:"center", 
  alignItems:"center", 
  borderRadius:theme.spacing.xs, 
  marginBottom:theme.spacing.xl
 }, 
 textCriarServico:{
  textAlign:"center", 
  fontSize:14, 
  color:theme.colors.surface,
  paddingVertical:theme.spacing.xs
}, 
cardContainer:{
  flexDirection:"column", 
  paddingHorizontal:theme.spacing.md, 
  paddingVertical:theme.spacing.md,
  backgroundColor:theme.colors.surface, 
  borderWidth:1, 
  borderColor:theme.colors.border,
  borderRadius:theme.borderRadius.md, 
  marginBottom:theme.spacing.md
}, 
titulo:{
fontSize:20, 
fontWeight:"600",
color:theme.colors.textPrimary,
marginBottom:theme.spacing.xs
}, 
descricao:{
fontSize:14, 
fontWeight:"400", 
color:theme.colors.textSecondary,
marginBottom:theme.spacing.sm
}, 
statusAtual:{
fontWeight:"600",
fontSize:13
},
btnStatus:{
flex:1, 
backgroundColor:theme.colors.primary, 
paddingHorizontal:theme.spacing.sm, 
paddingVertical:theme.spacing.md,
borderRadius:theme.spacing.md, 
alignItems:"center",
justifyContent:"center",
minHeight:48
}, 
btnEditar:{
flex:1,
backgroundColor:theme.colors.surface, 
paddingHorizontal:theme.spacing.sm, 
paddingVertical:theme.spacing.md,
borderRadius:theme.spacing.md, 
borderWidth:1,
borderColor:theme.colors.primaryDark,
flexDirection:'row', 
alignItems:"center", 
justifyContent:"center", 
gap:theme.spacing.xs, 
minHeight:48
}, 
containerBtns:{
  flexDirection:"row",
  alignItems:"center",
  gap:theme.spacing.sm
  
}, 
buttonText:{
color:theme.colors.surface,
textAlign:"center", 
}, 
buttonTextEditar:{
color:theme.colors.primaryDark,
textAlign:"center", 
}, 
containerAdicionar:{

}, 
statusContainer:{
alignSelf:"flex-start",
paddingHorizontal:theme.spacing.sm, 
paddingVertical:theme.spacing.xs,
borderRadius:theme.borderRadius.md, 
marginBottom:theme.spacing.md
}, 
textInformation:{
fontSize:15,
color:theme.colors.textSecondary, 
textAlign:"center", 
lineHeight:22, 
paddingHorizontal:theme.spacing.md
}, 
errorBox:{
  padding:theme.spacing.sm,
  borderRadius:theme.borderRadius.sm,
  marginBottom:theme.spacing.md
}, 
textError:{
  color:theme.colors.error,
  fontSize:16,
  fontWeight:"500",
  textAlign:"center"
}, 
buttonRefetch:{
  alignItems:"center",
  backgroundColor:theme.colors.primary, 
  paddingHorizontal:theme.spacing.lg,
  paddingVertical:theme.spacing.md, 
  borderRadius:theme.spacing.md, 
  marginTop:theme.spacing.md, 

}, 
menu:{
marginBottom:theme.spacing.xs
}, 
containerAtivo:{
backgroundColor:"#E3F5F1"
}, 
containerInativo:{
backgroundColor:"#FCE8EA"
},
ativo:{
color:theme.colors.primary
},
inativo:{
color:theme.colors.error
}, 
textTentarNovamente:{
color:theme.colors.surface
}, 
containerHeader:{
  justifyContent:"center", 
  alignItems:"center",
  marginBottom:theme.spacing.md
}, 
titleHeader:{
  fontSize:20, 
  color:theme.colors.textPrimary, 
  fontWeight:"600", 
  marginBottom:theme.spacing.sm
}, 
descriptionHeader:{
  fontSize:14,
  color:theme.colors.textSecondary, 
  fontWeight:"600"
}, 
loadingContainer:{
  flex:1, 
  justifyContent:"center", 
  alignItems:"center"
}, 
botaoPressionado: {
  opacity:0.7,
}
})