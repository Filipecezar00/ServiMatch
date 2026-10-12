import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  View,
  ActivityIndicator,
  Pressable,
  Text,
  Modal,
  ScrollView,
  Alert,
  FlatList,
  TextInput,
  StyleSheet
} from "react-native";
import {theme} from "../../styles/theme/theme";
import { obterDetalhesServicoPorId } from "../../api/serviceOffered";
import { listaMeusServicos } from "../../api/serviceOffered";
import { criarProposta } from "../../api/exchangeProposals";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../types/types";
import {criarConversa} from "../../api/chat"; 
import { useAuthStore } from "../../stores/useAuthStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function DetalhesServico() {
  const route = useRoute();
  type NavigationProps = NativeStackNavigationProp<AppStackParamList>;
  const navigation = useNavigation<NavigationProps>();
  const [modalVisual, setModalVisual] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [servicoSelecionadoId, setServicoSelecionadoId] = useState<
    number | null
  >(null);
  const [loadingChat,setLoadingChat] = useState(false)
  const { id } = route.params as { id: number };
  const usuarioId = useAuthStore((state)=>state.usuario?.id)

  const {
    data: detalhes,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["detalhesServicos", id],
    queryFn: () => obterDetalhesServicoPorId(id),
    enabled: !!id,
  });

  const { data: servicos, isLoading: LoadingServices } = useQuery({
    queryKey: ["meusServicos"],
    queryFn: listaMeusServicos,
    enabled: modalVisual,
  });

  const {
    mutate,
    isPending,
    error: erroMutation,
  } = useMutation({
    mutationFn: criarProposta,
    onSuccess: () => {
      Alert.alert("Proposta enviada!");
      setModalVisual(false);
      setMensagem("");
      setServicoSelecionadoId(null);
    },
    onError: (error) => {
      Alert.alert("Erro ao enviar Proposta", error?.message);
    },
  });

  const handleSubmit = (
    wanted_service_id: number,
    offered_service_id: number | null,
    mensagem: string,
  ) => {
    const receiver_id = detalhes?.user_id;

    if (!receiver_id) {
      Alert.alert("Usuário sem Permissão");
      return;
    }
    if (!wanted_service_id) {
      Alert.alert("Informe o serviço desejado");
      return;
    }

    if (!offered_service_id) {
      Alert.alert("Informe o serviço oferecido");
      return;
    }

    if (!mensagem) {
      Alert.alert("Escreva os detalhes da proposta");
      return;
    }
    mutate({ receiver_id, wanted_service_id, offered_service_id, mensagem });
  };

  const handleCriarConversa = async ()=>{
    if(!detalhes?.user_id || !id){
      Alert.alert("Aviso","Informações do prestador indisponíveis no momento."); 
      return
    }
    try{
    setLoadingChat(true)
    const data = await criarConversa({receiver_id:detalhes.user_id,service_id:id}); 
    const conversa_id = data?.id || data?.conversas?.id

    if(conversa_id){
      navigation.navigate("Chat",{conversa_id}); 
    }else{
      Alert.alert("Erro","Não foi possível obter a sala da conversa"); 
    }
    }catch(error:any){
      Alert.alert("Erro ao iniciar conversa",error?.response?.data?.message || error.message); 
      
    }finally{
      setLoadingChat(false)
    }
  }

  if (isLoading) {
   return(
    <View style={styles.estadoCentralizado}>
      <ActivityIndicator size="small" color={theme.colors.primary}/>
    </View>
    )
  }

  if (isError || !detalhes) {
    return (
      <View style={styles.errorBox}>
        <Text style={styles.textError}>Erro ao consultar detalhes do serviço : {error?.message}</Text>
        <Pressable onPress={() => refetch()} style={styles.btnTentarNovamente}>
          <Text>Tente novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
      
        <View style={styles.cabecalho}>
          <Pressable onPress={()=>navigation.goBack()}
          accessibilityLabel="Voltar"  
          accessibilityRole="button"
          hitSlop={8}
          style={styles.botaoVoltar}
          >
          <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={theme.colors.textPrimary}
          />
          </Pressable>
          <Text style={styles.tituloCabecalho}>Detalhes do Serviço</Text>     
        </View>

        <View style={styles.detalhesServicos}>
          <View style={styles.etiquetaCategoria}>
            <Text style={styles.categoriaServico}>{detalhes.categoria}</Text>
          </View>
          <Text style={styles.tituloServico}>{detalhes.titulo}</Text>
          <Text style={styles.descricaoServico}>{detalhes.descricao}</Text>
        </View>

        <View>
           <Pressable
           style={({pressed})=>[
            styles.detalhesPerfil, 
            pressed && styles.perfilPressionado, 
           ]}
            onPress={() => {
              if (detalhes?.user_id) {
                navigation.navigate("ProfileStack",{
                 screen:"Profile", 
                 params: { id: detalhes?.user_id }
              });
              }
            }}
            accessibilityLabel={`Ver perfil do prestador`}
            accessibilityRole="button"
          >
            <View style={styles.iconePrestador}>
              <MaterialCommunityIcons name="account-outline"
              size={26}
              color={theme.colors.primaryDark}
              />
            </View>
            <View style={styles.informacoesPrestador}>
              <Text style={styles.rotuloPrestador}>
                Prestador
              </Text>
              <Text style={styles.nomePrestador}>{detalhes.prestador_nome}</Text>
              <Text style={styles.textoPerfil}>Ver Perfil</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.textSecondary}/>
          </Pressable>
        </View>

      </ScrollView>

  {Number(usuarioId)!= Number(detalhes?.user_id)?(
    <View style={styles.acoesPrestador}>
      <Pressable onPress={() => setModalVisual(true)} style={styles.btnProporTroca}>
        <Text style={styles.textTroca}>Propor troca</Text>
      </Pressable>

      <Pressable onPress={handleCriarConversa} disabled={loadingChat} style={styles.btnConversar}>
         {loadingChat?(
          <ActivityIndicator size="small" />
         ):(
          <Text style={styles.textConversar}>Conversar com o prestador</Text>
         )}
       </Pressable>
    </View>
      ):(
        <View style={styles.containerServico}>
          <Text style={styles.textSeuServico}>Esse é seu serviço!</Text>
        </View>
      )}

 

      <Modal
       visible={modalVisual}
       onRequestClose={() => setModalVisual(false)}
       transparent
       animationType="slide"
      >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text>Realizar Troca de Servicos</Text>
          <View>
            <Text>Seus Serviços:</Text>
            {LoadingServices ? (
              <ActivityIndicator size={"small"} />
            ) : (
              <View>
                <TextInput
                  value={mensagem}
                  placeholder="Detalhes da Proposta"
                  onChangeText={setMensagem}
                />
                <FlatList
                  data={servicos}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => {
                    return (
                      <View>
                        <Pressable
                          onPress={() => setServicoSelecionadoId(item?.id)}
                        >
                          <View
                            style={{
                              backgroundColor:
                                servicoSelecionadoId === item.id
                                  ? "#007Aff"
                                  : "#e5e5ea",
                            }}
                          >
                            <Text>{item.titulo}</Text>
                            <Text>{item.descricao}</Text>
                          </View>
                        </Pressable>
                      </View>
                    );
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </View>
        <Pressable onPress={() => setModalVisual(false)}>
          <Text>Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={() => handleSubmit(id, servicoSelecionadoId, mensagem)}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator size={"small"} />
          ) : (
            <Text>Enviar Proposta</Text>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}
const styles= StyleSheet.create({
container:{
flex:1,
backgroundColor:theme.colors.background
},
conteudo:{
paddingHorizontal:theme.spacing.lg,
paddingTop:theme.spacing.md, 
paddingBottom:theme.spacing.lg,
}, 
cabecalho:{
flexDirection:"row", 
alignItems:"center",
marginBottom:theme.spacing.xl
}, 
detalhesServicos:{
backgroundColor:theme.colors.surface, 
borderRadius:theme.borderRadius.lg,
borderWidth:1,
borderColor:theme.colors.border, 
padding:theme.spacing.lg,
marginBottom:theme.spacing.lg
}, 
detalhesPerfil:{
flexDirection:"row", 
alignItems:"center",
backgroundColor:theme.colors.surface, 
borderRadius:theme.borderRadius.lg, 
borderWidth:1,
borderColor:theme.colors.border,
padding:theme.spacing.lg
}, 
acoesPrestador:{
backgroundColor:theme.colors.surface, 
borderTopWidth:1,
borderTopColor:theme.colors.border,
padding:theme.spacing.lg,
gap:theme.spacing.md
}, 
etiquetaCategoria:{
alignSelf:'flex-start',
backgroundColor:"#E5F4F6",
paddingHorizontal:theme.spacing.md, 
paddingVertical:theme.spacing.xs,
borderRadius:theme.borderRadius.sm, 
marginBottom:theme.spacing.md
}, 
textTroca:{
color:theme.colors.surface, 
fontSize:16,
}, 
textConversar:{
color:theme.colors.surface, 
fontSize:16, 
}, 
containerServico:{
backgroundColor:theme.colors.surface, 
borderWidth:1, 
borderColor:theme.colors.border, 
borderRadius:theme.borderRadius.md, 
padding:theme.spacing.lg, 
margin:theme.spacing.lg
}, 
textSeuServico:{
color:theme.colors.textPrimary, 
fontSize:15,
fontWeight:"600",
textAlign:"center",
gap:theme.spacing.md
},
btnProporTroca:{
minHeight:50, 
alignItems:"center", 
justifyContent:"center", 
backgroundColor:theme.colors.primary, 
borderRadius:theme.borderRadius.md, 
paddingHorizontal:theme.spacing.lg,
paddingVertical:theme.spacing.md
}, 
btnConversar:{
minHeight:50, 
alignItems:"center", 
justifyContent:"center",
backgroundColor:theme.colors.primary, 
borderWidth:1,
borderColor:theme.colors.surface, 
borderRadius:theme.borderRadius.md,
paddingHorizontal:theme.spacing.lg, 
paddingVertical:theme.spacing.md
}, 
tituloServico:{
  fontSize:24,
  fontWeight:"700", 
  lineHeight:31, 
  color:theme.colors.textPrimary, 
  marginBottom:theme.spacing.md
},
categoriaServico:{
  fontSize:13,
  fontWeight:"600", 
  color:theme.colors.primaryDark
}, 
descricaoServico:{
  fontSize:16, 
  lineHeight:24,
  color:theme.colors.textSecondary
}, 
tituloCabecalho:{
  fontSize:20,
  fontWeight:"700", 
  color:theme.colors.textPrimary,
  flexShrink:1,
},
botaoVoltar:{
  width:44,
  height:44,
  alignItems:"center", 
  justifyContent:"center", 
  borderRadius:theme.borderRadius.md,
  backgroundColor:theme.colors.surface,
  borderWidth:1, 
  borderColor:theme.colors.border, 
  marginRight:theme.spacing.md
},
perfilPressionado:{
  opacity:0.75
}, 
iconePrestador:{
width:48, 
height:48, 
borderRadius:24, 
backgroundColor:"#E5F4F6", 
alignItems:"center", 
justifyContent:"center", 
marginRight:theme.spacing.md
}, 
informacoesPrestador:{
flex:1, 
minWidth:0,
}, 
rotuloPrestador:{
fontSize:12,
fontWeight:"600", 
color:theme.colors.textSecondary, 
marginBottom:theme.spacing.xs
}, 
nomePrestador:{
fontSize:16,
fontWeight:"700", 
color:theme.colors.textPrimary
}, 
textoPerfil:{
fontSize:13,
color:theme.colors.primaryDark, 
marginTop:theme.spacing.xs,
}, 
errorBox:{
backgroundColor:"#FDE8E8", 
borderWidth:1, 
borderColor:theme.colors.error, 
borderRadius:theme.borderRadius.md, 
padding:theme.spacing.md,
marginBottom:theme.spacing.md
}, 
textError:{
color:theme.colors.error, 
fontSize:14, 
lineHeight:20,
textAlign:"center"
}, 
btnTentarNovamente:{
backgroundColor:theme.colors.primary, 
minHeight:52, 
paddingHorizontal:theme.spacing.md, 
paddingVertical:theme.spacing.md, 
borderRadius:theme.spacing.md, 
alignItems:'center', 
justifyContent:"center", 
marginTop:theme.spacing.sm
}, 
estadoCentralizado:{
 flex:1, 
 alignItems:"center", 
 justifyContent:"center", 
 backgroundColor:theme.colors.background, 
 padding:theme.spacing.lg
}, 
modalOverlay:{
flex:1,
justifyContent:"flex-end", 
backgroundColor:"rgba(0,0,0,0.45)"
}, 
modalContainer:{
backgroundColor:theme.colors.surface, 
borderTopLeftRadius:theme.borderRadius.lg,
borderTopRightRadius:theme.borderRadius.lg,
padding:theme.spacing.lg, 
maxHeight:"90%"
}
})