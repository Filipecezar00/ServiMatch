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
} from "react-native";
import { obterDetalhesServicoPorId } from "../../api/serviceOffered";
import { listaMeusServicos } from "../../api/serviceOffered";
import { criarProposta } from "../../api/exchangeProposals";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../types/types";
import {criarConversa} from "../../api/chat"; 

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
    return <ActivityIndicator />;
  }

  if (isError || !detalhes) {
    return (
      <View>
        <Text>Erro ao consultar detalhes do serviço : {error?.message}</Text>
        <Pressable onPress={() => refetch()}>
          <Text>Tente novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <ScrollView>
        <Text>Detalhes do Serviço</Text>
        <View>
          <Text>{detalhes.titulo}</Text>
          <Text>{detalhes.descricao}</Text>
          <Text>{detalhes.categoria}</Text>
          <Pressable
            onPress={() => {
              if (detalhes?.user_id) {
                navigation.navigate("Profile", { id: detalhes?.user_id });
              }
            }}
          >
            <Text>{detalhes.prestador_nome}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Pressable onPress={() => setModalVisual(true)}>
        <Text>Propor troca</Text>
      </Pressable>

       <Pressable onPress={handleCriarConversa} disabled={loadingChat}>
         {loadingChat?(
          <ActivityIndicator size="small" />
         ):(
          <Text>Conversar com o prestador</Text>
         )}
       </Pressable>
      <Modal visible={modalVisual} onRequestClose={() => setModalVisual(false)}>
        <View>
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
