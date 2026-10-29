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
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Image
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
import {profile_informations} from "../../api/profile"

export function DetalhesServico() {
  const route = useRoute();
  type NavigationProps = NativeStackNavigationProp<AppStackParamList>;
  const navigation = useNavigation<NavigationProps>();
  const [modalVisual, setModalVisual] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const params = route.params as {id?:number} | undefined; 
  const perfilTargetId = params?.id 
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

  console.log("Detalhes do serviço:",JSON.stringify(detalhes,null,2))
  console.log("Imagens recebidas:",detalhes?.imagens); 

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

  const {data:profile} = useQuery({
    queryKey:["Profile",perfilTargetId], 
    queryFn: ()=>profile_informations(perfilTargetId), 
    enabled:!!perfilTargetId
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

    if(!mensagem.trim()){
      Alert.alert("Escreva os detalhes da proposta"); 
      return 
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

        <FlatList
        data={[...(detalhes.imagens ?? [])].sort(
          (a,b)=>a.ordem - b.ordem
        )}
        keyExtractor={(item)=>String(item.ordem)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap:theme.spacing.md}}
        renderItem={({item})=>(
            <Image 
            source={{uri:item.image_url}}
            style={styles.imagemServico}
            resizeMode="cover"
            onError={(event)=>{
              console.log("Erro ao carregar imagem:",event.nativeEvent.error)
            }}
            />
        )}
        />
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
              {profile?.usuario.image_url?(
                <Image
                source={{uri:profile.usuario.image_url}}
                style={styles.fotoPerfil}
                />     
              ):(
              <MaterialCommunityIcons name="account-outline"
              size={26}
              color={theme.colors.primaryDark}
              />
              )}
             
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
  <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding":"height"} style={styles.container}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>

       <View style={styles.cabecalhoModal}>
            <View style={styles.textosCabecalhoModal}>
              <Text style={styles.tituloModal}>
                Propor uma Troca
              </Text>
              <Text style={styles.descricaoModal}>
                Escolha um serviço para oferecer e envie uma proposta
              </Text>
            </View>
            <Pressable onPress={()=>setModalVisual(false)} 
              accessibilityRole="button"
              accessibilityLabel="Fechar Modal"
              hitSlop={8}
              style={styles.botaoFecharModal}
              >
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.textPrimary}/>
          </Pressable>
          </View>
            <Text style={styles.rotuloServicos}>Seus Serviços:</Text>
            {LoadingServices ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
                <FlatList
                  data={servicos??[]}
                  keyExtractor={(item) => String(item.id)}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => {
                    return (
                        <Pressable
                          onPress={() => setServicoSelecionadoId(item?.id)}
                          accessibilityRole="button"
                          accessibilityState={{
                            selected:servicoSelecionadoId===item.id
                          }}
                          style={[
                            styles.cartaoServico, 
                            servicoSelecionadoId===item.id && styles.categoriaServicoSelecionado
                          ]}
                        >
                            <Text style={styles.tituloServicoModal}>{item.titulo}</Text>
                            <Text style={styles.descricaoServicoModal}>{item.descricao}</Text>
                        </Pressable>
                    );
                  }}
                  ListEmptyComponent={
                    <Text style={styles.textoListaVazia}>
                      Você ainda não possui serviços para oferecer
                    </Text>
                  }
                />
            )}
              <TextInput
                  value={mensagem}
                  placeholder="Explique os detalhes da sua proposta"
                  placeholderTextColor={theme.colors.textPrimary}
                  onChangeText={setMensagem}
                  multiline
                  textAlignVertical="top"
                  maxLength={500}
                  style={styles.inputMensagem}
                />
                <Pressable
                  onPress={() => handleSubmit(id, servicoSelecionadoId, mensagem)}
                  disabled={isPending}
                  style={styles.botaoEnviarProposta}
                  >
                  {isPending ? (
                    <ActivityIndicator size="small" color={theme.colors.surface}/>
                  ) : (
                    <Text style={styles.textoBotaoEnviar}>Enviar Proposta</Text>
                  )}
                </Pressable>
                 <Pressable onPress={() => setModalVisual(false)} style={styles.botaoCancelar}>
                      <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
        </KeyboardAvoidingView>
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
height:"85%", 
backgroundColor:theme.colors.surface, 
borderTopLeftRadius:theme.borderRadius.lg,
borderTopRightRadius:theme.borderRadius.lg,
padding:theme.spacing.lg, 
maxHeight:"90%"
},
botaoFecharModal:{
width:40,
height:40, 
alignItems:"center", 
justifyContent:"center", 
borderRadius:theme.borderRadius.md, 
backgroundColor:theme.colors.background
}, 
cabecalhoModal:{
flexDirection:"row", 
alignItems:"flex-start", 
justifyContent:"space-between", 
marginBottom:theme.spacing.lg
}, 
tituloModal:{
fontSize:22,
fontWeight:"700", 
color:theme.colors.textPrimary, 
marginBottom:theme.spacing.xs
}, 
descricaoModal:{
  fontSize:14,
  lineHeight:20,
  color:theme.colors.textSecondary
}, 
textosCabecalhoModal:{
  flex:1,
  marginRight:theme.spacing.md
}, 
rotuloServicos:{
fontSize:14,
fontWeight:"700", 
color:theme.colors.textPrimary, 
marginBottom:theme.spacing.sm
}, 
cartaoServico:{
padding:theme.spacing.md, 
marginBottom:theme.spacing.sm,
borderWidth:1, 
borderColor:theme.colors.border,
borderRadius:theme.borderRadius.md,
backgroundColor:theme.colors.surface, 
}, 
tituloServicoModal:{
fontSize:15,
fontWeight:"700", 
color:theme.colors.textPrimary, 
marginBottom:theme.spacing.xs
}, 
descricaoServicoModal:{
  fontSize:13,
  lineHeight:19,
  color:theme.colors.textSecondary
}, 
categoriaServicoSelecionado:{
borderColor:theme.colors.primary,
backgroundColor:"#E5F4F6",
},
textoListaVazia:{
fontSize:14,
color:theme.colors.textSecondary,
textAlign:'center', 
paddingVertical:theme.spacing.lg
},
inputMensagem:{
minHeight:90,
maxHeight:120,
borderWidth:1,
borderColor:theme.colors.textSecondary,
borderRadius:theme.borderRadius.md,
padding:theme.spacing.md, 
fontSize:15, 
color:theme.colors.textPrimary,
backgroundColor:theme.colors.surface,
marginTop:theme.spacing.md,
marginBottom:theme.spacing.md,
textAlign:"center"
}, 
botaoEnviarProposta:{
minHeight:50, 
alignItems:"center",
justifyContent:"center", 
backgroundColor:theme.colors.primary, 
borderRadius:theme.borderRadius.md, 
padding:theme.spacing.md
},
textoBotaoEnviar:{
fontSize:16,
fontWeight:"700", 
color:theme.colors.surface
}, 
botaoCancelar:{
alignItems:"center", 
justifyContent:"center",
minHeight:44, 
marginTop:theme.spacing.xs
}, 
textoBotaoCancelar:{
fontSize:15,
fontWeight:"600", 
color:theme.colors.textSecondary,
}, 
imagemServico:{
  width:280, 
  height:220,
  borderRadius:theme.borderRadius.md,
  marginTop:theme.spacing.md,
  backgroundColor:theme.colors.border
},
fotoPerfil:{
      width:60, 
      height:60,
      borderRadius:50,
      alignSelf:"center", 
}
})