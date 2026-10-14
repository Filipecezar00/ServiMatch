import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { profile_informations } from "../../api/profile";
import { useAuthStore } from "../../stores/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  StyleSheet
} from "react-native";
import {criarConversa} from "../../api/chat"
import { editar_profile } from "../../api/profile";
import {theme} from "../../styles/theme/theme"
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function Profile() {
  const usuarioId = useAuthStore((store) => store.usuario?.id);
  const logout = useAuthStore((store) => store.logout);
  const route = useRoute();
  const navigation = useNavigation()
  const [isLoadingChat,setIsLoadingChat] = useState(false)

  const params = route.params as { id?: number } | undefined;
  const perfilTargetId = params?.id || usuarioId;
  const ehMeuPerfil = !params?.id || Number(params.id) === Number(usuarioId);
  const queryClient = useQueryClient();

  const [isOpenModal, setOpenModal] = useState(false);

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["Profile", perfilTargetId],
    queryFn: () => profile_informations(perfilTargetId),
    enabled: !!perfilTargetId,
  });


  const {
    mutate: mutateSalvar,
    isPending,
  } = useMutation({
    mutationFn: editar_profile,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Profile"] });

      setOpenModal(false);

      Alert.alert("Perfil editado com Sucesso!");
    },
    onError: (error) => {
      Alert.alert("Atenção:", error.message);
    },
  });

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const handleEditar = () => {
    if (profile?.usuario) {
      setNome(profile.usuario.nome);
      setEmail(profile.usuario.email || "");
    }
    setOpenModal(true);
  };

  const handleSalvar = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!nome || nome.trim().length < 3) {
      return Alert.alert("O nome deve conter no mínimo três caracteres");
    }

    if (!emailRegex.test(email.trim())) {
      return Alert.alert("O email não possui um formato válido");
    }
    mutateSalvar({ nome: nome.trim(), email: email.trim() });
  };

  const handleFecharModal = () => {
    setOpenModal(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "Confimar",
      "Deseja realmente deslogar ?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deslogar",
          style: "destructive",
          onPress: () => {
            queryClient.clear();
            logout();
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleCriarConversa = async ()=>{
    if(!profile?.usuario.id){
      Alert.alert("Aviso","Informações do prestador indisponíveis no momento")
      return
    }
    try{
      setIsLoadingChat(true)
      const data = await criarConversa({receiver_id:Number(profile?.usuario.id)})
      const conversa_id = data?.id || data?.conversas?.id 
      if(conversa_id){
        navigation.navigate("Chat",{conversa_id}); 
      }else{
        Alert.alert("Erro","Não foi possível obter a sala da conversa"); 
      }
    }catch(error:any){
      Alert.alert("Erro ao iniciar conversa",error?.response?.data?.message || error.message)
    }finally{
      setIsLoadingChat(false)
    }
  }


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !profile) {
    return (
      <View>
        <Text>Erro ao renderizar Perfil</Text>
        <Pressable onPress={() => refetch()}>
          <Text>Tente Novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View>
          <View>
            <View style={styles.cartaoPerfil}>
              <Text style={styles.nomeUsuario}>{profile?.usuario.nome}</Text>
              <View style={styles.descricaoUsuario}>
                {profile.usuario.total_reviews === 0 ? (
                  <Text>Novo na plataforma</Text>
                ) : (
                  <View style={styles.containerNotas}>
                  <Text>
                    Nota: {Number(profile.usuario.media_rating).toFixed(1)}{" "}
                  </Text>
                  <MaterialCommunityIcons name="star" size={18} color="#F4B400"/>
                  {profile.usuario.total_reviews ==1 ? (
                   <Text>
                   {profile.usuario.total_reviews} Avaliação 
                  </Text>
                  ):(
                    <Text>
                      {profile.usuario.total_reviews} Avaliações
                    </Text>
                  )} 
                  </View>
                )}
              </View>
              <Text style={styles.informacoesEstatisticas}>
                Trocas Concluidas: {profile?.usuario?.trocas_concluidas || 0}
              </Text>
            </View>

            <View>
              <Text style={styles.tituloSecao}>Serviços Oferecidos</Text>
              {profile.usuario.servicos.length === 0 ? (
                <View>
                  <Text style={styles.tituloSecao}>
                    {ehMeuPerfil
                      ? "Você ainda não ofereceu nenhum serviço"
                      : "Este usuário ainda não cadastrou nenhum serviço"}
                  </Text>
                  {ehMeuPerfil && (
                    <Pressable
                      onPress={() => navigation.navigate("CriarServico")}
                    >
                      <Text> + Cadastrar meu primeiro serviço</Text>
                    </Pressable>
                  )}
                </View>
              ) : (
                <View>
                  {profile?.usuario.servicos.map((servico) => {
                    return (
                      <View key={servico.id} style={styles.cartaoCard}>
                        <Text style={styles.tituloServico}>{servico.titulo}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        </View>

        <Text style={styles.tituloSecao}>Avaliações Recebidas</Text>
        {profile.reviews.length === 0 ? (
          <Text>Nenhuma avaliação recebida até o momento</Text>
        ) : (
          profile.reviews.map((review) => (
              <View key={review.id} style={styles.cartaoCard}>
              <Text style={styles.nomeAvaliador}>{review.reviewer_nome}</Text>
              <Text style={styles.notaAvaliacao}>Nota: {review.rating}</Text>
              <Text style={styles.comentarioAvaliacao}>{review.comment}</Text>
            </View>
          ))
        )}

        <View>
          <Text style={styles.informacoesMembro}>
            Membro desde:
            {profile?.usuario.criado_em
              ? new Date(profile.usuario.criado_em).toLocaleDateString("pt-BR")
              : "-"}
          </Text>
        </View>
    
        {ehMeuPerfil ? (
          <View style={styles.containerbtnsMeuperfil}>
            <Pressable onPress={handleEditar} style={styles.btnEditar}>
              <Text style={styles.btnTextEditar}>Editar Perfil</Text>
            </Pressable>
            <Pressable onPress={handleLogout} style={styles.btnSair}>
              <MaterialCommunityIcons name="logout" size={18} color={theme.colors.surface}/>
              <Text style={styles.btnTextSair}>Sair da Conta</Text>
            </Pressable>
          </View>
          
        ):(
          <View>
              <Pressable onPress={handleCriarConversa} disabled={isLoadingChat}>
                {isLoadingChat?(
                  <ActivityIndicator size="small"/>
                ):(
                  <Text>Conversar com o prestador</Text>
                )}
              </Pressable>
        </View>
 
        )}
      </ScrollView>
      <Modal
        visible={isOpenModal}
        animationType="slide"
        onRequestClose={handleFecharModal}
      >
        <View style={{ flex: 1, padding: 20 }}>
          <Text>Editar Perfil</Text>
          <TextInput
            onChangeText={setNome}
            value={nome}
            placeholder="Digite seu nome"
          />
          <TextInput
            onChangeText={setEmail}
            value={email}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable onPress={handleFecharModal}>
            <Text>Cancelar</Text>
          </Pressable>
          <Pressable onPress={handleSalvar} disabled={isPending}>
            {isPending ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text>Salvar</Text>
            )}
          </Pressable>
        </View>
      </Modal>
    </View>
  ); 
}
const styles = StyleSheet.create({
    container:{
     flex: 1,
     backgroundColor:theme.colors.background, 
    }, 
    conteudo:{
      padding:theme.spacing.md, 
      paddingBottom:theme.spacing.xl
    }, 
    cartaoPerfil:{
      backgroundColor:theme.colors.surface, 
      borderRadius:theme.borderRadius.lg, 
      padding:theme.spacing.lg, 
      marginBottom:theme.spacing.lg,
      borderWidth:1, 
      borderColor:theme.colors.border
    }, 
    nomeUsuario:{
      fontSize:24,
      fontWeight:"700", 
      color:theme.colors.textPrimary, 
      marginBottom:theme.spacing.sm
    }, 
    cartaoCard:{
      backgroundColor:theme.colors.surface,
      borderRadius:theme.borderRadius.md, 
      padding:theme.spacing.md, 
      marginBottom:theme.spacing.md, 
      borderWidth:1, 
      borderColor:theme.colors.border, 
    }, 
    tituloSecao:{
      fontSize:20, 
      fontWeight:"600", 
      paddingLeft:theme.spacing.sm,
      color:theme.colors.textPrimary,
      marginBottom:theme.spacing.md
    },
    descricaoUsuario:{
      
    }, 
    containerNotas:{
      flexDirection:"row",
      alignItems:"center",
      flexWrap:"wrap",
      gap:theme.spacing.xs,
    },
    containerbtnsMeuperfil:{
      flexDirection:"row",
      justifyContent:"center",
      gap:theme.spacing.md,
      marginTop:theme.spacing.lg
    }, 
    btnEditar:{
      minHeight:50,
      alignItems:"center", 
      backgroundColor:theme.colors.primary,
      borderWidth:1,
      borderColor:theme.colors.surface, 
      borderRadius:theme.borderRadius.md,
      paddingHorizontal:theme.spacing.lg,
      paddingVertical:theme.spacing.md,
    }, 
    btnTextEditar:{
      color:theme.colors.surface,
      fontSize:16
    },
    btnTextSair:{
      color:theme.colors.surface,
      fontSize:16
    }, 
    btnSair:{
      flexDirection:"row",
      justifyContent:"center", 
      alignItems:"center",
      gap:theme.spacing.xs, 
      minHeight:50,
      backgroundColor:theme.colors.error,
      borderWidth:1,
      borderColor:theme.colors.surface, 
      borderRadius:theme.borderRadius.md,
      paddingHorizontal:theme.spacing.lg,
      paddingVertical:theme.spacing.md,
    },
    informacoesMembro:{
      fontSize:14, 
      color:theme.colors.textSecondary,
      fontWeight:"bold", 
      paddingLeft:theme.spacing.sm,
    },
    tituloServico:{
      fontSize:16,
      fontWeight:"600", 
      color:theme.colors.textPrimary  
    }, 
    nomeAvaliador:{
      fontSize:16, 
      fontWeight:"600",
      color:theme.colors.textPrimary, 
      marginBottom:theme.spacing.xs
    }, 
    comentarioAvaliacao:{
      fontSize:14, 
      lineHeight:20, 
      color:theme.colors.textSecondary,
      marginTop:theme.spacing.xs
    }, 
    notaAvaliacao:{
      fontSize:14, 
      fontWeight:"bold", 
      color:theme.colors.textPrimary
    }, 
    informacoesEstatisticas:{
      fontSize:14,
      marginTop:theme.spacing.sm,
    }
})