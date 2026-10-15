import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listaMeusServicos,
  editarStatusServico,
} from "../../api/serviceOffered";
import {
  Alert,
  View,
  ActivityIndicator,
  Text,
  Pressable,
  FlatList,
  StyleSheet
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ServiceStackOfferedParamList } from "../../navigation/ServicesStack";
import { CompositeNavigationProp } from "@react-navigation/native";
import { theme } from "../../styles/theme/theme";

export function MeusServicos() {
  type ListarServicosNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<
      ServiceStackOfferedParamList,
      "ListarMeusServicos"
    >,
    DrawerNavigationProp<any>
  >;

  const navigation = useNavigation<ListarServicosNavigationProp>();

  const queryClient = useQueryClient();
  const {
    data: servicos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["Meus-servicos"],
    queryFn: () => listaMeusServicos(),
  });

  const { mutate } = useMutation({
    mutationFn: editarStatusServico,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["Meus-servicos"] });
    },
    onError(erro) {
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
      <View style={styles.containerCriarServico}>
        <Pressable onPress={() => navigation.navigate("CriarServico")} style={styles.botaoCriar}>
          <MaterialCommunityIcons name="plus" size={18} color={theme.colors.surface}/>
          <Text style={styles.textCriarServico}>Criar novo serviço</Text>
        </Pressable>
      </View>
      {isError && (
        <View style={styles.erroBox}>
          <Text style={styles.textError}>Erro ao realizar operação</Text>
          <Pressable onPress={() => refetch()} style={styles.buttonRefetch}>
            <Text style={styles.textTentarNovamente}>Tentar Novamente</Text>
          </Pressable>
        </View>
      )}
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : (
        <View style={styles.listacontainer}>
          <FlatList
            data={servicos}
            keyExtractor={(servico) => servico.id.toString()}
            refreshing={isLoading}
            onRefresh={refetch}
            ListEmptyComponent={
              <Text style={styles.textInformation}>Você ainda não possui nenhum serviço cadastrado!</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.cardMeusServicos}>
                <Text style={styles.titulo}>{item.titulo}</Text>
                <Text style={styles.descricao}>{item.descricao}</Text>
                <View style={[styles.statusContainer,item.ativo?styles.statusContainerAtivo : styles.statusContainerInativo]}>
                  <Text style={[styles.statusAtual,item.ativo ? styles.ativo : styles.inativo]}>Status Atual: {item.ativo ? "Ativo" : "Inativo"}</Text>
                </View>
                <View style={styles.containerBtns}>
                <Pressable onPress={() => handleSubmit(item.id, item.ativo)} style={styles.btnStatus}>
                  <Text style={styles.buttonText}>
                    {item.ativo ? "Desativar serviço" : "Ativar serviço"}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    navigation.navigate("EditarServico", { id: item.id })
                  }
                  style={styles.btnEditar}
                >
                  <Text style={styles.buttonTextEditar}>Editar Serviço</Text>
                  <MaterialCommunityIcons name="pencil" size={18}/>
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
containerCriarServico:{
}, 
botaoCriar:{
flexDirection:"row",
gap:theme.spacing.xs,
paddingBottom:theme.spacing.xs,
backgroundColor:theme.colors.primary, 
borderWidth:1,
borderColor:theme.colors.border,
paddingHorizontal:theme.spacing.md,
paddingVertical:theme.spacing.md,
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
erroBox:{
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
textTentarNovamente:{
  color:theme.colors.surface
}, 
textInformation:{

}, 
cardMeusServicos:{
 flexDirection:"column", 
 paddingHorizontal:theme.spacing.md, 
 paddingVertical:theme.spacing.md, 
 backgroundColor:theme.colors.surface,
 borderWidth:1,
 borderColor:theme.colors.border,
 borderRadius:theme.spacing.md,
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
ativo:{
color:theme.colors.primary
}, 
inativo:{
color:theme.colors.error
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
buttonText:{
color:theme.colors.surface,
textAlign:"center", 
}, 
buttonTextEditar:{
color:theme.colors.primaryDark,
textAlign:"center", 
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
menu:{
  marginBottom:theme.spacing.xs
}, 
statusContainer:{
alignSelf:"flex-start", 
paddingHorizontal:theme.spacing.sm, 
paddingVertical:theme.spacing.xs,
borderRadius:theme.borderRadius.md, 
marginBottom:theme.spacing.md
}, 
statusContainerAtivo:{
backgroundColor:"#E3F5F1"
}, 
statusContainerInativo:{
backgroundColor:"#FCE8EA"
}, 
})